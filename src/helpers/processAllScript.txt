// gatsby-node.js
const cheerio = require('cheerio');
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
    const scriptTags = $('script');
    const extractedScripts = [];
    const specialScriptsFound = []; // Lưu các script đặc biệt đã được xử lý

    scriptTags.each((index, element) => {
        const attributes = { ...element.attribs };
        const src = attributes.src || '';
        const scriptType = attributes.type || 'text/javascript'; // Lấy type, mặc định là JS
        let isSpecial = false;

        // 1. Kiểm tra xem có phải script đặc biệt không
        for (const key in SPECIAL_SCRIPT_HANDLERS) {
            if (src.includes(key)) {
                const handler = SPECIAL_SCRIPT_HANDLERS[key];
                const specialScriptInfo = handler.createPlaceholder(element, $);
                if (specialScriptInfo) {
                    specialScriptsFound.push(specialScriptInfo);
                }
                isSpecial = true;
                break; // Đã xử lý, chuyển sang script tiếp theo
            }
        }

        // 2. Nếu là script đặc biệt, bỏ qua và không làm gì thêm
        if (isSpecial) {
            return;
        }

        // 3. Xử lý script thông thường (như cũ)
        if (src) {
            if (!attributes.id) {
                attributes.id = `external-script-${pageSlug}-${index}`;
            }
            extractedScripts.push({
                resourceType: 'external-script',
                attributes: attributes,
            });
        } else {
            const inlineContent = $(element).html();
            if (inlineContent) {
                // Phân loại dựa trên 'type'
                if (scriptType === 'text/javascript') {
                    // Chỉ bọc IIFE cho các script JavaScript thực thi
                    extractedScripts.push({
                        resourceType: 'inline-script', // Script để chạy
                        content: `(function(){\n${inlineContent}\n})();`,
                        id: `inline-script-${pageSlug}-${index}`
                    });
                } else {
                    // Đối với 'speculationrules', 'application/ld+json', etc.
                    extractedScripts.push({
                        resourceType: 'data-script', // Script dữ liệu
                        content: inlineContent,
                        attributes: attributes, // Giữ lại các attributes gốc (quan trọng là 'type')
                        id: `data-script-${pageSlug}-${index}`
                    });
                }
            }
        }
        $(element).remove();
    });

    return {
        cleanedHtml: $.html(),
        scripts: extractedScripts,
        specialScripts: specialScriptsFound, // Trả về danh sách script đặc biệt
    };
    // return { cleanedHtml: html, scripts: [], specialScripts: [] };
}

module.exports = processAllScripts;