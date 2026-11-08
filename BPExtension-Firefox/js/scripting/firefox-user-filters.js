/* Apply cosmetic filters entered in the Malward dashboard on Firefox. */

(async ( ) => {
    try {
        const selectors = await browser.runtime.sendMessage({
            what: 'getFirefoxUserCosmeticFilters',
            hostname: location.hostname,
        });
        if ( Array.isArray(selectors) === false || selectors.length === 0 ) { return; }
        const style = document.createElement('style');
        style.dataset.malwardUserFilters = 'true';
        style.textContent = `${selectors.join(',\n')}{display:none!important;}`;
        (document.head || document.documentElement).append(style);
    } catch {
    }
})();
