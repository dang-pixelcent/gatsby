// src/components/OptimalWistiaEmbed.js

import React, { useState, useEffect, useRef } from 'react';

const OptimalWistiaEmbed = ({ videoId, seo = 'false', rootMargin = '200px' }) => {
    // State để theo dõi xem có nên bắt đầu tải video hay không
    const [loadVideo, setLoadVideo] = useState(false);
    // Ref để tham chiếu đến div placeholder
    const placeholderRef = useRef(null);

    useEffect(() => {
        // Chỉ chạy ở phía trình duyệt
        if (typeof window === 'undefined' || !placeholderRef.current) {
            return;
        }

        // --- Sử dụng IntersectionObserver ---
        // Nó sẽ theo dõi khi nào div placeholder lọt vào màn hình
        const observer = new IntersectionObserver(
            (entries) => {
                // entries[0] là div placeholder của chúng ta
                if (entries[0].isIntersecting) {
                    // Khi placeholder lọt vào màn hình, bắt đầu tải video
                    setLoadVideo(true);
                    // Ngừng theo dõi để tiết kiệm tài nguyên
                    observer.disconnect();
                }
            },
            {
                // Tải trước khi nó lọt vào màn hình 200px để người dùng không thấy độ trễ
                rootMargin: rootMargin, 
            }
        );

        // Bắt đầu theo dõi div placeholder
        observer.observe(placeholderRef.current);

        // Dọn dẹp khi component bị hủy
        return () => {
            observer.disconnect();
        };
    }, [rootMargin]); // Mảng rỗng đảm bảo chỉ chạy một lần

    // --- Logic tải script (chỉ chạy khi loadVideo là true) ---
    useEffect(() => {
        // Nếu chưa đến lúc tải, không làm gì cả
        if (!loadVideo) {
            return;
        }

        // Bắt chước cách Site Live tải script
        const script1 = document.createElement("script");
        script1.src = `https://fast.wistia.com/embed/medias/${videoId}.jsonp`;
        script1.async = true;

        const script2 = document.createElement("script");
        script2.src = "https://fast.wistia.com/assets/external/E-v1.js";
        script2.async = true;

        document.body.appendChild(script1);
        document.body.appendChild(script2);

        return () => {
            // Cố gắng xóa script khi component unmount
            if (script1.parentNode) document.body.removeChild(script1);
            if (script2.parentNode) document.body.removeChild(script2);
        };
    }, [loadVideo, videoId]); // Chạy lại khi loadVideo chuyển thành true

    
    // Render ra cấu trúc HTML y hệt site live, nhưng ban đầu sẽ được chứa trong placeholder
    return (
        <div ref={placeholderRef} style={{ minHeight: '360px' }}> {/* Đặt chiều cao tối thiểu để tránh nhảy layout */}
            {loadVideo && (
                <div className="wistia_responsive_padding" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                    <div className="wistia_responsive_wrapper" style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "100%" }}>
                        <div
                            className={`wistia_embed wistia_async_${videoId} videoFoam=true seo=${seo}`}
                            style={{ height: "100%", position: "relative", width: "100%" }}
                        >
                            &nbsp;
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OptimalWistiaEmbed;