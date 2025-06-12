// src/script-handlers/slick-carousel-handler.js

// Hàm trợ giúp để tải CSS, đảm bảo không tải lại
const loadStylesheet = (href, id) => {
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.id = id;
    document.head.appendChild(link);
};

// Hàm trợ giúp để tải script
const loadScript = (src, id) => new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
        resolve();
        return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.id = id;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
});

/**
 * Tìm và khởi tạo tất cả các slider có class '.gallery-slider'.
 * @returns {null} - Handler này không cần hàm dọn dẹp.
 */
export const initializeSlickCarousel = async () => {
    // Chỉ chạy nếu có slider trên trang
    if (document.querySelectorAll(".gallery-slider").length === 0) {
        return null;
    }

    try {
        // Tải các file CSS cần thiết
        loadStylesheet("https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css", "slick-css");
        loadStylesheet("https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css", "slick-theme-css");

        // Tải các file JS tuần tự
        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js", "jquery-script");
        await loadScript("https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js", "slick-script");

        // Khởi tạo slider
        if (window.jQuery && window.jQuery.fn.slick) {
            window.jQuery(".gallery-slider").slick({
                centerMode: false,
                slidesToShow: 2,
                variableWidth: true,
                swipeToSlide: true,
                autoplay: false,
                prevArrow: "<button class='slick-prev slick-arrow'>...</button>", // (giữ nguyên SVG của bạn)
                nextArrow: "<button class='slick-next slick-arrow'>...</button>", // (giữ nguyên SVG của bạn)
                responsive: [
                    // ... (giữ nguyên các cài đặt responsive của bạn)
                ]
            });
        }
    } catch (error) {
        console.error("Lỗi khi khởi tạo Slick Carousel:", error);
    }

    return null; // Không cần hàm dọn dẹp vì thư viện tự quản lý
};