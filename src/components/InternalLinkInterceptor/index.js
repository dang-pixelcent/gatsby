// src/components/InternalLinkInterceptor.js

import React from 'react';
import { navigate } from 'gatsby';

const InternalLinkInterceptor = () => {
    React.useEffect(() => {
        const handleLinkClick = (event) => {
            // Tìm thẻ <a> gần nhất với mục tiêu được click
            const link = event.target.closest('a');

            // Nếu không phải là link hoặc không có href, bỏ qua
            if (!link || !link.getAttribute('href')) {
                return;
            }

            const href = link.getAttribute('href');
            const target = link.getAttribute('target');

            // Bỏ qua nếu là target="_blank"
            if (target === '_blank') return;

            // Bỏ qua các giao thức đặc biệt
            if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

            // Bỏ qua link anchor trên cùng trang
            if (href.startsWith('#')) return;

            // Bỏ qua các tệp tin
            if (/\.(pdf|zip|jpg|jpeg|png|gif)$/i.test(href)) return;

            // Kiểm tra có phải link bên ngoài không
            // Nếu href bắt đầu bằng http -> là link bên ngoài
            if (href.startsWith('http')) {
                try {
                    // Nếu domain khác với domain hiện tại -> link ngoài
                    const linkUrl = new URL(href);
                    if (linkUrl.origin !== window.location.origin) {
                        return;
                    }
                } catch (e) {
                    // URL không hợp lệ, để trình duyệt xử lý
                    return;
                }
            }

            // Nếu không rơi vào các trường hợp trên, đây là link nội bộ.
            event.preventDefault(); // Ngăn tải lại trang
            navigate(href); // Sử dụng Gatsby navigate
        };

        // Lắng nghe click trên toàn bộ tài liệu
        document.addEventListener('click', handleLinkClick);

        // Dọn dẹp khi component unmount
        return () => {
            document.removeEventListener('click', handleLinkClick);
        };
    }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần khi component mount

    return null; // Component này không render ra UI
};

export default InternalLinkInterceptor;