// import { Script } from 'gatsby';
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

    // Effect này sẽ chạy khi `hasInteracted` chuyển thành `true`
    useEffect(() => {
        // Chỉ bắt đầu tải khi đã có tương tác và có scripts để tải
        if (!hasInteracted || !scripts || scripts.length === 0 || typeof window === 'undefined') {
            return;
        }

        // Hàm để tải script tuần tự
        const loadScript = (index) => {
            // Khi đã tải hết script thì dừng lại
            if (index >= scripts.length) return;

            const scriptData = scripts[index];

            // Bỏ qua nếu script không hợp lệ và chuyển sang script tiếp theo
            if (!scriptData || (!scriptData.content && !scriptData.src)) {
                loadScript(index + 1);
                return;
            }

            // Tạo một thẻ <script> mới
            const scriptElement = document.createElement('script');

            // Gán các thuộc tính (props) như id, data-...
            if (scriptData.props) {
                for (const [key, value] of Object.entries(scriptData.props)) {
                    const attributeName = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
                    scriptElement.setAttribute(attributeName, value);
                }
            }

            // Xử lý script inline
            if (scriptData.content) {
                scriptElement.innerHTML = scriptData.content;
                document.head.appendChild(scriptElement);
                // Tải ngay script tiếp theo
                loadScript(index + 1);
            }
            // Xử lý script có src
            else if (scriptData.src) {
                scriptElement.src = scriptData.src;
                // Khi script ngoài tải xong (hoặc lỗi), mới tải script tiếp theo
                scriptElement.onload = () => loadScript(index + 1);
                scriptElement.onerror = () => loadScript(index + 1); // Vẫn tiếp tục dù lỗi
                document.head.appendChild(scriptElement);
            }
        };

        // Bắt đầu tải từ script đầu tiên (index = 0)
        loadScript(0);

    }, [hasInteracted, scripts]);

    return null;
};

export default CmsScriptsForHead;