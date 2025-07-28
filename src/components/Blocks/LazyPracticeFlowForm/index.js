// src/components/Blocks/LazyPracticeFlowForm.js

import React, { useState, useEffect, useRef } from 'react';
import { Script } from 'gatsby';

const LazyPracticeFlowForm = () => {
    // State để theo dõi xem form đã được tải hay chưa
    const [isLoaded, setIsLoaded] = useState(false);
    // Ref để tham chiếu đến div placeholder
    const containerRef = useRef(null);

    useEffect(() => {
        // 1. Tạo một Intersection Observer
        const observer = new IntersectionObserver(
            (entries) => {
                // Khi placeholder bắt đầu xuất hiện trên màn hình...
                if (entries[0].isIntersecting) {
                    // 2. ...thì cập nhật state để bắt đầu tải form
                    setIsLoaded(true);
                    // 3. Ngừng theo dõi để tiết kiệm tài nguyên
                    observer.disconnect();
                }
            },
            {
                // Tải trước 200px trước khi nó thực sự lọt vào màn hình
                rootMargin: '200px',
            }
        );

        // Bắt đầu theo dõi div placeholder
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        // Hàm dọn dẹp
        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []); // Mảng rỗng đảm bảo effect này chỉ chạy một lần

    // Nếu chưa cần tải, chỉ hiển thị một div giữ chỗ
    if (!isLoaded) {
        return (
            <div
                ref={containerRef}
                // Đặt chiều cao tối thiểu để tránh nhảy layout
                style={{ minHeight: '800px' }}
            >
                {/* Bạn có thể đặt một spinner tải ở đây nếu muốn */}
            </div>
        );
    }

    // Khi đã cần tải, render iframe và script của form
    return (
        <>
            <iframe
                id="pZ5us1TDI3kKin0xSGLQ"
                style={{ width: '100%', border: 'none', minHeight: '800px' }}
                src="https://book.practiceflow.md/widget/survey/pZ5us1TDI3kKin0xSGLQ"
                title="Practice Flow Survey Form"
            ></iframe>
            <Script src="https://book.practiceflow.md/js/form_embed.js" strategy="post-hydrate" />
        </>
    );
};

export default LazyPracticeFlowForm;