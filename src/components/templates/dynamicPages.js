// các import cơ bản phải có
import { graphql, Link, Script } from "gatsby"
import React, { useEffect, useMemo } from "react";
import Layout from "@components/layout"
import { SEO } from "@components/SEO"
// làm sạch link
import InternalLinkInterceptor from '@components/InternalLinkInterceptor'
// Tiêm component vào một phần tử DOM, không xóa nội dung của nó.
import ComponentPortal from "@components/Tools/ComponentPortal"
// Tiếp quản một phần tử DOM, xóa nội dung của nó và render các component con vào đó.
import DomInjector from '@components/Tools/DomInjector';
import ScriptLoader from '@components/Tools/ScriptLoader';
import DynamicScriptHandler from '@components/DynamicScriptHandler'
import { SCRIPT_HANDLING_CONFIG, DEFAULT_SCRIPT_HANDLING } from '@config/scriptManager';
import { ScheduleForm } from '@components/Blocks/GetStarted';
import { ServiceSlider } from '@components/Blocks/ServiceSlider.js/';


// Một hàm trợ giúp để tìm cấu hình cho một script
const getScriptConfig = (src) => {
  if (!src) return DEFAULT_SCRIPT_HANDLING;
  // Tìm key trong config có tồn tại trong src của script không
  const configKey = Object.keys(SCRIPT_HANDLING_CONFIG).find(key => src.includes(key));
  return configKey ? SCRIPT_HANDLING_CONFIG[configKey] : DEFAULT_SCRIPT_HANDLING;
};

const Home = ({ pageContext }) => {
  const { flexibleContentHtml, scripts = [] } = pageContext;
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


  // Thêm useEffect để chạy các hàm process()
  useEffect(() => {
    // Hàm này sẽ chạy mỗi khi component được mount (tải trang, back/forward)
    //console.log("Page content updated, processing scripts...");
    scripts.forEach(script => {
      if (script.resourceType === 'external-script') {
        const config = getScriptConfig(script.attributes.src);
        // Nếu có hàm process trong cấu hình, hãy gọi nó
        if (config.process) {
          //console.log(`Calling process() for: ${script.attributes.src}`);
          config.process();
        }
      }
    });
    // Chạy lại effect này mỗi khi danh sách script hoặc nội dung thay đổi
  }, [scripts, flexibleContentHtml]);

  const memoizedScriptLoaders = useMemo(() => {
    // console.log("Memoizing ScriptLoaders..."); // Bạn sẽ thấy log này chỉ chạy khi `scripts` thay đổi
    return scripts.map((script) => {
      if (script.resourceType === 'external-script') {
        const config = getScriptConfig(script.attributes.src);
        return (
          <ScriptLoader
            key={script.attributes.id}
            attributes={script.attributes} // `script.attributes` bây giờ có tham chiếu ổn định
            keepOnUnmount={config.keepOnUnmount}
          />
        );
      }
      return null;
    });
  }, [scripts]); // Chỉ tính toán lại khi mảng `scripts` thay đổi

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

        <DomInjector selector=".col-slider">
          <ServiceSlider />
        </DomInjector>


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
        {memoizedScriptLoaders}

      </Layout>
      {/* Tiêm các script động vào cuối body */}
      <DynamicScriptHandler />
      {scripts.map((script) => {
        // Trường hợp 2: Script inline
        if (script.resourceType === 'inline-script') {
          return (
            <Script
              key={script.id}
              strategy="post-hydrate" // Script inline cũng có thể có chiến lược
              dangerouslySetInnerHTML={{ __html: script.content }}
            />
          );
        }

        return null;
      })}
    </React.Fragment>
  )
}
export const Head = ({ pageContext }) => (
  <SEO
    seoData={pageContext.seoData || {}}
  />
);

export default Home
