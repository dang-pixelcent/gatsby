// import { Script } from 'gatsby';
import React, { useState, useEffect } from 'react';
// import { Script } from 'gatsby'; // Dùng <Script> của Gatsby
// import { Helmet } from 'react-helmet';

const CmsScriptsForHead = ({ scripts = [] }) => {
    useEffect(() => {
        if (!scripts || scripts.length === 0 || typeof window === 'undefined') {
            return;
        }

        const loadScript = (index) => {
            if (index >= scripts.length) return;

            const scriptData = scripts[index];
            // Bỏ qua nếu script không hợp lệ
            if (!scriptData || (!scriptData.content && !scriptData.src)) {
                scheduleNext();
                return;
            }

            const scriptElement = document.createElement('script');

            if (scriptData.props) {
                for (const [key, value] of Object.entries(scriptData.props)) {
                    const attributeName = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
                    scriptElement.setAttribute(attributeName, value);
                }
            }

            const scheduleNext = () => {
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(() => loadScript(index + 1));
                } else {
                    setTimeout(() => loadScript(index + 1), 200);
                }
            };

            if (scriptData.content) {
                scriptElement.innerHTML = scriptData.content;
                document.head.appendChild(scriptElement);
                scheduleNext();
            } else if (scriptData.src) {
                scriptElement.src = scriptData.src;
                // Đảm bảo async=true để không block, trừ khi được chỉ định khác
                if (scriptData.props?.async !== false) {
                    scriptElement.async = true;
                }
                scriptElement.onload = scheduleNext;
                scriptElement.onerror = scheduleNext; // Vẫn tiếp tục nếu script lỗi
                document.head.appendChild(scriptElement);
            }
        };

        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => loadScript(0));
        } else {
            setTimeout(() => loadScript(0), 200);
        }

    }, [scripts]);

    return null;
};

export default CmsScriptsForHead;