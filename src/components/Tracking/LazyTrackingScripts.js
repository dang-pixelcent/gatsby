import React, { useEffect } from 'react';

const LazyTrackingScripts = () => {
  useEffect(() => {
    const scripts = [
      // Google Analytics (gtag.js)
      {
        type: 'script',
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=UA-179011612-1',
      },
      {
        type: 'inline',
        content: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-179011612-1');
          gtag('config', 'AW-578323724');
        `,
      },
      // UBEmbed Script
      {
        type: 'script',
        src: 'https://d6e924dfdd9047e58ab4d02edbc3ed70.js.ubembed.com',
        async: true,
      },
      // Google Tag Manager
      {
        type: 'inline',
        content: `
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KGBVQVH');
        `,
      },
      // Meta Pixel Code
      {
        type: 'inline',
        content: `
          !function(f,b,e,v,n,t,s){
            if(f.fbq) return;
            n=f.fbq=function(){
              n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
            };
            if(!f._fbq) f._fbq=n;
            n.push=n; n.loaded=!0; n.version='2.0';
            n.queue=[];
            t=b.createElement(e); t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
          }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '778437997646509');
          fbq('track', 'PageView');
        `,
      },
      // Dynamic Optimization Script
      {
        type: 'inline',
        content: `
          var script = document.createElement("script");
          script.setAttribute("nowprocket", "");
          script.setAttribute("nitro-exclude", "");
          script.src = "https://dashboard.wellnessclinicmarketing.com/scripts/dynamic_optimization.js";
          script.dataset.uuid = "b2cef48b-2374-4e77-85db-459dba39fef0";
          script.id = "sa-dynamic-optimization-loader";
          document.head.appendChild(script);
        `,
      },
      // Aimtell (Footer) Script
      {
        type: 'inline',
        content: `
          var _at = {};
          window._at.track = window._at.track || function(){
            (window._at.track.q = window._at.track.q || []).push(arguments);
          };
          _at.owner = '637e71b8be40';
          _at.idSite = '27466';
          _at.attributes = {};

          (function() {
            var u='//cdn.aimtell.com/trackpush/';
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript';
            g.async=true;
            g.defer=true;
            g.src=u+'trackpush.min.js';
            s.parentNode.insertBefore(g,s);
          })();
        `,
      },
    ];

    const loadScript = (index) => {
      if (index >= scripts.length) return;

      const scriptData = scripts[index];
      const scriptElement = document.createElement('script');

      if (scriptData.type === 'inline') {
        scriptElement.innerHTML = scriptData.content;
        document.head.appendChild(scriptElement);
        // Tải script tiếp theo trong thời gian rảnh rỗi
        requestIdleCallback(() => loadScript(index + 1));
      } else { // type 'script'
        scriptElement.src = scriptData.src;
        if (scriptData.async) scriptElement.async = true;
        if (scriptData.defer) scriptElement.defer = true;
        scriptElement.onload = () => {
          // Tải script tiếp theo trong thời gian rảnh rỗi
          requestIdleCallback(() => loadScript(index + 1));
        };
        document.head.appendChild(scriptElement);
      }
    };

    // Bắt đầu tải script đầu tiên khi trình duyệt rảnh rỗi
    requestIdleCallback(() => loadScript(0));

  }, []); // Chạy một lần duy nhất khi component được mount

  // Không cần render gì cả, vì các script được chèn động
  return null;
};

export default LazyTrackingScripts;