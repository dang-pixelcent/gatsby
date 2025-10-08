import { useEffect } from 'react';

const MOBILE_BREAKPOINT = 921;

export const useScrollHeader = (isMobileMenuOpen) => {
    useEffect(() => {
        const headerElement = document.getElementById('masthead');
        if (!headerElement) return;

        const handleScroll = () => {
            const isDesktop = window.innerWidth > MOBILE_BREAKPOINT;

            if (isDesktop) {
                // Logic cho desktop
                if (window.scrollY > 100) {
                    // Thêm class 'menu-fixed' nếu cuộn xuống hơn 100px
                    headerElement.classList.add('menu-scroll-scale');
                }
                else if (window.scrollY <= 0) {
                    headerElement.classList.remove('menu-scroll-scale');
                }
                // Lưu ý: Nếu 0 < window.scrollY <= 100 và 'menu-fixed' đang tồn tại, nó sẽ được giữ lại.
            }
            //  else {
            //   // Logic gốc cho mobile (ngưỡng là 0 cho cả việc thêm và xóa class)
            //   if (window.scrollY > (isMobileMenuOpen ? 200 : 0)) {
            //     headerElement.classList.add('menu-fixed');
            //   } else if (window.scrollY <= 0) {
            //     headerElement.classList.remove('menu-fixed');
            //   }
            // }
        };

        const handleResize = () => {
            handleScroll(); // Re-evaluate on resize
        };

        // Gắn sự kiện
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        // Chạy lần đầu
        handleScroll();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobileMenuOpen]);
};