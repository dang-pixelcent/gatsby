// // src/components/ChatWidget/index.js

// import React, { useEffect, useRef, useCallback } from 'react';
// import { Script } from 'gatsby';

// const ChatWidget = () => {
//     // useRef để lưu trữ các observer và hàm dọn dẹp
//     const mainObserverRef = useRef(null);
//     const shadowObserverRef = useRef(null);
//     const cleanupEventListenersRef = useRef(null);

//     // --- Logic tùy chỉnh widget, được bọc trong useCallback để tối ưu ---
//     const customizeWidget = useCallback((root) => {
//         const conWidget = root.querySelector('.lc_text-widget');
//         if (!conWidget) return;

//         let currentScreenSize = window.innerWidth;

//         const handleResize = () => {
//             const newWidth = window.innerWidth;
//             const breakpointChanged = (currentScreenSize <= 921 && newWidth > 921) || (currentScreenSize > 921 && newWidth <= 921);
//             if (breakpointChanged) {
//                 ['.lc_text-widget', '.lc_text-widget_content', '.lc_text-widget_dialog'].forEach(selector => {
//                     const el = root.querySelector(selector);
//                     if (el) el.style.cssText = '';
//                 });
//                 currentScreenSize = newWidth;
//             }

//             // Luôn tìm nút chat chính và áp dụng style
//             const chatButton = conWidget.querySelector('button:not([aria-label="Close Greeting"])');
//             if (chatButton) {
//                 chatButton.style.cssText = 'right: 20px !important; bottom: 70px !important;';
//             }
//         };

//         let resizeTimeout;
//         const debouncedResize = () => {
//             clearTimeout(resizeTimeout);
//             resizeTimeout = setTimeout(handleResize, 150);
//         };
//         window.addEventListener('resize', debouncedResize);

//         const handleCloseClick = () => {
//             setTimeout(() => {
//                 const button = conWidget.querySelector('button:not([aria-label="Close Greeting"])');
//                 if (button) {
//                     button.style.cssText = 'right: 20px !important; bottom: 70px !important; display: block !important;';
//                 }
//             }, 300);
//         };

//         const closeBtn = root.querySelector('.lc_text-widget_heading_close--btn');
//         if (closeBtn) closeBtn.addEventListener('click', handleCloseClick);

//         const promptCloseBtn = root.querySelector('.lc_text-widget_prompt--prompt-close');
//         if (promptCloseBtn) promptCloseBtn.addEventListener('click', handleCloseClick);

//         // Áp dụng style ngay lần đầu
//         handleResize();

//         // Trả về hàm dọn dẹp
//         return () => {
//             window.removeEventListener('resize', debouncedResize);
//             if (closeBtn) closeBtn.removeEventListener('click', handleCloseClick);
//             if (promptCloseBtn) promptCloseBtn.removeEventListener('click', handleCloseClick);
//             clearTimeout(resizeTimeout);
//         };
//     }, []);

//     // --- useEffect chính để quản lý vòng đời ---
//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         // Observer 1: Chờ thẻ <chat-widget> xuất hiện trong body
//         const mainObserver = new MutationObserver((mutations, mainObs) => {
//             const chatWidget = document.querySelector('chat-widget');

//             if (chatWidget?.shadowRoot) {
//                 // Đã tìm thấy, ngắt observer này để tiết kiệm tài nguyên
//                 mainObs.disconnect();

//                 // Observer 2: Chờ nút bấm xuất hiện BÊN TRONG shadowRoot
//                 const shadowObserver = new MutationObserver((shadowMutations, shadowObs) => {
//                     const button = chatWidget.shadowRoot.querySelector('button');
//                     if (button) {
//                         // Đã tìm thấy nút, giờ mới chạy code tùy chỉnh
//                         cleanupEventListenersRef.current = customizeWidget(chatWidget.shadowRoot);

//                         // Hoàn thành nhiệm vụ, ngắt observer này
//                         shadowObs.disconnect();
//                     }
//                 });

//                 shadowObserver.observe(chatWidget.shadowRoot, { childList: true, subtree: true });
//                 shadowObserverRef.current = shadowObserver;
//             }
//         });

//         mainObserver.observe(document.body, { childList: true, subtree: true });
//         mainObserverRef.current = mainObserver;

//         // Hàm dọn dẹp cuối cùng khi component bị hủy
//         return () => {
//             if (mainObserverRef.current) mainObserverRef.current.disconnect();
//             if (shadowObserverRef.current) shadowObserverRef.current.disconnect();
//             if (typeof cleanupEventListenersRef.current === 'function') {
//                 cleanupEventListenersRef.current();
//             }

//             // // --- PHẦN BỔ SUNG QUAN TRỌNG ---
//             // // Tìm và gỡ bỏ các element mà script đã tạo ra

//             // // 1. Gỡ bỏ thẻ <chat-widget> chính
//             // const chatWidgetElement = document.querySelector('chat-widget');
//             // if (chatWidgetElement) {
//             //     chatWidgetElement.remove();
//             //     console.log('ChatWidget: <chat-widget> element removed.');
//             // }

//             // // 2. Gỡ bỏ iframe (nếu có) - các widget chat thường tạo iframe
//             // // Chúng ta tìm theo một phần của URL để chắc chắn
//             // const widgetIframe = document.querySelector('iframe[src*="leadconnectorhq.com"]');
//             // if (widgetIframe) {
//             //     widgetIframe.remove();
//             //     console.log('ChatWidget: Iframe removed.');
//             // }

//             // // 3. Gỡ bỏ các container khác mà script có thể đã thêm vào body
//             // // (Thêm các selector khác nếu bạn phát hiện ra)
//             // const otherWidgetContainer = document.getElementById('some-widget-id-if-exists');
//             // if (otherWidgetContainer) {
//             //     otherWidgetContainer.remove();
//             // }
//         };
//     }, [customizeWidget]);

//     return (
//         <div className="widget-chat-box">
//             <Script
//                 async
//                 src="https://widgets.leadconnectorhq.com/loader.js"
//                 data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
//                 data-widget-id="668d5bc943da7a2804c9bf8e"
//             />
//         </div>
//     );
// };

// export default ChatWidget;