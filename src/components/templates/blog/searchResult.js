import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Layout from '@components/layout';
import { SEO } from "@components/SEO";

import PostItem from '@components/Blog/PostItem';
import BlogSidebar from '@components/Blog/BlogSidebar';
import Pagination from '@components/Blog/Pagination';

// Hàm để gọi GraphQL API phía client
async function fetchSearchResults(searchTerm) {
    const response = await fetch("https://agencysitestaging.mystagingwebsite.com/graphql", {
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
            }        }
    }, [location.search, searchTerm]);

    // Logic phân trang
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = allResults.slice(indexOfFirstPost, indexOfLastPost);
    const numPages = Math.ceil(allResults.length / postsPerPage);

    // Debug log
    console.log('Debug pagination:', {
        currentPage,
        totalPosts: allResults.length,
        indexOfFirstPost,
        indexOfLastPost,
        currentPostsLength: currentPosts.length,
        numPages
    });// Tạo basePath cho pagination với search query
    const basePath = `/blogs/search?q=${encodeURIComponent(searchTerm)}&`;

    return (
        <Layout>
            {/* Banner tĩnh */}
            <section className="banner" style={{background: "no-repeat center/cover #0659A9 url('https://www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/default-page-banner.jpg')"}}>
                <div className="cus-container h-100 ast-flex align-items-center">
                    <div className="ast-full-width text-left text-white">
                        <h1 className="h1-title fs-56 f-soletoxbold fw-800 text-white" style={{marginBottom: '24px'}}>
                            Search results for: {searchTerm}
                        </h1>
                        <div className="desc fs-22 f-soleto fw-300" style={{marginBottom: '30px'}}></div>
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
                                        <Pagination
                                            currentPage={currentPage}
                                            numPages={numPages}
                                            basePath={basePath}
                                        />
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

// export const Head = ({ location }) => {
//     const params = new URLSearchParams(location.search);
//     const searchTerm = params.get('q') || '';
    
//     return (
//         <SEO 
//             seoData={{
//                 title: `Search Results for: ${searchTerm}`,
//                 metaDesc: `Search results for "${searchTerm}" - Find the best articles and posts related to your search.`,
//             }} 
//         />
//     );
// };

export default SearchResultPage;