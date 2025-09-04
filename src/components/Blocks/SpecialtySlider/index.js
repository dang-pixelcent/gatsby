// src/components/Blocks/SpecialtySliderFromHtml.js

import React, { useMemo } from 'react';
import Slider from 'react-slick'; // Dùng lại react-slick cho nhất quán
import parse from 'html-react-parser';
import { Link } from 'gatsby'; // Dùng Link của Gatsby cho internal link

// Import CSS cho react-slick nếu bạn chưa làm ở layout chính
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const SpecialtySliderFromHtml = ({ htmlContent }) => {

  // BƯỚC 1: Phân tích HTML và trích xuất dữ liệu
  const slidesData = useMemo(() => {
    const data = [];
    if (!htmlContent) return data;

    // Dùng parse để duyệt qua cây DOM ảo của chuỗi HTML
    parse(htmlContent, {
      replace: (domNode) => {
        // Chỉ xử lý nếu gặp đúng container của chúng ta
        if (domNode.attribs && domNode.attribs.class?.includes('specialty-list')) {
          
          // Lặp qua từng slide con
          domNode.children.forEach(slideWrapperNode => {
            // Đảm bảo node là một thẻ và có class 's-box-slide'
            if (slideWrapperNode.type === 'tag' && slideWrapperNode.attribs?.class === 's-box-slide') {
              try {
                // Đi sâu vào cấu trúc để lấy các phần tử cần thiết
                const linkNode = slideWrapperNode.children[0].children[1].children[0];
                const imageNode = linkNode.children[0].children[0];
                const titleNode = linkNode.children[1].children[0].children[0];

                // Thêm dữ liệu đã trích xuất vào mảng
                data.push({
                  href: linkNode.attribs.href || '#',
                  imgSrc: imageNode.attribs.src,
                  imgAlt: imageNode.attribs.alt || 'Specialty Image',
                  title: titleNode.data,
                });

              } catch (e) {
                // Bỏ qua nếu cấu trúc HTML không đúng, tránh làm sập trang
                console.warn("Could not parse a slide, its HTML structure might have changed.", e);
              }
            }
          });
        }
        // return <></>; // Chúng ta không render gì từ HTML gốc cả
      },
    });

    return data;
  }, [htmlContent]); // Chỉ chạy lại khi HTML thay đổi

  // Nếu không trích xuất được slide nào, không render gì cả
  if (!slidesData.length) {
    return null;
  }

  // BƯỚC 2: Render một slider react-slick mới từ dữ liệu đã trích xuất
  // Bạn có thể copy lại settings từ trang home viết lại của mình
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    // ...dán các settings khác của bạn vào đây...
    responsive: [
        {
          breakpoint: 1200,
          settings: { slidesToShow: 3 }
        },
        {
          breakpoint: 768,
          settings: { slidesToShow: 1 }
        }
    ]
  };

  return (
    <div className="section sc-specialty slick-rebuilt-wrapper">
        <Slider {...settings}>
            {slidesData.map((slide, index) => (
                // Tái tạo lại cấu trúc slide bằng JSX
                <div key={index} className="s-box-slide">
                    <div className="s-box position-relative">
                        {/* SVG có thể giữ nguyên hoặc tạo component riêng nếu muốn */}
                        <div className="s-box-inner">
                            <Link to={slide.href}>
                                <figure className="mb-0">
                                    <img src={slide.imgSrc} alt={slide.imgAlt} />
                                </figure>
                                <div className="s-content">
                                    <h3 className="h3-title f-soleto fw-700 fs-32 mb-0">
                                        {slide.title}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </Slider>
    </div>
  );
};

export default SpecialtySliderFromHtml;