import React, { useEffect, useState, Suspense } from "react";
import { useStaticQuery, graphql } from "gatsby";
import loadable from "@loadable/component";
// import LazyTrackingScripts from '@components/Tracking/LazyTrackingScripts';
// Import Tailwind CSS trước
// import './src/styles/tailwind.css';

// Import custom SCSS sau
// import './src/styles/main.scss';

// // Global styles và libraries
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// 3. GATSBY THEME STYLES - với lower priority
import "../styles/main.scss";
import "../styles/aos.css";
import "../styles/customStyle.scss";
import "../styles/dashicons.min.css";
import "../styles/slick.css";
import "../styles/custom.scss";
import "../styles/main.min.scss";
import "../styles/layouts/_blog.scss";

// 4. EXTERNAL LIBRARIES CUỐI CÙNG
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import 'slick-carousel/slick/slick.min.js';

import Header from "./Header";

import ChatWidget from "./ChatWidget";
import { useLocation } from "@reach/router";
import Helmet from "react-helmet";
// làm sạch link
import InternalLinkInterceptor from "@components/InternalLinkInterceptor";

import ScrollTop from "@components/ScrollTop";

// Import custom hooks
import { useBodyUpdate } from "@hooks/layout/useBodyUpdate";
import { useAos } from "@hooks/useAos";
import CookieBanner, { COOKIE_KEY, getCookie } from "./CookieBanner";

const Footer = loadable(() => import("./Footer"));

const DefaultLayout = ({ children }) => {
  const location = useLocation(); // Lấy thông tin về trang hiện tại

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // +++ PHẦN THÊM MỚI: QUẢN LÝ COOKIE CONSENT +++
  const [hasConsented, setHasConsented] = useState(false);
  const [consentPrefs, setConsentPrefs] = useState({
    functional: true,
    statistics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = getCookie(COOKIE_KEY);
    if (consent) {
      try {
        if (consent === "true")
          setConsentPrefs({
            functional: true,
            statistics: true,
            marketing: true,
          });
        else if (consent === "false")
          setConsentPrefs({
            functional: true,
            statistics: false,
            marketing: false,
          });
        else setConsentPrefs(JSON.parse(consent));
      } catch (e) {}
    }
  }, []);
  // +++ KẾT THÚC PHẦN THÊM MỚI +++

  // bodyClass sẽ được cập nhật mỗi khi trang thay đổi hoặc kích thước cửa sổ thay đổi
  useBodyUpdate(location, isMobileMenuOpen);
  // +++ KẾT THÚC PHẦN THÊM MỚI +++

  // Khởi tạo AOS
  useAos();

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
        menuItems(where: { location: PRIMARY }) {
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
      headerfooterJson {
        headerHtmlall
        footerHtmlall
      }
    }
  `);

  // Lấy dữ liệu đã xử lý ra
  const processedHeaderHtml = data.headerfooterJson?.headerHtmlall || "";
  const processedFooterHtml = data.headerfooterJson?.footerHtmlall || "";

  return (
    <React.Fragment>
      <InternalLinkInterceptor />

      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        data={processedHeaderHtml}
      />
      {children}
      <Suspense fallback={<div></div>}>
        <Footer data={processedFooterHtml} />
        <ScrollTop />
      </Suspense>
      {consentPrefs.marketing && (
        <>
          <ChatWidget />
        </>
      )}
      {/* 4. Gắn Cookie Banner vào Layout để trang nào cũng hiện */}
      <CookieBanner
        onAccept={(prefs) => {
          setConsentPrefs(prefs);
          // PHÁT LOA THÔNG BÁO CHO Home.js biết
          const event = new CustomEvent("cookie_consent_accepted", {
            detail: prefs,
          });
          window.dispatchEvent(event);
        }}
        onDecline={() => {
          const defaults = {
            functional: true,
            statistics: false,
            marketing: false,
          };
          setConsentPrefs(defaults);
        }}
      />
      {/* <LazyTrackingScripts /> */}
    </React.Fragment>
  );
};

export default DefaultLayout;
