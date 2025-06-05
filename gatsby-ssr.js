import React from "react";
import parse from 'html-react-parser'; // Import thư viện
const fs = require('fs');
const path = require('path');

// Hàm loadTrackingCodesFromCache của bạn giữ nguyên
const loadTrackingCodesFromCache = () => {
  const trackingCodesCachePath = path.join(process.cwd(), '.cache', 'theme-tracking-codes.json');
  try {
    // Dòng log này bạn có thể giữ lại hoặc bỏ đi sau khi debug xong
    // console.log("----- Path check:", trackingCodesCachePath, "Exists:", fs.existsSync(trackingCodesCachePath));
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
// (Quan trọng cho React khi render danh sách các elements)
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
}, pluginOptions) => {

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

  if (scriptsForPreBodyString_fromFooterField) { // GTM noscript
    const parsedFooterScripts = parseHtmlToReact(scriptsForPreBodyString_fromFooterField, 'prebody-footer-item');
    preBodyItems.push(...parsedFooterScripts);
  }

  if (scriptsForPreBodyString_fromBodyField) { // Scripts từ trường 'body'
    const parsedBodyScripts = parseHtmlToReact(scriptsForPreBodyString_fromBodyField, 'prebody-body-item');
    preBodyItems.push(...parsedBodyScripts);
  }

  if (preBodyItems.length > 0) {
    setPreBodyComponents(preBodyItems);
  }

  // --- 3. Cấu hình cho ngay trước thẻ </body> đóng ---
  const postBodyItems = [];
  // Ví dụ: Nếu bạn có một trường khác cho các script ở cuối body
  const scriptsForPostBodyString = trackingCodes.postBody || "";
  if (scriptsForPostBodyString) {
    const parsedPostBodyScripts = parseHtmlToReact(scriptsForPostBodyString, 'postbody-item');
    postBodyItems.push(...parsedPostBodyScripts);
  }

  if (postBodyItems.length > 0) {
    setPostBodyComponents(postBodyItems);
  }
};