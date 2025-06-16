import React from 'react';
import { Link } from 'gatsby';

// Component nhận vào một object 'post' qua props
const PostItem = ({ post }) => {
    // Lấy ảnh đại diện một cách an toàn
    const featuredImage = post.featuredImage?.node;

    return (
        <div className="item ast-flex">
            <div className="image">
                <Link to={post.uri}>
                    {featuredImage ? (
                        <img src={featuredImage.sourceUrl} alt={featuredImage.altText || post.title} />
                    ) : (
                        // Cung cấp một ảnh placeholder nếu bài viết không có ảnh đại diện
                        <div style={{ aspectRatio: '318 / 284', background: '#e0e0e0' }} />
                    )}
                </Link>
            </div>
            <div className="info">
                {/* Toàn bộ khối info cũng là một link */}
                <Link to={post.uri}>
                    <h3 className="blog-title">{post.title}</h3>
                    {/* Dùng dangerouslySetInnerHTML để render đúng định dạng của đoạn trích */}
                    <div className="description" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                </Link>
                <div className="div-button">
                    <Link to={post.uri} className="button-link">Read more</Link>
                    {/* Phần social có thể thêm vào đây nếu cần */}
                </div>
            </div>
        </div>
    );
};

export default PostItem;