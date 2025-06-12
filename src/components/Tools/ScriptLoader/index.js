// Bạn có thể tạo file này tại: src/components/ScriptLoader.js

import { useEffect } from 'react';

/**
 * Một component React "thông minh" để tải và quản lý các file script bên ngoài
 * một cách an toàn trong môi trường Gatsby (SPA).
 *
 * @param {object} props - Các thuộc tính của component.
 * @param {string} props.src - Đường dẫn (URL) của file script cần tải.
 * @param {string} [props.id] - Một ID để gán cho thẻ script, giúp tránh tải lại không cần thiết.
 * @param {boolean} [props.async=true] - Thuộc tính async cho thẻ script.
 * @param {boolean} [props.defer=false] - Thuộc tính defer cho thẻ script.
 * @param {function} [props.onLoad] - Hàm callback sẽ được gọi khi script tải xong.
 * @param {function} [props.onError] - Hàm callback sẽ được gọi khi có lỗi tải script.
 * @param {boolean} [props.removeOnUnmount=true] - Tự động xóa script khỏi DOM khi chuyển trang.
 */
const ScriptLoader = ({
    src,
    id,
    async = true,
    defer = false,
    onLoad = () => { },
    onError = () => { },
    removeOnUnmount = true,
}) => {
    useEffect(() => {
        // Nếu không có src, không làm gì cả
        if (!src) return;

        // Kiểm tra xem script đã tồn tại trong DOM chưa (dựa vào src hoặc id)
        const existingScript = id
            ? document.getElementById(id)
            : document.querySelector(`script[src="${src}"]`);

        if (existingScript) {
            console.log(`Script đã tồn tại: ${src}`);
            // Nếu đã có script, ta vẫn gọi callback onLoad để logic phụ thuộc vào nó có thể chạy
            // Ta cần đảm bảo script đã thực sự load xong trước khi gọi callback
            if (existingScript.dataset.loaded) {
                onLoad();
            } else {
                existingScript.addEventListener('load', onLoad);
            }
            // Trả về hàm dọn dẹp để gỡ bỏ event listener khi component bị gỡ bỏ
            return () => {
                existingScript.removeEventListener('load', onLoad);
            };
        }

        // Nếu script chưa tồn tại, tạo mới
        const script = document.createElement('script');
        script.src = src;
        script.async = async;
        script.defer = defer;
        if (id) script.id = id;

        // Xử lý sự kiện khi tải thành công hoặc thất bại
        const handleLoad = () => {
            script.dataset.loaded = 'true'; // Đánh dấu là đã tải xong
            console.log(`Script đã tải thành công: ${src}`);
            onLoad();
        };

        const handleError = () => {
            console.error(`Lỗi tải script: ${src}`);
            onError();
        };

        script.addEventListener('load', handleLoad);
        script.addEventListener('error', handleError);

        // Thêm script vào cuối thẻ <body>
        document.body.appendChild(script);

        // --- Phần quan trọng nhất: HÀM DỌN DẸP ---
        // Hàm này sẽ tự động chạy khi component bị gỡ bỏ (khi chuyển trang)
        return () => {
            // Gỡ bỏ các event listener để tránh rò rỉ bộ nhớ
            script.removeEventListener('load', handleLoad);
            script.removeEventListener('error', handleError);

            // Nếu được cấu hình, xóa script khỏi DOM
            if (removeOnUnmount) {
                // Chỉ xóa script khỏi DOM nếu nó thực sự được component này tạo ra.
                const scriptToRemove = document.getElementById(id) || document.querySelector(`script[src="${src}"]`);
                if (scriptToRemove) {
                    document.body.removeChild(scriptToRemove);
                }
            }
        };
    }, [src, id, async, defer, onLoad, onError, removeOnUnmount]); // Chạy lại effect nếu bất kỳ prop nào thay đổi

    // Component này không render ra bất cứ thứ gì trên giao diện
    return null;
};

export default ScriptLoader;