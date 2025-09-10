// các import cơ bản phải có
import { Script } from "gatsby"
import React, { Suspense, lazy, useEffect } from "react";
import loadable from '@loadable/component';
import Layout from "@components/layout"
import { SEO } from "@components/SEO"

import ReactDOM from 'react-dom';
// ⭐️ Import component lazy-load YouTube và CSS của nó
import LazyEmbed from '@components/Video/LazyEmbed';

// làm sạch link
import InternalLinkInterceptor from '@components/InternalLinkInterceptor'
// Tiêm component vào một phần tử DOM, không xóa nội dung của nó.
// import ComponentPortal from "@components/Tools/ComponentPortal"
// Tiếp quản một phần tử DOM, xóa nội dung của nó và render các component con vào đó.
// import DomInjector from '@components/Tools/DomInjector';
// import DomReplacer from '@components/Tools/DomReplacer';
// import DynamicScriptHandler from '@components/DynamicScriptHandler'
import { SCRIPT_HANDLING_CONFIG, DEFAULT_SCRIPT_HANDLING } from '@config/scriptManager';
// import LazyPracticeFlowForm from '@components/Blocks/LazyPracticeFlowForm';
// import OldScheduleForm from '@components/Blocks/OldScheduleForm'; // Đảm bảo đường dẫn đúng
// import SpecialScriptInjector from '@components/Tools/SpecialScriptInjector';
const LazyServiceSlider = lazy(() => import('@components/Blocks/ServiceSlider.js/'));
// const SpecialtySliderFromHtml  = lazy(() => import('@components/Blocks/SpecialtySlider/index.js'));

const DomReplacer = loadable(() => import('@components/Tools/DomReplacer'));
const DomInjector = loadable(() => import('@components/Tools/DomInjector'));
const SpecialScriptInjector = loadable(() => import('@components/Tools/SpecialScriptInjector'));
const DynamicScriptHandler = loadable(() => import('@components/DynamicScriptHandler'));
const LazyPracticeFlowForm = loadable(() => import('@components/Blocks/LazyPracticeFlowForm'));
const OldScheduleForm = loadable(() => import('@components/Blocks/OldScheduleForm'));

// flag kiểm soát tính năng
const isInternalTest = process.env.FEATURE_INTERNAL_TEST === "true";
const isPublicProd = process.env.FEATURE_PUBLIC_PROD === "true";
const isNewFormEnabled = process.env.FEATURE_NEW_FORM === "true";

// Một hàm trợ giúp để tìm cấu hình cho một script
const getScriptConfig = (src) => {
  if (!src) return DEFAULT_SCRIPT_HANDLING;
  // Tìm key trong config có tồn tại trong src của script không
  const configKey = Object.keys(SCRIPT_HANDLING_CONFIG).find(key => src.includes(key));
  return configKey ? SCRIPT_HANDLING_CONFIG[configKey] : DEFAULT_SCRIPT_HANDLING;
};

