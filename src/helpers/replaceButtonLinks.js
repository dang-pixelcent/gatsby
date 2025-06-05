const cheerio = require('cheerio');

const OLD_DOMAIN = 'https://agencysitestaging.mystagingwebsite.com';
const NEW_DOMAIN = process.env.REACT_APP_BASE_URL;

/**
 * Thay domain trong các thẻ <a>, KHÔNG đụng tới <img>
 * @param {string} html - flexibleContentHtml hoặc bất kỳ chuỗi HTML nào
 * @returns {string}    - HTML sau khi đã thay
 */
module.exports = function replaceButtonLinks(html = '') {
  const $ = cheerio.load(html);

  // Chọn tất cả thẻ <a> có thuộc tính href
  $('a[href]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href');

    // Chỉ thay nếu href bắt đầu bằng domain cũ
    if (href && href.startsWith(OLD_DOMAIN)) {
      $el.attr('href', href.replace(OLD_DOMAIN, NEW_DOMAIN));
    }
  });

  // Trả lại HTML đã cập nhật
  return $.html();
};