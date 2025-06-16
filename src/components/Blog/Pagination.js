import React from 'react';
import { Link } from 'gatsby';
import { usePagination } from '../../hooks/usePagination'; 

const Pagination = ({ currentPage, numPages, basePath }) => {
    const paginationRange = usePagination({
        currentPage,
        totalPages: numPages,
        siblingCount: 2, // Thay đổi từ 2 về 1
        boundaryCount: 1, // Có thể tùy chỉnh
    });

    if (numPages <= 1) {
        return null;
    }

    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;
    const prevPage = currentPage - 1 === 1 ? basePath : `${basePath}/page/${currentPage - 1}`;
    const nextPage = `${basePath}/page/${currentPage + 1}`;

    return (
        <div className="page-navigation">
            {/* Nút Previous */}
            {!isFirst && (
                <Link className="button" to={prevPage} rel="prev">&lt;</Link>
            )}

            {paginationRange.map((page, index) => {
                // Nếu là dấu "...", render ra một thẻ span không click được
                if (typeof page === 'string') {
                    return <span key={`dots-${index}`} className="button dots">&hellip;</span>;
                }

                // Nếu là một số, render ra Link
                const pageLink = page === 1 ? basePath : `${basePath}/page/${page}`;
                return (
                    <Link
                        key={`pagination-number-${page}`}
                        className={`button ${page === currentPage ? 'active' : ''}`}
                        to={pageLink}
                    >
                        {page}
                    </Link>
                );
            })}

            {/* Nút Next */}
            {!isLast && (
                <Link className="button" to={nextPage} rel="next">&gt;</Link>
            )}
        </div>
    );
};

export default Pagination;