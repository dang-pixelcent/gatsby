import React, { useState, useEffect, Suspense } from 'react';
import Layout from '@components/layout';
import { SEO } from "@components/SEO";
import loadable from '@loadable/component';

import PostItem from '@components/Blog/PostItem';
import BlogSidebar from '@components/Blog/BlogSidebar';

import { useLocation } from '@reach/router';
const Pagination = loadable(() => import('@components/Blog/Pagination'));



// async function fetchSeoData(searchTerm) {
//     // MOCK BIẾN MÔI TRƯỜNG:
//     const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL
//     const SEO_QUERY_URL = process.env.REACT_APP_SEO_QUERY_URL
//     try {
//         const fullurl = `${SEO_QUERY_URL}/?s=${encodeURIComponent(searchTerm)}`;
//         const apiUrl = `${WP_BASE_URL}/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(fullurl)}`;
//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             console.error("Rank Math API request failed:", response.statusText);
//             return null;
//         }
//         const json = await response.json();
//         console.log("SEO data fetched successfully:", json);
//         return json.success ? json.head : console.log("Failed to fetch SEO data:", json);
//     } catch (error) {
//         console.error("Error fetching SEO data:", error);
//         return null;
//     }
// }

//mock url
const WP_GRAPHQL_URL = process.env.GATSBY_WPGRAPHQL_URL
const REACT_APP_DOMAIN = process.env.REACT_APP_DOMAIN
const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL

// Hàm để gọi GraphQL API phía client
async function fetchSearchResults(searchTerm) {
    const response = await fetch(`${WP_GRAPHQL_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query SearchPosts($searchTerm: String!) {
                        posts(first: 99999, where: { search: $searchTerm }) {
                            nodes {
                                id
                                title
                                uri
                                excerpt(format: RENDERED)
                                featuredImage {
                                    node {
                                        sourceUrl
                                        altText
                                    }
                                }
                            }
                        }
                    }
            `,
            variables: { searchTerm },
        }),
    });

    const json = await response.json();
    return json?.data?.posts?.nodes || [];
}


