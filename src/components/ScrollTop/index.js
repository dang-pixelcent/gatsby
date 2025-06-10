// src/components/ScrollTop/index.js

import React, { useEffect, useState } from "react";

const ScrollTop = () => {
  // 1. Dùng state để theo dõi việc có nên hiển thị nút hay không
  const [isVisible, setIsVisible] = useState(false);

  // 2. useEffect để lắng nghe sự kiện cuộn
  useEffect(() => {
    // Hàm kiểm tra vị trí cuộn
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Lắng nghe sự kiện scroll
    window.addEventListener("scroll", toggleVisibility);

    // Dọn dẹp sự kiện khi component bị hủy
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // 3. Hàm xử lý khi nhấn vào nút
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Tạo hiệu ứng cuộn mượt mà
    });
  };

  return (
    // Chỉ render nút khi isVisible là true
    isVisible && (
      <div 
        id="ast-scroll-top" 
        tabIndex="0" 
        className="ast-scroll-top-icon ast-scroll-to-top-right" 
        data-on-devices="desktop"
        onClick={scrollToTop} // Gắn sự kiện click
        onKeyDown={(e) => e.key === 'Enter' && scrollToTop()} // Hỗ trợ cho bàn phím
        role="button" // Thêm vai trò cho accessibility
        aria-label="Scroll to top"
        display="block" // Đảm bảo nút hiển thị
      >
        <span className="ast-icon icon-arrow">
          <svg className="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enableBackground="new 57 35.171 26 16.043" xmlSpace="preserve">
            <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z"></path>
          </svg>
        </span>
        <span className="screen-reader-text">Scroll to Top</span>
      </div>
    )
  );
};

export default ScrollTop;