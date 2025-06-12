import { graphql, Link } from "gatsby"
import React, { useEffect } from "react"
import Layout from "../layout"
import SEO from "../SEO"
import InternalLinkInterceptor from '../InternalLinkInterceptor'
import ComponentPortal from "../Tools/ComponentPortal"
import ScriptLoader from '../Tools/ScriptLoader';
import DynamicScriptHandler from '../DynamicScriptHandler'
import { SCRIPT_HANDLING_CONFIG, DEFAULT_SCRIPT_HANDLING } from '../../config/scriptManager';
import { ScheduleForm } from '../Blocks/GetStarted';

// Một hàm trợ giúp để tìm cấu hình cho một script
const getScriptConfig = (src) => {
  if (!src) return DEFAULT_SCRIPT_HANDLING;
  // Tìm key trong config có tồn tại trong src của script không
  const configKey = Object.keys(SCRIPT_HANDLING_CONFIG).find(key => src.includes(key));
  return configKey ? SCRIPT_HANDLING_CONFIG[configKey] : DEFAULT_SCRIPT_HANDLING;
};

const Home = ({ data, pageContext }) => {
  const { flexibleContentHtml, seoData, scripts = [], id, uri } = pageContext;

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



  const pageKey = id || uri;

  // Thêm useEffect để chạy các hàm process()
  useEffect(() => {
    // Hàm này sẽ chạy mỗi khi component được mount (tải trang, back/forward)
    console.log("Page content updated, processing scripts...");
    scripts.forEach(script => {
      const config = getScriptConfig(script.attributes.src);
      // Nếu có hàm process trong cấu hình, hãy gọi nó
      if (config.process) {
        console.log(`Calling process() for: ${script.attributes.src}`);
        config.process();
      }
    });
    // Chạy lại effect này mỗi khi danh sách script hoặc nội dung thay đổi
  }, [scripts, flexibleContentHtml]);

  return (
    <React.Fragment>
      <Layout>
        <SEO
          seoData={seoData}
        />
        <InternalLinkInterceptor />
        <div id="content" className="site-content" dangerouslySetInnerHTML={{ __html: flexibleContentHtml }}></div>

        {/* Sử dụng ComponentPortal để tiêm các component khác nhau vào các vị trí khác nhau.
        Nó sẽ tự động tìm các div này trong flexibleContentHtml và tiêm vào.
      */}
        <ComponentPortal selector="#sdformthree">
          <ScheduleForm />
        </ComponentPortal>

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
        {scripts.map((script) => {
          if (script.resourceType === 'external-script') {
            // ✨ Lấy cấu hình cho script hiện tại
            const config = getScriptConfig(script.attributes.src);

            return (
              <ScriptLoader
                key={script.attributes.id}
                attributes={script.attributes}
                // ✨ Sử dụng cấu hình để quyết định
                keepOnUnmount={config.keepOnUnmount}
              />
            );
          }
          return null;
        })}

      </Layout>
      {/* Tiêm các script động vào cuối body */}
      <DynamicScriptHandler />
    </React.Fragment>
  )
}

export default Home
