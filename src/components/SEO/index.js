import React from "react"
// import { Helmet } from "react-helmet"
import parse from 'html-react-parser';

export const SEO = ({
    seoData,
    // bodyClass,
    children,
    lcpImageUrl
}) => {
    // // Lấy giá trị isMobileMenuOpen từ context
    // const { isMobileMenuOpen } = useMobileMenuContext();
    // // Sử dụng hook để tính toán chuỗi class cho thẻ body
    // const calculatedBodyClass = useBodyClass(isMobileMenuOpen);
    //if (!bodyClass) console.warn("[SEO] bodyClass is not provided, this may cause issues with styling or functionality.");
    // Kiểm tra xem seoData có phải là một chuỗi hợp lệ và không rỗng hay không
    const canParseSeoData = typeof seoData === 'string' && seoData.trim().length > 0;

    if (!seoData) {
        return (
            <>
                <html lang="en-US" />
                {/* <body className={bodyClass} /> */}
                <link rel="icon" href="/favicon.png" sizes="32x32" />
                <link rel="icon" href="/favicon.png" sizes="192x192" />
                <link rel="apple-touch-icon" href="/favicon.png" />
                <meta name="msapplication-TileImage" content="/favicon.png" />
                {children}
            </>
        )
    }

    return (
        <>
            <html lang="en-US" />
            <meta charSet="utf-8" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

            {/* --- TỐI ƯU HÓA KẾT NỐI SỚM --- */}
            {/* Preconnect đến các domain của bên thứ ba quan trọng */}
            <link rel="preconnect" href="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com" />
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />

            {/* DNS-prefetch như một phương án dự phòng */}
            <link rel="dns-prefetch" href="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />

            {/* <link rel="preconnect" href="https://widgets.leadconnectorhq.com" />
            <link rel="dns-prefetch" href="https://widgets.leadconnectorhq.com" /> */}

            {/* <link rel="preconnect" href="https://fonts.bunny.net" crossOrigin="true" />
            <link rel="dns-prefetch" href="https://fonts.bunny.net" /> */}
{/* 
            <link rel="preconnect" href="https://book.practiceflow.md/widget/survey/pZ5us1TDI3kKin0xSGLQ" />
            
            <link rel="dns-prefetch" href="https://book.practiceflow.md/widget/survey/pZ5us1TDI3kKin0xSGLQ" /> */}

            {/* --- KẾT THÚC TỐI ƯU HÓA --- */}

            {/* Tối ưu hóa LCP cho ảnh banner */}
            {lcpImageUrl && <link rel="preload" fetchpriority="high" as="image" href={lcpImageUrl} type="image/webp" />}

            {/* Thêm bodyClass vào thẻ body */}
            {/* <body className={bodyClass} /> */}

            {/* dữ liệu-seo từ wp */}
            {canParseSeoData && parse(seoData)}

            <link rel="icon" href="/favicon.png" sizes="32x32" />
            <link rel="icon" href="/favicon.png" sizes="192x192" />
            <link rel="apple-touch-icon" href="/favicon.png" />
            <meta name="msapplication-TileImage" content="/favicon.png" />

            {/* tùy chỉnh các thẻ meta SEO khác nếu cần */}
            {children}
        </>
    )
}