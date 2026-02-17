import { Script } from 'gatsby';
import React, { useState, useEffect } from 'react';
// import { Script } from 'gatsby'; // Dùng <Script> của Gatsby
// import { Helmet } from 'react-helmet';

const CmsScriptsForHead = ({ scripts = [] }) => {
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            if (hasInteracted) return;
            setHasInteracted(true);
            window.removeEventListener('scroll', handleInteraction, { capture: true });
            window.removeEventListener('mousemove', handleInteraction, { capture: true });
            window.removeEventListener('touchstart', handleInteraction, { capture: true });
            window.removeEventListener('click', handleInteraction, { capture: true });
            window.removeEventListener('keydown', handleInteraction, { capture: true });
        };

        window.addEventListener('scroll', handleInteraction, { once: true, passive: true, capture: true });
        window.addEventListener('mousemove', handleInteraction, { once: true, passive: true, capture: true });
        window.addEventListener('touchstart', handleInteraction, { once: true, passive: true, capture: true });
        window.addEventListener('click', handleInteraction, { once: true, passive: true, capture: true });
        window.addEventListener('keydown', handleInteraction, { once: true, passive: true, capture: true });

        return () => {
            window.removeEventListener('scroll', handleInteraction, { capture: true });
            window.removeEventListener('mousemove', handleInteraction, { capture: true });
            window.removeEventListener('touchstart', handleInteraction, { capture: true });
            window.removeEventListener('click', handleInteraction, { capture: true });
            window.removeEventListener('keydown', handleInteraction, { capture: true });
        };
    }, [hasInteracted]);

    // Nếu chưa tương tác, hoặc không có script, không render gì cả
    if (!hasInteracted || !scripts || scripts.length === 0) {
        return null;
    }

    // DEBUG: Log head scripts ra console
    console.log('[CmsScriptsForHead] Head Scripts:', scripts);

    // TEST: Bỏ 2 phần tử cuối để test
    const filteredScripts = scripts.slice(0, -2);

    return (
        <>
            {filteredScripts.map((script, index) => {
                // Lấy các props từ gatsby-node (như id, data-uuid)
                const scriptProps = script.props || {};

                if (script.src) {
                    return (
                        <Script
                            key={`cms-script-${index}`}
                            src={script.src}
                            {...scriptProps} // Truyền tất cả props
                            strategy="post-hydrate" // Chiến lược tải
                        />
                    );
                }
                if (script.content) {
                    return (
                        <Script
                            key={`cms-script-${index}`}
                            {...scriptProps}
                            strategy="post-hydrate" // Chiến lược tải
                            dangerouslySetInnerHTML={{ __html: script.content }}
                        />
                    );
                }
                return null;
            })}
        </>
    );
};

export default CmsScriptsForHead;