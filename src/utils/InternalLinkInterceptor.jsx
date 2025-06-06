// Mục đích: Intercept các liên kết nội bộ trong ứng dụng Gatsby để sử dụng navigate thay vì a href

import React from 'react';
import { navigate } from 'gatsby';

const InternalLinkInterceptor = () => {
    React.useEffect(() => {
        const handleLinkClick = (event) => {
            const link = event.target.closest('a');

            // Nếu không phải là một link, hoặc không có href, bỏ qua
            if (!link || !link.href) {
                return;
            }

            const href = link.getAttribute('href');
            const target = link.getAttribute('target');

            // 1. Bỏ qua nếu có target="_blank"
            if (target === '_blank') {
                return;
            }

            // 2. Bỏ qua các giao thức đặc biệt
            if (href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            // 3. Bỏ qua các liên kết anchor trên cùng một trang
            if (href.startsWith('#')) {
                return;
            }

            // 4. Bỏ qua các liên kết đến tệp tin
            if (/\.(pdf|zip|jpg|jpeg|png|gif)$/i.test(href)) {
                return;
            }

            // 5. Kiểm tra nếu là link bên ngoài
            // URL.origin chỉ tồn tại trên các URL đầy đủ, nên ta cần new URL()
            // Nếu href là một đường dẫn tương đối (vd: /about), nó sẽ throw error -> ta bắt lỗi này
            let isExternal = false;
            try {
                const linkUrl = new URL(href);
                if (linkUrl.origin !== window.location.origin) {
                    isExternal = true;
                }
            } catch (e) {
                // Lỗi xảy ra chứng tỏ đây là một đường dẫn tương đối (relative path) -> là link nội bộ
                isExternal = false;
            }

            if (isExternal) {
                return;
            }

            // Nếu tất cả các điều kiện trên đều không đúng -> đây là link nội bộ
            event.preventDefault();
            navigate(href);
        };

        document.addEventListener('click', handleLinkClick);

        // Dọn dẹp trình lắng nghe sự kiện khi component bị unmount
        return () => {
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    // Component này không render ra bất kỳ UI nào
    return null;
};

export default InternalLinkInterceptor;