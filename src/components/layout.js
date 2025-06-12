import React, { useState, useEffect } from "react"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/main.min.scss"
import "../styles/lightbox.min.css"
import "../styles/slick.css"
import "../styles/main.scss"
import "../styles/customStyle.scss"
import "../styles/dashicons.min.css"
import Header from './Header'
import Footer from './Footer'
import { useLocation } from "@reach/router"
import { Helmet } from "react-helmet"
import ScrollTop from "./ScrollTop";
// import ChatWidget from "./ChatWidget"

const DefaultLayout = ({ children }) => {
  const location = useLocation(); // Lấy thông tin về trang hiện tại
  const [bodyClass, setBodyClass] = useState(""); // Dùng state để lưu trữ class

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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


  // ✨ BẮT ĐẦU: Thêm useEffect để tải script chat widget
  useEffect(() => {
    // 1. Tạo một thẻ script mới
    const script = document.createElement('script');

    // 2. Thiết lập các thuộc tính cho script
    script.src = "https://widgets.leadconnectorhq.com/loader.js";
    script.setAttribute('data-noptimize', 'async'); // Thêm async để không chặn render
    script.setAttribute('data-resources-url', "https://widgets.leadconnectorhq.com/chat-widget/loader.js");
    script.setAttribute('data-widget-id', "668d5bc943da7a2804c9bf8e");

    // 3. Thêm script vào thẻ <body> của trang web
    document.body.appendChild(script);

    // 4. Hàm dọn dẹp: Sẽ chạy khi component unmount
    return () => {
      // Gỡ bỏ script khỏi body để tránh lỗi khi chuyển trang
      document.body.removeChild(script);

      // Widget này có thể tạo thêm các element khác, chúng ta cần tìm và xóa chúng
      const widgetContainer = document.querySelector('.widget-chat-box-container'); // Tên class này có thể khác, bạn cần kiểm tra
      if (widgetContainer) {
        widgetContainer.remove();
      }
    };
  }, []); // Mảng rỗng `[]` đảm bảo hook này chỉ chạy một lần duy nhất

  // ✨ KẾT THÚC: Phần thêm script

  return (
    <div>
      <Helmet>
        <body className={bodyClass} />
      </Helmet>
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {children}
      <Footer />
      <ScrollTop />
      {/* <div className="widget-chat-box"><script data-noptimize src="https://widgets.leadconnectorhq.com/loader.js" data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js" data-widget-id="668d5bc943da7a2804c9bf8e"></script></div> */}
    </div>
  )
}

export default DefaultLayout
