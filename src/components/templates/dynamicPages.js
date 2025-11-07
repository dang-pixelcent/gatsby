// các import cơ bản phải có
import { Script } from "gatsby"
import React, { Suspense, lazy, useState, useEffect } from "react";
import loadable from '@loadable/component';
// import ConditionalLayout from "./tools/conditionalLayout";
import Layout from "@components/layout"
import { SEO } from "@components/SEO"

// import { SCRIPT_HANDLING_CONFIG, DEFAULT_SCRIPT_HANDLING } from '@config/scriptManager';

// import hooks
import useLazyEmbedRenderer from '@hooks/useLazyEmbedRenderer';
import useJqueryPlugins from '@hooks/useJqueryPlugins';
import { getJqueryPlugins } from "@src/utils/jqueryConfig";
import { Helmet } from "react-helmet";
// import useIsMobile from '@hooks/useIsMobile';

// import LazySection from '@components/Tools/LazySection';
// import LazySectionDynamic from '@components/sectionLazyDynamic';

// const LazyServiceSlider = lazy(() => import('@components/Blocks/ServiceSlider.js/'));
// const SpecialtySliderFromHtml  = lazy(() => import('@components/Blocks/SpecialtySlider/index.js'));

const DomReplacer = loadable(() => import('@components/Tools/DomReplacer'));
const DomInjector = loadable(() => import('@components/Tools/DomInjector'));
// const SpecialScriptInjector = loadable(() => import('@components/Tools/SpecialScriptInjector'));
const DynamicScriptHandler = loadable(() => import('@components/DynamicScriptHandler'));
const LazyPracticeFlowForm = loadable(() => import('@components/Blocks/LazyPracticeFlowForm'));
// const OldScheduleForm = loadable(() => import('@components/Blocks/OldScheduleForm'));
const ScriptInjector = loadable(() => import('@components/Tools/ScriptInjector'));
// const LazySectionDynamic = loadable(() => import('@components/sectionLazyDynamic'));

const LazyCmsScripts = loadable(() => import('@components/Tools/LazyCmsScripts'));

// flag kiểm soát tính năng
// const isInternalTest = process.env.FEATURE_INTERNAL_TEST === "true";
// const isPublicProd = process.env.FEATURE_PUBLIC_PROD === "true";
const isNewFormEnabled = process.env.FEATURE_NEW_FORM === "true";

// Một hàm trợ giúp để tìm cấu hình cho một script
// const getScriptConfig = (src) => {
//   if (!src) return DEFAULT_SCRIPT_HANDLING;
//   // Tìm key trong config có tồn tại trong src của script không
//   const configKey = Object.keys(SCRIPT_HANDLING_CONFIG).find(key => src.includes(key));
//   return configKey ? SCRIPT_HANDLING_CONFIG[configKey] : DEFAULT_SCRIPT_HANDLING;
// };

// Component Noscript (đơn giản, không cần lazy-load)
const NoscriptInjector = ({ snippets = [] }) => (
  <>
    {snippets.map((snippet, i) => (
      <noscript key={`cms-noscript-${i}`} dangerouslySetInnerHTML={{ __html: snippet }} />
    ))}
  </>
);

const Home = ({ pageContext }) => {
  const { flexibleContentHtml,
    scripts = [],
    specialScripts = [],
    uri,
    schemas,
    cmsSafeSnippets = [],
    cmsDangerousSnippets = [],
    cmsNoscriptSnippets = []
  } = pageContext;

  // --- Cấu hình các plugin jQuery cần dùng cho trang này ---
  // Gọi hook quản lý tập trung
  useJqueryPlugins(getJqueryPlugins(uri));

  /**
   * Hook: useLazyEmbedRenderer - Tự động lazy-load các video và nội dung nhúng
   */
  useLazyEmbedRenderer({ flexibleContentHtml });

  // Lọc và tạo các thẻ <link> cho Helmet
  const preloadLinks = specialScripts
    .filter(script => script.type === 'preload-lcp-image' && script.tag === 'link')
    .map((script, index) => (
      <link key={`preload-${index}`} {...script.props} />
    ));

  return (
    <React.Fragment>
      <Helmet>
        {preloadLinks}
      </Helmet>

      {/* Tiêm các thẻ <noscript> */}
      <NoscriptInjector snippets={cmsNoscriptSnippets} />

      <Layout>
        <div id="content" className="site-content" dangerouslySetInnerHTML={{ __html: flexibleContentHtml }}></div>


        {/* Xử lý tiêm các script đã được trích xuất */}
        <ScriptInjector scripts={scripts} />

        {/* Phần form mới */}
        {isNewFormEnabled ? (
          <Suspense fallback={<div></div>}>
            <DomReplacer selector="#scheduleform">
              <LazyPracticeFlowForm />
            </DomReplacer>
          </Suspense>
        ) : null}

        {/* <DomInjector selector=".col-slider"> */}
        {/* 4. Bọc component "lười biếng" trong Suspense */}
        {/* <Suspense fallback={<img src="/loading.gif" alt="Loading..." />}>
            <LazyServiceSlider />
          </Suspense> */}
        {/* </DomInjector> */}

      </Layout>
      {/* {schemas && schemas.length > 0 && schemas.map((schema, index) => (
        <Script
          key={`schema-ld-${index}`}
          type="application/ld+json"
          className="rank-math-schema-pro"
          strategy="post-hydrate" // Tải script khi trình duyệt rảnh rỗi
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))} */}

      {/* GỘP 2 NGUỒN SCHEMA LẠI VÀ RENDER (AN TOÀN) */}
      {[...schemas, ...cmsSafeSnippets].map((schema, index) => (
        <Script
          key={`schema-ld-${index}`}
          type="application/ld+json"
          className="rank-math-schema-pro"
          strategy="post-hydrate" // Tải khi rảnh
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}

      {/* TẢI LƯỜI CÁC SCRIPT NGUY HIỂM TỪ CMS */}
      <Suspense fallback={null}>
        <LazyCmsScripts scripts={cmsDangerousSnippets} />
      </Suspense>

      {/* Tiêm các script động vào cuối body */}
      <Suspense fallback={null}>
        <DynamicScriptHandler />
      </Suspense>

    </React.Fragment>
  )
}
export const Head = ({ pageContext }) => (
  <SEO
    metaHtml={pageContext.metaHtml || {}}
  // schemas={pageContext.schemas || []}
  />
);

export default Home
