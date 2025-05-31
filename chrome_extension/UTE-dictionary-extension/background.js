// Filename: background.js

//------------------------------------------------------
// Setup context menu for translation
//------------------------------------------------------

// Create context menu entries
function createContextMenus() {
  chrome.contextMenus.create({
    id: "en",
    title: "🇺🇸→🇻🇳 Translate to Vietnamese",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "vi",
    title: "🇻🇳→🇺🇸 Translate to English",
    contexts: ["selection"],
  });
}

// Ensure context menu is created on install or browser startup
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(createContextMenus);
});

chrome.runtime.onStartup.addListener(() => {
  chrome.contextMenus.removeAll(createContextMenus);
});

//------------------------------------------------------
// Handle context menu click
//------------------------------------------------------

chrome.contextMenus.onClicked.addListener((info) => {
  const selectedText = info.selectionText;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    if (tabId) {
      translateSelectedText(tabId, selectedText, info.menuItemId);
    }
  });
});

//------------------------------------------------------
// Translate text and inject popup
//------------------------------------------------------

function translateSelectedText(tabId, text, lang) {
  const sourceLang = lang;
  const targetLang = lang === "vi" ? "en" : "vi";

  fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text,
    )}`,
  )
    .then((response) => response.json())
    .then((data) => {
      const translatedText = data[0][0][0];
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: showTranslatedText,
        args: [translatedText, text, sourceLang, targetLang],
      });
    })
    .catch(() => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: showTranslatedText,
        args: ["Translation failed. Please try again later.", text, sourceLang, targetLang],
      });
    });
}

//------------------------------------------------------
// Function to inject and position the popup
//------------------------------------------------------

function showTranslatedText(translatedText, originalText, fromLang, toLang) {
  const existingPopup = document.getElementById("translation-popup_for_extension_ute_app");
  if (existingPopup) existingPopup.remove();

  const popup = document.createElement("div");
  popup.id = "translation-popup_for_extension_ute_app";
  popup.style.cssText = `
    position: absolute !important;
    background: #ffffff !important;
    border: 2px solid #1976d2 !important;
    border-radius: 8px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
    padding: 15px !important;
    z-index: 999999 !important;
    max-width: 320px !important;
    min-width: 250px !important;
    font-family: 'Segoe UI', Arial, sans-serif !important;
    font-size: 14px !important;
    color: #212121 !important;
    pointer-events: auto !important;
    line-height: 1.4 !important;
  `;

  const header = document.createElement("div");
  header.style.cssText = `
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-bottom: 12px !important;
    padding-bottom: 8px !important;
    border-bottom: 2px solid #e3f2fd !important;
  `;

  const title = document.createElement("div");
  title.textContent = fromLang === "vi" ? "🇻🇳 → 🇺🇸 Translation" : "🇺🇸 → 🇻🇳 Translation";
  title.style.cssText = `
    color: #1976d2 !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    background: #e3f2fd !important;
    padding: 4px 8px !important;
    border-radius: 4px !important;
  `;

  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.style.cssText = `
    background: #f44336 !important;
    color: white !important;
    border: none !important;
    border-radius: 50% !important;
    width: 24px !important;
    height: 24px !important;
    cursor: pointer !important;
    font-size: 14px !important;
    font-weight: bold !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  `;
  closeButton.addEventListener("click", () => popup.remove());

  header.appendChild(title);
  header.appendChild(closeButton);
  popup.appendChild(header);

  const originalSection = document.createElement("div");
  originalSection.style.marginBottom = "12px";

  const originalLabel = document.createElement("div");
  originalLabel.textContent = "Original:";
  originalLabel.style.cssText = `
    color: #666 !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    margin-bottom: 4px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
  `;

  const original = document.createElement("div");
  original.textContent = originalText;
  original.style.cssText = `
    background: #f5f5f5 !important;
    border: 1px solid #e0e0e0 !important;
    border-radius: 6px !important;
    padding: 10px !important;
    font-size: 13px !important;
    color: #424242 !important;
    font-style: italic !important;
    word-wrap: break-word !important;
  `;

  originalSection.appendChild(originalLabel);
  originalSection.appendChild(original);
  popup.appendChild(originalSection);

  const translatedSection = document.createElement("div");

  const translatedLabel = document.createElement("div");
  translatedLabel.textContent = "Translation:";
  translatedLabel.style.cssText = `
    color: #1976d2 !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    margin-bottom: 4px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
  `;

  const translated = document.createElement("div");
  translated.textContent = translatedText;
  translated.style.cssText = `
    background: #e3f2fd !important;
    border: 2px solid #1976d2 !important;
    border-radius: 6px !important;
    padding: 12px !important;
    font-size: 14px !important;
    color: #0d47a1 !important;
    font-weight: 500 !important;
    word-wrap: break-word !important;
  `;

  translatedSection.appendChild(translatedLabel);
  translatedSection.appendChild(translated);
  popup.appendChild(translatedSection);

  //------------------------------------------------------
  // Position popup near selected text
  //------------------------------------------------------

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    let top = rect.bottom + window.scrollY + 10;
    let left = rect.left + window.scrollX;

    const popupHeight = 260;
    const popupWidth = 320;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (top + popupHeight > window.scrollY + viewportHeight) {
      top = rect.top + window.scrollY - popupHeight;
    }

    if (left + popupWidth > viewportWidth) {
      left = viewportWidth - popupWidth - 10;
    }

    if (left < 10) left = 10;
    if (top < 10) top = 10;

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
  }

  document.body.appendChild(popup);

  // Auto-close after 15s
  setTimeout(() => popup.remove(), 15000);

  // Close when clicking outside
  const closePopup = (event) => {
    if (!popup.contains(event.target)) {
      popup.remove();
      document.removeEventListener("click", closePopup);
    }
  };

  setTimeout(() => {
    document.addEventListener("click", closePopup);
  }, 200);
}
