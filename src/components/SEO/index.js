import React from "react"
// import { Helmet } from "react-helmet"
import parse from 'html-react-parser';

export const SEO = ({
    seoData, // Chỉ nhận một prop duy nhất là chuỗi HTML thô
    children,
    lcpImageUrl
}) => {

    let metaElements = [];
    let schemas = [];

    if (seoData && typeof seoData === 'string') {
        // Logic tách chuỗi giờ nằm ngay trong component
        const $ = cheerio.load(seoData);

        // 1. Tìm, trích xuất và xóa các thẻ schema
        $('script[type="application/ld+json"]').each((i, el) => {
            try {
                const jsonContent = JSON.parse($(el).html());
                schemas.push(jsonContent); // Lưu object JSON vào mảng schemas
                $(el).remove(); // Xóa thẻ script khỏi cheerio instance
            } catch (e) {
                // Bỏ qua nếu có lỗi parse JSON
            }
        });

        // 2. Phần HTML còn lại chính là các thẻ meta
        const metaHtml = $.html();
        metaElements = parse(metaHtml);
    }

    return (
        <>
            {/* Các thẻ link và meta cố định */}
            <link rel="preconnect" href="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com" />
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
            <link rel="dns-prefetch" href="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
            {lcpImageUrl && <link rel="preload" fetchpriority="high" as="image" href={lcpImageUrl} type="image/webp" />}

            {/* Render các thẻ meta đã được làm sạch */}
            {metaElements}

            {/* Render thẻ schema từ dữ liệu đã được trích xuất */}
            {schemas && schemas.length > 0 && schemas.map((schema, index) => (
                <script
                    key={`schema-ld-${index}`}
                    type="application/ld+json"
                    className="rank-math-schema-pro"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema)
                    }}
                />
            ))}

            {/* Các thẻ link cho favicon */}
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