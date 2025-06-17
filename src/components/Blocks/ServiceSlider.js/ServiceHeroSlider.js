// src/components/ServiceHeroSlider.js

import React from "react";
import Slider from "react-slick";

// Component này giờ nhận vào một mảng các ảnh
const ServiceHeroSlider = ({ images }) => {
    // Nếu không có ảnh thì không render gì cả
    if (!images || images.length === 0) {
        return null;
    }

    const settings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
        cssEase: 'ease',
        speed: 1500,
        arrows: false,
        dots: false,
    };

    return (
        <div className="service-slider-hero">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="slide">
                        <img src={image.src} alt={image.alt || `Slide ${index + 1}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ServiceHeroSlider;