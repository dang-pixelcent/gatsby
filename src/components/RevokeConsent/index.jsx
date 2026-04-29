// components/RevokeConsent.jsx
import React from "react";

// Thay tên cookie cho khớp với dự án của bạn
const COOKIE_KEY =
  process.env.GATSBY_COOKIE_CONSENT_KEY || "default_site_cookie_v1";

const RevokeConsent = () => {
  const handleRevoke = () => {
    // 1. Xóa cookie bằng cách set ngày hết hạn về quá khứ (Năm 1970)
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

      // 2. Tải lại trang để dọn sạch các script tracking đang chạy
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleRevoke}
      style={{
        background: "transparent",
        border: "none",
        color: "#1a6fd4", // Màu link
        fontSize: "13px",
        cursor: "pointer",
        textDecoration: "underline",
        padding: "0",
      }}
    >
      Cookie Preferences
    </button>
  );
};

export default RevokeConsent;
