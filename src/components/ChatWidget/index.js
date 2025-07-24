// src/components/ChatWidget/index.js

import React, { useEffect, useRef, useCallback } from 'react';
import { Script } from 'gatsby';

const ChatWidget = () => {
    // useRef để lưu trữ các biến mà không làm component re-render
    const observerRef = useRef(null);
    const cleanupRef = useRef(null); // Lưu trữ hàm dọn dẹp của event listeners

    // --- Logic tùy chỉnh widget, được bọc trong useCallback để tối ưu ---
    const customizeWidget = useCallback(() => {
        const chatWidget = document.querySelector('chat-widget');
        if (!chatWidget?.shadowRoot) return;

        const root = chatWidget.shadowRoot;
        const conWidget = root.querySelector('.lc_text-widget');
        if (!conWidget) return;

        let currentScreenSize = window.innerWidth;

        // --- Hàm xử lý thay đổi kích thước cửa sổ ---
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const breakpointChanged = (currentScreenSize <= 921 && newWidth > 921) || (currentScreenSize > 921 && newWidth <= 921);

            if (breakpointChanged) {
                // Reset styles khi thay đổi breakpoint
                ['.lc_text-widget', '.lc_text-widget_content', '.lc_text-widget_dialog'].forEach(selector => {
                    const el = root.querySelector(selector);
                    if (el) el.style.cssText = '';
                });
                currentScreenSize = newWidth;
            }
            
            // Luôn cập nhật style cho button chat
            const chatButton = conWidget.querySelector('button:not([aria-label="Close Greeting"])');
            if (chatButton) {
                chatButton.style.cssText = 'right: 20px !important; bottom: 70px !important;';
            }
        };
        
        // Dùng debounce để tối ưu sự kiện resize
        let resizeTimeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 150);
        };
        window.addEventListener('resize', debouncedResize);

        // --- Hàm xử lý click vào nút đóng ---
        const handleCloseClick = () => {
            setTimeout(() => {
                const button = conWidget.querySelector('button:not([aria-label="Close Greeting"])');
                if (button) {
                    button.style.cssText = 'right: 20px !important; bottom: 70px !important; display: block !important;';
                }
            }, 300); // Đợi animation đóng hoàn tất
        };
        
        const closeBtn = root.querySelector('.lc_text-widget_heading_close--btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', handleCloseClick);
        }
        
        const promptCloseBtn = root.querySelector('.lc_text-widget_prompt--prompt-close');
        if (promptCloseBtn) {
            promptCloseBtn.addEventListener('click', handleCloseClick);
        }

        // Áp dụng style lần đầu
        handleResize();

        // Trả về hàm dọn dẹp để xóa tất cả event listener
        return () => {
            window.removeEventListener('resize', debouncedResize);
            if (closeBtn) closeBtn.removeEventListener('click', handleCloseClick);
            if (promptCloseBtn) promptCloseBtn.removeEventListener('click', handleCloseClick);
            clearTimeout(resizeTimeout);
        };
    }, []);

    // --- useEffect chính để quản lý vòng đời ---
    useEffect(() => {
        // Chỉ chạy ở phía client
        if (typeof window === 'undefined') return;

        // Sử dụng MutationObserver để đợi 'chat-widget' xuất hiện
        const observer = new MutationObserver((mutations, obs) => {
            const chatWidget = document.querySelector('chat-widget');
            if (chatWidget?.shadowRoot) {
                // Khi tìm thấy, chạy hàm tùy chỉnh và lưu lại hàm dọn dẹp
                cleanupRef.current = customizeWidget();
                
                // Dừng theo dõi để tiết kiệm tài nguyên
                obs.disconnect();
                observerRef.current = null;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        observerRef.current = observer;

        // Dọn dẹp cuối cùng khi component bị hủy
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect(); // Dừng observer
            }
            if (typeof cleanupRef.current === 'function') {
                cleanupRef.current(); // Chạy hàm dọn dẹp của event listeners
            }
        };
    }, [customizeWidget]); // Chỉ chạy lại nếu hàm customizeWidget thay đổi (rất hiếm)

    return (
        <div className="widget-chat-box">
            <Script
                async
                src="https://widgets.leadconnectorhq.com/loader.js"
                data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
                data-widget-id="668d5bc943da7a2804c9bf8e"
                // Không cần prop onLoad nữa, useEffect sẽ quản lý tất cả
            />
        </div>
    );
};

export default ChatWidget;