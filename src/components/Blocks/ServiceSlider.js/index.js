import React from 'react';
import ServiceHeroSlider from './ServiceHeroSlider';


function ServiceSlider() {
    // link các ảnh sẽ được truyền vào component ServiceHeroSlider
    const imageData = [
        { src: 'https://agencysitestaging.mystagingwebsite.com/wp-content/uploads/2024/12/new-slider-component-1.jpg', alt: 'slide 1' },
        { src: 'https://agencysitestaging.mystagingwebsite.com/wp-content/uploads/2024/12/new-component-2.png', alt: 'slide 2' },
        { src: 'https://agencysitestaging.mystagingwebsite.com/wp-content/uploads/2024/12/new-component-3.png', alt: 'slide 3' },
    ];

    const backgroundStyle = {
        background: "no-repeat center/cover url('https://a.wellnessclinicmarketing.com/wp-content/uploads/2024/12/slider-iframe-bg.png')"
    };

    return (
        <div className="iframe-slider" style={backgroundStyle}>
            <ServiceHeroSlider images={imageData} />
        </div>
    );
}

export default ServiceSlider;