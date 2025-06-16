import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

const BlogSidebar = () => {
      // Sử dụng biến môi trường cho WordPress URL
  const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL
  const siteBaseUrl = process.env.GATSBY_SITE_URL
    // Query này chạy độc lập để lấy 5 bài viết mới nhất
    const data = useStaticQuery(graphql`
        query RecentPostsSidebarQuery {
            cms {
                posts(first: 5, where: {orderby: {field: DATE, order: DESC}}) {
                    nodes {
                        id
                        title
                        uri
                        featuredImage {
                            node {
                                sourceUrl
                                altText
                            }
                        }
                    }
                }
            }
        }
    `);

    const recentPosts = data.cms.posts.nodes;

    return (
        <div className="recent-posts">
            <div className="recent">
                {/* NOTE: Phần Search và các widget quảng cáo có thể được thêm vào đây dưới dạng component riêng
                    hoặc được quản lý qua một hệ thống widget trong tương lai. 
                    Ở đây chúng ta tập trung vào Recent Posts. */}
                <div className="widget-get-book">
                    <div className="widget-title">GET FREE BOOK</div>
                    <div className="widget-content">
                        <img decoding="async" src={`${WP_BASE_URL}/wp-content/uploads/2025/04/get-book.png`} alt=""/>
                            <div className="name">Alex Sidorenkov</div>
                            <div className="position">Grow Your Medical Wellness Practice</div>
                            <div className="sc-btn"><a href="https://e.wellnessclinicmarketing.com/free-book/" target="_blank" rel="noopener noreferrer" className="bg-btn">Get Your Free Copy</a></div>
                    </div>
                </div>
                <aside id="block-8" className="widget widget_block"><div className="widget-doctor">
                    <div className="widget-doctor-inner">
                        <figure><img decoding="async" src={`${WP_BASE_URL}/wp-content/uploads/2025/04/widget-doctor-alex.png`} alt=""/></figure>
                        <div className="widget-content">
                            <div className="title">Meet the Man Behind the Book</div>
                            <div className="name">Alex Sidorenkov</div>
                            <div className="desc">Founder of the leading medical wellness marketing agency, Alex has helped hundreds of practices grow their revenue and patient flow. His work has taken many from startup to dominating local search, with some reaching over 200 new patients per month and even $1M in monthly sales. Now, he's sharing that experience with you.</div>
                        </div>
                    </div>
                </div></aside>
                <div className="widget-recent-post">
                    <h4 className="recent-title">Recent Posts</h4>
                    <div className="recent-items">
                        {recentPosts.map(post => (
                            <Link to={post.uri} key={post.id} className="item">
                                <div className="image">
                                    <img
                                        src={post.featuredImage?.node?.sourceUrl || 'https://via.placeholder.com/60'}
                                        alt={post.featuredImage?.node?.altText || post.title}
                                    />
                                </div>
                                <div className="recent-info">
                                    <div className="title">{post.title}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogSidebar;