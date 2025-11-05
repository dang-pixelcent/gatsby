import React from 'react';
import $ from 'jquery';
import 'slick-carousel/slick/slick.min.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export function initializeSpecialtySlider() {
    // Tìm đến đúng container của slider, và chỉ những slider chưa được khởi tạo
    const sliderElements = document.querySelectorAll('.specialty-list:not(.slick-initialized)');

    if (sliderElements.length === 0) {
        return null; // Không có slider nào để khởi tạo
    }

    // console.log(`Initializing ${sliderElements.length} specialty sliders.`);

    sliderElements.forEach(slider => {
        $(slider).slick({
            dots: false,
            infinite: true,
            speed: 300,
            centerPadding: "100px",
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: true,
            draggable: true, // Cho phép drag
            swipe: true,     // Cho phép swipe
            touchMove: true, // Cho phép touch move
            prevArrow: '<div class="slick-arrow slick-prev"><svg width="54" height="100" viewBox="0 0 54 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M52.3223 93.129C53.0704 93.8873 53.4898 94.9096 53.4898 95.9748C53.4898 97.04 53.0704 98.0623 52.3223 98.8206C51.9544 99.1941 51.516 99.4908 51.0324 99.6933C50.5488 99.8957 50.0298 100 49.5056 100C48.9813 100 48.4623 99.8957 47.9787 99.6933C47.4951 99.4908 47.0567 99.1941 46.6888 98.8206L1.16748 52.8458C0.419413 52.0875 0 51.0652 0 50C0 48.9348 0.419413 47.9125 1.16748 47.1542L46.6888 1.17939C47.0567 0.805857 47.4951 0.509222 47.9787 0.306747C48.4623 0.104272 48.9813 0 49.5056 0C50.0298 0 50.5488 0.104272 51.0324 0.306747C51.516 0.509222 51.9544 0.805857 52.3223 1.17939C53.0704 1.93767 53.4898 2.96002 53.4898 4.0252C53.4898 5.09038 53.0704 6.11272 52.3223 6.87101L10.8066 50.0029L52.3223 93.129Z" fill="#0568B9" /></svg></div>',
            nextArrow: '<div class="slick-arrow slick-next"><svg width="54" height="100" viewBox="0 0 54 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.16793 93.129C0.419865 93.8873 0.000442505 94.9096 0.000442505 95.9748C0.000442505 97.04 0.419865 98.0623 1.16793 98.8206C1.53579 99.1941 1.97426 99.4908 2.45784 99.6933C2.94141 99.8957 3.46042 100 3.98467 100C4.50892 100 5.02794 99.8957 5.51152 99.6933C5.99509 99.4908 6.43356 99.1941 6.80142 98.8206L52.3228 52.8458C53.0708 52.0875 53.4902 51.0652 53.4902 50C53.4902 48.9348 53.0708 47.9125 52.3228 47.1542L6.80142 1.17939C6.43356 0.805857 5.99509 0.509222 5.51152 0.306747C5.02794 0.104272 4.50892 0 3.98467 0C3.46042 0 2.94141 0.104272 2.45784 0.306747C1.97426 0.509222 1.53579 0.805857 1.16793 1.17939C0.419865 1.93767 0.000442505 2.96002 0.000442505 4.0252C0.000442505 5.09038 0.419865 6.11272 1.16793 6.87101L42.6836 50.0029L1.16793 93.129Z" fill="#0568B9" /></svg></div>',
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    arrows: true,
                    dots: true,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    arrows: true,
                    dots: true,
                }
            },
            ],
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