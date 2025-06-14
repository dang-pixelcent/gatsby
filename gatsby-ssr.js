import React from "react";
import parse from 'html-react-parser'; // Import thư viện

// Hàm để tải tracking codes từ cache
const loadTrackingCodesFromCache = () => {
  // Chỉ chạy trong môi trường server-side (Node.js)
  if (typeof window !== 'undefined') {
    console.info("[gatsby-ssr] Running in browser environment, skipping cache read");
    return { header: '', body: '', footer: '' };
  }
  
  try {
    // Sử dụng eval để tránh webpack phân tích static code
    const fs = eval('require')('fs');
    const path = eval('require')('path');
    
    const trackingCodesCachePath = path.join(process.cwd(), '.cache', 'theme-tracking-codes.json');
    
    if (fs.existsSync(trackingCodesCachePath)) {
      const fileContent = fs.readFileSync(trackingCodesCachePath, 'utf-8');
      const data = JSON.parse(fileContent);
      console.log("[gatsby-ssr] Successfully loaded tracking codes from cache");
      return data;
    }
    console.info("[gatsby-ssr] Cached 'theme-tracking-codes.json' not found - this is normal for first build or if cache was cleared.");
  } catch (error) {
    console.error("[gatsby-ssr] Error reading or parsing cached 'theme-tracking-codes.json':", error);
  }
  return { header: '', body: '', footer: '' };
};

// Helper function để đảm bảo output từ parse là một mảng và có key
const parseHtmlToReact = (htmlString, baseKey) => {
  if (!htmlString || typeof htmlString !== 'string' || htmlString.trim() === '') {
    return [];
  }
  try {
    const reactElements = parse(htmlString.trim()); // trim() để loại bỏ khoảng trắng thừa

    if (Array.isArray(reactElements)) {
      // Nếu parse trả về mảng, gán key cho từng element
      return reactElements.map((el, index) =>
        React.isValidElement(el) ? React.cloneElement(el, { key: `${baseKey}-${index}` }) : null
      ).filter(Boolean); // Lọc bỏ các giá trị null nếu có
    } else if (React.isValidElement(reactElements)) {
      // Nếu parse trả về một element đơn lẻ
      return [React.cloneElement(reactElements, { key: `${baseKey}-0` })];
    }
    // Nếu parse trả về string hoặc thứ gì đó không phải React element (ví dụ: chuỗi rỗng sau parse)
    return [];
  } catch (error) {
    console.error(`[gatsby-ssr] Error parsing HTML string for key ${baseKey}:`, error, "HTML String:", htmlString);
    return [];
  }
};


export const onRenderBody = ({
  setHeadComponents,
  setPreBodyComponents,
  setPostBodyComponents,
  setBodyAttributes,
}, pluginOptions) => {

  // ============ADD CLASS FOR BODY================
  setBodyAttributes({
    itemType: "https://schema.org/WebPage",
    itemScope: "itemscope",
    // className: "ast-theme-transparent-header", //lazyloaded menu-fixed
    // className: "wp-singular page-template page-template-template-service-category page-template-template-service-category-php page page-id-3432 wp-custom-logo wp-theme-astra wp-child-theme-agencymarketing mega-menu-primary ast-plain-container ast-no-sidebar astra-4.11.1 ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header ast-sticky-main-shrink ast-sticky-above-shrink ast-sticky-below-shrink ast-sticky-header-shrink ast-inherit-site-logo-sticky ast-primary-sticky-enabled ast-normal-title-enabled astra-addon-4.11.0 ast-header-break-point",
    style: {}
  });
  // ============================

  const trackingCodes = loadTrackingCodesFromCache();

  const scriptsForHeadString = trackingCodes.header || "";
  const scriptsForPreBodyString_fromBodyField = trackingCodes.body || "";
  const scriptsForPreBodyString_fromFooterField = trackingCodes.footer || "";

  // --- 1. Cấu hình cho <head> ---
  const headItems = [];
  headItems.push(
    <link
      key="google-fonts"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Anek+Devanagari:wght@100..800&family=Assistant:wght@200..800&display=swap"
    />
  );

  if (scriptsForHeadString) {
    // Phân tích chuỗi HTML thành các React elements
    const parsedHeadScripts = parseHtmlToReact(scriptsForHeadString, 'head-script-item');
    // Thêm các elements đã parse vào headItems (sử dụng spread operator nếu parsedHeadScripts là mảng)
    headItems.push(...parsedHeadScripts);
  }
  // Chỉ gọi setHeadComponents nếu có items để tránh lỗi hoặc warning không cần thiết
  if (headItems.length > 0) {
    setHeadComponents(headItems);
  }

  // --- 2. Cấu hình cho ngay sau thẻ <body> mở ---
  const preBodyItems = [];

  if (scriptsForPreBodyString_fromFooterField) {
    const parsedFooterScripts = parseHtmlToReact(scriptsForPreBodyString_fromFooterField, 'prebody-footer-item');
    preBodyItems.push(...parsedFooterScripts);
  }

  // if (scriptsForPreBodyString_fromBodyField) {
  //   const parsedBodyScripts = parseHtmlToReact(scriptsForPreBodyString_fromBodyField, 'prebody-body-item');
  //   preBodyItems.push(...parsedBodyScripts);
  // }

  if (preBodyItems.length > 0) {
    setPreBodyComponents(preBodyItems);
  }

  // --- 3. Cấu hình cho ngay trước thẻ </body> đóng ---
  const postBodyItems = [];
  
  const scriptsForPostBodyString = trackingCodes.postBody || "";
  if (scriptsForPostBodyString) {
    const parsedPostBodyScripts = parseHtmlToReact(scriptsForPostBodyString, 'postbody-item');
    postBodyItems.push(...parsedPostBodyScripts);
  }

  if (postBodyItems.length > 0) {
    setPostBodyComponents(postBodyItems);
  }
};