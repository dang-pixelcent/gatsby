// src/script-handlers/load-more-handler.js

/**
 * Tìm và gắn sự kiện cho nút "Load More" có class '.loadmore'.
 * @returns {function|null} - Trả về hàm dọn dẹp để gỡ bỏ sự kiện.
 */
export const initializeLoadMore = () => {
    const loadMoreBtn = document.querySelector(".loadmore");
    const items = document.querySelectorAll(".item");

    if (!loadMoreBtn || items.length === 0) {
        return null;
    }

    // Hiển thị 9 mục đầu tiên
    for (let i = 0; i < Math.min(9, items.length); i++) {
        items[i].classList.add("show");
    }

    // Nếu tất cả đã hiển thị, xóa nút
    if (document.querySelectorAll(".item:not(.show)").length === 0) {
        loadMoreBtn.remove();
        return null;
    }

    const handleClick = (e) => {
        e.preventDefault();
        const hiddenItems = document.querySelectorAll(".item:not(.show)");
        for (let i = 0; i < Math.min(9, hiddenItems.length); i++) {
            hiddenItems[i].classList.add("show");
        }

        if (document.querySelectorAll(".item:not(.show)").length === 0) {
            loadMoreBtn.remove();
        }
    };

    loadMoreBtn.addEventListener("click", handleClick);

    // Trả về hàm dọn dẹp
    return () => {
        // Cần kiểm tra lại vì nút có thể đã bị xóa
        const btn = document.querySelector(".loadmore");
        if (btn) {
            btn.removeEventListener("click", handleClick);
        }
    };
};