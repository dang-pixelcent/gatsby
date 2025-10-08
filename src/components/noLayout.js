import React, { useState, useEffect, Suspense } from "react"
// import loadable from '@loadable/component';
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
// import Header from './Header'
import ChatWidget from "./ChatWidget"
import { useLocation } from "@reach/router"
import Helmet from "react-helmet"
// phần scroll top
import DomEnhancer from '@components/Tools/DomEnhancer';
import ScrollTop from '@components/ScrollTop';


// Import custom hooks
import { useMegaMenu } from "@hooks/header/useMegaMenu"
import { useScrollHeader } from "@hooks/header/useScrollHeader"
import { useMobileMenu } from "@hooks/header/useMobileMenu"
import { useBodyUpdate } from "@hooks/layout/useBodyUpdate"
import { useAos } from "@hooks/useAos"

// 1. Import trực tiếp file logo
import logoSrc from '@assets/logo/logo-head.png';

// const Footer = loadable(() => import('./Footer'));
// const ScrollTop = loadable(() => import('./ScrollTop'));

const NoLayout = ({ children }) => {
    const location = useLocation(); // Lấy thông tin về trang hiện tại

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    // bodyClass sẽ được cập nhật mỗi khi trang thay đổi hoặc kích thước cửa sổ thay đổi
    useBodyUpdate(location, isMobileMenuOpen);
    // +++ KẾT THÚC PHẦN THÊM MỚI +++

    // Khởi tạo AOS
    useAos();
    // Sử dụng các custom hooks
    useMegaMenu();
    useScrollHeader(isMobileMenuOpen);
    useMobileMenu(isMobileMenuOpen, setMobileMenuOpen);

    return (
        <div>
            <Helmet>
                <link rel="preload" as="image" href={logoSrc} fetchpriority="high" />
            </Helmet>

            {children}
            <Suspense fallback={<div></div>}>
                {/* <Footer data={data} /> */}
                <DomEnhancer
                    selector="#ast-scroll-top"
                    enhancer={ScrollTop}
                />
                {/* <ScrollTop /> */}
            </Suspense>
            <ChatWidget />
        </div>
    )
}

export default NoLayout