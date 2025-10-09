import React, { useState, useEffect, Suspense, useMemo } from "react"
import { useStaticQuery, graphql } from "gatsby"
import loadable from '@loadable/component';
// import { Script } from "gatsby"
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../styles/main.min.scss"
// // import "../styles/lightbox.min.css"
// import "../styles/slick.css"
// import "../styles/main.scss"
// import "../styles/aos.css"
// import "../styles/customStyle.scss"
// import "../styles/dashicons.min.css"
import Header from './Header'
import ChatWidget from "./ChatWidget"
import { useLocation } from "@reach/router"
import Helmet from "react-helmet"
// làm sạch link
import InternalLinkInterceptor from '@components/InternalLinkInterceptor'
// Import replaceInternalLinks helper
import replaceInternalLinks from '@helpers/replaceButtonLinks'

// phần scroll top
import DomEnhancer from '@components/Tools/DomEnhancer';
import ScrollTop from '@components/ScrollTop';

// Import custom hooks
import { useBodyUpdate } from "@hooks/layout/useBodyUpdate"
import { useAos } from "@hooks/useAos"

// 1. Import trực tiếp file logo
import logoSrc from '@assets/logo/logo-head.png';

const Footer = loadable(() => import('./Footer'));
// const ScrollTop = loadable(() => import('./ScrollTop'));

const DefaultLayout = ({ children }) => {
  const location = useLocation(); // Lấy thông tin về trang hiện tại

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // bodyClass sẽ được cập nhật mỗi khi trang thay đổi hoặc kích thước cửa sổ thay đổi
  useBodyUpdate(location, isMobileMenuOpen);
  // +++ KẾT THÚC PHẦN THÊM MỚI +++

  // 1. Lấy dữ liệu tập trung tại Layout
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      cms {
        themeSettings {
          menuTitle
          pageTitle
          themeOptionsSettings {
            socials {
              facebook
              instagram
              linkedin
              twitter
              youtube
            }
          }
        }
        menuItems(where: {location: PRIMARY}) {
          nodes {
            uri
            title
            url
            path
            id
            cssClasses
            label
            locations
            menuItemId
            parentDatabaseId
            childItems {
              nodes {
                label
                id
                uri
              }
            }
          }
        }
        headerHtmlall
        footerHtmlall
      }
    }
  `);

  // Xử lý replaceInternalLinks cho headerHtmlall và footerHtmlall
  const processedData = useMemo(() => {
    if (!data?.cms) return data;

    let processedHeaderHtml = data.cms.headerHtmlall || "";
    let processedFooterHtml = data.cms.footerHtmlall || "";

    // Xử lý header HTML
    if (processedHeaderHtml) {
      processedHeaderHtml = replaceInternalLinks(processedHeaderHtml);
    }

    // Xử lý footer HTML
    if (processedFooterHtml) {
      processedFooterHtml = replaceInternalLinks(processedFooterHtml);
    }

    return {
      ...data,
      cms: {
        ...data.cms,
        headerHtmlall: processedHeaderHtml,
        footerHtmlall: processedFooterHtml
      }
    };
  }, [data]);

  // Khởi tạo AOS
  useAos();

  return (
    <React.Fragment>
      <InternalLinkInterceptor />
      {/* <Helmet>
        <body className={bodyClass} />
      </Helmet> */}
      <Helmet>
        <link rel="preload" as="image" href={logoSrc} fetchpriority="high" />
      </Helmet>
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        data={processedData}
        logoSrc={logoSrc}
      />
      {children}
      <Suspense fallback={<div></div>}>
        <Footer data={processedData} />
        {/* <DomEnhancer
          selector="#ast-scroll-top"
          enhancer={ScrollTop}
        /> */}
        <ScrollTop />
      </Suspense>
      <ChatWidget />

      {/* Global AOS Script */}
      {/* <Script
        src="/js/aos.js"
        strategy="idle"
        onLoad={() => {
          if (window.AOS) {
            window.AOS.init({
              offset: 150,
            });
          }
        }}
      /> */}
    </React.Fragment>
  )
}

export default DefaultLayout