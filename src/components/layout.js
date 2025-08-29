import React, { useState, useEffect, useCallback, useRef } from "react"
import Header from './Header'
import Footer from './Footer'
import ScrollTop from "./ScrollTop";
import { useLocation } from "@reach/router"
import { Script } from "gatsby"

// Simple debounce implementation
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const DefaultLayout = ({ children }) => {
  const location = useLocation();
  const [bodyClass, setBodyClass] = useState("");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastWidthRef = useRef(0);

  const updateBodyClass = useCallback(() => {
    const currentWidth = window.innerWidth;

    // Only update if width changed significantly (5px threshold)
    if (Math.abs(currentWidth - lastWidthRef.current) > 5) {
      const isMobile = currentWidth <= 921;
      const isHomePage = location.pathname === '/';

      let classes = [
        "wp-custom-logo",
        "wp-theme-astra",
        "wp-child-theme-agencymarketing",
        "mega-menu-primary",
        "ast-plain-container",
        "ast-no-sidebar",
        "astra-4.11.1",
        "ast-single-post",
        "ast-inherit-site-logo-transparent",
        "ast-theme-transparent-header",
        "ast-hfb-header",
        "ast-sticky-main-shrink",
        "ast-sticky-above-shrink",
        "ast-sticky-below-shrink",
        "ast-sticky-header-shrink",
        "ast-inherit-site-logo-sticky",
        "ast-primary-sticky-enabled",
        "astra-addon-4.11.0"
      ];

      if (isMobile) {
        classes.push("ast-header-break-point");
        if (isMobileMenuOpen) {
          classes.push("ast-main-header-nav-open");
        }
      } else {
        classes.push("ast-desktop");
      }

      if (isHomePage) {
        classes.push("page-template-front-page");
      }

      setBodyClass(classes.join(" "));
      lastWidthRef.current = currentWidth;
    }
  }, [location.pathname, isMobileMenuOpen]);

  useEffect(() => {
    // Create debounced version
    const debouncedUpdate = debounce(updateBodyClass, 100);

    // Initial call
    updateBodyClass();

    // Add resize event with debounce
    window.addEventListener('resize', debouncedUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, [updateBodyClass]);

  useEffect(() => {
    // Use requestAnimationFrame to avoid forced reflow
    const rafId = requestAnimationFrame(() => {
      document.body.className = bodyClass;
    });

    return () => {
      cancelAnimationFrame(rafId);
      // Cleanup also in requestAnimationFrame
      requestAnimationFrame(() => {
        if (document.body.className === bodyClass) {
          document.body.className = '';
        }
      });
    };
  }, [bodyClass]);

  return (
    <div>
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {children}
      <Footer />
      <ScrollTop />

      <Script
        src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"
        strategy="idle"
        onLoad={() => {
          if (window.AOS) {
            window.AOS.init({ offset: 150 });
          }
        }}
      />
    </div>
  )
}

export default DefaultLayout;