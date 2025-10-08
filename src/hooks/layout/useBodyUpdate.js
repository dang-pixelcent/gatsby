import { useEffect, useState } from 'react';

export const useBodyUpdate = (location, isMobileMenuOpen) => {
    const [bodyClass, setBodyClass] = useState(""); // Dùng state để lưu trữ class
    useEffect(() => {
        const updateBodyClass = () => {
            const isMobile = window.innerWidth <= 921; // Ngưỡng breakpoint của bạn
            const isHomePage = location.pathname === '/'; // Kiểm tra có phải trang chủ không

            let classes = [
                "wp-custom-logo",
                "wp-theme-astra",
                "wp-child-theme-agencymarketing",
                "mega-menu-primary",
                "ast-plain-container",
                "ast-no-sidebar",
                "astra-4.11.1",
                "ast-single-post",
                "ast-inherit-site-logo-transparent",
                "ast-theme-transparent-header",
                "ast-hfb-header",
                "ast-sticky-main-shrink",
                "ast-sticky-above-shrink",
                "ast-sticky-below-shrink",
                "ast-sticky-header-shrink",
                "ast-inherit-site-logo-sticky",
                "ast-primary-sticky-enabled",
                "astra-addon-4.11.0"
            ];

            if (isMobile) {
                classes.push("ast-header-break-point");
                if (isMobileMenuOpen) {
                    // 2. Thêm class khi menu mở trên mobile
                    classes.push("ast-main-header-nav-open");
                }
            } else {
                classes.push("ast-desktop");
            }

            if (isHomePage) {
                classes.push("page-template-front-page");
                // Thêm các class khác chỉ dành cho trang chủ
            }

            setBodyClass(classes.join(" "));
        };

        // Chạy lần đầu khi component được render
        updateBodyClass();

        // Thêm sự kiện resize để cập nhật class khi thay đổi kích thước cửa sổ
        window.addEventListener('resize', updateBodyClass);

        // Dọn dẹp sự kiện khi component unmount
        return () => window.removeEventListener('resize', updateBodyClass);

    }, [location.pathname, isMobileMenuOpen]);

    // Hook này sẽ theo dõi sự thay đổi của `bodyClass` và cập nhật DOM
    useEffect(() => {
        // Gán trực tiếp chuỗi class vào thẻ body
        // Thao tác này sẽ ghi đè lên tất cả các class cũ và áp dụng bộ class mới
        document.body.className = bodyClass;

        // Trả về một hàm cleanup (không bắt buộc nhưng là good practice)
        // để xóa các class khi component unmount, đưa body về trạng thái sạch sẽ.
        return () => {
            document.body.className = '';
        };
    }, [bodyClass]); // Chỉ chạy lại effect này khi `bodyClass` thay đổi
};