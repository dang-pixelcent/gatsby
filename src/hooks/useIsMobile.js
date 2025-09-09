import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 767) => {
    // Kiểm tra xem window có tồn tại không để tránh lỗi lúc build (SSR)
    const isBrowser = typeof window !== 'undefined';

    const [isMobile, setIsMobile] = useState(
        isBrowser ? window.innerWidth <= breakpoint : false
    );

    useEffect(() => {
        if (!isBrowser) {
            return;
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth <= breakpoint);
        };

        window.addEventListener('resize', handleResize);

        // Dọn dẹp event listener khi component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isBrowser, breakpoint]);

    return isMobile;
};

export default useIsMobile;