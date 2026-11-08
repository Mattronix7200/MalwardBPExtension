import { browser, runtime, sendMessage } from './ext.js';
import { locale, t } from './malward-i18n.js';
const $ = id => document.getElementById(id);
const number = value => Number(value || 0).toLocaleString(locale);
let currentHostname;
function text(pl,en){return locale==='pl'?pl:en;}

const BLOCKED_PAGE=runtime.getURL('/malward-blocked.html');

function siteFromTab(tab){const raw=String(tab?.url||'');if(raw.startsWith(BLOCKED_PAGE)){let host;try{host=new URL(raw).searchParams.get('host')||undefined;}catch{}return{host,blockedPage:true};}try{return{host:new URL(raw).hostname||undefined,blockedPage:false};}catch{}return{host:undefined,blockedPage:false};}

function serviceLabel(vdeb,settings,healthy){if(settings.urlProtection===false)return text('Ochrona URL wyłączona','URL protection disabled');if(settings.cloudScan===false)return text('Skanowanie w chmurze wyłączone','Cloud scanning disabled');if(healthy)return text('Pełna baza serwera','Full server database');if(vdeb?.rateLimited===true)return text('Limit zapytań — spróbuj za chwilę','Request limit reached — try again shortly');if(vdeb?.serverOnline===false)return text('Usługa chwilowo niedostępna','Service temporarily unavailable');return text('Aktualizacja w toku','Updating');}

async function init(){
  const [tab]=await browser.tabs.query({active:true,currentWindow:true});
  const site=siteFromTab(tab);
  const data=await sendMessage({what:'malwardPopupData',tabId:tab?.id});
  if(site.blockedPage&&data?.blocked?.host)site.host=data.blocked.host;
  currentHostname=site.host;
  $('current-site').textContent=site.host||text('Ta strona nie obsługuje skanowania','This page cannot be scanned');
  if(site.blockedPage&&site.host)$('current-site').title=String(data?.blocked?.url||site.host);
  $('tab-count').textContent=number(data?.tabMatches||data?.recentMatches);
  $('total-count').textContent=number(data?.totalMatches);
  const vdeb=data?.vdeb;const settings=data?.settings||{};
  const ad=settings.adBlocking!==false,url=settings.urlProtection!==false;
  const healthy=!url||(settings.cloudScan===true&&vdeb?.ok===true&&vdeb?.serverOnline===true&&vdeb?.rateLimited!==true);
  const state=site.blockedPage?'blocked':!ad&&!url?'off':ad&&url&&healthy?'healthy':'warning';
  $('popup-status-icon').src={healthy:'img/check-mark.png',warning:'img/attention.png',off:'img/close.png',blocked:'img/attention.png'}[state];
  $('status-dot').classList.toggle('warning',state==='warning'||state==='blocked');
  $('status-dot').classList.toggle('off',state==='off');
  document.querySelector('.site-status').classList.toggle('warning',state==='warning'||state==='blocked');
  document.querySelector('.site-status').classList.toggle('off',state==='off');
  $('current-state').textContent=state==='blocked'?text('Ta witryna została zablokowana przez osłonę URL.','This site was blocked by the URL shield.'):state==='healthy'?text('Osłona URL i blokowanie reklam są aktywne.','URL protection and ad blocking are active.'):state==='off'?text('Wszystkie moduły ochrony są wyłączone.','All protection modules are disabled.'):text('Co najmniej jeden moduł wymaga uwagi.','At least one module needs attention.');
  $('vdeb-status').textContent=serviceLabel(vdeb,settings,healthy);
  $('exception-button').hidden=!currentHostname;
}

$('tab-label').textContent=text('Na tej stronie','On this page');$('total-label').textContent=text('Łącznie przez rozszerzenie','Total by extension');$('url-shield-label').textContent=text('Osłona URL Malward','Malward URL Shield');$('matched-button').textContent=text('Ostatnie blokady','Recent blocks');$('exception-button').textContent=text('Dodaj wyjątek dla tej domeny','Add exception for this domain');$('element-picker-label').textContent=text('Zablokuj element na stronie','Block an element on this page');$('settings-button').setAttribute('aria-label',t('settings'));
$('settings-button').addEventListener('click',()=>runtime.openOptionsPage());$('matched-button').addEventListener('click',async()=>{const [tab]=await browser.tabs.query({active:true,currentWindow:true});await sendMessage({what:'showMatchedRules',tabId:tab?.id});});$('element-picker-button').addEventListener('click',async()=>{const button=$('element-picker-button');button.disabled=true;try{const[tab]=await browser.tabs.query({active:true,currentWindow:true});await sendMessage({what:'launchElementPicker',tabId:tab?.id});window.close();}catch(error){button.disabled=false;$('element-picker-label').textContent=text('Nie można wybrać elementu na tej stronie','Cannot select an element on this page');}});$('exception-button').addEventListener('click',async()=>{if(!currentHostname)return;const button=$('exception-button');button.disabled=true;button.textContent=text('Dodawanie wyjątku…','Adding exception…');try{await sendMessage({what:'addMalwardException',hostname:currentHostname});button.textContent=text('Domena została dodana do wyjątków','Domain was added to exceptions');}catch(error){button.textContent=error?.message||text('Nie udało się dodać wyjątku','Could not add exception');button.disabled=false;}});void init();
