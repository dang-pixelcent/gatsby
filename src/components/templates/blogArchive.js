import React from 'react';
import Layout from '../layout';
import PostItem from '../Blog/PostItem';
import BlogSidebar from '../Blog/BlogSidebar';
import Pagination from '../Blog/Pagination';

const BlogArchive = ({ pageContext }) => {
    const { posts, pageNumber, numPages } = pageContext;

    return (
        <Layout>
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