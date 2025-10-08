import { useEffect } from "react";
import AOS from 'aos';

export const useAos = () => {
    // Khởi tạo AOS
    useEffect(() => {
        // Trì hoãn việc khởi tạo AOS để nó không chặn luồng chính trong quá trình tải ban đầu
        const timer = setTimeout(() => {
            AOS.init({
                offset: 250,
                once: false, // Hiệu ứng chỉ chạy nhiều lần
            });
        }, 500); // Trì hoãn 0.5 giây, đủ để LCP hiển thị

        // Lắng nghe sự kiện để refresh AOS khi trang thay đổi (quan trọng cho Gatsby)
        const handleRouteChange = () => {
            AOS.refresh();
        };

        window.addEventListener('gatsby:route-update', handleRouteChange);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('gatsby:route-update', handleRouteChange);
        };
    }, []);
};
