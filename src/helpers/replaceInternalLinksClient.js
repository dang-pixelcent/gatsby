/**
 * Browser-safe version của replaceInternalLinks
 * Sử dụng DOM API thay vì cheerio để tránh lỗi SSR
 * Logic tương tự hoàn toàn với file gốc
 * @param {string} html - Chuỗi HTML cần xử lý
 * @returns {string} - HTML đã được cập nhật
 */
export default function replaceInternalLinksClient(html = '') {
    // Kiểm tra điều kiện tương tự file gốc
    if (!html || typeof window === 'undefined') return html;

    // Sử dụng cùng biến môi trường như file gốc
    const SITE_DOMAIN = process.env.REACT_APP_DOMAIN || window.location.origin;

    // Tạo temporary DOM element để parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let successCount = 0;
    let errorCount = 0;

    // Thông báo bắt đầu xử lý (tương tự logic gốc)
    console.log('🔄 Client: Đang thay thế các URL nội bộ...');

    // Tìm tất cả thẻ <a> có href (tương tự cheerio selector)
    const links = tempDiv.querySelectorAll('a[href]');

    links.forEach(linkEl => {
        const href = linkEl.getAttribute('href');

        // Logic tương tự như trong file gốc
        if (href && href.startsWith(SITE_DOMAIN)) {
            try {
                const urlObject = new URL(href);
                // Lấy pathname và gán lại (tương tự logic gốc)
                linkEl.setAttribute('href', urlObject.pathname);
                successCount++;
            } catch (e) {
                console.error(`❌ Client: URL không hợp lệ trong nội dung: ${href}`);
                errorCount++;
            }
        }
    });

    // Thông báo kết quả cuối cùng (tương tự logic gốc)
    if (successCount > 0 || errorCount > 0) {
        if (errorCount === 0) {
            console.log(`✅ Client: Thành công! Đã thay thế ${successCount} URL`);
        } else {
            console.log(`⚠️ Client: Hoàn thành với lỗi: ${successCount} thành công, ${errorCount} lỗi`);
        }
    }

    // Trả về HTML đã được cập nhật
    return tempDiv.innerHTML;
}