import React from "react"
import { Helmet } from "react-helmet"
import parse from 'html-react-parser';
const SEO = ({
    seoData,
    // bodyClass,
    children
}) => {
    // // Lấy giá trị isMobileMenuOpen từ context
    // const { isMobileMenuOpen } = useMobileMenuContext();
    // // Sử dụng hook để tính toán chuỗi class cho thẻ body
    // const calculatedBodyClass = useBodyClass(isMobileMenuOpen);
    //if (!bodyClass) console.warn("[SEO] bodyClass is not provided, this may cause issues with styling or functionality.");
    
    if (!seoData) {
        return (
            <Helmet>
                <html lang="en-US" />
                {/* <body className={bodyClass} /> */}
                {children}
            </Helmet>
        )
    }

    return (
        <Helmet>
            <html lang="en-US" />
            <meta charSet="utf-8" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

            {/* Thêm bodyClass vào thẻ body */}
            {/* <body className={bodyClass} /> */}

            {/* dữ liệu-seo từ wp */}
            {parse(seoData)}

            <link rel="icon" href="/favicon.png" sizes="32x32" />
            <link rel="icon" href="/favicon.png" sizes="192x192" />
            <link rel="apple-touch-icon" href="/favicon.png" />
            <meta name="msapplication-TileImage" content="/favicon.png" />

            {/* tùy chỉnh các thẻ meta SEO khác nếu cần */}
            {children}
        </Helmet>
    )
}

export default SEO