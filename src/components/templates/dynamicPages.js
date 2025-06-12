import { graphql, Link, Script } from "gatsby"
import React from "react"
import Layout from "../layout"
import SEO from "../SEO"
import InternalLinkInterceptor from '../InternalLinkInterceptor'
import ComponentPortal from "../Tools/ComponentPortal"
import ScriptLoader from '../Tools/ScriptLoader';
import DynamicScriptHandler from '../DynamicScriptHandler'
import { ScheduleForm } from '../Blocks/GetStarted';



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

  return (
    <React.Fragment>
      <Layout key={pageKey}>
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
          // Chỉ render các script external, vì inline đã được xử lý thủ công
          if (script.type === 'external') {
            return <ScriptLoader key={script.src} {...script} />;
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
