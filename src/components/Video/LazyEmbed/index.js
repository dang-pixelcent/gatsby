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
                    if (domNode.type === 'script' && domNode.name === 'script') {
                        // Dùng component <Script> của Gatsby để tải script một cách tối ưu
                        return <Script {...domNode.attribs}>{domToReact(domNode.children)}</Script>;
                    }
                }
            })}
        </>
    );
};

export default LazyEmbed;