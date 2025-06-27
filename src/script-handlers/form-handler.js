import { navigate } from 'gatsby'; // Import hàm navigate của Gatsby

/**
 * Handler này tìm tất cả các form tìm kiếm trên trang,
 * ngăn chặn hành vi mặc định và chuyển hướng nó sang trang kết quả tìm kiếm của Gatsby.
 */
export const initializeSearchForm = () => {
    // Tìm form dựa trên một selector cụ thể. Hãy kiểm tra HTML của bạn
    // và thay thế '.search-form' bằng class hoặc id đúng của form.
    const searchForms = document.querySelectorAll('.search form'); // Ví dụ: tìm thẻ form bên trong div có class 'search'

    if (searchForms.length === 0) {
        return null; // Không tìm thấy form nào, không làm gì cả
    }

    const handleSubmit = (event) => {
        // 1. Ngăn chặn hành vi mặc định (tải lại trang)
        event.preventDefault();

        // 2. Lấy từ khóa người dùng nhập vào
        const form = event.currentTarget;
        const searchInput = form.querySelector('input[name="s"]'); // WordPress thường dùng name="s"
        const query = searchInput ? searchInput.value : '';

        // 3. Thực hiện điều hướng phía client bằng Gatsby
        if (query.trim()) {
            navigate(`/blogs/search?q=${encodeURIComponent(query)}`);
        }
    };

    // Gắn sự kiện cho mỗi form tìm thấy
    searchForms.forEach(form => {
        form.addEventListener('submit', handleSubmit);
    });

    // Trả về một hàm dọn dẹp để gỡ bỏ event listener khi chuyển trang
    return () => {
        console.log("Cleaning up search form listeners...");
        searchForms.forEach(form => {
            form.removeEventListener('submit', handleSubmit);
        });
    };
};