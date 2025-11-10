import React, { useState, useEffect } from 'react';
import { Script } from 'gatsby'; // Dùng <Script> của Gatsby

const LazyCmsScripts = ({ scripts = [] }) => {
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            if (hasInteracted) return;
            setHasInteracted(true);
            window.removeEventListener('scroll', handleInteraction, { capture: true });
            window.removeEventListener('mousemove', handleInteraction, { capture: true });
            window.removeEventListener('touchstart', handleInteraction, { capture: true });
        };

        window.addEventListener('scroll', handleInteraction, { once: true, passive: true, capture: true });
        window.addEventListener('mousemove', handleInteraction, { once: true, passive: true, capture: true });
        window.addEventListener('touchstart', handleInteraction, { once: true, passive: true, capture: true });

        return () => {
            window.removeEventListener('scroll', handleInteraction, { capture: true });
            window.removeEventListener('mousemove', handleInteraction, { capture: true });
            window.removeEventListener('touchstart', handleInteraction, { capture: true });
        };
    }, [hasInteracted]);

    // Nếu chưa tương tác, hoặc không có script, không render gì cả
    if (!hasInteracted || !scripts || scripts.length === 0) {
        return null;
    }

    // Đã tương tác, render các script
    return (
        <>
            {scripts.map((script, index) => {
                // Lấy các props từ gatsby-node (như id, data-uuid)
                const scriptProps = script.props || {};

                if (script.src) {
                    // Script có src ngoài
                    return (
                        <Script
                            key={`cms-script-${index}`}
                            strategy="idle"
                            src={script.src}
                            {...scriptProps} // Truyền tất cả props
                        />
                    );
                }
                if (script.content) {
                    // Script inline
                    return (
                        <Script
                            key={`cms-script-${index}`}
                            strategy="idle"
                            {...scriptProps}
                            dangerouslySetInnerHTML={{ __html: script.content }}
                        />
                    );
                }
                return null;
            })}
        </>
    );
};

export default LazyCmsScripts;