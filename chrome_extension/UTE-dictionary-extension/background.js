// Tạo các mục menu ngữ cảnh (context menu)
chrome.runtime.onInstalled.addListener(() => {
    // Tạo mục menu ngữ cảnh cho dịch từ tiếng Anh sang tiếng Việt
    chrome.contextMenus.create({
        id: "en", // ID duy nhất cho mục menu
        title: "Dịch Anh  ⇄ Việt", // Tiêu đề hiển thị trong menu
        contexts: ["selection"], // Mục menu này chỉ hiển thị khi có văn bản được chọn
    });

    // Tạo mục menu ngữ cảnh cho dịch từ tiếng Việt sang tiếng Anh
    chrome.contextMenus.create({
        id: "vi", // ID duy nhất cho mục menu
        title: "Dịch Việt  ⇄ Anh", // Tiêu đề hiển thị trong menu
        contexts: ["selection"], // Mục menu này chỉ hiển thị khi có văn bản được chọn
    });
});

// Xử lý khi người dùng nhấp vào menu ngữ cảnh
chrome.contextMenus.onClicked.addListener((info) => {
    const selectedText = info.selectionText; // Lấy văn bản đã chọn từ thông tin menu

    // Truy vấn tab đang hoạt động để lấy tabId
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id; // Lấy ID của tab đang hoạt động

        if (tabId) {
            // Gọi hàm dịch văn bản đã chọn, truyền vào tabId, văn bản và ID của mục menu
            translateSelectedText(tabId, selectedText, info.menuItemId);
        } else {
            // In ra lỗi nếu không tìm thấy tabId
            console.error("tabId is missing.");
        }
    });
});

// Hàm để dịch văn bản
function translateSelectedText(tabId, text, lang) {
    const sourceLang = lang; // Ngôn ngữ nguồn (dựa vào ID mục menu)
    const targetLang = lang === "vi" ? "en" : "vi"; // Đặt ngôn ngữ đích dựa trên ngôn ngữ nguồn

    // Gửi yêu cầu đến API dịch
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`)
        .then(response => response.json()) // Chuyển đổi phản hồi thành JSON
        .then(data => {
            const translatedText = data[0][0][0]; // Lấy văn bản đã dịch từ dữ liệu
            // Hiển thị văn bản đã dịch trên trang
            chrome.scripting.executeScript({
                target: { tabId: tabId }, // Chỉ định tab để thực thi script
                func: showTranslatedText, // Hàm để hiển thị văn bản đã dịch
                args: [translatedText, text] // Truyền văn bản đã dịch và văn bản gốc vào hàm
            });
        })
        .catch(error => {
            // Nếu có lỗi trong quá trình dịch, in ra lỗi và thông báo cho người dùng
            console.error('Error:', error);
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: showTranslatedText,
                args: ['Dịch không thành công. vui lòng thử lại sau', text] // Hiển thị thông báo lỗi
            });
        });
}

// Hàm để hiển thị văn bản đã dịch
function showTranslatedText(text, selectedText) {
    const existingPopup = document.getElementById('translation-popup'); // Kiểm tra xem popup đã tồn tại chưa
    if (existingPopup) {
        existingPopup.remove(); // Nếu tồn tại, xóa popup hiện tại
    }

    const popup = document.createElement('div');                // Tạo phần tử div cho popup
    popup.id = 'translation-popup';                             // Đặt ID cho popup
    popup.style.position = 'fixed';                             // Đặt popup ở vị trí cố định
    popup.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';   // Đặt nền trắng bán trong suốt
    popup.style.border = '1px solid #ccc';                      // Đặt viền màu xám nhạt
    popup.style.borderRadius = '8px';                           // Thêm góc bo tròn
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';     // Thêm bóng mờ để tạo chiều sâu
    popup.style.padding = '10px';                               // Đặt khoảng cách bên trong popup
    popup.style.zIndex = 9999;                                  // Đảm bảo popup xuất hiện trên các phần tử khác
    popup.style.pointerEvents = 'auto';                         // Cho phép các sự kiện chuột trên popup
    popup.style.maxWidth = '300px';                             // Đặt chiều rộng tối đa cho popup
    popup.style.fontFamily = 'Arial, sans-serif';               // Đặt font chữ sạch sẽ
    popup.style.fontSize = '14px';                              // Đặt kích thước font chữ dễ đọc



    // Định vị popup gần với văn bản đã chọn
    const selection = window.getSelection(); // Lấy đối tượng lựa chọn hiện tại
    if (selection.rangeCount > 0) { // Kiểm tra xem có lựa chọn nào không
        const range = selection.getRangeAt(0); // Lấy dải lựa chọn đầu tiên
        const rect = range.getBoundingClientRect(); // Lấy vị trí của dải lựa chọn
        // Đặt vị trí cho popup bên dưới văn bản đã chọn
        popup.style.top = `${rect.top + window.scrollY + rect.height + 5}px`; // Vị trí dọc
        popup.style.left = `${rect.left + window.scrollX}px`; // Vị trí ngang
    }

    popup.innerText = text; // Đặt văn bản đã dịch cho popup
    document.body.appendChild(popup); // Thêm popup vào body của trang

    // Đóng popup khi người dùng nhấp ra ngoài nó
    const closePopup = (event) => {
        if (!popup.contains(event.target)) { // Kiểm tra xem nhấp không nằm trong popup
            popup.remove(); // Xóa popup
            document.removeEventListener('click', closePopup); // Gỡ bỏ sự kiện nhấp
        }
    };

    document.addEventListener('click', closePopup); // Thêm sự kiện nhấp cho toàn bộ tài liệu
}
