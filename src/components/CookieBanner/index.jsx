// components/CookieBanner.tsx
import React, { useState, useEffect } from "react";
import PreferenceItem from "./_components/PreferenceItem";
import "./_scss/styles.scss";

export const COOKIE_KEY =
  process.env.GATSBY_COOKIE_CONSENT_KEY || "default_agency_site_cookie_v1";

export function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name, value, days) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/`;
}

const CookieBanner = ({ onAccept, onDecline }) => {
  // Đổi tên state cho chuẩn logic: Bảng có đang được phóng to hay không?
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. STATE MỚI: Quản lý việc đang ở màn hình Banner hay màn hình Cài đặt chi tiết
  const [showPreferences, setShowPreferences] = useState(false);

  // 2. STATE MỚI: Lưu trữ trạng thái của các nút Toggle
  const [prefs, setPrefs] = useState({
    functional: true, // Luôn luôn true, không cho tắt
    statistics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = getCookie(COOKIE_KEY);
    if (!consent) {
      setIsExpanded(true);
    } else {
      try {
        if (consent === "true") {
          const allTrue = {
            functional: true,
            statistics: true,
            marketing: true,
          };
          setPrefs(allTrue); // Đồng bộ UI
          onAccept(allTrue);
        } else if (consent === "false") {
          const allFalse = {
            functional: true,
            statistics: false,
            marketing: false,
          };
          setPrefs(allFalse); // Đồng bộ UI
          onDecline();
        } else {
          // Khách đã save Object -> Lấy object đó đắp vào State
          const parsedPrefs = JSON.parse(consent);
          setPrefs(parsedPrefs); // Cập nhật đúng các toggle đã gạt
          onAccept(parsedPrefs);
        }
      } catch (e) {
        setIsExpanded(true);
      }
    }
  }, []);

  // KHÁCH BẤM ACCEPT ALL
  const handleAcceptAll = () => {
    const allTrue = { functional: true, statistics: true, marketing: true };
    setCookie(COOKIE_KEY, JSON.stringify(allTrue), 365);

    setPrefs(allTrue);

    setIsExpanded(false);
    setShowPreferences(false);
    onAccept(allTrue);
  };

  // KHÁCH BẤM SAVE PREFERENCES
  const handleSavePreferences = () => {
    // Lấy trạng thái cũ trong Cookie trước khi ghi đè
    const previousConsent = getCookie(COOKIE_KEY);

    // Ghi đè trạng thái mới vào Cookie
    setCookie(COOKIE_KEY, JSON.stringify(prefs), 365);
    setIsExpanded(false);
    setShowPreferences(false);

    // Kiểm tra xem khách có đang "Hạ cấp" quyền không?
    let isDowngrading = false;
    if (previousConsent) {
      try {
        if (previousConsent === "true") {
          // Đang bật hết mà giờ chuyển sang save custom -> chắc chắn là hạ cấp
          isDowngrading = true;
        } else if (previousConsent !== "false") {
          const oldPrefs = JSON.parse(previousConsent);
          // Tắt statistics đang bật HOẶC tắt marketing đang bật
          if (
            (oldPrefs.statistics && !prefs.statistics) ||
            (oldPrefs.marketing && !prefs.marketing)
          ) {
            isDowngrading = true;
          }
        }
      } catch (e) {}
    }

    if (!prefs.statistics && !prefs.marketing) {
      onDecline();
    } else {
      onAccept(prefs);
    }

    // Nếu có "Quay xe" tắt bớt quyền -> Buộc reload để xoá script cũ đang chạy trên DOM
    if (isDowngrading && typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // KHÁCH BẤM DENY ALL
  const handleDeclineAll = () => {
    const allFalse = { functional: true, statistics: false, marketing: false };
    const previousConsent = getCookie(COOKIE_KEY);

    setCookie(COOKIE_KEY, JSON.stringify(allFalse), 365);

    setPrefs(allFalse);

    setIsExpanded(false);
    setShowPreferences(false);
    onDecline();

    if (
      previousConsent &&
      previousConsent !== "false" &&
      typeof window !== "undefined"
    ) {
      window.location.reload();
    }
  };

  // NẾU KHÔNG PHÓNG TO -> HIỂN THỊ NÚT MINI Ở GÓC PHẢI
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="cookie-consent-trigger"
        aria-label="Open Cookie Consent Manager"
      >
        Manage consent
      </button>
    );
  }

  // NẾU ĐANG PHÓNG TO -> HIỂN THỊ BẢNG FULL NHƯ CŨ
  return (
    <div
      role="dialog"
      aria-label="Manage Consent"
      className="cookie-consent-box"
    >
      {/* Drag handle - chỉ hiện trên mobile */}
      <div className="cookie-consent-box__drag-wrap">
        <div className="cookie-consent-box__drag-handle" />
      </div>

      {/* Header */}
      <div className="cookie-consent-box__header">
        <span className="cookie-consent-box__title">Manage Consent</span>
      </div>

      {/* Body */}

      <div className="cookie-consent-box__body">
        <p className="cookie-consent-box__description">
          To provide the best experiences, we use technologies like cookies to
          store and/or access device information. Consenting to these
          technologies will allow us to process data such as browsing behavior
          or unique IDs on this site. Not consenting or withdrawing consent, may
          adversely affect certain features and functions.
        </p>
      </div>
      {showPreferences && (
        <div className="cookie-consent-box__preferences-wrap">
          <div className="cookie-consent-box__preferences-scroll-shell">
            <div className="prefs-scroll cookie-consent-box__preferences-list">
              {/* ── Functional ── */}
              <PreferenceItem
                label="Functional"
                description="The technical storage or access is strictly necessary for the legitimate purpose of enabling the use of a specific service explicitly requested by the subscriber or user, or for the sole purpose of carrying out the transmission of a communication over an electronic communications network."
                isAlwaysActive
              />

              {/* ── Statistics ── */}
              <PreferenceItem
                label="Statistics"
                description="The technical storage or access that is used exclusively for statistical purposes."
                checked={prefs.statistics}
                onChange={(v) => setPrefs({ ...prefs, statistics: v })}
              />

              {/* ── Marketing ── */}
              <PreferenceItem
                label="Marketing"
                description="The technical storage or access is required to create user profiles to send advertising, or to track the user on a website or across several websites for similar marketing purposes."
                checked={prefs.marketing}
                onChange={(v) => setPrefs({ ...prefs, marketing: v })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Accept Button */}
      <div className="cookie-consent-box__actions">
        <button
          onClick={handleAcceptAll}
          className="cookie-consent-box__action cookie-consent-box__action--primary"
        >
          Accept
        </button>

        <button
          onClick={handleDeclineAll}
          className="cookie-consent-box__action cookie-consent-box__action--secondary"
        >
          Deny
        </button>

        {!showPreferences ? (
          <button
            onClick={() => setShowPreferences(true)}
            className="cookie-consent-box__action cookie-consent-box__action--secondary"
          >
            View preferences
          </button>
        ) : (
          <button
            onClick={handleSavePreferences}
            className="cookie-consent-box__action cookie-consent-box__action--secondary"
          >
            Save preferences
          </button>
        )}
      </div>

      {/* Footer links */}
      <div className="cookie-consent-box__footer">
        <a href="/privacy-policy" className="cookie-consent-box__footer-link">
          Cookie Policy
        </a>
      </div>

      {/* Safe area padding cho iPhone có notch */}
      <div className="cookie-consent-box__safe-area" />
    </div>
  );
};

export default CookieBanner;
