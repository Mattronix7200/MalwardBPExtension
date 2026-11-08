/*
 * Firefox network-filter fallback.
 *
 * Firefox keeps the blocking webRequest API available to MV3 extensions.  The
 * packaged DNR rules are still enabled first; this listener makes the core ad
 * lists effective on Firefox installations where static DNR rules are not
 * applied by the browser.
 */

import { browser, localRead, localWrite, runtime } from './ext.js';
import { getMalwardSettings, recordMalwardAdBlock } from './malward.js';

const coreRulesets = [ 'ublock-filters', 'easylist', 'pgl' ];
const cosmeticScriptId = 'malward-firefox-user-filters';
const globalDomains = new Set();
const thirdPartyDomains = new Set();
const userDomains = new Set();
let userCosmeticFilters = {};
let fallbackEnabled = true;
let listenerRegistered = false;

function normalizeDomain(value) {
    const domain = String(value || '').trim().toLowerCase().replace(/^\.+|\.+$/g, '');
    return /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(domain) ? domain : undefined;
}

function domainFromUrlFilter(value) {
    const match = /^\|\|([^/^$*|]+)\^/.exec(value || '');
    return match ? normalizeDomain(match[1]) : undefined;
}

function addDomains(rules) {
    for ( const rule of rules ) {
        if ( rule?.action?.type !== 'block' ) { continue; }
        const condition = rule.condition || {};
        // The fallback only reproduces unconditional domain rules. A rule
        // limited to a specific initiator, resource type or path must stay in
        // Firefox DNR; collapsing it to a bare domain would over-block sites
        // such as GitHub's raw-content and asset hosts.
        if (
            condition.initiatorDomains || condition.excludedInitiatorDomains ||
            condition.excludedRequestDomains || condition.resourceTypes ||
            condition.excludedResourceTypes || condition.requestMethods ||
            condition.excludedRequestMethods || condition.tabIds ||
            condition.excludedTabIds
        ) { continue; }
        const destination = condition.domainType === 'thirdParty'
            ? thirdPartyDomains
            : globalDomains;
        for ( const domain of condition.requestDomains || [] ) {
            const normalized = normalizeDomain(domain);
            if ( normalized ) { destination.add(normalized); }
        }
        const domain = domainFromUrlFilter(condition.urlFilter);
        if ( domain ) { destination.add(domain); }
    }
}

function addUserDomain(value) {
    const domain = normalizeDomain(value);
    if ( domain ) { userDomains.add(domain); }
}

function parseUserFilters(text = '') {
    const cosmetic = {};
    userDomains.clear();
    for ( const sourceLine of String(text).split(/\r?\n/) ) {
        const line = sourceLine.trim();
        if ( line === '' || line.startsWith('!') || line.startsWith('[') || line.startsWith('@@') ) { continue; }
        const cosmeticPos = line.indexOf('##');
        if ( cosmeticPos !== -1 ) {
            const selector = line.slice(cosmeticPos + 2).trim();
            const hostPart = line.slice(0, cosmeticPos).trim();
            if ( selector === '' || selector.startsWith('+js(') || selector.startsWith('^') ) { continue; }
            const hosts = hostPart === '' ? [ '*' ] : hostPart.split(',').map(a => a.trim());
            for ( const host of hosts ) {
                if ( host.startsWith('~') ) { continue; }
                const key = host === '*' ? '*' : normalizeDomain(host);
                if ( key === undefined ) { continue; }
                (cosmetic[key] ||= []).push(selector);
            }
            continue;
        }
        const network = line.split('$', 1)[0];
        const match = /^\|\|([^/^*|]+)(?:[\^/]|$)/.exec(network);
        if ( match ) { addUserDomain(match[1]); }
    }
    for ( const selectors of Object.values(cosmetic) ) {
        selectors.sort();
    }
    return cosmetic;
}

