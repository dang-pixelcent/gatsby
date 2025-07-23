const React = require('react');
const parse = require('html-react-parser').default || require('html-react-parser');
const path = require('path');
const getTerminalColors = require('./src/utils/terminalColors.js');

// Lấy màu sắc từ utils để sử dụng trong console log
const color = getTerminalColors();

// Đường dẫn đến thư mục cache và file chứa tracking codes
const CACHE_DIR = '.cache';
const GLOBAL_SNIPPETS_FILE = 'global-html-snippets.json';
const PAGE_SNIPPETS_DIR = 'page-snippets'; // Thư mục chứa các snippet riêng của từng trang

/** 1.
 * Hàm helper để đọc một file JSON từ cache một cách an toàn.
 * @param {string} filePath - Đường dẫn đầy đủ đến file cache.
 * @returns {object} - Dữ liệu JSON đã parse hoặc object rỗng.
 */
const readJsonCache = (filePath) => {
  const fs = eval('require')('fs');
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      console.log(`${color.cyan}[gatsby-ssr] Successfully loaded cache from ${filePath}${color.reset}`);
      const data = JSON.parse(fileContent);
      return data;
    }
    console.info(`${color.yellow}[gatsby-ssr] Cache file ${filePath} not found - this is normal for first build or if cache was cleared.${color.reset}`);
  } catch (error) {
    console.error(`${color.red}[gatsby-ssr] Error reading cache file ${filePath}:`, error);
  }
  return { headerHtml: '', bodyOpenHtml: '', footerHtml: '' }; // Luôn trả về object rỗng để tránh lỗi
};


// 2. Helper function để đảm bảo output từ parse là một mảng và có key
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
    console.error(`${color.red}[gatsby-ssr] Error parsing HTML string for key ${baseKey}:`, error, "HTML String:", htmlString);
    return [];
  }
};



/** 3.
 * HÀM MỚI: Biến đổi các thẻ script để chạy với Partytown
 * @param {string} htmlString - Chuỗi HTML chứa các script.
 * @param {string} baseKey - Key cơ sở cho các React element.
 * @returns {Array} - Mảng các React elements đã được biến đổi.
 */
// Nó sẽ tìm và thay thế các thẻ script, sau đó gọi hàm parseHtmlToReact ở trên.
const transformAndParseScripts = (htmlString, baseKey) => {
  if (!htmlString || typeof htmlString !== 'string' || htmlString.trim() === '') {
    return [];
  }

  // Bước 1: Dùng Regex để tìm và thêm type="text/partytown" vào tất cả thẻ script.
  // Cách này không phụ thuộc vào thư viện parse và rất an toàn.
  const transformedHtml = htmlString.replace(/<script/g, '<script type="text/partytown"');

  // Bước 2: Gọi hàm parse ban đầu của bạn để chuyển HTML đã được biến đổi sang React.
  return parseHtmlToReact(transformedHtml, baseKey);
};


export const onRenderBody = ({
  pathname, // Đường dẫn hiện tại của trang render
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

  // Đọc snippet riêng của trang từ cache
  const slug = pathname.replace(/\//g, '') || 'homepage'; // Thay thế dấu '/' bằng rỗng, nếu pathname là '/', sử dụng 'homePage' làm slug
  const pageSnippetsPath = path.join(process.cwd(), CACHE_DIR, PAGE_SNIPPETS_DIR, `${slug}.json`);
  const pageSnippets = readJsonCache(pageSnippetsPath);

  // global tracking codes
  const globalSnippetsPath = path.join(process.cwd(), CACHE_DIR, GLOBAL_SNIPPETS_FILE);
  const globalSnippets = readJsonCache(globalSnippetsPath);

  //==============GHÉP NỐI CÁC SNIPPET LẠI VỚI NHAU================
  // HTML cuối cùng = HTML toàn cục + HTML của trang hiện tại
  const scriptsForHeadString_fromHeadField = (globalSnippets.headerHtml || '') + (pageSnippets.headerHtml || '');
  const scriptsForPreBodyString_fromBodyField = (globalSnippets.bodyOpenHtml || '') + (pageSnippets.bodyOpenHtml || '');
  const scriptsForPreBodyString_fromFooterField = (globalSnippets.footerHtml || '') + (pageSnippets.footerHtml || '');


  // phần cũ chỉ có tracking codes global
  // const scriptsForHeadString_fromHeadField = globalSnippets.headerHtml || "";
  // const scriptsForPreBodyString_fromBodyField = globalSnippets.bodyOpenHtml || "";
  // const scriptsForPreBodyString_fromFooterField = globalSnippets.footerHtml || "";

  // --- 1. Cấu hình cho <head> ---
  const headItems = [];
  headItems.push(
    <link
      key="google-fonts"
      rel="stylesheet"
    // href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Anek+Devanagari:wght@100..800&family=Assistant:wght@200..800&display=swap"
    />
  );

  if (scriptsForHeadString_fromHeadField) {
    // Phân tích chuỗi HTML thành các React elements
    const parsedHeadScripts = transformAndParseScripts(scriptsForHeadString_fromHeadField, 'head-script-item');
    // Thêm các elements đã parse vào headItems (sử dụng spread operator nếu parsedHeadScripts là mảng)
    headItems.push(...parsedHeadScripts);
  }
  // Chỉ gọi setHeadComponents nếu có items để tránh lỗi hoặc warning không cần thiết
  if (headItems.length > 0) {
    setHeadComponents(headItems);
  }

  // --- 2. Cấu hình cho ngay sau thẻ <body> mở ---
  const preBodyItems = [];

  if (scriptsForPreBodyString_fromBodyField) {
    const parsedBodyScripts = transformAndParseScripts(scriptsForPreBodyString_fromBodyField, 'prebody-body-item');
    preBodyItems.push(...parsedBodyScripts);
  }

  if (preBodyItems.length > 0) {
    setPreBodyComponents(preBodyItems);
  }

  // --- 3. Cấu hình cho ngay trước thẻ </body> đóng ---
  const postBodyItems = [];

  if (scriptsForPreBodyString_fromFooterField) {
    const parsedFooterScripts = transformAndParseScripts(scriptsForPreBodyString_fromFooterField, 'postbody-footer-item');
    postBodyItems.push(...parsedFooterScripts);
  }

  if (postBodyItems.length > 0) {
    setPostBodyComponents(postBodyItems);
  }
};