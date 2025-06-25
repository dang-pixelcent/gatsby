import React from 'react';
import Layout from '@components/layout';
import { SEO } from "@components/SEO"

import PostItem from '@components/Blog/PostItem';
import BlogSidebar from '@components/Blog/BlogSidebar';
import Pagination from '@components/Blog/Pagination';

const BlogArchive = ({ pageContext }) => {
    const { posts, pageNumber, numPages, pageInfo } = pageContext;

    const bannerBlogs = (
        <section className="banner cus-height" style={{ background: "no-repeat center/cover url('https://agencysitestaging.mystagingwebsite.com/wp-content/uploads/2025/03/default-page-banner.jpg')" }}>
            <div className="cus-container h-100">
                <div className="ast-full-width h-100 ast-flex align-items-center justify-content-center banner-inner">
                    <h1 className="h1-title fw-800 f-soletoxbold text-white text-center">{pageInfo ? pageInfo.name : ''}</h1>
                </div>
            </div>
        </section>
    );

    const bannerCategory = (
        <section className="banner cus-height" style={{ background: "no-repeat center/cover #0659A9 url('https://www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/default-page-banner.jpg')" }}>
            <div className="cus-container h-100 ast-flex align-items-center">
                <div className="ast-full-width text-left text-white">
                    <h1 className="h1-title fs-56 f-soletoxbold fw-800 text-white" style={{ marginBottom: '24px' }}>
                        {pageInfo ? pageInfo.name : ''}
                    </h1>
                    <div className="desc fs-22 f-soleto fw-300" style={{ marginBottom: '30px' }}></div>
                </div>
            </div>
        </section>
    );

    return (
        <Layout>
            {/* Banner tĩnh cho danh mục hoặc Blogs */}
            {pageInfo.name === 'Blogs' ? bannerBlogs : bannerCategory}

            {/* Khung chính của trang blog */}
            <section className="section sc-blog">
                <div className="cus-container">
                    <div className="main ast-flex justify-content-between">
                        {/* Cột trái */}
                        <div className="blog-items ast-flex flex-column">
                            {posts.map(post => (
                                <PostItem key={post.id} post={post} />
                            ))}
                            <Pagination
                                currentPage={pageNumber}
                                numPages={numPages}
                                basePath={`${pageInfo ? `${pageInfo.uri}` : null}`}
                            />
                        </div>

                        {/* Cột phải */}
                        <BlogSidebar />
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export const Head = ({ pageContext }) => (
    <SEO
        seoData={pageContext.seoData || {}}
    />
);

export default BlogArchive;