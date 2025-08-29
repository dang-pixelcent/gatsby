import React, { useState, useEffect } from "react"
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
import Footer from './Footer'
import ScrollTop from "./ScrollTop";
// import ChatWidget from "./ChatWidget"
import { useLocation } from "@reach/router"
import { Script } from "gatsby"

const DefaultLayout = ({ children }) => {
  const location = useLocation(); // Lấy thông tin về trang hiện tại
  const [bodyClass, setBodyClass] = useState(""); // Dùng state để lưu trữ class

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // bodyClass sẽ được cập nhật mỗi khi trang thay đổi hoặc kích thước cửa sổ thay đổi
  useEffect(() => {
    const updateBodyClass = () => {
      const isMobile = window.innerWidth <= 921; // Ngưỡng breakpoint của bạn
      const isHomePage = location.pathname === '/'; // Kiểm tra có phải trang chủ không

      let classes = [
        "wp-custom-logo",
        "wp-theme-astra",
        "wp-child-theme-agencymarketing",
        "mega-menu-primary",
        "ast-plain-container",
        "ast-no-sidebar",
        "astra-4.11.1",
        "ast-single-post",
        "ast-inherit-site-logo-transparent",
        "ast-theme-transparent-header",
        "ast-hfb-header",
        "ast-sticky-main-shrink",
        "ast-sticky-above-shrink",
        "ast-sticky-below-shrink",
        "ast-sticky-header-shrink",
        "ast-inherit-site-logo-sticky",
        "ast-primary-sticky-enabled",
        "astra-addon-4.11.0"
      ];

      if (isMobile) {
        classes.push("ast-header-break-point");
        if (isMobileMenuOpen) {
          // 2. Thêm class khi menu mở trên mobile
          classes.push("ast-main-header-nav-open");
        }
      } else {
        classes.push("ast-desktop");
      }

      if (isHomePage) {
        classes.push("page-template-front-page");
        // Thêm các class khác chỉ dành cho trang chủ
      }

      setBodyClass(classes.join(" "));
    };

    // Chạy lần đầu khi component được render
    updateBodyClass();

    // Thêm sự kiện resize để cập nhật class khi thay đổi kích thước cửa sổ
    window.addEventListener('resize', updateBodyClass);

    // Dọn dẹp sự kiện khi component unmount
    return () => window.removeEventListener('resize', updateBodyClass);

  }, [location.pathname, isMobileMenuOpen]); // Chạy lại hook này mỗi khi đường dẫn trang thay đổi


  // Hook này sẽ theo dõi sự thay đổi của `bodyClass` và cập nhật DOM
  useEffect(() => {
    // Gán trực tiếp chuỗi class vào thẻ body
    // Thao tác này sẽ ghi đè lên tất cả các class cũ và áp dụng bộ class mới
    document.body.className = bodyClass;

    // Trả về một hàm cleanup (không bắt buộc nhưng là good practice)
    // để xóa các class khi component unmount, đưa body về trạng thái sạch sẽ.
    return () => {
      document.body.className = '';
    };
  }, [bodyClass]); // Chỉ chạy lại effect này khi `bodyClass` thay đổi
  // +++ KẾT THÚC PHẦN THÊM MỚI +++

  return (
    <div>
      {/* <Helmet>
        <body className={bodyClass} />
      </Helmet> */}
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {children}
      <Footer />
      <ScrollTop />
      {/* <ChatWidget /> */}

      {/* Global AOS Script */}
      <Script
        src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"
        strategy="idle"
        onLoad={() => {
          if (window.AOS) {
            window.AOS.init({ offset: 150 });
          }
        }}
      />
    </div>
  )
}

export default DefaultLayout
