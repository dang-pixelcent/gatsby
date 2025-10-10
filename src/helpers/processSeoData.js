const cheerio = require('cheerio');
/**
 * Hàm xử lý seoData, tách riêng meta tags và schema JSON.
 * @param {string} seoDataString - Chuỗi HTML SEO từ WordPress.
 * @returns {{metaHtml: string, schemas: Array<Object>}}
 */
function processSeoData(seoDataString) {
    if (!seoDataString) {
        return { metaHtml: '', schemas: [] };
    }

    const $ = cheerio.load(seoDataString);
    const schemas = [];

    // Tìm tất cả các script JSON-LD
    $('script[type="application/ld+json"]').each((i, el) => {
        try {
            const scriptContent = $(el).html();
            if (scriptContent) {
                // Parse nội dung JSON và đẩy vào mảng schemas
                schemas.push(JSON.parse(scriptContent));
            }
        } catch (e) {
            console.error('Error parsing JSON-LD schema:', e);
        }
        // Xóa thẻ script này khỏi DOM ảo
        $(el).remove();
    });

    // HTML còn lại là các thẻ meta, title, link...
    const metaHtml = $.html();

    console.log(`[processSeoData] Extracted ${schemas.length} schemas. Meta HTML length: ${metaHtml.length}`);

    return { metaHtml, schemas };
}
module.exports = processSeoData;