import $ from 'jquery';

export function initializeExpertsSlider() {
    // Tìm đến đúng container của slider, và chỉ những slider chưa được khởi tạo
    const sliderElements = document.querySelectorAll('.experts-list:not(.slick-initialized)');

    if (sliderElements.length === 0) {
        return null; // Không có slider nào để khởi tạo
    }

    // console.log(`Initializing ${sliderElements.length} experts sliders.`);

    sliderElements.forEach(slider => {
        $(slider).slick({
            draggable: false,
            dots: false,
            infinite: true,
            lazyLoad: 'ondemand',
            speed: 300,
            centerPadding: "100px",
            slidesToShow: 6,
            slidesToScroll: 1,
            arrows: true,
            responsive: [{
                breakpoint: 1024,
                settings: { slidesToShow: 4, arrows: false, dots: true }
            }, {
                breakpoint: 600,
                settings: { slidesToShow: 2, arrows: false, dots: true }
            }],
        });
    });

    // Trả về hàm cleanup để hủy slider khi chuyển trang
    return () => {
        sliderElements.forEach(slider => {
            if ($(slider).hasClass('slick-initialized')) {
                $(slider).slick('unslick');
            }
        });
    };
}