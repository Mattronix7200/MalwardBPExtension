const polish = (navigator.language || '').toLowerCase().startsWith('pl');
const text = polish
    ? { slider:'Przesuń suwak, aby wybrać najlepszą regułę', pick:'Wybierz', preview:'Podgląd', create:'Utwórz regułę', more:'Więcej propozycji', less:'Mniej propozycji' }
    : { slider:'Move the slider to select the best rule', pick:'Select', preview:'Preview', create:'Create rule', more:'More suggestions', less:'Fewer suggestions' };
document.querySelector('label[for="slider"]')?.replaceChildren(text.slider);
document.getElementById('pick')?.replaceChildren(text.pick);
document.getElementById('preview')?.replaceChildren(text.preview);
document.getElementById('create')?.replaceChildren(text.create);
document.querySelector('#moreOrLess > span:first-child [data-i18n]')?.replaceChildren(text.more);
document.querySelector('#moreOrLess > span:last-child [data-i18n]')?.replaceChildren(text.less);
