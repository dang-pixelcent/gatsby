// src/components/LazyBlockquoteEmbed.js

import React, { useState, useEffect, useRef } from 'react';
import { Script } from 'gatsby';
import parse from 'html-react-parser';

const LazyBlockquoteEmbed = ({ embedCode, scriptSrc, platformName, rootMargin = '200px' }) => {
    // State để theo dõi xem có nên bắt đầu tải nội dung hay không
    const [loadEmbed, setLoadEmbed] = useState(false);
    // Ref để tham chiếu đến div placeholder
    const placeholderRef = useRef(null);

    useEffect(() => {
        // Chỉ chạy ở phía trình duyệt
        if (typeof window === 'undefined' || !placeholderRef.current) {
            return;
        }

        // --- Sử dụng IntersectionObserver ---
        // Nó sẽ "canh chừng" khi nào div placeholder lọt vào màn hình
        const observer = new IntersectionObserver(
            (entries) => {
                // entries[0] chính là div placeholder của chúng ta
                if (entries[0].isIntersecting) {
                    // Khi placeholder lọt vào màn hình, bắt đầu tải nội dung
                    setLoadEmbed(true);
                    // Ngừng "canh chừng" để tiết kiệm tài nguyên
                    observer.disconnect();
                }
            },
            {
                // Tùy chọn: Bắt đầu tải trước khi nó lọt vào màn hình 200px
                // để người dùng không cảm thấy độ trễ.
                rootMargin: rootMargin,
            }
        );

        // Bắt đầu theo dõi div placeholder
        observer.observe(placeholderRef.current);

        // Dọn dẹp khi component bị hủy (khi chuyển trang)
        return () => {
            observer.disconnect();
        };
    }, [rootMargin]); // Chỉ chạy lại nếu rootMargin thay đổi

    // --- Render ---
    // Nếu chưa đến lúc tải, chỉ render một div trống với chiều cao tối thiểu
    // để tránh hiện tượng nhảy layout (Cumulative Layout Shift - CLS)
    if (!loadEmbed) {
        return (
            <div
                ref={placeholderRef}
                style={{ minHeight: '400px', width: '100%' }}
                aria-label={`Loading content from ${platformName}`}
            />
        );
    }

    // Khi đã đến lúc, render mã nhúng gốc và tải script cần thiết
    return (
        <>
            {parse(embedCode)}
            <Script src={scriptSrc} strategy="idle" />
        </>
    );
};

export default LazyBlockquoteEmbed;