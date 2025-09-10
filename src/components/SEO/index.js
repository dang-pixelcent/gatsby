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
                    __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "Organization", "@id": "https://www.wellnessclinicmarketing.com/#organization", "name": "Wellness Clinic Marketing", "logo": { "@type": "ImageObject", "@id": "https://www.wellnessclinicmarketing.com/#logo", "url": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/logo-head.png", "contentUrl": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/logo-head.png", "caption": "Wellness Clinic Marketing", "inLanguage": "en-US", "width": "1038", "height": "300" } }, { "@type": "WebSite", "@id": "https://www.wellnessclinicmarketing.com/#website", "url": "https://www.wellnessclinicmarketing.com", "name": "Wellness Clinic Marketing", "publisher": { "@id": "https://www.wellnessclinicmarketing.com/#organization" }, "inLanguage": "en-US" }, { "@type": "ImageObject", "@id": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/facebook.png", "url": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/facebook.png", "width": "225", "height": "225", "inLanguage": "en-US" }, { "@type": "BreadcrumbList", "@id": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/#breadcrumb", "itemListElement": [{ "@type": "ListItem", "position": "1", "item": { "@id": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/", "name": "Meta Advertising (Facebook & Instagram)" } }] }, { "@type": ["ItemPage", "FAQPage"], "@id": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/#webpage", "url": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/", "name": "Facebook Advertising for Medical Practices | Patient Lead Generation", "datePublished": "2024-12-02T02:40:23+00:00", "dateModified": "2025-09-08T08:50:08+00:00", "isPartOf": { "@id": "https://www.wellnessclinicmarketing.com/#website" }, "primaryImageOfPage": { "@id": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/facebook.png" }, "inLanguage": "en-US", "breadcrumb": { "@id": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/#breadcrumb" }, "mainEntity": [{ "@type": "Question", "name": "How can you get Botox patients with Facebook ads?", "acceptedAnswer": { "@type": "Answer", "text": "Facebook ads are an effective way to target women and men in an ideal age range. Our ads are crafted in a way that speaks to people who can benefit from a fresher look and are familiar with aesthetic procedures. Combining these creatives with a qualifying funnel, we entice prospective patients to reach out for an appointment," } }, { "@type": "Question", "name": "What types of medical practices can benefit from Facebook ads?", "acceptedAnswer": { "@type": "Answer", "text": "Med Spas and Medical Wellness Centers that offer aesthetic, wellness, and body contouring procedures are having great success with Facebook ads. However, due to platform restrictions, other strategies may be needed for sensitive services like hormone therapy or sexual wellness." } }, { "@type": "Question", "name": "How much does Facebook advertising cost?", "acceptedAnswer": { "@type": "Answer", "text": "The fee for implementing and managing Facebook/ Instagram advertising will range from $1,500-2,500/mo, depending on the total marketing program. In terms of an advertising budget, you want to allocate a minimum of $1,000/mo per procedure advertised. In a busy season, you want to scale that 3x and more, as long as you get a positive RO." } }] }, { "@type": "Product", "name": "Meta Advertising (Facebook & Instagram)", "url": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/", "description": "Grow your medical practice with targeted Facebook & Instagram ads. Convert high-quality leads into paying patients with expert ad strategies. ☎️ (800) 401-7046", "brand": { "@type": "Brand", "name": "Wellness Clinic Marketing" }, "image": { "@type": "ImageObject", "url": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/facebook.png" }, "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "bestRating": "5", "ratingCount": "120" } }, { "@type": "Service", "name": "Meta Advertising (Facebook & Instagram)", "url": "https://www.wellnessclinicmarketing.com/service/facebook-advertising/", "description": "Grow your medical practice with targeted Facebook & Instagram ads. Convert high-quality leads into paying patients with expert ad strategies. ☎️ (800) 401-7046", "image": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/facebook.png", "provider": { "@type": "Organization", "name": "Wellness Clinic Marketing", "url": "https://www.wellnessclinicmarketing.com/", "logo": { "@type": "ImageObject", "url": "https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/logo-head.png" } }, "areaServed": { "@type": "Country", "name": "United States" }, "audience": { "@type": "Audience", "audienceType": "Medical & Wellness Practices" } }] })
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