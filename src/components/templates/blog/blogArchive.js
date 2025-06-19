import React from 'react';
import Layout from '@components/layout';
import SEO from "@components/SEO"
import { useBodyClass } from '@hooks/useBodyClass';

import PostItem from '@components/Blog/PostItem';
import BlogSidebar from '@components/Blog/BlogSidebar';
import Pagination from '@components/Blog/Pagination';

const BlogArchive = ({ pageContext }) => {
    const bodyClass = useBodyClass();
    const { posts, pageNumber, numPages, seoData } = pageContext;

    return (
        <Layout>
            <SEO
                seoData={seoData}
                bodyClass={bodyClass}
            />
            {/* Banner tĩnh */}
            <section className="banner cus-height" style={{ background: "no-repeat center/cover url('https://agencysitestaging.mystagingwebsite.com/wp-content/uploads/2025/03/default-page-banner.jpg')" }}>
                <div className="cus-container h-100">
                    <div className="ast-full-width h-100 ast-flex align-items-center justify-content-center banner-inner">
                        <h1 className="h1-title fw-800 f-soletoxbold text-white text-center">Blogs</h1>
                    </div>
                </div>
            </section>

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
                                basePath="/blogs"
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

export default BlogArchive;