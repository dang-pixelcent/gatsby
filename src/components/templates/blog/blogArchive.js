import React, { Suspense } from 'react';
import Layout from '@components/layout';
import { SEO } from "@components/SEO";
import loadable from '@loadable/component';

import PostItem from '@components/Blog/PostItem';
import BlogSidebar from '@components/Blog/BlogSidebar';
const Pagination = loadable(() => import('@components/Blog/Pagination'));

const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL;
const BlogArchive = ({ pageContext }) => {
    const { posts, pageNumber, numPages, pageInfo } = pageContext;

    const bannerBlogs = (
        <section className="banner cus-height" style={{ background: `no-repeat center/cover url('${WP_BASE_URL}/wp-content/uploads/2025/03/default-page-banner.jpg')` }}>
            <div className="cus-container h-100">
                <div className="ast-full-width h-100 ast-flex align-items-center justify-content-center banner-inner">
                    <h1 className="h1-title fw-800 f-soletoxbold text-white text-center">{pageInfo ? pageInfo.name : ''}</h1>
                </div>
            </div>
        </section>
    );

    const bannerCategory = (
        <section className="banner cus-height" style={{ background: `no-repeat center/cover #0659A9 url('${WP_BASE_URL}/wp-content/uploads/2025/03/default-page-banner.jpg')` }}>
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
                            <Suspense fallback={<div></div>}>
                                <Pagination
                                    currentPage={pageNumber}
                                    numPages={numPages}
                                    basePath={`${pageInfo ? `${pageInfo.uri}` : null}`}
                                />
                            </Suspense>
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
        schemas={pageContext.schemas || []}
    />
);

export default BlogArchive;