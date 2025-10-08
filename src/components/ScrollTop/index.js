// // src/components/ScrollTop/index.js

// // import React, { useEffect, useState, useRef } from "react";

// const ScrollTop = (element) => {
//   let throttleTimer = null;

//   // Ẩn element ban đầu
//   element.style.display = 'none';

//   const handleScroll = () => {
//     if (throttleTimer) return;

//     throttleTimer = setTimeout(() => {
//       if (window.scrollY > 300) {
//         element.style.display = 'block';
//       } else {
//         element.style.display = 'none';
//       }
//       throttleTimer = null;
//     }, 200);
//   };

//   const scrollToTop = (e) => {
//     e.preventDefault();
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth"
//     });
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       scrollToTop(e);
//     }
//   };

//   // Add event listeners
//   window.addEventListener("scroll", handleScroll);
//   element.addEventListener("click", scrollToTop);
//   element.addEventListener("keydown", handleKeyDown);

//   // Return cleanup function
//   return () => {
//     window.removeEventListener("scroll", handleScroll);
//     element.removeEventListener("click", scrollToTop);
//     element.removeEventListener("keydown", handleKeyDown);

//     if (throttleTimer) {
//       clearTimeout(throttleTimer);
//     }
//   };
// };

// export default ScrollTop;


// src/components/ScrollTop/index.js

import React, { useEffect, useState, useRef } from "react";

const ScrollTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // useRef để lưu trữ ID của timeout, giúp tránh re-render không cần thiết
  const throttleTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Hàm kiểm tra vị trí cuộn, không thay đổi
      const toggleVisibility = () => {
        if (window.scrollY > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      // --- Phần tối ưu Throttling ---
      // Nếu đang trong thời gian chờ (cooldown), thì không làm gì cả
      if (throttleTimer.current) {
        return;
      }

      // Đặt thời gian chờ, trong lúc này sẽ không xử lý các sự kiện scroll tiếp theo
      throttleTimer.current = setTimeout(() => {
        toggleVisibility();
        // Sau khi chạy xong, xóa timer để lần scroll tiếp theo có thể chạy
        throttleTimer.current = null;
      }, 200); // Chỉ thực thi mỗi 200ms
    };

    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp sự kiện và cả timeout nếu component bị hủy
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, []); // Chỉ chạy một lần

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    // Phần JSX không thay đổi
    isVisible && (
      <div
        id="ast-scroll-top"
        tabIndex="0"
        className="ast-scroll-top-icon ast-scroll-to-top-right"
        data-on-devices="desktop"
        onClick={scrollToTop}
        onKeyDown={(e) => e.key === 'Enter' && scrollToTop()}
        role="button"
        aria-label="Scroll to top"
        style={{ display: 'block' }} // Thay thuộc tính display thành style
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