import React from 'react';
import { Link } from 'gatsby';
import { usePagination } from '../../hooks/usePagination';

const Pagination = ({ currentPage, numPages, basePath }) => {
    const paginationRange = usePagination({
        currentPage,
        totalPages: numPages,
        siblingCount: 1,
        boundaryCount: 1,
    });

    // Kiểm tra xem basePath có được truyền vào không
    if (!basePath) {
        console.error("Pagination component requires a basePath prop.");
        return null;
    }

    if (numPages <= 1) {
        return null;
    }

    // loại bỏ dấu gạch chéo cuối cùng nếu có
    if (basePath.endsWith('/')) {
        basePath = basePath.slice(0, -1);
    }

    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;

    // Sửa đổi ở đây: Kiểm tra xem basePath có chứa query param không
    const getPageLink = (page) => {
        if (basePath.includes('?')) {
            // Dành cho trang tìm kiếm (ví dụ: /blogs/search?q=abc&)
            return `${basePath}page=${page}`;
        }
        // Dành cho trang blog chính
        return page === 1 ? basePath : `${basePath}/page/${page}`;
    };

    const prevPage = getPageLink(currentPage - 1);
    const nextPage = getPageLink(currentPage + 1);

    return (
        <div className="page-navigation">
            {!isFirst && (
                <Link className="button" to={prevPage} rel="prev">&lt;</Link>
            )}

            {paginationRange.map((page, index) => {
                if (typeof page === 'string') {
                    return <span key={`dots-${index}`} className="button dots">&hellip;</span>;
                }
                return (
                    <Link
                        key={`pagination-number-${page}`}
                        className={`button ${page === currentPage ? 'active' : ''}`}
                        to={getPageLink(page)}
                    >
                        {page}
                    </Link>
                );
            })}

            {!isLast && (
                <Link className="button" to={nextPage} rel="next">&gt;</Link>
            )}
        </div>
    );
};

export default Pagination;