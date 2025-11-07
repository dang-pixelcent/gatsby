import React from 'react';

// Hàm này chèn code vào *ngay sau* thẻ <body> mở
export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([ // <-- Đã đổi thành setPreBodyComponents
    // Đây là GTM noscript iframe (từ 'bodyOpenHtml')
    <noscript
      key="gtm-noscript"
      dangerouslySetInnerHTML={{
        __html: `
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KGBVQVH"
                  height="0" width="0"
                  style="display:none;visibility:hidden">
          </iframe>
        `,
      }}
    />,
  ]);
};