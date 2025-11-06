const path = require('path');
const fs = require('fs');
const axios = require('axios');
const optimizeImage = require('./optimizeImage'); // Tái sử dụng helper tối ưu ảnh

/**
 * Tìm và xử lý các ảnh nền (background-image) trong các section và các phần tử con của chúng.
 * - Chuyển đổi background-image thành thẻ <picture> hoặc <img> để tối ưu hóa.
 * - Tải, tối ưu và tạo các phiên bản WebP và fallback.
 * - Thêm preload link cho ảnh LCP (Largest Contentful Paint).
 * @param {object} params
 * @param {CheerioAPI} params.$ - Instance Cheerio.
 * @param {Cheerio<Element>} params.sections - Các section của trang.
 * @param {object} params.node - Node trang hiện tại.
 * @param {object} params.colors - Màu cho console.
 * @param {string} params.DOWNLOADED_IMAGES_DIR - Thư mục lưu ảnh.
 * @param {string} params.DOWNLOADED_IMAGES_URL_PREFIX - Tiền tố URL của ảnh.
 * @param {Array} params.specialScripts - Mảng để thêm các script đặc biệt (như preload).
 */
async function processBackgroundImages({ $, sections, node, colors, DOWNLOADED_IMAGES_DIR, DOWNLOADED_IMAGES_URL_PREFIX, specialScripts }) {
    let isLcpBackgroundAssigned = false; // Flag để đánh dấu ảnh LCP đã được chỉ định hay chưa.

    // Duyệt qua từng section để xác định ngữ cảnh (ví dụ: có phải section đầu tiên không)
    for (const [index, section] of sections.toArray().entries()) {
        const sectionEl = $(section);
        const isFirstSection = (index === 0);

        // Tìm tất cả các phần tử con (và cả chính section) có thuộc tính style
        const elementsToScan = sectionEl.find('[style]').addBack(sectionEl);

        for (const element of elementsToScan.toArray()) {
            const el = $(element);
            const style = el.attr('style');

            // Chỉ xử lý các phần tử có style background-image
            if (!style || !(style.includes('background:') || style.includes('background-image:'))) {
                continue;
            }

            const match = style.match(/url\(['"]?(.*?)['"]?\)/);
            if (!match || !match[1]) {
                continue;
            }

            const urlContent = match[1];
            let potentialUrls = [];

            if (urlContent.startsWith('http')) {
                potentialUrls = [urlContent];
            } else {
                const urlRegex = /(https?:\/\/[^\s,'"]+\.(?:jpg|jpeg|png|gif|webp|svg))/ig;
                potentialUrls = urlContent.match(urlRegex) || [];
            }

            if (potentialUrls.length === 0) {
                continue;
            }

            let processedImage = null;

            for (const urlToTry of potentialUrls) {
                try {
                    const imageName = path.basename(new URL(urlToTry).pathname);
                    const originalImagePath = path.join(DOWNLOADED_IMAGES_DIR, imageName);

                    if (!fs.existsSync(originalImagePath)) {
                        const response = await axios({ url: urlToTry, method: 'GET', responseType: 'arraybuffer', timeout: 15000 });
                        await fs.promises.writeFile(originalImagePath, response.data);
                    }

                    const imageBuffer = await fs.promises.readFile(originalImagePath);
                    processedImage = await optimizeImage(imageBuffer, imageName, DOWNLOADED_IMAGES_DIR, colors);

                    if (processedImage) {
                        console.log(`${colors.green}Successfully processed background for element in ${node.uri}${colors.reset}`);
                        break;
                    }
                } catch (error) {
                    console.warn(`${colors.yellow} -> Failed to process background URL ${urlToTry}: ${error.message}. Trying next...${colors.reset}`);
                }
            }

            if (!processedImage) {
                console.warn(`${colors.red}All potential background URLs failed for an element on page ${node.uri}.${colors.reset}`);
                continue;
            }

            // --- Thay thế HTML ---
            const newStyle = style.replace(/background(-image)?:[^;]+;?/g, '').trim();
            el.attr('style', `${newStyle} overflow: hidden; position: relative;`);

            const fallbackUrl = `${DOWNLOADED_IMAGES_URL_PREFIX}/${processedImage.fallback}`;

            const imageAttrs = {
                'class': 'section-background-image',
                'src': fallbackUrl,
                'alt': 'Section background',
                'decoding': 'async',
                'width': processedImage.width,
                'height': processedImage.height,
                'style': 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; pointer-events: none;'
            };

            // Áp dụng logic fetchpriority/loading mới
            if (isFirstSection) {
                if (!isLcpBackgroundAssigned) {
                    // Ảnh nền đầu tiên trong section đầu tiên
                    imageAttrs.fetchpriority = 'high';
                    isLcpBackgroundAssigned = true; // Đánh dấu đã gán LCP

                    // Chỉ tạo preload link cho ảnh LCP này
                    const preloadUrl = processedImage.isSpecial ? fallbackUrl : `${DOWNLOADED_IMAGES_URL_PREFIX}/${processedImage.webp}`;
                    const preloadLinkData = {
                        type: 'preload-lcp-image',
                        tag: 'link',
                        props: { rel: 'preload', href: preloadUrl, as: 'image', fetchpriority: 'high' }
                    };
                    if (!specialScripts.some(s => s.props && s.props.href === preloadUrl)) {
                        specialScripts.push(preloadLinkData);
                    }
                } else {
                    // Các ảnh nền khác trong section đầu tiên
                    imageAttrs.fetchpriority = 'low';
                }
            } else {
                // Ảnh nền trong các section sau
                imageAttrs.loading = 'lazy';
            }


            if (processedImage.isSpecial) {
                const imageTag = $('<img>').attr(imageAttrs);
                el.prepend(imageTag);
            } else {
                const picture = $('<picture></picture>');
                const webpUrl = `${DOWNLOADED_IMAGES_URL_PREFIX}/${processedImage.webp}`;
                picture.append($('<source>').attr({ srcset: webpUrl, type: 'image/webp' }));
                picture.append($('<source>').attr('srcset', fallbackUrl));
                const imageTag = $('<img>').attr(imageAttrs);
                picture.append(imageTag);
                el.prepend(picture);
            }
        }
    }
}

module.exports = processBackgroundImages;