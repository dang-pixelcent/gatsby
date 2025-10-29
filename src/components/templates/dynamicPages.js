// các import cơ bản phải có
import { Script } from "gatsby"
import React, { Suspense, lazy, useState, useEffect } from "react";
import loadable from '@loadable/component';
// import ConditionalLayout from "./tools/conditionalLayout";
import Layout from "@components/layout"
import { SEO } from "@components/SEO"

import { SCRIPT_HANDLING_CONFIG, DEFAULT_SCRIPT_HANDLING } from '@config/scriptManager';

// import hooks
import useLazyEmbedRenderer from '@hooks/useLazyEmbedRenderer';
import useJqueryPlugins from '@hooks/useJqueryPlugins';
import { getJqueryPlugins } from "@src/utils/jqueryConfig";
import { Helmet } from "react-helmet";
import useIsMobile from '@hooks/useIsMobile';

const LazyServiceSlider = lazy(() => import('@components/Blocks/ServiceSlider.js/'));
// const SpecialtySliderFromHtml  = lazy(() => import('@components/Blocks/SpecialtySlider/index.js'));

const DomReplacer = loadable(() => import('@components/Tools/DomReplacer'));
const DomInjector = loadable(() => import('@components/Tools/DomInjector'));
const SpecialScriptInjector = loadable(() => import('@components/Tools/SpecialScriptInjector'));
const DynamicScriptHandler = loadable(() => import('@components/DynamicScriptHandler'));
const LazyPracticeFlowForm = loadable(() => import('@components/Blocks/LazyPracticeFlowForm'));
const OldScheduleForm = loadable(() => import('@components/Blocks/OldScheduleForm'));
const ScriptInjector = loadable(() => import('@components/Tools/ScriptInjector'));

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
  const { flexibleContentHtml, scripts = [], specialScripts = [], bgbanner, uri, schemas } = pageContext;

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

  // const isMobile = useIsMobile();
  // const [isLcpDelayed, setLcpDelayed] = useState(false);
  // const [isLcpDelayed2, setLcpDelayed2] = useState(false);

  // 1. Hook này chỉ để kích hoạt state isLcpDelayed sau một khoảng thời gian
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLcpDelayed(true);
  //   }, isMobile ? 150 : 0); // Delay 150ms trên mobile, desktop thì không delay
  //   return () => clearTimeout(timer);
  // }, [isMobile]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLcpDelayed2(true);
  //   }, 100); // Delay 100ms trên mobile, desktop thì không delay
  //   return () => clearTimeout(timer);
  // }, []);


  // 2. Hook này thực hiện việc ẩn/hiện các phần tử dựa trên isLcpDelayed
  // useEffect(() => {
  //   const banner = document.querySelector('.home-banner');
  //   const boxDesktop = document.querySelector('.box-desktop');
  //   const boxMobile = document.querySelector('.box-mobile');

  //   if (!banner) return; // Nếu không có banner thì không làm gì cả

  //   if (!isLcpDelayed) {
  //     // --- GIAI ĐOẠN BAN ĐẦU (TRƯỚC KHI DELAY) ---
  //     if (isMobile) {
  //       // Trên mobile, ẩn ảnh nền và box mobile
  //       if (bgbanner) banner.classList.add('bannerSection');
  //       if (boxMobile) boxMobile.classList.add('lcp-hidden');
  //     }
  //     // Ẩn box desktop trên mọi thiết bị ban đầu
  //     if (boxDesktop) boxDesktop.classList.add('lcp-hidden');

  //   } else {
  //     // --- GIAI ĐOẠN SAU KHI DELAY ---
  //     // Tải lại ảnh nền nếu có

  //     // Hiện các box
  //     if (boxDesktop) {
  //       boxDesktop.classList.remove('lcp-hidden');
  //       boxDesktop.classList.add('lcp-visible');
  //     }
  //     if (boxMobile) {
  //       boxMobile.classList.remove('lcp-hidden');
  //       boxMobile.classList.add('lcp-visible');
  //     }
  //   }




  // }, [isLcpDelayed, isMobile, flexibleContentHtml]);

  // useEffect(() => {
  //   const banner = document.querySelector('.home-banner');

  //   if (bgbanner) {
  //     banner.classList.add('bannerSection');
  //     const img = new Image();
  //     img.src = bgbanner;
  //     img.onload = () => {
  //       banner.style.backgroundImage = `url('${bgbanner}')`;
  //       banner.classList.remove('bannerSection');
  //     };
  //   }
  // }, [bgbanner]);

  return (
    <React.Fragment>
      <Layout>
        <div id="content" className="site-content" dangerouslySetInnerHTML={{ __html: flexibleContentHtml }}></div>

        {/* Xử lý tiêm các script đã được trích xuất */}
        <ScriptInjector scripts={scripts} />


        <Helmet>
          {preloadLinks}
        </Helmet>

        {/* Phần form mới */}
        {isNewFormEnabled ? (
          <Suspense fallback={<div></div>}>
            <DomReplacer selector="#scheduleform">
              <LazyPracticeFlowForm />
            </DomReplacer>
          </Suspense>
        ) : null}

        <DomInjector selector=".col-slider">
          {/* 4. Bọc component "lười biếng" trong Suspense */}
          <Suspense fallback={<img src="/loading.gif" alt="Loading..." />}>
            <LazyServiceSlider />
          </Suspense>
        </DomInjector>
      </Layout>
      {schemas && schemas.length > 0 && schemas.map((schema, index) => (
        <Script
          key={`schema-ld-${index}`}
          type="application/ld+json"
          className="rank-math-schema-pro"
          strategy="post-hydrate" // Tải script khi trình duyệt rảnh rỗi
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}

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
