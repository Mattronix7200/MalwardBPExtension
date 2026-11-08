(() => {
    const target = document.getElementById('generated-at');
    if ( target === null ) { return; }
    const language = navigator.language || 'en';
    const prefix = language.toLowerCase().startsWith('pl') ? 'Wygenerowano' : 'Generated';
    target.textContent = `${prefix}: ${new Intl.DateTimeFormat(language, {
        dateStyle: 'medium',
        timeStyle: 'medium',
    }).format(new Date())}`;
})();
