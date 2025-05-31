// Compact Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Load word of the day
    fetchCompactWordOfTheDay();
    
    // Enter key for dictionary
    document.getElementById('word-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('lookup-btn').click();
        }
    });
    
    // Ctrl+Enter for translation
    document.getElementById('translate_inputText').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            document.getElementById('translate_translateButton').click();
        }
    });
});

// Compact Word of the Day
function fetchCompactWordOfTheDay() {
    const container = document.getElementById('word-of-day-content');
    
    const today = new Date().toISOString().split('T')[0];
    const cachedWord = localStorage.getItem('compactWordOfDay');
    const cachedDate = localStorage.getItem('compactWordOfDayDate');
    
    if (cachedWord && cachedDate === today) {
        container.innerHTML = cachedWord;
        return;
    }
    
    // Simple word list for reliability
    const words = [
        'diligent', 'perseverance', 'eloquent', 'meticulous', 
        'innovative', 'pragmatic', 'resilient', 'versatile',
        'analytical', 'comprehensive', 'efficient', 'proficient',
        'substantial', 'preliminary', 'consecutive', 'adequate'
    ];
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const word = data[0];
                const meaning = word.meanings[0];
                const definition = meaning.definitions[0];
                
                let html = `
                    <div class="word-day-word">${word.word}</div>
                    <div class="word-day-pos">${meaning.partOfSpeech}</div>
                    <div class="word-day-definition">${definition.definition}</div>
                `;
                
                if (definition.example) {
                    html += `<div class="word-day-example">"${definition.example}"</div>`;
                }
                
                container.innerHTML = html;
                localStorage.setItem('compactWordOfDay', html);
                localStorage.setItem('compactWordOfDayDate', today);
            } else {
                container.innerHTML = '<div class="error-message">Word unavailable today</div>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = '<div class="error-message">Word unavailable today</div>';
        });
}