import { sendMessage } from './ext.js';
import { locale } from './malward-i18n.js';
const $ = id => document.getElementById(id);
const pl = locale === 'pl';
const copy = pl ? { title:'Strona zablokowana', lead:'Osłona sieciowa Malward zablokowała dostęp do tej witryny.', url:'ADRES URL', unknown:'Nieznana domena', detection:'DETEKCJA', unsafe:'Niebezpieczna witryna', source:'ŹRÓDŁO', database:'Baza URL Malward', explanation:'Strona została zaklasyfikowana jako szkodliwa lub niezaufana. Otwarcie jej może prowadzić do wyłudzenia danych, pobrania złośliwego pliku albo śledzenia użytkownika.', back:'← Zabierz mnie stąd', add:'Dodaj wyjątek dla domeny', adding:'Dodawanie wyjątku…', added:'Domena została dodana do wyjątków osłony URL. Możesz wrócić do strony.', done:'Wyjątek dodany', failure:'Nie udało się dodać wyjątku.', leaving:'Zamykanie…', leaveFailure:'Nie udało się opuścić tej strony.' } : { title:'Blocked page', lead:'Malward network protection blocked access to this website.', url:'URL ADDRESS', unknown:'Unknown domain', detection:'DETECTION', unsafe:'Unsafe website', source:'SOURCE', database:'Malward URL database', explanation:'This page was classified as malicious or untrusted. Opening it may lead to data theft, a malicious download or tracking.', back:'← Take me back', add:'Add domain exception', adding:'Adding exception…', added:'The domain was added to URL shield exceptions. You can return to the page.', done:'Exception added', failure:'Could not add exception.', leaving:'Leaving…', leaveFailure:'Could not leave this page.' };
document.title=`${copy.title} — Malward`;for(const [id,key] of [['blocked-title','title'],['blocked-lead','lead'],['url-label','url'],['detection-label','detection'],['source-label','source'],['source-value','database'],['explanation','explanation'],['back-button','back'],['exception-button','add']])$(id).textContent=copy[key];{const cel=$('detection-value');cel.replaceChildren(document.createTextNode(copy.unsafe+' '));const etykieta=document.createElement('small');etykieta.textContent='Malicious URL';cel.append(etykieta);}$('blocked-host').textContent=copy.unknown;

let hostname, blockedUrl;
const params=new URL(location.href).searchParams;
const tabId=Number.parseInt(params.get('tab')??'',10);

function showTarget(){if(blockedUrl){$('blocked-host').textContent=blockedUrl;$('blocked-host').title=blockedUrl;}else if(hostname){$('blocked-host').textContent=hostname;}}

async function resolveTarget(){hostname=params.get('host')||undefined;let info;try{info=await sendMessage({what:'malwardBlockedInfo',tabId:Number.isInteger(tabId)?tabId:undefined});}catch{}if(!info&&hostname){try{info=await sendMessage({what:'malwardBlockedPageOpened',host:hostname});}catch{}}if(info){hostname=info.host||hostname;blockedUrl=info.url||blockedUrl;}if(!hostname&&document.referrer){try{hostname=new URL(document.referrer).hostname||undefined;}catch{}}showTarget();if(hostname)$('exception-button').hidden=false;}

$('back-button').addEventListener('click',async()=>{const button=$('back-button');button.disabled=true;button.textContent=copy.leaving;try{await sendMessage({what:'malwardLeaveBlockedPage',tabId:Number.isInteger(tabId)?tabId:undefined});}catch{$('exception-status').textContent=copy.leaveFailure;button.disabled=false;button.textContent=copy.back;}});

$('exception-button').addEventListener('click',async()=>{if(!hostname)return;const button=$('exception-button');button.disabled=true;button.textContent=copy.adding;try{await sendMessage({what:'addMalwardException',hostname});$('exception-status').textContent=copy.added;button.textContent=copy.done;}catch(error){$('exception-status').textContent=error?.message||copy.failure;button.disabled=false;button.textContent=copy.add;}});

void resolveTarget();
