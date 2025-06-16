import { useMemo } from 'react';

// Một hàm helper nhỏ để tạo ra một mảng các số
const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
    totalPages,
    siblingCount = 1,
    boundaryCount = 1,
    currentPage,
}) => {
    const paginationRange = useMemo(() => {
        if (totalPages <= 1) {
            return [];
        }

        // Nếu tổng số trang ít, hiển thị tất cả
        if (totalPages <= 7) {
            return range(1, totalPages);
        }

        // Tính toán vùng sibling (các trang xung quanh current page)
        const leftSibling = Math.max(currentPage - siblingCount, 1);
        const rightSibling = Math.min(currentPage + siblingCount, totalPages);

        // Xác định khi nào cần hiển thị dots
        const showLeftDots = leftSibling > 2; // Thay đổi từ 3 thành 2
        const showRightDots = rightSibling < totalPages - 1; // Thay đổi từ totalPages - 2 thành totalPages - 1

        // Case 1: Không có left dots, có right dots
        // [1, 2, 3, 4, ..., 8] khi currentPage = 1, 2, 3
        if (!showLeftDots && showRightDots) {
            const leftRange = range(1, Math.max(3, rightSibling));
            return [...leftRange, '...', totalPages];
        }

        // Case 2: Có left dots, không có right dots  
        // [1, ..., 5, 6, 7, 8] khi currentPage = 6, 7, 8
        if (showLeftDots && !showRightDots) {
            const rightRange = range(Math.min(leftSibling, totalPages - 2), totalPages);
            return [1, '...', ...rightRange];
        }

        // Case 3: Có cả left và right dots
        // [1, ..., 3, 4, 5, ..., 8] khi currentPage = 4
        if (showLeftDots && showRightDots) {
            const middleRange = range(leftSibling, rightSibling);
            return [1, '...', ...middleRange, '...', totalPages];
        }

        // Case 4: Không có dots nào (fallback)
        return range(1, totalPages);

    }, [totalPages, siblingCount, currentPage, boundaryCount]);

    return paginationRange;
};