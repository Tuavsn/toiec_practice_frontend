document.getElementById('translate_translateButton').addEventListener('click', () => {
    const inputText = document.getElementById('translate_inputText').value;
    translateText(inputText); // Call the function with the input text
});

document.getElementById('translate_switchButton').addEventListener('click', function (event) {
    const from = this.getAttribute('data-from_lang'); // Get the current language
    const to = from === "vi" ? "en" : "vi"; // Toggle to the other language
    this.setAttribute('data-from_lang', to); // Update the data attribute
    this.innerText = from === "vi" ? "Anh  ⇄ Việt" : "Việt  ⇄ Anh"; // Update button text
});

// Function to handle translation
function translateText(inputText) {
    const button = document.getElementById('translate_switchButton');
    const sourceLang = button.getAttribute('data-from_lang'); // Get the current language
    const targetLang = sourceLang === "vi" ? "en" : "vi"; // Determine the target language based on source

    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(inputText)}`)
        .then(response => response.json())
        .then(data => {
            const translatedText = data[0][0][0];
            document.getElementById('translate_outputText').innerText = translatedText; // Display the translated text
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('translate_outputText').innerText = 'Translation failed. Please try again.'; // Handle errors
        });
}