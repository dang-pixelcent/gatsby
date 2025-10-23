// gatsby-node.js
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
// --- START: CẤU HÌNH SCRIPT ĐẶC BIỆT : XỬ LÝ VỊ TRÍ ĐỨNG CỦA SCRIPTs ---
const SPECIAL_SCRIPT_HANDLERS = {
    // Từ khóa để nhận diện script
    'form.jotform.com/jsform/': {
        // Hàm này sẽ được gọi khi tìm thấy script
        // Nó nhận vào element script (dưới dạng cheerio) và cheerio instance ($)
        createPlaceholder: (element, $) => {
            const src = $(element).attr('src');
            const formId = src.split('/').pop();
            if (!formId) return null;

            const placeholderId = `jotform-placeholder-${formId}`;
            // Thay thế thẻ <script> bằng một thẻ <div> placeholder
            $(element).replaceWith(`<div id="${placeholderId}"></div>`);

            // Trả về thông tin cần thiết cho client-side
            return { type: 'jotform', id: formId, placeholderId: placeholderId };
        }
    },
    // Bạn có thể thêm các handler khác ở đây trong tương lai
    // 'some-other-service.com/widget.js': {
    //   createPlaceholder: (element, $) => { ... }
    // }
};
// --- END: CẤU HÌNH SCRIPT ĐẶC BIỆT ---

/**
 * Trích xuất tất cả các thẻ script từ một chuỗi HTML,
 * lấy toàn bộ thuộc tính của chúng và trả về HTML đã được làm sạch.
 * @param {string} html - Chuỗi HTML đầu vào.
 * @param {string} pageSlug - Slug của trang để tạo ID duy nhất.
 * @returns {{cleanedHtml: string, scripts: Array<Object>, specialScripts: Array<Object>}}
 */
function processAllScripts(html = '', pageSlug) {
    if (!html || !pageSlug) {
        return { cleanedHtml: html || '', scripts: [], specialScripts: [] };
    }

    const $ = cheerio.load(html, null, false);
    const extractedScripts = [];

    $('script').each((index, element) => {
        const scriptElement = $(element);
        const scriptHtml = scriptElement.toString();

        const placeholderId = `script-placeholder-${uuidv4()}`;

        extractedScripts.push({
            placeholderId,
            scriptHtml,
        });

        //thay thế thẻ script bằng placeholder
        scriptElement.replaceWith(`<div id="${placeholderId}"></div>`);
    });

    return {
        cleanedHtml: $.html(),
        scripts: extractedScripts,
    };
}

module.exports = processAllScripts;