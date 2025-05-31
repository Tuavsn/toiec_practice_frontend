document.getElementById('lookup-btn').addEventListener('click', function () {
    const word = document.getElementById('word-input').value.trim();
    if (word) {
        fetchCompactDefinition(word);
    }
});

function fetchCompactDefinition(word) {
    const container = document.getElementById('definition');
    container.innerHTML = '<div class="loading-spinner"></div>';
    
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Word not found');
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                displayCompactDefinition(data[0]);
            } else {
                container.innerHTML = '<div class="error-message">No definition found</div>';
            }
        })
        .catch(error => {
            container.innerHTML = `<div class="error-message">${error.message}</div>`;
        });
}

function displayCompactDefinition(data) {
    const container = document.getElementById('definition');
    container.innerHTML = '';

    // Word title
    const title = document.createElement('div');
    title.className = 'word-title';
    title.textContent = data.word;
    container.appendChild(title);

    // Phonetics (compact) - handle both data.phonetic and data.phonetics
    if (data.phonetic || (data.phonetics && data.phonetics.length > 0)) {
        const phonetics = document.createElement('div');
        phonetics.className = 'phonetics';
        
        // Use main phonetic if available, otherwise first from phonetics array
        if (data.phonetic) {
            phonetics.textContent = data.phonetic;
        } else if (data.phonetics && data.phonetics.length > 0) {
            const phoneticWithText = data.phonetics.find(p => p.text);
            if (phoneticWithText) {
                phonetics.textContent = phoneticWithText.text;
            }
        }
        
        // Find first audio from phonetics array
        if (data.phonetics && data.phonetics.length > 0) {
            const phoneticWithAudio = data.phonetics.find(p => p.audio);
            if (phoneticWithAudio) {
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.className = 'audio-player';
                // Handle URLs that might start with //
                let audioUrl = phoneticWithAudio.audio;
                if (audioUrl.startsWith('//')) {
                    audioUrl = 'https:' + audioUrl;
                }
                audio.src = audioUrl;
                phonetics.appendChild(audio);
            }
        }
        
        if (phonetics.children.length > 0 || phonetics.textContent) {
            container.appendChild(phonetics);
        }
    }

    // Origin (if available)
    if (data.origin) {
        const origin = document.createElement('div');
        origin.className = 'origin';
        origin.innerHTML = `<strong>Origin:</strong> ${data.origin}`;
        origin.style.fontSize = '12px';
        origin.style.color = 'var(--text-gray)';
        origin.style.marginBottom = '8px';
        origin.style.fontStyle = 'italic';
        container.appendChild(origin);
    }

    // Meanings (compact - show first 2)
    if (data.meanings && data.meanings.length > 0) {
        const meaningsToShow = data.meanings.slice(0, 2);
        
        meaningsToShow.forEach(meaning => {
            const section = document.createElement('div');
            section.className = 'meaning-section';
            
            const pos = document.createElement('div');
            pos.className = 'part-of-speech';
            pos.textContent = meaning.partOfSpeech;
            section.appendChild(pos);
            
            // Show first 2 definitions
            const defsToShow = meaning.definitions.slice(0, 2);
            defsToShow.forEach(def => {
                const defText = document.createElement('div');
                defText.className = 'definition-text';
                defText.textContent = def.definition;
                section.appendChild(defText);
                
                if (def.example) {
                    const example = document.createElement('div');
                    example.className = 'example';
                    example.textContent = `"${def.example}"`;
                    section.appendChild(example);
                }
            });
            
            // Synonyms (first 3) - check if synonyms exist and have length
            if (meaning.synonyms && meaning.synonyms.length > 0) {
                const synonyms = document.createElement('div');
                synonyms.className = 'synonyms';
                synonyms.innerHTML = '<strong>Synonyms:</strong> ';
                
                meaning.synonyms.slice(0, 3).forEach(synonym => {
                    const span = document.createElement('span');
                    span.textContent = synonym;
                    span.addEventListener('click', () => {
                        document.getElementById('word-input').value = synonym;
                        fetchCompactDefinition(synonym); // Call the function directly
                    });
                    synonyms.appendChild(span);
                });
                
                section.appendChild(synonyms);
            }
            
            // Antonyms (first 3) - check if antonyms exist and have length
            if (meaning.antonyms && meaning.antonyms.length > 0) {
                const antonyms = document.createElement('div');
                antonyms.className = 'antonyms';
                antonyms.innerHTML = '<strong>Antonyms:</strong> ';
                
                meaning.antonyms.slice(0, 3).forEach(antonym => {
                    const span = document.createElement('span');
                    span.textContent = antonym;
                    span.style.backgroundColor = '#f44336';
                    span.addEventListener('click', () => {
                        document.getElementById('word-input').value = antonym;
                        fetchCompactDefinition(antonym); // Call the function directly
                    });
                    antonyms.appendChild(span);
                });
                
                section.appendChild(antonyms);
            }
            
            container.appendChild(section);
        });
    }

    // Show more button if there are more meanings
    if (data.meanings && data.meanings.length > 2) {
        const showMore = document.createElement('button');
        showMore.textContent = `Show ${data.meanings.length - 2} more meanings`;
        showMore.style.cssText = `
            background: var(--primary-light);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: var(--radius);
            cursor: pointer;
            font-size: 12px;
            margin-top: 8px;
            width: 100%;
        `;
        showMore.addEventListener('click', () => {
            // Remove the button and show all meanings
            showMore.remove();
            displayAllMeanings(data, container);
        });
        container.appendChild(showMore);
    }
}

