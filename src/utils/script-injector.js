/**
 * Tìm một placeholder, chèn chuỗi HTML vào vị trí đó, và đảm bảo các script được thực thi.
 * @param {string} placeholderSelector - CSS selector để tìm placeholder.
 * @param {string} htmlString - Chuỗi HTML để chèn vào.
 * @param {HTMLElement} injectionTarget - Vị trí DOM thực tế để chèn các node vào (ví dụ: document.head hoặc document.body).
 */
export function injectHtmlIntoPlaceholder(placeholderSelector, htmlString, injectionTarget) {
    if (!htmlString || typeof document === 'undefined' || !injectionTarget) {
        return;
    }

    const placeholder = document.querySelector(placeholderSelector);

    if (placeholder) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // DOMParser có thể đặt một số thẻ vào <head> và một số vào <body> của tài liệu ảo.
        // Chúng ta sẽ lấy tất cả các node từ cả hai nơi.
        const nodesToInject = [
            ...Array.from(doc.head.childNodes),
            ...Array.from(doc.body.childNodes)
        ];

        nodesToInject.forEach(node => {
            // Bỏ qua các text node rỗng
            if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
                return;
            }

            if (node.nodeName === 'SCRIPT') {
                const newScript = document.createElement('script');
                for (const attr of node.attributes) {
                    newScript.setAttribute(attr.name, attr.value);
                }
                if (node.innerHTML) {
                    newScript.innerHTML = node.innerHTML;
                }
                // Chèn vào target đã chỉ định
                injectionTarget.appendChild(newScript);
            } else {
                const importedNode = document.importNode(node, true);
                // Chèn vào target đã chỉ định
                injectionTarget.appendChild(importedNode);
            }
        });

        // Dọn dẹp placeholder
        placeholder.parentNode.removeChild(placeholder);
    }
}