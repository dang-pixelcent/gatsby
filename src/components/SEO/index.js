import React from "react"
// import { Helmet } from "react-helmet"
import parse from 'html-react-parser';

export const SEO = ({
    seoData,
    schemas,
    // bodyClass,
    children,
    lcpImageUrl
}) => {
    // LOGGING ĐỂ DEBUG: In ra các props mà component nhận được
    // Bạn hãy mở console của trình duyệt và terminal lúc build để xem kết quả
    console.log("--- SEO Component Props ---");
    // console.log("Prop 'metaHtml':", metaHtml);
    console.log("Prop 'schemas':", schemas);
    console.log("---------------------------");
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
                {/* Preload favicon ngay lập tức để tránh delay */}
                <link rel="preload" href="/favicon/favicon.ico" as="image" type="image/x-icon" fetchpriority="high" />

                {/* Favicon setup tối ưu */}
                <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="Wellness Clinic Marketing" />
                <link rel="manifest" href="/favicon/site.webmanifest" />
                {children}
            </>
        )
    }

    // --- THÊM VÀO ĐỂ DEBUG ---
    // Biến này sẽ lưu kết quả của hàm parse()
    let parsedSeoElements = null;
    if (canParseSeoData) {
        // 1. Chạy hàm parse và lưu kết quả
        parsedSeoElements = parse(seoData);

        // // 2. Log kết quả ra console để bạn xem
        console.log("--- [DEBUG SEO] Output of parse(seoData): ---");
        console.log(parsedSeoElements);
        console.log("--------------------------------------------");
    }
    // --- KẾT THÚC PHẦN DEBUG ---
    // Nó là một MẢNG chứa một OBJECT, cấu trúc này là hoàn toàn chính xác.
    const hardcodedSchemas = [{
        "@context": "https://schema.org",
        "@graph": [{
            "@type": "Organization",
            "@id": "https://www.wellnessclinicmarketing.com/#organization",
            "name": "Wellness Clinic Marketing",
            "logo": {
                "@type": "ImageObject",
                "@id": "https://www.wellnessclinicmarketing.com/#logo",
                "url": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/logo-head.png",
                "contentUrl": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/logo-head.png",
                "caption": "Wellness Clinic Marketing",
                "inLanguage": "en-US",
                "width": "1038",
                "height": "300"
            }
        }, {
            "@type": "WebSite",
            "@id": "https://www.wellnessclinicmarketing.com/#website",
            "url": "https://www.wellnessclinicmarketing.com",
            "name": "Wellness Clinic Marketing",
            "publisher": {
                "@id": "https://www.wellnessclinicmarketing.com/#organization"
            },
            "inLanguage": "en-US",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.wellnessclinicmarketing.com/?s={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        }, {
            "@type": "WebPage",
            "@id": "https://www.wellnessclinicmarketing.com/#webpage",
            "url": "https://www.wellnessclinicmarketing.com/",
            "name": "Medical Marketing Company For Med Spa & Medical Wellness Centers",
            "datePublished": "2024-11-04T03:41:46+00:00",
            "dateModified": "2025-09-08T11:38:03+00:00",
            "about": {
                "@id": "https://www.wellnessclinicmarketing.com/#organization"
            },
            "isPartOf": {
                "@id": "https://www.wellnessclinicmarketing.com/#website"
            },
            "inLanguage": "en-US"
        }]
    }];

    console.log("[SEO Component]schemas:", hardcodedSchemas);

    return (
        <>
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
            {parsedSeoElements}

            {/* JSON-LD schemas */}
            {/* Render các schema JSON-LD một cách an toàn */}
            {/* {schemas && schemas.length > 0 && schemas.map((schema, index) => (
                <script
                    key={`schema-ld-${index}`}
                    type="application/ld+json"
                    className="rank-math-schema-pro"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema),
                    }}
                />
            ))} */}

            {/* {schemas && schemas.length > 0 && schemas.map((schema, index) => ( */}
            <script
                // key={`schema-ld-${index}`}
                type="application/ld+json"
                className="rank-math-schema-pro"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schemas[0]), // Chỉ dùng phần tử đầu tiên
                }}
            />
            {/* ))} */}


            <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
            <link rel="shortcut icon" href="/favicon/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
            <meta name="apple-mobile-web-app-title" content="Wellness Clinic Marketing" />
            <link rel="manifest" href="/favicon/site.webmanifest" />

            {/* tùy chỉnh các thẻ meta SEO khác nếu cần */}
            {children}
        </>
    )
}