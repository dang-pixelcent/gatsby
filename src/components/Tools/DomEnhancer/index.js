import { useEffect } from 'react';

/**
 * Component này tìm một phần tử DOM dựa trên `selector`,
 * KHÔNG xóa nội dung của nó, mà thêm logic/functionality vào element đó.
 * @param {string} selector - CSS selector của phần tử (ví dụ: '#ast-scroll-top').
 * @param {Function} enhancer - Function nhận element và thêm logic vào đó.
 * @param {Array} dependencies - Dependencies để re-run effect.
 */
const DomEnhancer = ({ selector, enhancer, dependencies = [] }) => {
    useEffect(() => {
        // Tìm phần tử container trên trang
        const targetElement = document.querySelector(selector);

        if (targetElement && enhancer) {
            // Gọi function enhancer để thêm logic vào element
            const cleanup = enhancer(targetElement);

            // Return cleanup function nếu enhancer có trả về
            return cleanup;
        }
    }, [selector, enhancer, ...dependencies]);

    // Component này không render gì cả, chỉ là logic
    return null;
};

export default DomEnhancer;