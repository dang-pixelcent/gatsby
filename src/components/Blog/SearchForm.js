import React, { useState } from 'react';
import { navigate } from 'gatsby'; // Import navigate từ Gatsby

const SearchForm = () => {
    // Sử dụng biến môi trường cho WordPress URL
    const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL
    const siteBaseUrl = process.env.GATSBY_SITE_URL
    const [query, setQuery] = useState('');

    const handleSubmit = (event) => {
        // Ngăn chặn hành vi mặc định của form (tải lại trang)
        event.preventDefault();

        // Chỉ điều hướng nếu người dùng có nhập gì đó
        if (query.trim()) {
            // Dùng navigate của Gatsby để chuyển đến trang kết quả tìm kiếm
            // và truyền từ khóa tìm kiếm qua URL parameter
            navigate(`/blogs/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="search">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="q"
                    className="search-bar"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">
                    <img src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/search.svg`} alt="Search" />
                </button>
            </form>
        </div>
    );
};

export default SearchForm;