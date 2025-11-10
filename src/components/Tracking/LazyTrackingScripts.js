import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'; // Bạn đã cài 'gatsby-plugin-react-helmet'

const LazyTrackingScripts = () => {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Nếu đã chạy rồi thì không làm gì cả
    if (hasInteracted) return;

    let timerId = null;

    // --- 1. HÀM KÍCH HOẠT (Sẽ được gọi 1 lần duy nhất) ---
    const triggerLoad = () => {
      // Dọn dẹp các trình lắng nghe và hẹn giờ
      window.removeEventListener('scroll', triggerLoad, { capture: true });
      window.removeEventListener('mousemove', triggerLoad, { capture: true });
      window.removeEventListener('touchstart', triggerLoad, { capture: true });
      if (timerId) {
        clearTimeout(timerId);
      }

      // Kích hoạt việc tải script!
      setHasInteracted(true);
    };

    // --- 2. LẮNG NGHE TƯƠNG TÁC (Cách 1) ---
    // (Dùng `once: true` để nó tự động gỡ bỏ sau khi chạy)
    window.addEventListener('scroll', triggerLoad, { once: true, passive: true, capture: true });
    window.addEventListener('mousemove', triggerLoad, { once: true, passive: true, capture: true });
    window.addEventListener('touchstart', triggerLoad, { once: true, passive: true, capture: true });

    // --- 3. HẸN GIỜ TỰ ĐỘNG (Cách 2 - "Failsafe") ---
    // Tự động kích hoạt sau 2.5 giây nếu không có tương tác
    timerId = setTimeout(triggerLoad, 3000);

    // Hàm dọn dẹp cuối cùng (nếu component bị gỡ bỏ)
    return () => {
      // Đảm bảo dọn dẹp nếu component unmount trước khi trigger
      window.removeEventListener('scroll', triggerLoad, { capture: true });
      window.removeEventListener('mousemove', triggerLoad, { capture: true });
      window.removeEventListener('touchstart', triggerLoad, { capture: true });
      if (timerId) {
        clearTimeout(timerId);
      }
    };

  }, [hasInteracted]); // Dependency vẫn là [hasInteracted]

  // --- Phần render không thay đổi ---
  if (!hasInteracted) {
    return null;
  }

  // --- ĐÃ CÓ TƯƠNG TÁC ---
  // Bây giờ chúng ta mới render TẤT CẢ các script vào <head>
  return (
    <Helmet>
      {/* ===== Global site tag (gtag.js) - Google Analytics ===== */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-179011612-1"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-179011612-1');
          gtag('config', 'AW-578323724');
        `}
      </script>

      {/* ===== UBEmbed Script ===== */}
      <script src="https://d6e924dfdd9047e58ab4d02edbc3ed70.js.ubembed.com" async></script>

      {/* ===== Google Tag Manager ===== */}
      <script>
        {`
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
        `}
      </script>

      {/* ===== Meta Pixel Code ===== */}
      <script>
        {`
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
        `}
      </script>
      <noscript>
        <img height="1" width="1" src="https://www.facebook.com/tr?id=778437997646509&ev=PageView&noscript=1" />
      </noscript>

      {/* ===== Dynamic Optimization Script ===== */}
      <script nowprocket nitro-exclude type="text/javascript" id="sa-dynamic-optimization" data-uuid="b2cef48b-2374-4e77-85db-459dba39fef0" src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyYWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLndlbGxuZXNzY2xpbmljbWFya2V0aW5nLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gImIyY2VmNDhiLTIzNzQtNGU3Ny04NWRiLTQ1OWRiYTM5ZmVmMCI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1emF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw==">
      </script>

      {/* ===== Aimtell (Footer) Script ===== */}
      <script>
        {`
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
        `}
      </script>
    </Helmet>
  );
};

export default LazyTrackingScripts;