export async function updateFirefoxUserFilters(text = '') {
    userCosmeticFilters = parseUserFilters(text);
    const hasCosmeticFilters = Object.keys(userCosmeticFilters).length !== 0;
    if ( hasCosmeticFilters ) {
        await localWrite('firefoxUserCosmeticFilters', userCosmeticFilters);
    } else {
        await localWrite('firefoxUserCosmeticFilters', {});
    }
    await registerFirefoxUserCosmeticFilters();
    return { domains: userDomains.size, cosmetic: hasCosmeticFilters };
}

export async function registerFirefoxUserCosmeticFilters() {
    if ( browser.scripting?.registerContentScripts === undefined ) { return; }
    try {
        await browser.scripting.unregisterContentScripts({ ids: [ cosmeticScriptId ] });
    } catch {
    }
    if ( Object.keys(userCosmeticFilters).length === 0 ) { return; }
    await browser.scripting.registerContentScripts([{
        id: cosmeticScriptId,
        matches: [ '<all_urls>' ],
        js: [ '/js/scripting/firefox-user-filters.js' ],
        allFrames: true,
        runAt: 'document_start',
        persistAcrossSessions: true,
    }]);
}

export async function getFirefoxUserCosmeticFilters(hostname) {
    const output = new Set(userCosmeticFilters['*'] || []);
    let candidate = normalizeDomain(hostname);
    while ( candidate ) {
        for ( const selector of userCosmeticFilters[candidate] || [] ) { output.add(selector); }
        const dot = candidate.indexOf('.');
        candidate = dot === -1 ? undefined : candidate.slice(dot + 1);
    }
    return [ ...output ];
}

function matchesDomain(domains, hostname) {
    let candidate = hostname;
    for ( ;; ) {
        if ( domains.has(candidate) ) { return true; }
        const dot = candidate.indexOf('.');
        if ( dot === -1 ) { return false; }
        candidate = candidate.slice(dot + 1);
    }
}

function isThirdParty(details, hostname) {
    try {
        const source = new URL(details.documentUrl || details.originUrl || '').hostname.toLowerCase();
        return source !== hostname && !source.endsWith(`.${hostname}`) && !hostname.endsWith(`.${source}`);
    } catch {
        return true;
    }
}

function onBeforeRequest(details) {
    if ( fallbackEnabled === false || details.type === 'main_frame' ) { return; }
    let hostname;
    try {
        hostname = new URL(details.url).hostname.toLowerCase();
    } catch {
        return;
    }
    const blocked = matchesDomain(userDomains, hostname) || matchesDomain(globalDomains, hostname) || (
        isThirdParty(details, hostname) && matchesDomain(thirdPartyDomains, hostname)
    );
    if ( blocked === false ) { return; }
    void recordMalwardAdBlock(details.tabId, details.url, 'Firefox core filter list');
    return { cancel: true };
}

export function setFirefoxAdFallbackEnabled(value) {
    fallbackEnabled = value !== false;
}

export async function startFirefoxAdFallback() {
    if ( listenerRegistered ) { return; }
    const settings = await getMalwardSettings();
    setFirefoxAdFallbackEnabled(settings.adBlocking);
    userCosmeticFilters = parseUserFilters(await localRead('sandboxFilters') || '');
    await registerFirefoxUserCosmeticFilters();

    const ruleLists = await Promise.all(coreRulesets.map(async id => {
        try {
            const response = await fetch(runtime.getURL(`/rulesets/main/${id}.json`));
            return response.ok ? response.json() : [];
        } catch {
            return [];
        }
    }));
    ruleLists.forEach(addDomains);

    if ( globalDomains.size === 0 && thirdPartyDomains.size === 0 ) {
        console.warn('Malward: Firefox ad-filter fallback did not load any domains.');
        return;
    }
    try {
        browser.webRequest.onBeforeRequest.addListener(
            onBeforeRequest,
            { urls: [ '<all_urls>' ] },
            [ 'blocking' ],
        );
        listenerRegistered = true;
        console.info(`Malward: Firefox ad-filter fallback loaded ${globalDomains.size + thirdPartyDomains.size} domains.`);
    } catch ( reason ) {
        console.error('Malward: Firefox ad-filter fallback could not start.', reason);
    }
}
