import React, { useState, Suspense } from "react"
import { useStaticQuery, graphql } from "gatsby"
import loadable from '@loadable/component';

import Header from './Header'

import ChatWidget from "./ChatWidget"
import { useLocation } from "@reach/router"
import Helmet from "react-helmet"
// làm sạch link
import InternalLinkInterceptor from '@components/InternalLinkInterceptor'

import ScrollTop from '@components/ScrollTop';

// Import custom hooks
import { useBodyUpdate } from "@hooks/layout/useBodyUpdate"
import { useAos } from "@hooks/useAos"

// 1. Import trực tiếp file logo
import logoSrc from '@assets/logo/logo-head.png';

const Footer = loadable(() => import('./Footer'));

const DefaultLayout = ({ children }) => {
  const location = useLocation(); // Lấy thông tin về trang hiện tại

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      dataJson {
        headerHtmlall
        footerHtmlall
      }
    }
  `);

  // Lấy dữ liệu đã xử lý ra
  const processedHeaderHtml = data.dataJson?.headerHtmlall || '';
  const processedFooterHtml = data.dataJson?.footerHtmlall || '';


  return (
    <React.Fragment>
      <InternalLinkInterceptor />
      <Helmet>
        <link rel="preload" as="image" href={logoSrc} fetchpriority="high" />
      </Helmet>
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
      <ChatWidget />
    </React.Fragment>
  )
}

export default DefaultLayout