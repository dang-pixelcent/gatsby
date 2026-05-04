import React from "react";
import wrapWithProvider from "./wrap-with-provider";

export const wrapRootElement = wrapWithProvider;

export const onRenderBody = ({ setHeadComponents, setPreBodyComponents }) => {
  setHeadComponents([
    // 1. Khai báo thư viện Gtag
    // <script
    //   key="gtag-lib"
    //   async
    //   src="https://www.googletagmanager.com/gtag/js?id=UA-179011612-1"
    // />,
    // 2. Lệnh nội tuyến của Gtag (Ép cứng format bằng \n)
    <script
      key="gtag-inline"
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'UA-179011612-1');\ngtag('config', 'AW-578323724');`,
      }}
    />,
    // 3. Lệnh nội tuyến của GTM (Ép cứng format bằng \n)
    <script
      key="gtm-inline"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','GTM-KGBVQVH');`,
      }}
    />,
  ]);

  setPreBodyComponents([
    // 4. No-script của GTM (Ép thành 1 dòng sát nhau)
    <noscript
      key="gtm-noscript"
      dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KGBVQVH" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
      }}
    />,
  ]);
};
