// components/CookieBanner.tsx
import React, { useState, useEffect } from "react";
import "./CookieBanner.scss"; // Nhớ import file CSS vào đây!

// const CookieBannerProps = {
//   onAccept: () => void,
//   onDecline: () => void
// };

const COOKIE_KEY =
  process.env.GATSBY_COOKIE_CONSENT_KEY || "default_site_cookie_v1";

// Export để các component khác có thể xài lại hàm check cookie
export function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/`;
}

const CookieBanner = ({ onAccept, onDecline }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const consent = getCookie(COOKIE_KEY);
    if (!consent) {
      setIsExpanded(true);
    } else if (consent === "true") {
      onAccept();
    }
  }, []);

  const handleAccept = () => {
    setCookie(COOKIE_KEY, "true", 365);
    setIsExpanded(false);
    onAccept();

    // Phát sự kiện toàn cục để Home và Layout biết mà thả Script ra
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cookie_consent_accepted"));
    }
  };

  const handleDecline = () => {
    // 1. Kiểm tra xem trước đó khách đã Accept chưa?
    const previousConsent = getCookie(COOKIE_KEY);

    // 2. Cập nhật lại Cookie thành false
    setCookie(COOKIE_KEY, "false", 365);
    setIsExpanded(false);
    onDecline();

    // 3. Nếu khách đang "quay xe" (từ true chuyển sang false) -> Ép Reload để dọn rác
    if (previousConsent === "true" && typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="openBtnCookie"
        aria-label="Open Cookie Consent Manager"
      >
        Manage consent
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Manage Consent"
      className="cookie-banner-wrapper"
      style={{
        zIndex: 999999999, // Đảm bảo banner luôn nằm trên cùng
      }}
    >
      {/* Drag handle - chỉ hiện trên mobile */}
      <div className="cookie-banner-drag">
        <div className="cookie-banner-drag-line" />
      </div>

      {/* Header */}
      <div className="cookie-banner-header">
        <span className="cookie-banner-title">Manage Consent</span>
        <button
          onClick={handleClose}
          aria-label="Close"
          className="cookie-banner-close"
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="cookie-banner-body">
        <p className="cookie-banner-text">
          To provide the best experiences, we use technologies like cookies to
          store and/or access device information. Consenting to these
          technologies will allow us to process data such as browsing behavior
          or unique IDs on this site. Not consenting or withdrawing consent, may
          adversely affect certain features and functions.
        </p>
      </div>

      {/* Accept Button */}
      <div className="cookie-banner-action">
        <button onClick={handleAccept} className="cookie-banner-accept-btn">
          Accept
        </button>
      </div>

      {/* Footer links */}
      <div className="cookie-banner-footer">
        <button onClick={handleDecline} className="cookie-banner-link-btn">
          Opt-out preferences
        </button>
        <a href="/privacy-policy" className="cookie-banner-link-btn">
          Privacy Statement
        </a>
      </div>

      {/* Safe area padding cho iPhone có notch */}
      <div className="cookie-banner-safe-area" />
    </div>
  );
};

export default CookieBanner;