const Home = ({ pageContext }) => {
  const { flexibleContentHtml, scripts = [], specialScripts = [], uri } = pageContext;

  useEffect(() => {
    if (uri === "/events/") {
      // Thêm script jQuery
      const jqueryScript = document.createElement("script");
      jqueryScript.src = "https://code.jquery.com/jquery-3.7.1.min.js";
      jqueryScript.async = true;
      document.body.appendChild(jqueryScript);

      // Thêm script lightbox2
      const lightboxScript = document.createElement("script");
      lightboxScript.src = "https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js";
      lightboxScript.async = true;
      document.body.appendChild(lightboxScript);

      // Thêm CSS lightbox2
      const lightboxCSS = document.createElement("link");
      lightboxCSS.rel = "stylesheet";
      lightboxCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css";
      document.head.appendChild(lightboxCSS);

      // Cleanup khi rời trang
      return () => {
        if (jqueryScript.parentNode) document.body.removeChild(jqueryScript);
        if (lightboxScript.parentNode) document.body.removeChild(lightboxScript);
        if (lightboxCSS.parentNode) document.head.removeChild(lightboxCSS);
      };
    }
  }, [uri]);
  /**
   * Nâng cấp: Tự động lazy-load các video và nội dung nhúng
   */
  useEffect(() => {
    const contentContainer = document.getElementById('content');
    if (!contentContainer) return;

    const cleanupTasks = [];
    const totalContentHeight = contentContainer.offsetHeight;

    // Tìm tất cả các placeholder vạn năng
    document.querySelectorAll('.lazy-embed-placeholder').forEach(placeholder => {
      const embedCode = placeholder.dataset.embedCode;
      if (embedCode) {
        const placeholderTop = placeholder.offsetTop;
        const rootMargin = (placeholderTop < totalContentHeight * 0.6) ? '500px' : '200px';

        ReactDOM.render(
          <LazyEmbed
            embedCode={decodeURIComponent(embedCode)}
            rootMargin={rootMargin}
          />,
          placeholder
        );
        cleanupTasks.push(placeholder);
      }
    });

    return () => {
      cleanupTasks.forEach(placeholder => {
        ReactDOM.unmountComponentAtNode(placeholder);
      });
    };
  }, [flexibleContentHtml]);
  // ================== KẾT THÚC NÂNG CẤP ==================

  // React.useEffect(() => {
  //   // Tạo các script tag mới và thêm vào DOM
  //   const scripts = [
  //     "https://fast.wistia.com/player.js",
  //     "https://fast.wistia.com/embed/cxeoqwzjx0.js",
  //   ];

  //   const scriptEls = scripts.map((src) => {
  //     const script = document.createElement("script");
  //     script.src = src;
  //     script.async = true;
  //     // Nếu là module (như wistia embed script), thêm type
  //     if (src.includes("embed/")) {
  //       script.type = "module";
  //     }
  //     document.body.appendChild(script);
  //     return script;
  //   });

  //   return () => {
  //     scriptEls.forEach((script) => {
  //       document.body.removeChild(script);
  //     });
  //   };
  // }, []);


  // // Thêm useEffect để chạy các hàm process()
  // useEffect(() => {
  //   // Hàm này sẽ chạy mỗi khi component được mount (tải trang, back/forward)
  //   //console.log("Page content updated, processing scripts...");
  //   scripts.forEach(script => {
  //     if (script.resourceType === 'external-script') {
  //       const config = getScriptConfig(script.attributes.src);
  //       // Nếu có hàm process trong cấu hình, hãy gọi nó
  //       if (config.process) {
  //         //console.log(`Calling process() for: ${script.attributes.src}`);
  //         config.process();
  //       }
  //     }
  //   });
  //   // Chạy lại effect này mỗi khi danh sách script hoặc nội dung thay đổi
  // }, [scripts, flexibleContentHtml]);

  const handleScriptLoad = (script) => {
    const config = getScriptConfig(script.attributes.src);

    if (config.process) {
      requestIdleCallback(() => {
        try {
          config.process();
        } catch (error) {
          console.warn(`Failed to process script: ${script.attributes.src}`, error);
        }
      });
    }
  };

  // const memoizedScriptLoaders = useMemo(() => {
  //   // console.log("Memoizing ScriptLoaders..."); // Bạn sẽ thấy log này chỉ chạy khi `scripts` thay đổi
  //   return scripts.map((script) => {
  //     if (script.resourceType === 'external-script') {
  //       const config = getScriptConfig(script.attributes.src);
  //       return (
  //         <ScriptLoader
  //           key={script.attributes.id}
  //           attributes={script.attributes} // `script.attributes` bây giờ có tham chiếu ổn định
  //           keepOnUnmount={config.keepOnUnmount}
  //         />
  //       );
  //     }
  //     return null;
  //   });
  // }, [scripts]); // Chỉ tính toán lại khi mảng `scripts` thay đổi

  return (
    <React.Fragment>
      <Layout>
        {/* <SEO
          seoData={seoData}
        /> */}

        <InternalLinkInterceptor />
        <div id="content" className="site-content" dangerouslySetInnerHTML={{ __html: flexibleContentHtml }}></div>

        {/* Sử dụng ComponentPortal để tiêm các component khác nhau vào các vị trí khác nhau.
        Nó sẽ tự động tìm các div này trong flexibleContentHtml và tiêm vào.
      */}
        {/* <ComponentPortal selector="#sdformthree">
          <ScheduleForm />
        </ComponentPortal> */}

        {/* Component này sẽ tự động xử lý tất cả các script đặc biệt được tìm thấy */}
        <Suspense fallback={<div></div>}>
          <SpecialScriptInjector scripts={specialScripts} />
        </Suspense>

        {/* Phần form mới */}
        {isNewFormEnabled ? (
          <Suspense fallback={<div></div>}>
            <DomReplacer selector="#scheduleform">
              <LazyPracticeFlowForm />
            </DomReplacer>
          </Suspense>
        ) : (
          <Suspense fallback={<div></div>}>
            <DomInjector selector="#sdformthree">
              <OldScheduleForm />
            </DomInjector>
          </Suspense>
        )}

        <DomInjector selector=".col-slider">
          {/* 4. Bọc component "lười biếng" trong Suspense */}
          <Suspense fallback={<img src="/loading.gif" alt="Loading..." />}>
            <LazyServiceSlider />
          </Suspense>
        </DomInjector>
        {/* <Suspense fallback={<img src="/loading.gif" alt="Loading..." />}>
          <SpecialtySlider />
        </Suspense> */}
        {/* <DomInjector selector=".sc-specialty .specialty-list">
          <SpecialtySliderFromHtml  htmlContent={flexibleContentHtml} />
        </DomInjector> */}


        {/* {(slug === "streamlining-operations-and-boosting-patient-engagement-with-crm-automation-for-medspa-marketing") && (
        <ScriptLoader
          src="https://www.tiktok.com/embed.js"
          // id="tiktok-embed-script"
          async={true}
          removeOnUnmount={true}
        />
      )}

      {(slug == "get-started") && (
        <ScriptLoader src="/js/script_tag_2.js" />
      )} */}

        {/* {scripts.map((scriptProps) => (
        <ScriptLoader key={scriptProps.id || scriptProps.src} {...scriptProps} />
      ))} */}

        {/* Tự động tải tất cả các script có src */}
        {/* {memoizedScriptLoaders} */}

      </Layout>
      {/* Tiêm các script động vào cuối body */}
      <Suspense fallback={null}>
        <DynamicScriptHandler />
      </Suspense>
      {scripts.map((script) => {
        if (script.resourceType === 'external-script') {
          return (
            <Script
              key={script.attributes.id}
              src={script.attributes.src}
              strategy="idle" // NON-BLOCKING
              // defer
              onLoad={() => handleScriptLoad(script)}
              onError={(error) => {
                console.error(`Error loading script: ${script.attributes.src}`, error);
              }}
            />
          );
        }
        // Trường hợp 2: Script inline
        // if (script.resourceType === 'inline-script') {
        //   return (
        //     <Script
        //       key={script.id}
        //       strategy="idle" // Script inline cũng có thể có chiến lược
        //       dangerouslySetInnerHTML={{ __html: script.content }}
        //     />
        //   );
        // }

        return null;
      })}
    </React.Fragment>
  )
}
export const Head = ({ pageContext }) => (
  <SEO
    seoData={pageContext.seoData || {}}
  >
    {/* {pageContext.uri === "/about-us/" && (
      <script
        type="application/ld+json"
        className="rank-math-schema-pro"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://www.wellnessclinicmarketing.com/#organization",
                "name": "Wellness Clinic Marketing",
                "logo": {
                  "@type": "ImageObject",
                  "@id": "https://www.wellnessclinicmarketing.com/#logo",
                  "url": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/logo-head.png",
                  "contentUrl": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/logo-head.png",
                  "caption": "Wellness Clinic Marketing",
                  "inLanguage": "en-US",
                  "width": "1038",
                  "height": "300"
                }
              },
              {
                "@type": "WebSite",
                "@id": "https://www.wellnessclinicmarketing.com/#website",
                "url": "https://www.wellnessclinicmarketing.com",
                "name": "Wellness Clinic Marketing",
                "publisher": {
                  "@id": "https://www.wellnessclinicmarketing.com/#organization"
                },
                "inLanguage": "en-US"
              }
            ]
          })
        }}
      />
    )} */}
    {pageContext.uri === "/about-us/" && (
      <script
        type="application/ld+json"
        className="rank-math-schema-pro"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "Organization", "@id": "https://www.wellnessclinicmarketing.com/#organization", "name": "Wellness Clinic Marketing", "logo": { "@type": "ImageObject", "@id": "https://www.wellnessclinicmarketing.com/#logo", "url": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/logo-head.png", "contentUrl": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/logo-head.png", "caption": "Wellness Clinic Marketing", "inLanguage": "en-US", "width": "1038", "height": "300" } }, { "@type": "WebSite", "@id": "https://www.wellnessclinicmarketing.com/#website", "url": "https://www.wellnessclinicmarketing.com", "name": "Wellness Clinic Marketing", "publisher": { "@id": "https://www.wellnessclinicmarketing.com/#organization" }, "inLanguage": "en-US" }, { "@type": "ImageObject", "@id": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/facebook.png", "url": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/facebook.png", "width": "225", "height": "225", "inLanguage": "en-US" }, { "@type": "BreadcrumbList", "@id": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/#breadcrumb", "itemListElement": [{ "@type": "ListItem", "position": "1", "item": { "@id": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/", "name": "Meta Advertising (Facebook & Instagram)" } }] }, { "@type": ["ItemPage", "FAQPage"], "@id": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/#webpage", "url": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/", "name": "Facebook Advertising for Medical Practices | Patient Lead Generation", "datePublished": "2024-12-02T02:40:23+00:00", "dateModified": "2025-09-08T08:50:08+00:00", "isPartOf": { "@id": "https://www.wellnessclinicmarketing.com/#website" }, "primaryImageOfPage": { "@id": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/facebook.png" }, "inLanguage": "en-US", "breadcrumb": { "@id": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/#breadcrumb" }, "mainEntity": [{ "@type": "Question", "name": "How can you get Botox patients with Facebook ads?", "acceptedAnswer": { "@type": "Answer", "text": "Facebook ads are an effective way to target women and men in an ideal age range. Our ads are crafted in a way that speaks to people who can benefit from a fresher look and are familiar with aesthetic procedures. Combining these creatives with a qualifying funnel, we entice prospective patients to reach out for an appointment," } }, { "@type": "Question", "name": "What types of medical practices can benefit from Facebook ads?", "acceptedAnswer": { "@type": "Answer", "text": "Med Spas and Medical Wellness Centers that offer aesthetic, wellness, and body contouring procedures are having great success with Facebook ads. However, due to platform restrictions, other strategies may be needed for sensitive services like hormone therapy or sexual wellness." } }, { "@type": "Question", "name": "How much does Facebook advertising cost?", "acceptedAnswer": { "@type": "Answer", "text": "The fee for implementing and managing Facebook/ Instagram advertising will range from $1,500-2,500/mo, depending on the total marketing program. In terms of an advertising budget, you want to allocate a minimum of $1,000/mo per procedure advertised. In a busy season, you want to scale that 3x and more, as long as you get a positive RO." } }] }, { "@type": "Product", "name": "Meta Advertising (Facebook & Instagram)", "url": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/", "description": "Grow your medical practice with targeted Facebook & Instagram ads. Convert high-quality leads into paying patients with expert ad strategies. ☎️ (800) 401-7046", "brand": { "@type": "Brand", "name": "Wellness Clinic Marketing" }, "image": { "@type": "ImageObject", "url": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/facebook.png" }, "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "bestRating": "5", "ratingCount": "120" } }, { "@type": "Service", "name": "Meta Advertising (Facebook & Instagram)", "url": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/", "description": "Grow your medical practice with targeted Facebook & Instagram ads. Convert high-quality leads into paying patients with expert ad strategies. ☎️ (800) 401-7046", "image": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/facebook.png", "provider": { "@type": "Organization", "name": "Wellness Clinic Marketing", "url": "https://www.wellnessclinicmarketing.com/", "logo": { "@type": "ImageObject", "url": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/logo-head.png" } }, "areaServed": { "@type": "Country", "name": "United States" }, "audience": { "@type": "Audience", "audienceType": "Medical & Wellness Practices" } }] })
        }}
      />
    )}
  </SEO>
);

export default Home
