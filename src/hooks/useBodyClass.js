import { useState, useEffect } from 'react';
import { useLocation } from '@reach/router';
import { useMobileMenuContext } from '@context/MobileMenuContext';

/**
 * Custom Hook để tự động tính toán và trả về chuỗi class cho thẻ <body>
 * dựa trên trang hiện tại, kích thước màn hình và trạng thái của mobile menu.
 * @param {boolean} isMobileMenuOpenOverride - Trạng thái mở/đóng của mobile menu.
 * @returns {string} - Chuỗi class đã được tính toán cho thẻ <body>.
 */
export const useBodyClass = (isMobileMenuOpenOverride = null) => {
    // Sử dụng context để lấy trạng thái của mobile menu
    const { isMobileMenuOpen : contextValue } = useMobileMenuContext();
    const location = useLocation();
    const [bodyClass, setBodyClass] = useState("");

    // Nếu isMobileMenuOpenOverride khác null (tức là có giá trị được truyền vào), thì dùng nó.
    // Nếu không, thì dùng giá trị từ context.
    const isMobileMenuOpen = isMobileMenuOpenOverride !== null 
        ? isMobileMenuOpenOverride 
        : contextValue;

    // Toàn bộ logic useEffect của bạn được chuyển vào đây
    useEffect(() => {
        const updateBodyClass = () => {
            const isMobile = window.innerWidth <= 921;
            const isHomePage = location.pathname === '/';

            let classes = [
                "wp-custom-logo",
                "wp-theme-astra",
                "wp-child-theme-agencymarketing",
                "mega-menu-primary",
                "ast-plain-container",
                "ast-no-sidebar",
                "astra-4.1.1", // Bạn có thể cập nhật các phiên bản này nếu muốn
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
                "astra-addon-4.1.0" // Bạn có thể cập nhật các phiên bản này nếu muốn
            ];

            if (isMobile) {
                classes.push("ast-header-break-point");
                if (isMobileMenuOpen) {
                    classes.push("ast-main-header-nav-open");
                }
            } else {
                classes.push("ast-desktop");
            }

            if (isHomePage) {
                classes.push("page-template-front-page");
            }

            setBodyClass(classes.join(" "));
        };

        // Chạy lần đầu
        updateBodyClass();

        // Thêm và dọn dẹp event listener
        window.addEventListener('resize', updateBodyClass);
        return () => window.removeEventListener('resize', updateBodyClass);

    }, [location.pathname, isMobileMenuOpen]); // Các dependencies không đổi

    // Hook sẽ trả về chuỗi class cuối cùng
    return bodyClass;
};