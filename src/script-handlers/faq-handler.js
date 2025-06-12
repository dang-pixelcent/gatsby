/**
 * Tìm tất cả các phần tử FAQ trên trang, gắn sự kiện click để mở/đóng,
 * và trả về một hàm để dọn dẹp các sự kiện đó.
 * @returns {function|null} - Trả về một hàm dọn dẹp nếu tìm thấy phần tử, hoặc null nếu không.
 */
export const initializeFAQs = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    // Nếu không có phần tử FAQ nào trên trang, không làm gì cả.
    if (faqItems.length === 0) {
        return null;
    }

    const handleFaqClick = (event) => {
        event.currentTarget.classList.toggle('active');
    };
    
    faqItems.forEach(item => {
        item.addEventListener('click', handleFaqClick);
    });
    
    // Rất quan trọng: Trả về một hàm. 
    // "Bộ điều phối" sẽ gọi hàm này khi cần dọn dẹp.
    return () => {
        faqItems.forEach(item => {
            item.removeEventListener('click', handleFaqClick);
        });
    };
};