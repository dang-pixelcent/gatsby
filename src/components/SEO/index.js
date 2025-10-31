import React from "react"
import { Helmet } from "react-helmet"
import parse from 'html-react-parser';

// import soletoXBold from "../../fonts/Soleto-XBold.woff2";
// import soletoMedium from "../../fonts/Soleto-Medium.woff2";
// import soletoRegular from "../../fonts/Soleto-Regular.woff2";
// import assistant700 from "../../fonts2/assistant-v23-latin-700.woff2";
// import assistant600 from "../../fonts2/assistant-v23-latin-600.woff2";
// import inter400 from "../../fonts2/inter-v19-latin-regular.woff2";

// import { Script } from "gatsby"

export const SEO = ({
    metaHtml,
    // schemas,
    // bodyClass,
    children,
    // lcpImageUrl
}) => {
    // LOGGING ĐỂ DEBUG: In ra các props mà component nhận được
    // Bạn hãy mở console của trình duyệt và terminal lúc build để xem kết quả

    // // Lấy giá trị isMobileMenuOpen từ context
    // const { isMobileMenuOpen } = useMobileMenuContext();
    // // Sử dụng hook để tính toán chuỗi class cho thẻ body
    // const calculatedBodyClass = useBodyClass(isMobileMenuOpen);
    //if (!bodyClass) console.warn("[SEO] bodyClass is not provided, this may cause issues with styling or functionality.");
    // Kiểm tra xem metaHtml có phải là một chuỗi hợp lệ và không rỗng hay không
    const canParsemetaHtml = typeof metaHtml === 'string' && metaHtml.trim().length > 0;

    if (!metaHtml) {
        return (
            <>
                {/* Preload favicon ngay lập tức để tránh delay */}
                <link rel="preload" href="/favicon/favicon.ico" as="image" type="image/x-icon" fetchpriority="high" />
                {children}
            </>
        )
    }

    // --- THÊM VÀO ĐỂ DEBUG ---
    // Biến này sẽ lưu kết quả của hàm parse()
    let parsedSeoElements = null;
    if (canParsemetaHtml) {
        // 1. Chạy hàm parse và lưu kết quả
        parsedSeoElements = parse(metaHtml);
    }
    // --- KẾT THÚC PHẦN DEBUG ---

    return (
        <>
            {/* --- TỐI ƯU HÓA KẾT NỐI SỚM --- */}
            {/* Preconnect đến các domain của bên thứ ba quan trọng */}
            {/* <link rel="preconnect" href="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com" />
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" /> */}

            {/* DNS-prefetch như một phương án dự phòng */}
            {/* <link rel="dns-prefetch" href="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" /> */}

            {/* <link rel="preconnect" href="https://widgets.leadconnectorhq.com" />
            <link rel="dns-prefetch" href="https://widgets.leadconnectorhq.com" /> */}

            {/* <link rel="preconnect" href="https://fonts.bunny.net" crossOrigin="true" />
            <link rel="dns-prefetch" href="https://fonts.bunny.net" /> */}
            {/* 
            <link rel="preconnect" href="https://book.practiceflow.md/widget/survey/pZ5us1TDI3kKin0xSGLQ" />
            
            <link rel="dns-prefetch" href="https://book.practiceflow.md/widget/survey/pZ5us1TDI3kKin0xSGLQ" /> */}

            {/* --- KẾT THÚC TỐI ƯU HÓA --- */}

            {/* Tối ưu hóa LCP cho ảnh banner */}
            {/* {lcpImageUrl && <link rel="preload" fetchpriority="high" as="image" href={lcpImageUrl} type="image/webp" />} */}

            {/* dữ liệu-seo từ wp */}
            {parsedSeoElements}

            {/* JSON-LD schemas */}
            {/* Render các schema JSON-LD một cách an toàn */}
            {/* {schemas && schemas.length > 0 && schemas.map((schema, index) => (
                <Script
                    key={`schema-ld-${index}`}
                    type="application/ld+json"
                    className="rank-math-schema-pro"
                    strategy="post-hydrate" // Tải script khi trình duyệt rảnh rỗi
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema),
                    }}
                />
            ))} */}

            {/* tùy chỉnh các thẻ meta SEO khác nếu cần */}
            {children}
            <Helmet>
                <html lang="en" />
                {/* {metaHtml && (
                    <div className="meta-html" dangerouslySetInnerHTML={{ __html: metaHtml }} />
                )} */}

                {/* <link
                    rel="preload"
                    href="/fonts/Soleto-XBold.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                    key="soleto-xbold"
                />,
                <link
                    rel="preload"
                    href="/fonts/Soleto-Regular.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                    key="soleto-regular"
                />, */}
                {/* <link
                    rel="preload"
                    href={soletoXBold}
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                    key="soleto-xbold"
                />
                <link
                    rel="preload"
                    href={soletoMedium}
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                    key="soleto-medium"
                />
                <link
                    rel="preload"
                    href={soletoRegular}
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                    key="soleto-regular"
                />
                <link
                    rel="preload"
                    href={assistant700}
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                    key="assistant-v23-latin-700"
                />
                <link
                    rel="preload"
                    href={assistant600}
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                    key="assistant-v23-latin-600"
                />
                <link
                    rel="preload"
                    href={inter400}
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                    key="inter-v19-latin-400"
                /> */}

                {/* <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="Wellness Clinic Marketing" />
                <link rel="manifest" href="/favicon/site.webmanifest" /> */}
            </Helmet>
        </>
    )
}