const SearchResultPage = ({ location }) => {
    const [allResults, setAllResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5; // Số lượng bài viết mỗi trang

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q') || '';
        const page = parseInt(params.get('page')) || 1;
        // Cập nhật currentPage khi URL thay đổi
        setCurrentPage(page);
        // Chỉ fetch dữ liệu khi search term thay đổi
        if (query !== searchTerm) {
            setSearchTerm(query);
            if (query) {
                setIsLoading(true);
                fetchSearchResults(query)
                    .then(data => {
                        setAllResults(data);
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error("Search failed:", error);
                        setIsLoading(false);
                    });
            } else {
                setAllResults([]);
                setIsLoading(false);
            }
        }
    }, [location.search, searchTerm]);

    // Logic phân trang
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = allResults.slice(indexOfFirstPost, indexOfLastPost);
    const numPages = Math.ceil(allResults.length / postsPerPage);

    // Tạo basePath cho pagination với search query
    const basePath = `/blogs/search?q=${encodeURIComponent(searchTerm)}&`;

    return (
        <Layout>
            {/* Banner tĩnh */}
            <section className="banner cus-height" style={{ background: "no-repeat center/cover #0659A9 url('https://a.wellnessclinicmarketing.com/wp-content/uploads/2025/03/default-page-banner.jpg')" }}>
                <div className="cus-container h-100 ast-flex align-items-center">
                    <div className="ast-full-width text-left text-white">
                        <h1 className="h1-title fs-56 f-soletoxbold fw-800 text-white" style={{ marginBottom: '24px' }}>
                            Search results for: {searchTerm}
                        </h1>
                        <div className="desc fs-22 f-soleto fw-300" style={{ marginBottom: '30px' }}></div>
                    </div>
                </div>
            </section>

            {/* Khung chính của trang search giống như blog */}
            <section className="section sc-blog">
                <div className="cus-container">
                    <div className="main ast-flex justify-content-between">                        {/* Cột trái */}
                        <div className="blog-items ast-flex flex-column">
                            {isLoading ? (
                                <div className="loading-container" style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '100px',
                                    flexDirection: 'column',
                                }}>
                                    <img
                                        src="/loading.gif"
                                        alt="Loading..."
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            marginBottom: '20px'
                                        }}
                                    />
                                    <p style={{
                                        fontSize: '18px',
                                        color: '#666',
                                        margin: 0
                                    }}>Searching...</p>
                                </div>
                            ) : allResults.length > 0 ? (
                                <>
                                    {currentPosts.map(post => (
                                        <PostItem key={post.id} post={post} />
                                    ))}
                                    {numPages > 1 && (
                                        <Suspense fallback={<div></div>}>
                                            <Pagination
                                                currentPage={currentPage}
                                                numPages={numPages}
                                                basePath={basePath}
                                            />
                                        </Suspense>
                                    )}
                                </>
                            ) : (
                                <div className="no-results">
                                    <p>Not found blog post</p>
                                </div>
                            )}
                        </div>

                        {/* Cột phải */}
                        <BlogSidebar />
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export const Head = () => {
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const searchTerm = params.get('q') || '';
    const page = parseInt(params.get('page')) || 1;

    const siteName = "Wellness Clinic Marketing";
    // Lấy tổng số trang từ URL nếu có (hoặc bạn có thể truyền qua context/props nếu cần)
    // Ở đây sẽ không có totalPages, nên chỉ hiển thị số trang hiện tại nếu page > 1
    let fullTitle = searchTerm ? `${searchTerm}` : 'Search';
    if (page > 1) {
        fullTitle = `${searchTerm} - Page ${page} - ${siteName}`;
    } else {
        fullTitle = `${searchTerm ? searchTerm : 'Search'} - ${siteName}`;
    }
    const pageUrl = location.href;

    // Tạo cấu trúc Schema JSON-LD động
    // Schema JSON-LD động với thông tin logo đầy đủ
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${REACT_APP_DOMAIN}/#organization`,
                "name": siteName,
                "url": `${REACT_APP_DOMAIN}`,
                "logo": {
                    "@type": "ImageObject",
                    "@id": `${REACT_APP_DOMAIN}/#logo`,
                    "url": `${WP_BASE_URL}/wp-content/uploads/2025/03/logo-head.png`,
                    "contentUrl": `${WP_BASE_URL}/wp-content/uploads/2025/03/logo-head.png`,
                    "caption": siteName,
                    "inLanguage": "en-US",
                    "width": "1038",
                    "height": "300"
                }
            },
            {
                "@type": "WebSite",
                "@id": `${REACT_APP_DOMAIN}/#website`,
                "url": `${REACT_APP_DOMAIN}`,
                "name": siteName,
                "publisher": {
                    "@id": `${REACT_APP_DOMAIN}/#organization`
                },
                "inLanguage": "en-US"
            },
            {
                "@type": "WebPage",
                "@id": `${pageUrl}#webpage`,
                "url": pageUrl,
                "name": fullTitle,
                "isPartOf": {
                    "@id": `${REACT_APP_DOMAIN}/#website`
                },
                "inLanguage": "en-US"
            }
        ]
    };

    return (
        <SEO>
            {/* Thẻ Title */}
            <title>{fullTitle}</title>

            <meta name="keywords" data-otto-pixel="dynamic-seo" content="Medical Wellness, Hormone Optimization, Sexual Wellness, Anti-Aging Procedures, Hormones Optimization, Medical Weight Loss, Cash-based Medical Practice, Practice Accelerator Program, Lead Generating Strategies"></meta>
            {/* Thẻ Robots quan trọng nhất cho trang search */}
            <meta name="robots" content="noindex, follow" />

            {/* Các thẻ Open Graph */}
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:site_name" content={siteName} />

            {/* Các thẻ Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />

            {/* Thẻ Schema JSON-LD động */}
            <script type="application/ld+json" className="rank-math-schema-pro">
                {JSON.stringify(schemaData)}
            </script>
        </SEO>
    );


    // // Nếu không có dữ liệu SEO (API lỗi), hiển thị các thẻ mặc định
    // return (
    //     <>
    //         <title>{`${defaultTitle} | Your Site Name`}</title>
    //         <meta name="robots" content="noindex, follow" />
    //     </>
    // );
};

export default SearchResultPage;