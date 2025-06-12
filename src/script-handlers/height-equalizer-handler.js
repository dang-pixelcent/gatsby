/**
 * Tự động set equal height cho các elements trong group,
 * và trả về một hàm để dọn dẹp các sự kiện đó.
 * @returns {function|null} - Trả về một hàm dọn dẹp nếu tìm thấy phần tử, hoặc null nếu không.
 */
export const initializeHeightEqualizer = () => {
    const group1 = document.querySelectorAll('.r-circle-1 .circle-item--content');
    const group2 = document.querySelectorAll('.r-circle-2 .circle-item--content');

    // Nếu không có phần tử nào, không làm gì cả.
    if (group1.length === 0 && group2.length === 0) {
        return null;
    }

    const setHeight = () => {
        // Set height for group 1
        if (group1.length > 0) {
            let maxHeight1 = 0;
            
            // Reset height để tính lại
            group1.forEach(item => {
                item.style.height = 'auto';
            });

            group1.forEach(item => {
                maxHeight1 = Math.max(maxHeight1, item.offsetHeight);
            });

            group1.forEach(item => {
                item.style.height = `${maxHeight1}px`;
            });
        }

        // Set height for group 2
        if (group2.length > 0) {
            let maxHeight2 = 0;
            
            // Reset height để tính lại
            group2.forEach(item => {
                item.style.height = 'auto';
            });

            group2.forEach(item => {
                maxHeight2 = Math.max(maxHeight2, item.offsetHeight);
            });

            group2.forEach(item => {
                item.style.height = `${maxHeight2}px`;
            });
        }
    };

    // Set height khi load và resize
    const handleLoad = () => setHeight();
    const handleResize = () => setHeight();

    window.addEventListener('load', handleLoad);
    window.addEventListener('resize', handleResize);

    // Initial call nếu đã load
    if (document.readyState === 'complete') {
        setHeight();
    }

    // Trả về hàm dọn dẹp
    return () => {
        window.removeEventListener('load', handleLoad);
        window.removeEventListener('resize', handleResize);
        
        // Reset heights
        [...group1, ...group2].forEach(item => {
            item.style.height = 'auto';
        });
    };
};
