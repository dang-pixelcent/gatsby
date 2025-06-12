/**
 * Tìm tất cả các phần tử tab trên trang, gắn sự kiện click để chuyển đổi tab,
 * và trả về một hàm để dọn dẹp các sự kiện đó.
 * @returns {function|null} - Trả về một hàm dọn dẹp nếu tìm thấy phần tử, hoặc null nếu không.
 */
export const initializeTabs = () => {
    const tabs = document.querySelectorAll('.header-tabs .tab');

    // Nếu không có phần tử tab nào trên trang, không làm gì cả.
    if (tabs.length === 0) {
        return null;
    }

    const handleTabClick = (event) => {
        const tab = event.currentTarget;
        const currentContentID = tab.getAttribute('data-item');
        
        if (!currentContentID) return;

        // Remove active class from all tabs
        const tabActive = document.querySelectorAll('.header-tabs .active');
        tabActive.forEach(el => el.classList.remove('active'));
        
        // Remove active class from all content
        const contentActive = document.querySelectorAll('.content-tabs .active');
        contentActive.forEach(el => el.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Add active class to corresponding content
        const contentID = document.getElementById(currentContentID);
        if (contentID) {
            contentID.classList.add('active');
        }
    };
    
    tabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });
    
    // Rất quan trọng: Trả về một hàm dọn dẹp.
    return () => {
        tabs.forEach(tab => {
            tab.removeEventListener('click', handleTabClick);
        });
    };
};
