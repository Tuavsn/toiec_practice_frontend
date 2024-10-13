document.getElementById('lookup-btn').addEventListener('click', function() {
  const word = document.getElementById('word-input').value.trim();
  if (word) {
      fetchDefinition(word);
  }
});

function fetchDefinition(word) {
  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          if (data.length > 0) {
              displayDefinition(data[0]);
          } else {
              document.getElementById('definition').textContent = 'No definition found.';
          }
      })
      .catch(error => {
          document.getElementById('definition').textContent = 'Error fetching definition.';
      });
}

function displayDefinition(data) {
  const definitionContainer = document.getElementById('definition');
  definitionContainer.innerHTML = ''; // Clear previous definitions

  // Word
  const wordElement = document.createElement('h2');
  wordElement.textContent = data.word;
  definitionContainer.appendChild(wordElement);

  // Phonetics
  if (data.phonetics && data.phonetics.length > 0) {
      const phoneticsElement = document.createElement('div');
      phoneticsElement.innerHTML = '<strong>Phonetics:</strong><br>';

      data.phonetics.forEach(phonetic => {
          if (phonetic.text) {
              const phoneticText = document.createElement('div');
              phoneticText.textContent = phonetic.text;
              phoneticsElement.appendChild(phoneticText);
          }
          if (phonetic.audio) {
              const audioLink = document.createElement('audio');
              audioLink.controls = true;
              audioLink.src = phonetic.audio;
              phoneticsElement.appendChild(audioLink);
          }
      });
      definitionContainer.appendChild(phoneticsElement);
  }

  // Meanings
  if (data.meanings && data.meanings.length > 0) {
      data.meanings.forEach(meaning => {
          const meaningElement = document.createElement('div');
          meaningElement.innerHTML = `<strong>Part of Speech:</strong> ${meaning.partOfSpeech}<br>`;
          
          meaning.definitions.forEach(def => {
              meaningElement.innerHTML += `<strong>Definition:</strong> ${def.definition}<br>`;
              if (def.example) {
                  meaningElement.innerHTML += `<strong>Example:</strong> ${def.example}<br>`;
              }
          });

          if (meaning.synonyms.length > 0) {
              meaningElement.innerHTML += `<strong>Synonyms:</strong> ${meaning.synonyms.join(', ')}<br>`;
          }

          if (meaning.antonyms.length > 0) {
              meaningElement.innerHTML += `<strong>Antonyms:</strong> ${meaning.antonyms.join(', ')}<br>`;
          }

          definitionContainer.appendChild(meaningElement);
      });
  }

  // License and Source
  if (data.sourceUrls && data.sourceUrls.length > 0) {
      const sourceElement = document.createElement('div');
      sourceElement.innerHTML = `<strong>Source:</strong> <a href="${data.sourceUrls[0]}" target="_blank">${data.sourceUrls[0]}</a>`;
      definitionContainer.appendChild(sourceElement);
  }

  if (data.license && data.license.url) {
      const licenseElement = document.createElement('div');
      licenseElement.innerHTML = `<strong>License:</strong> <a href="${data.license.url}" target="_blank">${data.license.name}</a>`;
      definitionContainer.appendChild(licenseElement);
  }
}
