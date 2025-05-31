document.getElementById('translate_translateButton').addEventListener('click', () => {
    const inputText = document.getElementById('translate_inputText').value.trim();
    if (inputText) {
        translateCompactText(inputText);
    }
});

document.getElementById('translate_switchButton').addEventListener('click', function() {
    const from = this.getAttribute('data-from_lang');
    const to = from === "vi" ? "en" : "vi";
    
    this.setAttribute('data-from_lang', to);
    this.textContent = to === "vi" ? "🇻🇳 ⇄ 🇺🇸" : "🇺🇸 ⇄ 🇻🇳";
    
    // Clear output
    document.getElementById('translate_outputText').textContent = '';
});

function translateCompactText(inputText) {
    const output = document.getElementById('translate_outputText');
    output.innerHTML = '<div class="mini-spinner"></div>';
    
    const button = document.getElementById('translate_switchButton');
    const sourceLang = button.getAttribute('data-from_lang');
    const targetLang = sourceLang === "vi" ? "en" : "vi";

    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(inputText)}`)
        .then(response => {
            if (!response.ok) throw new Error('Translation failed');
            return response.json();
        })
        .then(data => {
            const translatedSegments = data[0].map(segment => segment[0]);
            const translatedText = translatedSegments.join(' ');
            output.textContent = translatedText;
        })
        .catch(error => {
            console.error('Error:', error);
            output.innerHTML = '<div class="error-message">Translation failed</div>';
        });
}