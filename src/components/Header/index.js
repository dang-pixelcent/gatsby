import * as React from "react"
import "./styles.scss"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { useLocation } from "@reach/router"
// import iconmedicalweightloss from "../../assets/expertise/icon-medical-weight-loss.svg" // Thêm dòng này


const Header = ({ isMobileMenuOpen, setMobileMenuOpen, data, logoSrc }) => {
  // Sử dụng biến môi trường cho WordPress URL
  const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL
  const siteBaseUrl = process.env.GATSBY_SITE_URL

  const location = useLocation();
  const isActive = location.pathname === siteBaseUrl;

  React.useEffect(() => {
    const menuTriggers = document.querySelectorAll(".mega-menu-item");

    menuTriggers.forEach((menuTrigger) => {
      const handleMouseEnter = () => {
        menuTrigger.classList.add("mega-toggle-on");
      };

      const handleMouseLeave = () => {
        menuTrigger.classList.remove("mega-toggle-on");
      };

      menuTrigger.addEventListener("mouseenter", handleMouseEnter);
      menuTrigger.addEventListener("mouseleave", handleMouseLeave);

      // Lưu lại các hàm để cleanup sau
      menuTrigger._handleMouseEnter = handleMouseEnter;
      menuTrigger._handleMouseLeave = handleMouseLeave;
    });

    return () => {
      menuTriggers.forEach((menuTrigger) => {
        menuTrigger.removeEventListener("mouseenter", menuTrigger._handleMouseEnter);
        menuTrigger.removeEventListener("mouseleave", menuTrigger._handleMouseLeave);
      });
    };
  }, []);


  const content = data.cms.themeSettings
  // const menu = data.cms.menuItems
  // const logoUrl = content?.themeOptionsSettings?.defaultLogo?.node?.sourceUrl;
  const logoAlt = content?.themeOptionsSettings?.defaultLogo?.node?.altText || "Wellness Clinic Marketing";

  // === FIXED HEADER ===
  React.useEffect(() => {
    const headerElement = document.getElementById('masthead');
    if (!headerElement) return;

    // Định nghĩa ngưỡng breakpoint cho mobile
    const MOBILE_BREAKPOINT = 921;

    // Hàm để kiểm tra và cập nhật trạng thái "dính"
    const handleScroll = () => {
      const isDesktop = window.innerWidth > MOBILE_BREAKPOINT;

      if (isDesktop) {
        // Logic cho desktop
        if (window.scrollY > 100) {
          // Thêm class 'menu-fixed' nếu cuộn xuống hơn 100px
          headerElement.classList.add('menu-fixed');
        } else if (window.scrollY <= 0) {
          headerElement.classList.remove('menu-fixed');
        }
        // Lưu ý: Nếu 0 < window.scrollY <= 100 và 'menu-fixed' đang tồn tại, nó sẽ được giữ lại.
      } else {
        // Logic gốc cho mobile (ngưỡng là 0 cho cả việc thêm và xóa class)
        if (window.scrollY > (isMobileMenuOpen ? 200 : 0)) {
          headerElement.classList.add('menu-fixed');
        } else if (window.scrollY <= 0) {
          headerElement.classList.remove('menu-fixed');
        }
      }
    };

    // Gắn sự kiện scroll và resize
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Thêm resize để xử lý khi xoay màn hình hoặc thay đổi kích thước cửa sổ

    // Chạy hàm một lần lúc ban đầu để kiểm tra trạng thái
    handleScroll();

    // Hàm dọn dẹp để gỡ bỏ cả hai sự kiện
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobileMenuOpen]); // Mảng rỗng [] đảm bảo useEffect chỉ chạy một lần
  // === END ===


  // === BẮT ĐẦU PHẦN THÊM MỚI CHO TOGGLE MENU ===
  // === XỬ LÝ MỞ/ĐÓNG MENU VÀ SUB-MENU ===
  React.useEffect(() => {
    const mainToggle = document.querySelector('.menu-toggle.main-header-menu-toggle');
    const mobileHeaderContent = document.querySelector('.ast-mobile-header-content');
    const mainNav = document.querySelector('#ast-mobile-site-navigation');
    const allSubMenuToggles = mainNav ? mainNav.querySelectorAll('.ast-menu-toggle') : [];

    if (!mainToggle || !mobileHeaderContent || !mainNav) {
      return;
    }

    const handleMainMenuToggle = () => {
      setMobileMenuOpen(prevState => !prevState);
    };

    mainToggle.addEventListener('click', handleMainMenuToggle);

    const handleSubMenuToggle = (event) => {
      event.preventDefault();
      const parentMenuItem = event.currentTarget.closest('.menu-item-has-children');
      if (!parentMenuItem) return;

      const subMenu = parentMenuItem.querySelector('.sub-menu');
      if (!subMenu) return;

      const isExpanded = parentMenuItem.classList.toggle('ast-submenu-expanded');
      event.currentTarget.setAttribute('aria-expanded', isExpanded.toString());
      subMenu.style.display = isExpanded ? 'block' : 'none';
    };

    allSubMenuToggles.forEach(toggle => {
      toggle.addEventListener('click', handleSubMenuToggle);
    });

    // Cập nhật DOM dựa trên trạng thái menu chính
    if (isMobileMenuOpen) {
      mainToggle.classList.add('toggled');
      mainNav.classList.add('toggled');
      mobileHeaderContent.style.display = 'block';
    } else {
      mainToggle.classList.remove('toggled');
      mainNav.classList.remove('toggled');
      mobileHeaderContent.style.display = 'none';

      // === BẮT ĐẦU PHẦN THÊM MỚI: RESET SUB-MENU ===
      // Khi menu chính đóng, tìm tất cả các sub-menu đang mở và đóng chúng lại.
      const openedSubMenus = mainNav.querySelectorAll('.ast-submenu-expanded');
      openedSubMenus.forEach(item => {
        item.classList.remove('ast-submenu-expanded');
        const subMenu = item.querySelector('.sub-menu');
        const toggleButton = item.querySelector('.ast-menu-toggle');
        if (subMenu) {
          subMenu.style.display = 'none';
        }
        if (toggleButton) {
          toggleButton.setAttribute('aria-expanded', 'false');
        }
      });
      // === KẾT THÚC PHẦN THÊM MỚI ===
    }

    // Hàm dọn dẹp
    return () => {
      mainToggle.removeEventListener('click', handleMainMenuToggle);
      allSubMenuToggles.forEach(toggle => {
        toggle.removeEventListener('click', handleSubMenuToggle);
      });
    };
  }, [isMobileMenuOpen]);
  // === END ===

  // 2. useEffect để xử lý việc click và thêm/xóa class
  // React.useEffect(() => {
  //   const mobileMenuToggle = document.querySelector('.menu-toggle.main-header-menu-toggle');
  //   const mobileHeaderBarNav = document.querySelector('.main-header-bar-navigation');
  //   const mobileHeaderContent = document.querySelector('.ast-mobile-header-content');
  //   const mobileNavToggle = document.querySelector('.site-navigation');
  //   const mobileUl = document.querySelector('.main-header-menu');

  //   if (!mobileMenuToggle || !mobileHeaderContent) {
  //     return;
  //   }

  //   // Hàm xử lý khi nhấn nút
  //   const handleToggleClick = () => {
  //     setMobileMenuOpen(prevState => !prevState);
  //   };

  //   mobileMenuToggle.addEventListener('click', handleToggleClick);

  //   // Cập nhật DOM dựa trên trạng thái `isMobileMenuOpen`
  //   if (isMobileMenuOpen) {
  //    mobileHeaderContent.style.display = 'block';
  //     mobileMenuToggle.classList.add('toggled');
  //     mobileMenuToggle.setAttribute('aria-expanded', 'true');
  //     mobileUl.setAttribute('aria-expanded', 'true'); // Hoặc thêm class active để hiển thị
  //     mobileHeaderBarNav.style.display = 'block'; // Hoặc thêm class active để hiển thị
  //     mobileHeaderBarNav.classList.add('toggle-on'); // Thêm class toggle-on để hiển thị menu
  //     mobileNavToggle.classList.add('toggled'); // Thêm class toggled cho phần điều hướng
  //   } else {
  //     mobileHeaderContent.style.display = 'none';
  //     mobileMenuToggle.classList.remove('toggled');
  //     mobileMenuToggle.setAttribute('aria-expanded', 'false');
  //     mobileUl.setAttribute('aria-expanded', 'false');
  //     mobileHeaderBarNav.style.display = 'none';
  //     mobileHeaderBarNav.classList.remove('toggle-on'); // Xóa class toggle-on để ẩn menu
  //     mobileNavToggle.classList.remove('toggled'); // Xóa class toggled cho phần điều hướng
  //   }

  //   // Hàm dọn dẹp
  //   return () => {
  //     mobileMenuToggle.removeEventListener('click', handleToggleClick);
  //   };
  // }, [isMobileMenuOpen]); // Chạy lại mỗi khi trạng thái isMobileMenuOpen thay đổi

  // === KẾT THÚC PHẦN THÊM MỚI ===



  return (
    <header className="site-header header-main-layout-1 ast-primary-menu-enabled ast-hide-custom-menu-mobile ast-builder-menu-toggle-icon ast-mobile-header-inline" id="masthead">
      <div id="ast-desktop-header" data-toggle-type="dropdown" className="lazyloaded">
        <div className="ast-main-header-wrap main-header-bar-wrap ">
          <div className="ast-primary-header-bar ast-primary-header main-header-bar site-header-focus-item" data-section="section-primary-header-builder">
            <div className="site-primary-header-wrap ast-builder-grid-row-container site-header-focus-item ast-container" data-section="section-primary-header-builder">
              <div className="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
                <div className="site-header-primary-section-left site-header-section ast-flex site-header-section-left">
                  <div className="ast-builder-layout-element ast-flex site-header-focus-item" data-section="title_tagline">
                    <div className="site-branding ast-site-identity">
                      <span className="site-logo-img">
                        <Link className="custom-logo-link" to="/" rel="home">
                          <img
                            src={logoSrc}
                            alt="Wellness Clinic Marketing"
                            width={250}
                            height={72}
                            className="custom-logo"
                          />
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section">
                  <div className="ast-builder-menu-1 ast-builder-menu ast-flex ast-builder-menu-1-focus-item ast-builder-layout-element site-header-focus-item" data-section="section-hb-menu-1">
                    <div className="ast-main-header-bar-alignment">
                      <div id="mega-menu-wrap-primary" className="mega-menu-wrap">
                        <div className="mega-menu-toggle">
                          <div className="mega-toggle-blocks-left" />
                          <div className="mega-toggle-blocks-center" />
                          <div className="mega-toggle-blocks-right">
                            <div className="mega-toggle-block mega-menu-toggle-animated-block mega-toggle-block-0" id="mega-toggle-block-0"><button aria-label="Toggle Menu" className="mega-toggle-animated mega-toggle-animated-slider" type="button" aria-expanded="false"> <span className="mega-toggle-animated-box"> <span className="mega-toggle-animated-inner" /> </span> </button></div>
                          </div>
                        </div>
                        <ul id="mega-menu-primary" className="mega-menu max-mega-menu mega-menu-horizontal" data-event="hover_intent" data-effect="fade_up" data-effect-speed={200} data-effect-mobile="disabled" data-effect-speed-mobile={0} data-mobile-force-width="false" data-second-click="go" data-document-click="collapse" data-vertical-behaviour="standard" data-breakpoint={768} data-unbind="true" data-mobile-state="collapse_all" data-mobile-direction="vertical" data-hover-intent-timeout={300} data-hover-intent-interval={100}>
                          <li className="mega-full-w-columns mega-menu-item mega-menu-item-type-custom mega-menu-item-object-custom mega-menu-item-has-children mega-menu-megamenu mega-menu-grid mega-align-bottom-left mega-menu-grid mega-menu-item-31 full-w-columns" id="mega-menu-item-31">
                            <Link className="mega-menu-link" to="/service" aria-expanded="false" tabIndex={0}>Services<span className="mega-indicator" aria-hidden="true" /></Link>
                            <ul className="mega-sub-menu" role="presentation">
                              <li className="mega-menu-row" id="mega-menu-31-0">
                                <ul className="mega-sub-menu" style={{ "--columns": "12" }} role="presentation">
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--span": "6" }} id="mega-menu-31-0-0">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-8" id="mega-menu-item-media_image-8">
                                        <StaticImage
                                          src="../../assets/images/services/improvement-1.svg"
                                          alt="Hormone Optimization"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-238 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-857" id="mega-menu-item-857">
                                        <Link className="mega-menu-link" to={`/service/website-development`}>
                                          Website Development & Design
                                        </Link>
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_text mega-menu-item-text-9" id="mega-menu-item-text-9">
                                        <div className="textwidget">
                                          <p>Custom-built websites designed to attract, convert, and educate high-ticket wellness patients.</p>
                                        </div>
                                      </li>
                                    </ul>
                                  </li>
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--span": "6" }} id="mega-menu-31-0-1">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-9" id="mega-menu-item-media_image-9">
                                        <StaticImage
                                          src="../../assets/images/services/improvement-5.svg"
                                          alt="Improvement 5"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-239 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-858" id="mega-menu-item-858">
                                        <Link className="mega-menu-link" to={`/service/facebook-advertising`}>
                                          Meta Advertising (Facebook & Instagram)
                                        </Link>
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_text mega-menu-item-text-10" id="mega-menu-item-text-10">
                                        <div className="textwidget">
                                          <p>Targeted Facebook ads that drive new patient leads for aesthetics, HRT, and weight loss.</p>
                                        </div>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                              <li className="mega-menu-row" id="mega-menu-31-1">
                                <ul className="mega-sub-menu" style={{ "--columns": "12" }} role="presentation">
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--span": "6" }} id="mega-menu-31-1-0">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-11" id="mega-menu-item-media_image-11">
                                        <StaticImage
                                          src="../../assets/images/services/improvement-2.svg"
                                          alt="Improvement 2"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-240 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-859" id="mega-menu-item-859">
                                        <Link className="mega-menu-link" to={`/service/search-engine-optimization`}>
                                          Search Engine Marketing
                                        </Link>
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_text mega-menu-item-text-11" id="mega-menu-item-text-11">
                                        <div className="textwidget">
                                          <p>Top Google rankings for keywords your ideal patients are already searching.</p>
                                        </div>
                                      </li>
                                    </ul>
                                  </li>
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--span": "6" }} id="mega-menu-31-1-1">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-12" id="mega-menu-item-media_image-12">
                                        <StaticImage
                                          src="../../assets/images/services/improvement-6.svg"
                                          alt="Improvement 6"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-241 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-860" id="mega-menu-item-860">
                                        <Link className="mega-menu-link" to={`/service/lead-management`}>
                                          Lead Management (CRM)
                                        </Link>
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_text mega-menu-item-text-12" id="mega-menu-item-text-12">
                                        <div className="textwidget">
                                          <p>Automated tools to capture, nurture, and convert leads into booked appointments.</p>
                                        </div>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                              <li className="mega-menu-row" id="mega-menu-31-2">
                                <ul className="mega-sub-menu" style={{ "--columns": "12" }} role="presentation">
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--span": "6" }} id="mega-menu-31-2-0">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-13" id="mega-menu-item-media_image-13">
                                        <StaticImage
                                          src="../../assets/images/services/improvement-3.svg"
                                          alt="Improvement 3"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-242 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-861" id="mega-menu-item-861">
                                        <Link className="mega-menu-link" to={`/service/google-maps-marketing`}>
                                          Google Maps Marketing
                                        </Link>
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_text mega-menu-item-text-17" id="mega-menu-item-text-17">
                                        <div className="textwidget">
                                          <p>Rank higher locally and get found by patients searching in your area.</p>
                                        </div>
                                      </li>
                                    </ul>
                                  </li>
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--span": "6" }} id="mega-menu-31-2-1">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-16" id="mega-menu-item-media_image-16">
                                        <StaticImage
                                          src="../../assets/images/services/icon-reputation-management.png"
                                          alt="Reputation Management"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-864 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-862" id="mega-menu-item-862">
                                        <Link className="mega-menu-link" to={`/service/reputation-management`}>
                                          Reputation Management
                                        </Link>
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_text mega-menu-item-text-15" id="mega-menu-item-text-15">
                                        <div className="textwidget">
                                          <p>Build trust online with automated review requests and 5-star reputation strategies.</p>
                                        </div>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                              <li className="mega-menu-row" id="mega-menu-31-3">
                                <ul className="mega-sub-menu" style={{ "--columns": "12" }} role="presentation">
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--span": "6" }} id="mega-menu-31-3-0">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-15" id="mega-menu-item-media_image-15">
                                        <StaticImage
                                          src="../../assets/images/services/improvement-4.svg"
                                          alt="Improvement 4"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-244 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-863" id="mega-menu-item-863">
                                        <Link className="mega-menu-link" to={`/service/google-advertising`}>
                                          Google Paid Advertising
                                        </Link>
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_text mega-menu-item-text-14" id="mega-menu-item-text-14">
                                        <div className="textwidget">
                                          <p>High-converting Google Ads campaigns tailored to cash-pay medical wellness practices.</p>
                                        </div>
                                      </li>
                                    </ul>
                                  </li>
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--span": "6" }} id="mega-menu-31-3-1" >
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-15" id="mega-menu-item-media_image-17">
                                        <StaticImage
                                          src="../../assets/images/services/icon-ai.svg"
                                          alt="AI Icon"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-4048 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-863" id="mega-menu-item-863">
                                        <Link className="mega-menu-link" to={`/service/ai-search-optimization`}>
                                          AI Search Optimization
                                        </Link>
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_text mega-menu-item-text-14" id="mega-menu-item-text-14">
                                        <div className="textwidget">
                                          <p></p>
                                        </div>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                          <li className="full-non-text full-w-columns mega-menu-item mega-menu-item-type-custom mega-menu-item-object-custom mega-menu-item-has-children mega-menu-megamenu mega-menu-grid mega-align-bottom-left mega-menu-grid mega-menu-item-1641" id="mega-menu-item-1641">
                            <Link className="mega-menu-link" to="/expertise" aria-expanded="false" tabIndex={0}>Expertise<span className="mega-indicator" aria-hidden="true" /></Link>
                            <ul className="mega-sub-menu" role="presentation">
                              <li className="mega-menu-row" id="mega-menu-1641-0">
                                <ul className="mega-sub-menu" style={{ "--columns": "12" }} role="presentation">
                                  <li className="mega-menu-column mega-menu-columns-6-of-12 mega-hide-on-mobile" style={{ "--columns": "12", "--span": "6" }} id="mega-menu-1641-0-0">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-25" id="mega-menu-item-media_image-25">
                                        <StaticImage
                                          src="../../assets/expertise/icon-medical-weight-loss.svg"
                                          alt="Medical Weight Loss"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-4050 attachment-full size-full"
                                          quality={90}
                                        />
                                        {/* <img decoding="async" src="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2025/07/icon-medical-weight-loss.svg?hash=15c1346527bb82e468466739f2c23ab4" className="image wp-image-4050 attachment-full size-full" alt="" style={{ maxWidth: '100%', height: 'auto' }} /> */}
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-1644" id="mega-menu-item-1644">
                                        <Link className="mega-menu-link" to="/service/medical-weight-loss-marketing/">Medical Weight Loss Marketing</Link>
                                      </li>
                                    </ul>
                                  </li>
                                  <li className="mega-menu-column mega-menu-columns-6-of-12 mega-hide-on-mobile" style={{ "--columns": "12", "--span": "6" }} id="mega-menu-1641-0-1">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-24" id="mega-menu-item-media_image-24">
                                        <StaticImage
                                          src="../../assets/expertise/icon-hormone-opt.svg"
                                          alt="Hormone Optimization"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-4052 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-1643" id="mega-menu-item-1643">
                                        <Link className="mega-menu-link" to="/service/hormone-clinic-marketing/">Hormone Optimization Marketing</Link>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                              <li className="mega-menu-row" id="mega-menu-1641-1">
                                <ul className="mega-sub-menu" style={{ "--columns": "12" }} role="presentation">
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--columns": "12", "--span": "6" }} id="mega-menu-1641-1-0">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-23" id="mega-menu-item-media_image-23">
                                        <StaticImage
                                          src="../../assets/expertise/icon-sexual-health.svg"
                                          alt="Sexual Health"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-4054 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-1645" id="mega-menu-item-1645">
                                        <Link className="mega-menu-link" to="/service/sexual-health-marketing/">Sexual Health Marketing</Link>
                                      </li>
                                    </ul>
                                  </li>
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--columns": "12", "--span": "6" }} id="mega-menu-1641-1-1">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-22" id="mega-menu-item-media_image-22">
                                        <StaticImage
                                          src="../../assets/expertise/icon-medical-wellness.svg"
                                          alt="Medical Wellness"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-4056 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-2031" id="mega-menu-item-2031">
                                        <Link className="mega-menu-link" to="/service/wellness-medical-clinic-marketing/">Medical Wellness Clinic Marketing</Link>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                              <li className="mega-menu-row" id="mega-menu-1641-2">
                                <ul className="mega-sub-menu" style={{ "--columns": "12" }} role="presentation">
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--columns": "12", "--span": "6" }} id="mega-menu-1641-2-0">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-21" id="mega-menu-item-media_image-21">
                                        <StaticImage
                                          src="../../assets/expertise/icon-multi-loc.svg"
                                          alt="Multi-Location"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-4058 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-2617" id="mega-menu-item-2617">
                                        <Link className="mega-menu-link" to="/service/multi-location-marketing/">Multi-Location Clinic Marketing</Link>
                                      </li>
                                    </ul>
                                  </li>
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--columns": "12", "--span": "6" }} id="mega-menu-1641-2-1">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-20" id="mega-menu-item-media_image-20">
                                        <StaticImage
                                          src="../../assets/expertise/icon-men-health.svg"
                                          alt="Men's Health"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-4060 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-2032" id="mega-menu-item-2032">
                                        <Link className="mega-menu-link" to="/service/mens-health-clinic-marketing/">Men’s Health Clinic Marketing</Link>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                              <li className="mega-menu-row" id="mega-menu-1641-3">
                                <ul className="mega-sub-menu" style={{ "--columns": "12" }} role="presentation">
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--columns": "12", "--span": "6" }} id="mega-menu-1641-3-0">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-19" id="mega-menu-item-media_image-19">
                                        <StaticImage
                                          src="../../assets/expertise/icon-medspa.svg"
                                          alt="Medspa"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-4062 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-2033" id="mega-menu-item-2033">
                                        <Link className="mega-menu-link" to="/service/med-spa-marketing/">Medspa Marketing</Link>
                                      </li>
                                    </ul>
                                  </li>
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--columns": "12", "--span": "6" }} id="mega-menu-1641-3-1">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-18" id="mega-menu-item-media_image-18">
                                        <StaticImage
                                          src="../../assets/expertise/icon-franchise.svg"
                                          alt="Franchise"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-4064 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-3429" id="mega-menu-item-3429">
                                        <Link className="mega-menu-link" to="/service/franchise-marketing/">Franchise Marketing</Link>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                              <li className="mega-menu-row mega-only-col only-col" id="mega-menu-1641-4">
                                <ul className="mega-sub-menu" style={{ "--columns": "12" }} role="presentation">
                                  <li className="mega-menu-column mega-menu-columns-6-of-12" style={{ "--columns": "12", "--span": "6", 'paddingLeft': '0px' }} id="mega-menu-1641-4-0">
                                    <ul className="mega-sub-menu">
                                      <li className="mega-menu-item mega-menu-item-type-widget widget_media_image mega-menu-item-media_image-26" id="mega-menu-item-media_image-26">
                                        <StaticImage
                                          src="../../assets/expertise/legitscript-logo-2.png"
                                          alt="LegitScript Logo"
                                          width={100}
                                          height={100}
                                          loading="lazy"
                                          placeholder="none"
                                          className="image wp-image-4090 attachment-full size-full"
                                          quality={90}
                                        />
                                      </li>
                                      <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-service mega-menu-item-4085" id="mega-menu-item-4085">
                                        <Link className="mega-menu-link" to="/service/legitscript-certification/">LegitScript Certification</Link>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                          <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-page mega-align-bottom-left mega-menu-flyout mega-menu-item-2155" id="mega-menu-item-2155">
                            <Link className="mega-menu-link" to={`/our-method-mars/`} tabIndex={0}>Method</Link>
                          </li>
                          <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-page mega-menu-item-has-children mega-align-bottom-left mega-menu-flyout mega-menu-item-372" id="mega-menu-item-372">
                            <Link className="mega-menu-link" to={`/about-us`} aria-expanded="false" tabIndex={0}>
                              About Us
                              <span className="mega-indicator" aria-hidden="true" />
                            </Link>
                            <ul className="mega-sub-menu">
                              <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-page mega-menu-item-409" id="mega-menu-item-409">
                                <Link className="mega-menu-link" to={`/our-team`}>Our Team</Link>
                              </li>
                              <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-page mega-menu-item-408" id="mega-menu-item-408">
                                <Link className="mega-menu-link" to={`/events`}>Events</Link>
                              </li>
                              <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-page mega-menu-item-941" id="mega-menu-item-941">
                                <Link className="mega-menu-link" to={`/webinars`}>Webinars</Link>

                              </li>
                              <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-page mega-menu-item-942" id="mega-menu-item-942">
                                <Link className="mega-menu-link" to={`/podcast`}>Podcasts</Link>
                              </li>
                              <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-page mega-menu-item-2736" id="mega-menu-item-2736">
                                <Link className="mega-menu-link" to={`/case-study`}>Case Studies</Link>
                              </li>
                              <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-page mega-menu-item-1263" id="mega-menu-item-1263">
                                <Link className="mega-menu-link" to={`/blogs`}>Blogs</Link>
                              </li>
                              <li className="mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-page mega-menu-item-2853" id="mega-menu-item-2853">
                                <Link className="mega-menu-link" to={`/in-the-news`}>In The News</Link>
                              </li>
                            </ul>
                          </li>
                          <li className="mega-hide-mobile mega-menu-item mega-menu-item-type-custom mega-menu-item-object-custom mega-align-bottom-left mega-menu-flyout mega-menu-item-2177 hide-mobile" id="mega-menu-item-2177">
                            <div className="header-call ast-flex flex-column">
                              <div className="call-text">Have Questions?</div>
                              <a href="tel:+18004017046">Call (800) 401-7046</a>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="ast-builder-layout-element ast-flex site-header-focus-item ast-header-html-1" data-section="section-hb-html-1">
                    <div className="ast-header-html inner-link-style-">
                      <div className="ast-builder-html-element">
                        <div className="header-call ast-flex flex-column">
                          <div className="call-text">Have Questions?</div>
                          <p><a href="tel:+18004017046">Call&nbsp;(800) 401-7046</a></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ast-builder-layout-element ast-flex site-header-focus-item ast-header-button-1" data-section="section-hb-button-1">
                    <div className="ast-builder-button-wrap ast-builder-button-size-default">
                      <Link className="mega-menu-link" to={`/get-started`} target="_self" role="button" aria-label="Get Started">
                        <div className="ast-custom-button">Get Started</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="ast-mobile-header" className="ast-mobile-header-wrap " data-type="dropdown">
        <div className="ast-above-header-wrap ">
          <div className="ast-above-header-bar ast-above-header site-above-header-wrap site-header-focus-item ast-builder-grid-row-layout-default ast-builder-grid-row-tablet-layout-default ast-builder-grid-row-mobile-layout-default" data-section="section-above-header-builder">
            <div className="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
              <div className="site-header-above-section-left site-header-section ast-flex site-header-section-left">
                <div className="ast-builder-layout-element site-header-focus-item ast-header-button-2" data-section="section-hb-button-2">
                  <div className="ast-builder-button-wrap ast-builder-button-size-default">

                    <a className="ast-custom-button-link" href="tel:+18004017046" target="_self" role="button" aria-label="Call (800) 401-7046">
                      <div className="ast-custom-button">Call (800) 401-7046</div>
                    </a>
                    <a className="menu-link" href="tel:+18004017046" target="_self">Call (800) 401-7046</a>
                  </div>
                </div>
              </div>
              <div className="site-header-above-section-right site-header-section ast-flex ast-grid-right-section">
                <div className="ast-builder-layout-element ast-flex site-header-focus-item ast-header-button-1" data-section="section-hb-button-1">
                  <div className="ast-builder-button-wrap ast-builder-button-size-default">
                    <Link className="ast-custom-button-link" to={`/get-started`} target="_self" role="button" aria-label="Get Started">
                      <div className="ast-custom-button">Get Started</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ast-main-header-wrap main-header-bar-wrap">
          <div className="ast-primary-header-bar ast-primary-header main-header-bar site-primary-header-wrap site-header-focus-item ast-builder-grid-row-layout-default ast-builder-grid-row-tablet-layout-default ast-builder-grid-row-mobile-layout-default" data-section="section-transparent-header">
            <div className="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
              <div className="site-header-primary-section-left site-header-section ast-flex site-header-section-left">
                <div className="ast-builder-layout-element ast-flex site-header-focus-item" data-section="title_tagline">

                  <div className="site-branding ast-site-identity">
                    <span className="site-logo-img">
                      <Link to="/" className="custom-logo-link" rel="home">
                        {/* Sử dụng dữ liệu động từ GraphQL */}
                        <StaticImage
                          src="../../assets/logo/logo-head.png"
                          alt={logoAlt}
                          width={250}
                          height={72}
                          placeholder="none"
                          loading="eager"
                          formats={["auto", "webp", "avif"]}
                          className="custom-logo"
                          sizes="(max-width: 250px) 100vw, 250px"
                          quality={50}
                        />
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
              <div className="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section">
                <div className="ast-builder-layout-element ast-flex site-header-focus-item" data-section="section-header-mobile-trigger">
                  <div className="ast-button-wrap">
                    <button type="button" className="menu-toggle main-header-menu-toggle ast-mobile-menu-trigger-minimal" aria-expanded="false">
                      <span className="screen-reader-text">Main Menu</span>
                      <span className="mobile-menu-toggle-icon">
                        <span aria-hidden="true" className="ahfb-svg-iconset ast-inline-flex svg-baseline">
                          <svg className="ast-mobile-svg ast-menu-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                            <path d="M3 13h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 7h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 19h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1z" />
                          </svg>
                        </span>
                        <span aria-hidden="true" className="ahfb-svg-iconset ast-inline-flex svg-baseline">
                          <svg className="ast-mobile-svg ast-close-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                            <path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ast-mobile-header-content content-align-flex-start ">
            <div className="ast-builder-menu-mobile ast-builder-menu ast-builder-menu-mobile-focus-item ast-builder-layout-element site-header-focus-item" data-section="section-header-mobile-menu">
              <div className="ast-main-header-bar-alignment">
                <div className="main-header-bar-navigation">
                  <nav className="site-navigation ast-flex-grow-1 navigation-accessibility site-header-focus-item" id="ast-mobile-site-navigation" aria-label="Site Navigation: Primary Menu">
                    <div className="main-navigation">
                      <ul id="ast-hf-mobile-menu" className="main-header-menu ast-nav-menu ast-flex  submenu-with-border astra-menu-animation-fade  stack-on-mobile ast-mega-menu-enabled">
                        <li className="full-w-columns menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-31">
                          <Link aria-expanded="false" to="/service" className="menu-link">
                            <span className="ast-icon icon-arrow">
                              <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                              </svg>
                            </span>
                            <span className="menu-text1">Services</span>
                            <span role="application" className="dropdown-menu-toggle ast-header-navigation-arrow" tabIndex={0} aria-expanded="false" aria-label="Menu Toggle">
                              <span className="ast-icon icon-arrow">
                                <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                  <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                </svg>
                              </span>
                            </span>
                          </Link>
                          <button className="ast-menu-toggle" aria-expanded="false">
                            <span className="screen-reader-text">Menu Toggle</span>
                            <span className="ast-icon icon-arrow">
                              <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                              </svg>
                            </span>
                          </button>
                          <ul className="sub-menu">
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-857">
                              <Link className="menu-link" to={`/service/website-development`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Website Development & Design</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-858">
                              <Link className="menu-link" to={`/service/facebook-advertising`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Meta Advertising (Facebook & Instagram)</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-859">
                              <Link className="menu-link" to={`/service/search-engine-optimization`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Search Engine Marketing</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-860">
                              <Link className="menu-link" to={`/service/lead-management`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Lead Management (CRM)</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-861">
                              <Link className="menu-link" to={`/service/google-maps-marketing`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Google Maps Marketing</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-862">
                              <Link className="menu-link" to={`/service/reputation-management`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Reputation Management</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-863">
                              <Link className="menu-link" to={`/service/google-advertising`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Google Paid Advertising</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-863">
                              <Link className="menu-link" to={`/service/ai-search-optimization`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">AI Search Optimization</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1641">
                          <Link aria-expanded="false" to="/expertise" className="menu-link">
                            <span className="ast-icon icon-arrow">
                              <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                              </svg>
                            </span>
                            <span className="menu-text1">Expertise</span>
                            <span role="application" className="dropdown-menu-toggle ast-header-navigation-arrow" tabIndex={0} aria-expanded="false" aria-label="Menu Toggle">
                              <span className="ast-icon icon-arrow">
                                <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                  <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                </svg>
                              </span>
                            </span>
                          </Link>
                          <button className="ast-menu-toggle" aria-expanded="false">
                            <span className="screen-reader-text">Menu Toggle</span>
                            <span className="ast-icon icon-arrow">
                              <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                              </svg>
                            </span>
                          </button>
                          <ul className="sub-menu">
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-1644">
                              <Link className="menu-link" to={`/service/medical-weight-loss-marketing`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Medical Weight Loss Marketing</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-1645">
                              <Link className="menu-link" to={`/service/sexual-health-marketing`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Sexual Health Marketing</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-1643">
                              <Link className="menu-link" to={`/service/hormone-clinic-marketing`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Hormone Optimization Marketing</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-2031">
                              <Link className="menu-link" to={`/service/wellness-medical-clinic-marketing`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Medical Wellness Clinic Marketing</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-2032">
                              <Link className="menu-link" to={`/service/mens-health-clinic-marketing`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Men's Health Clinic Marketing</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-2033">
                              <Link className="menu-link" to={`/service/med-spa-marketing`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Medspa Marketing</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-2617">
                              <Link className="menu-link" to={`/service/multi-location-marketing`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Multi-Location Clinic Marketing</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-3429">
                              <Link className="menu-link" to={`/service/franchise-marketing`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Franchise Marketing</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-service menu-item-3343">
                              <Link className="menu-link" to={`/service/legitscript-certification`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">LegitScript Certification</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2155">
                          <Link className="menu-link" to={`/our-method-mars`}>
                            <span className="ast-icon icon-arrow">
                              <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                              </svg>
                            </span>
                            <span className="menu-text1">Method</span>
                          </Link>
                        </li>
                        <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-372">
                          <Link className="menu-link" to={`/about-us`}>
                            <span className="ast-icon icon-arrow">
                              <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                              </svg>
                            </span>
                            <span className="menu-text1">About Us</span>
                            <span role="application" className="dropdown-menu-toggle ast-header-navigation-arrow" tabIndex={0} aria-expanded="false" aria-label="Menu Toggle">
                              <span className="ast-icon icon-arrow">
                                <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                  <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                </svg>
                              </span>
                            </span>
                          </Link>
                          <button className="ast-menu-toggle" aria-expanded="false">
                            <span className="screen-reader-text">Menu Toggle</span>
                            <span className="ast-icon icon-arrow">
                              <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                              </svg>
                            </span>
                          </button>
                          <ul className="sub-menu">
                            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-409">
                              <Link className="menu-link" to={`/our-team`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Our Team</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-408">
                              <Link className="menu-link" to={`/events`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Events</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-941">
                              <Link className="menu-link" to={`/webinars`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Webinars</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-942">
                              <Link className="menu-link" to={`/podcast`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Podcasts</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2736">
                              <Link className="menu-link" to={`/case-study`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Case Studies</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1263">
                              <Link className="menu-link" to={`/blogs`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">Blogs</span>
                              </Link>
                            </li>
                            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2853">
                              <Link className="menu-link" to={`/in-the-news`}>
                                <span className="ast-icon icon-arrow">
                                  <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                  </svg>
                                </span>
                                <span className="menu-text">In The News</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="hide-mobile menu-item menu-item-type-custom menu-item-object-custom menu-item-2177">
                          <a href="#" className="menu-link">
                            <span className="ast-icon icon-arrow">
                              <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
                                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                              </svg>
                            </span>
                            <span className="menu-text">Call Text</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
