/**
 * Trích xuất pathname từ URL
 * @param {string} url - URL cần xử lý
 * @param {string} fallback - Giá trị mặc định nếu URL không hợp lệ
 * @returns {string} pathname hoặc fallback
 */
export const extractPathname = (url, fallback = '/') => {
    if (!url || typeof url !== 'string') {
        return fallback;
    }

    try {
        const urlObject = new URL(url);
        return urlObject.pathname;
    } catch (error) {
        console.warn(`Không thể phân tích URL: ${url}`, error);
        return fallback;
    }
};

/**
 * Cắt chuỗi với độ dài tối đa
 * @param {string} str - Chuỗi cần cắt
 * @param {number} maxLength - Độ dài tối đa
 * @param {string} suffix - Hậu tố thêm vào (mặc định là '...')
 * @returns {string} Chuỗi đã được cắt
 */
export const truncateString = (str, maxLength, suffix = '...') => {
    if (!str || typeof str !== 'string') {
        return '';
    }

    if (str.length <= maxLength) {
        return str;
    }

    return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Làm sạch và chuẩn hóa URL
 * @param {string} url - URL cần làm sạch
 * @returns {string} URL đã được chuẩn hóa
 */
export const sanitizeUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return '';
    }

    // Loại bỏ khoảng trắng đầu cuối
    let cleanUrl = url.trim();

    // Thêm protocol nếu thiếu
    if (cleanUrl && !cleanUrl.startsWith('http') && !cleanUrl.startsWith('/')) {
        cleanUrl = `https://${cleanUrl}`;
    }

    return cleanUrl;
};