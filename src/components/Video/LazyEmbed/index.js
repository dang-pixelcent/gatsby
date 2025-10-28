// src/components/LazyEmbed.js

import React, { useState, useEffect, useRef } from 'react';
import { Script } from 'gatsby';
import parse from 'html-react-parser';
import { domToReact } from 'html-react-parser';

const LazyEmbed = ({ embedCode, rootMargin = '200px' }) => {
    const [loadEmbed, setLoadEmbed] = useState(false);
    const placeholderRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !placeholderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setLoadEmbed(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        observer.observe(placeholderRef.current);
        return () => observer.disconnect();
    }, [rootMargin]);

    // Nếu chưa đến lúc, chỉ hiển thị div giữ chỗ
    if (!loadEmbed) {
        return <div ref={placeholderRef} style={{ minHeight: '350px', width: '100%' }} />;
    }

    // Khi đã đến lúc, parse HTML gốc và thay thế các thẻ <script> bằng <Script> của Gatsby
    return (
        <>
            {parse(embedCode, {
                replace: (domNode) => {
                    // Xử lý thẻ <script> để dùng component <Script> của Gatsby
                    if (domNode.type === 'script' && domNode.name === 'script') {
                        return <Script {...domNode.attribs}>{domToReact(domNode.children)}</Script>;
                    }

                    // Xử lý thẻ <img> có thuộc tính onload dạng chuỗi
                    if (domNode.type === 'tag' && domNode.name === 'img' && domNode.attribs && domNode.attribs.onload) {
                        // Tạo một bản sao của các thuộc tính và xóa onload đi
                        const newAttribs = { ...domNode.attribs };
                        delete newAttribs.onload;
                        // Trả về thẻ img mới không có onload
                        return <img {...newAttribs} />;
                    }
                }
            })}
        </>
    );
};

export default LazyEmbed;