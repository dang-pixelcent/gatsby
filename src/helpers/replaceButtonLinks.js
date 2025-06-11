// const cheerio = require('cheerio');

// const OLD_DOMAIN = 'https://agencysitestaging.mystagingwebsite.com';
// const NEW_DOMAIN = process.env.GATSBY_SITE_URL;

// /**
//  * Thay domain trong các thẻ <a>, KHÔNG đụng tới <img>
//  * @param {string} html - flexibleContentHtml hoặc bất kỳ chuỗi HTML nào
//  * @returns {string}    - HTML sau khi đã thay
//  */
// module.exports = function replaceButtonLinks(html = '') {
//   const $ = cheerio.load(html);

//   // Chọn tất cả thẻ <a> có thuộc tính href
//   $('a[href]').each((_, el) => {
//     const $el = $(el);
//     const href = $el.attr('href');

//     // Chỉ thay nếu href bắt đầu bằng domain cũ
//     if (href && href.startsWith(OLD_DOMAIN)) {
//       $el.attr('href', href.replace(OLD_DOMAIN, NEW_DOMAIN));
//     }
//   });

//   // Trả lại HTML đã cập nhật
//   return $.html();
// };

// src/helpers/replaceButtonLinks.js
const cheerio = require('cheerio');
const getTerminalColors = require('../utils/terminalColors')

// Lấy URL của trang web Gatsby từ biến môi trường
const SITE_DOMAIN = process.env.REACT_APP_DOMAIN;
const colors = getTerminalColors();

if (!SITE_DOMAIN) {
  console.error(`${colors.red}REACT_APP_DOMAIN must be set in .env file${colors.reset}`);
  process.exit(1);
}

/**
 * Thay thế các URL tuyệt đối nội bộ thành các đường dẫn tương đối.
 * Ví dụ: "https://mysite.com/about" -> "/about"
 * @param {string} html - Chuỗi HTML cần xử lý
 * @returns {string} - HTML đã được cập nhật
 */
module.exports = function replaceInternalLinks(html = '') {
  if (!html) return '';

  const $ = cheerio.load(html);
  let successCount = 0;
  let errorCount = 0;

  // Thông báo bắt đầu xử lý
  console.log(`${colors.yellow}Đang thay thế các URL nội bộ...${colors.reset}`);

  $('a[href]').each((_, el) => {
    const $el = $(el);
    let href = $el.attr('href');

    // Nếu href tồn tại và bắt đầu bằng domain của trang web
    if (href && href.startsWith(SITE_DOMAIN)) {
      try {
        const urlObject = new URL(href);
        // Lấy pathname (ví dụ: /our-team/) và gán lại cho href
        $el.attr('href', urlObject.pathname);
        successCount++;
      } catch (e) {
        console.error(`${colors.red}URL không hợp lệ trong nội dung: ${href}${colors.reset}`);
        errorCount++;
      }
    }
  });

  // Thông báo kết quả cuối cùng
  if (successCount > 0 || errorCount > 0) {
    if (errorCount === 0) {
      console.log(`${colors.green}✓ Thành công! Đã thay thế ${successCount} URL${colors.reset}`);
    } else {
      console.log(`${colors.red}⚠ Hoàn thành với lỗi: ${successCount} thành công, ${errorCount} lỗi${colors.reset}`);
    }
  }

  return $.html();
};