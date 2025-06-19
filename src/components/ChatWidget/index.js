// src/components/ChatWidget/index.js

import React from 'react';
import { Script } from 'gatsby';

const ChatWidget = () => {
    const onloadScript = () => {
        // Custom script để thêm element style với xử lý responsive
        let mainInterval;
        let closeEventAdded = false;
        let currentScreenSize = window.innerWidth;

        const customizeWidget = () => {
            const chatWidget = document.querySelector('chat-widget');

            if (!chatWidget || !chatWidget.shadowRoot) return false;

            const root = chatWidget.shadowRoot;
            const conWidget = root.querySelector('.lc_text-widget');

            if (!conWidget) return false;

            // Reset widget khi chuyển từ mobile sang desktop
            const wScreen = window.innerWidth;
            const isMobileToDesktop = currentScreenSize <= 921 && wScreen > 921;
            const isDesktopToMobile = currentScreenSize > 921 && wScreen <= 921;

            if (isMobileToDesktop || isDesktopToMobile) {
                // Reset chat widget content frame size
                const chatContainer = root.querySelector('.lc_text-widget');
                const chatFrame = root.querySelector('.lc_text-widget_content');
                const chatDialog = root.querySelector('.lc_text-widget_dialog');

                if (chatContainer) {
                    chatContainer.style.cssText = '';
                }
                if (chatFrame) {
                    chatFrame.style.cssText = '';
                }
                if (chatDialog) {
                    chatDialog.style.cssText = '';
                }

                currentScreenSize = wScreen;
            }

            // Tìm và style button chat
            const buttons = conWidget.querySelectorAll('button');
            if (buttons && buttons.length > 0) {
                const chatButton = buttons[0];

                // Style cố định cho button với responsive
                if (wScreen <= 921) {
                    chatButton.style.cssText = 'right: 20px !important; bottom: 70px !important;';
                } else {
                    chatButton.style.cssText = 'right: 20px !important; bottom: 70px !important;';
                }
            }

            // Xử lý nút close
            const closeBtn = root.querySelector('.lc_text-widget_heading_close--btn');
            if (closeBtn && !closeEventAdded) {
                closeEventAdded = true;

                closeBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        const currentWidth = window.innerWidth;
                        const newButtons = conWidget.querySelectorAll('button');

                        if (newButtons && newButtons.length > 0) {
                            const newChatButton = newButtons[0];

                            // Reset content frame khi đóng
                            const chatFrame = root.querySelector('.lc_text-widget_content');
                            const chatDialog = root.querySelector('.lc_text-widget_dialog');
                            if (chatFrame) {
                                chatFrame.style.cssText = '';
                            }
                            if (chatDialog) {
                                chatDialog.style.cssText = '';
                            }

                            // Style button dựa trên kích thước hiện tại - đẩy lên 70px khi đóng greeting
                            if (currentWidth <= 921) {
                                newChatButton.style.cssText = 'right: 20px !important; bottom: 70px !important; display: block !important;';
                            } else {
                                newChatButton.style.cssText = 'right: 20px !important; bottom: 70px !important; display: block !important;';
                            }
                            newChatButton.removeAttribute('data-click-added');

                            // // Re-add click event
                            // newChatButton.addEventListener('click', (e) => {
                            //     newChatButton.style.display = 'none';
                            // }, { once: true });
                        }
                    }, 300);
                });
            }

            // Xử lý nút prompt close
            const promptCloseBtn = root.querySelector('.lc_text-widget_prompt--prompt-close');
            if (promptCloseBtn && !promptCloseBtn.hasAttribute('data-click-added')) {
                promptCloseBtn.setAttribute('data-click-added', 'true');

                promptCloseBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        const buttons = conWidget.querySelectorAll('button');
                        if (buttons && buttons.length > 0) {
                            const chatButton = buttons[0];
                            
                            // Đẩy chat button lên 70px khi đóng prompt
                            chatButton.style.cssText = 'right: 20px !important; bottom: 70px !important; display: block !important;';
                        }
                    }, 100);
                });
            }

            // Clear main interval khi đã setup xong
            if ((closeBtn && closeEventAdded) || promptCloseBtn) {
                if (mainInterval) {
                    clearInterval(mainInterval);
                    mainInterval = null;
                }
                return true;
            }

            return false;
        };

        // Window resize handler
        const handleResize = () => {
            const newWidth = window.innerWidth;
            if ((currentScreenSize <= 921 && newWidth > 921) || (currentScreenSize > 921 && newWidth <= 921)) {
                // Screen size category changed, re-customize widget
                setTimeout(() => {
                    customizeWidget();
                }, 100);
            }
        };

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Main interval để tìm và customize widget
        mainInterval = setInterval(() => {
            if (customizeWidget()) {
                clearInterval(mainInterval);
                mainInterval = null;
            }
        }, 500);

        // Cleanup after 15 seconds
        setTimeout(() => {
            if (mainInterval) {
                clearInterval(mainInterval);
                mainInterval = null;
            }
        }, 15000);

        // Cleanup function for resize listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }
    return (
        <div className="widget-chat-box">
            <Script
                async
                src="https://widgets.leadconnectorhq.com/loader.js"
                data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
                data-widget-id="668d5bc943da7a2804c9bf8e"
                onLoad={ onloadScript}
            />
        </div>
    );
};

export default ChatWidget;