function displayAllMeanings(data, container) {
    // Remove existing meaning sections
    const existingSections = container.querySelectorAll('.meaning-section');
    existingSections.forEach(section => section.remove());
    
    // Display all meanings
    data.meanings.forEach(meaning => {
        const section = document.createElement('div');
        section.className = 'meaning-section';
        
        const pos = document.createElement('div');
        pos.className = 'part-of-speech';
        pos.textContent = meaning.partOfSpeech;
        section.appendChild(pos);
        
        // Show all definitions for this meaning
        meaning.definitions.forEach(def => {
            const defText = document.createElement('div');
            defText.className = 'definition-text';
            defText.textContent = def.definition;
            section.appendChild(defText);
            
            if (def.example) {
                const example = document.createElement('div');
                example.className = 'example';
                example.textContent = `"${def.example}"`;
                section.appendChild(example);
            }
        });
        
        // Synonyms
        if (meaning.synonyms && meaning.synonyms.length > 0) {
            const synonyms = document.createElement('div');
            synonyms.className = 'synonyms';
            synonyms.innerHTML = '<strong>Synonyms:</strong> ';
            
            meaning.synonyms.forEach(synonym => {
                const span = document.createElement('span');
                span.textContent = synonym;
                span.addEventListener('click', () => {
                    document.getElementById('word-input').value = synonym;
                    fetchCompactDefinition(synonym); // Call the function directly
                });
                synonyms.appendChild(span);
            });
            
            section.appendChild(synonyms);
        }
        
        // Antonyms
        if (meaning.antonyms && meaning.antonyms.length > 0) {
            const antonyms = document.createElement('div');
            antonyms.className = 'antonyms';
            antonyms.innerHTML = '<strong>Antonyms:</strong> ';
            
            meaning.antonyms.forEach(antonym => {
                const span = document.createElement('span');
                span.textContent = antonym;
                span.style.backgroundColor = '#f44336';
                span.addEventListener('click', () => {
                    document.getElementById('word-input').value = antonym;
                    fetchCompactDefinition(antonym); // Call the function directly
                });
                antonyms.appendChild(span);
            });
            
            section.appendChild(antonyms);
        }
        
        container.appendChild(section);
    });
}