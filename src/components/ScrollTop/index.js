// src/components/ScrollTop/index.js

// import React, { useEffect, useState, useRef } from "react";

const ScrollTop = (element) => {
  let throttleTimer = null;

  // Ẩn element ban đầu
  element.style.display = 'none';

  const handleScroll = () => {
    if (throttleTimer) return;

    throttleTimer = setTimeout(() => {
      if (window.scrollY > 300) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
      throttleTimer = null;
    }, 200);
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      scrollToTop(e);
    }
  };

  // Add event listeners
  window.addEventListener("scroll", handleScroll);
  element.addEventListener("click", scrollToTop);
  element.addEventListener("keydown", handleKeyDown);

  // Return cleanup function
  return () => {
    window.removeEventListener("scroll", handleScroll);
    element.removeEventListener("click", scrollToTop);
    element.removeEventListener("keydown", handleKeyDown);

    if (throttleTimer) {
      clearTimeout(throttleTimer);
    }
  };
};

export default ScrollTop;