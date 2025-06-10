// src/components/ChatWidget/index.js

import React, { useEffect } from 'react';

const ChatWidget = () => {
    useEffect(() => {
        // Kiểm tra xem script đã tồn tại chưa để tránh tải lại nhiều lần
        if (document.getElementById('lead-connector-widget-script')) {
            return;
        }

        // Tạo thẻ script
        const script = document.createElement('script');
        script.id = 'lead-connector-widget-script';
        script.src = 'https://widgets.leadconnectorhq.com/loader.js';
        script.defer = true; // Dùng defer để không chặn việc render trang

        // Gắn script vào cuối thẻ body
        document.body.appendChild(script);

        // Hàm dọn dẹp khi component bị hủy
        return () => {
            // Có thể xóa script khi rời trang nếu muốn, nhưng thường thì không cần thiết
            const existingScript = document.getElementById('lead-connector-widget-script');
            if (existingScript) {
                // document.body.removeChild(existingScript);
            }
        };
    }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần

    // Trả về thẻ <chat-widget> với tất cả các thuộc tính bạn đã cung cấp
    return (
        <chat-widget
            widget-id="668d5bc943da7a2804c9bf8e"
            resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
            locale="en-us"
            heading="Have a question?"
            theme='{"name":"custom","colors":{"chatBubbleColor":"#F2771A","backgroundColor":"#ffffff","headerColor":"#F2771A","buttonColor":"#F2771A","avatarBackgroundColor":"#ffffff","avatarBorderColor":"#F2771A","senderMessageColor":"#F2771A","receivedMessageColor":"#F2F4F7"},"typography":{"fontFamily":"Roboto","colors":{"senderMessageTextColor":"#ffffff","receivedMessageTextColor":"#111828","systemMessageTextColor":"#344054","headerMessageTextColor":"#ffffff","welcomeMessageTextColor":"#344054"}}}'
            live-chat-visitor-inactive-msg="Chat closed due to user Inactivity"
            use-email-field="false"
            enable-revisit-message="true"
            live-chat-feedback-note="Thank you, for taking your time."
            live-chat-visitor-inactive-time="5"
            primary-color="#F2771A"
            prompt-msg="Hi there, have a question? Text us here."
            revisit-prompt-msg="Welcome back {{name}}, How can we help you today?"
            live-chat-ack-msg="Your chat has ended"
            live-chat-end-msg="To start a new chat,"
            send-label="Start Chat"
            chat-type="emailChat"
            prompt-avatar="https://images.leadconnectorhq.com/image/f_webp/q_100/r_180/u_https://cdn.filesafe.space/locationPhotos%2FSxG2F86UGIn5lmszDAdS%2Fchat-widget-person?alt=media&token=e9362236-b95e-45cc-8c9b-5b4098b412f7"
            legal-msg="By submitting you agree to receive SMS or e-mails for the provided channel. Rates may be applied."
            live-chat-user-inactive-time="5"
            show-prompt="true"
            auto-country-code="true"
            sub-heading="Enter your question below and a representative will get right back to you."
            live-chat-user-inactive-msg=" Looks like it’s taking too long. Please leave your contact details. We will get back to you shortly"
            live-chat-feedback-msg="Please rate your experience."
            live-chat-intro-msg="Give us a minute to assign you the best person to help you out."
            success-msg="One of our representatives will contact you shortly."
            show-agency-branding="false"
            thank-you-msg="Thank You!"
            allow-avatar-image="true"
            prompt-avatar-alt-text="Avatar"
            prompt-type="avatar"
            show-live-chat-welcome-msg="true"
            show-consent-checkbox="true"
            is-prompt-avatar-image-optimize="true"
            chat-icon="messageChatCircle"
            location-country-code="US"
            currency-symbol="$"
            ack-icon="Check"
            ack-placeholder-color="#12b76a"
            position="bottom-right"
            redirect-action="false"
            redirect-text="For more details, please visit our website"
            branding-title="Powered by"
            default-consent-check="true"
            contact-form-options='[{"id":"1","value":"name","label":"Name","disabled":true,"dataType":"TEXT","fieldKey":"contact.name","placeholder":"Name"},{"id":"2","value":"phone","label":"Phone","dataType":"PHONE","fieldKey":"contact.phone","placeholder":"Phone"},{"id":"4","value":"message","label":"Message","dataType":"TEXTAREA","fieldKey":"contact.message","placeholder":"Message"}]'
            location-id="SxG2F86UGIn5lmszDAdS"
            default-widget="true"
        ></chat-widget>
    );
};

export default ChatWidget;