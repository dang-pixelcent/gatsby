const path = require('path');
const fs = require('fs');
const axios = require('axios');
const optimizeImage = require('./optimizeImage'); // Tái sử dụng helper tối ưu ảnh

/**
 * Tìm và xử lý các ảnh nền (background-image) trong các section.
 * - Chuyển đổi background-image thành thẻ <picture> để tối ưu hóa.
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
    for (const [index, section] of sections.toArray().entries()) {
        const sectionEl = $(section);
        const style = sectionEl.attr('style');

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

                // Tải ảnh nếu chưa có
                if (!fs.existsSync(originalImagePath)) {
                    const response = await axios({ url: urlToTry, method: 'GET', responseType: 'arraybuffer', timeout: 15000 });
                    await fs.promises.writeFile(originalImagePath, response.data);
                }

                // Tối ưu hóa ảnh
                const imageBuffer = await fs.promises.readFile(originalImagePath);
                processedImage = await optimizeImage(imageBuffer, imageName, DOWNLOADED_IMAGES_DIR, colors);

                if (processedImage) {
                    console.log(`${colors.green}Successfully processed background for ${node.uri}${colors.reset}`);
                    break; // Thoát khỏi vòng lặp khi đã xử lý thành công
                }
            } catch (error) {
                console.warn(`${colors.yellow} -> Failed to process background URL ${urlToTry}: ${error.message}. Trying next...${colors.reset}`);
            }
        }

        if (!processedImage) {
            console.warn(`${colors.red}All potential background image URLs failed for a section on page ${node.uri}.${colors.reset}`);
            continue;
        }

        // --- Thay thế HTML ---
        const newStyle = style.replace(/background(-image)?:[^;]+;?/g, '').trim();
        sectionEl.attr('style', `${newStyle} overflow: hidden; position: relative;`);

        const fallbackUrl = `${DOWNLOADED_IMAGES_URL_PREFIX}/${processedImage.fallback}`;
        const isFirstSection = (index === 0);

        if (processedImage.isSpecial) {
            // --- XỬ LÝ ẢNH ĐẶC BIỆT (SVG, GIF, WEBP): DÙNG THẺ IMG ---
            const imageTag = $('<img>').attr({
                'class': 'section-background-image',
                'src': fallbackUrl,
                'alt': 'Section background',
                'decoding': 'async',
                'style': 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; pointer-events: none;'
            });

            if (isFirstSection) {
                imageTag.attr('fetchpriority', 'high');
            } else {
                imageTag.attr('loading', 'lazy');
            }

            sectionEl.prepend(imageTag);

        } else {
            // --- XỬ LÝ ẢNH THƯỜNG: DÙNG THẺ PICTURE ---
            const picture = $('<picture></picture>');
            const webpUrl = `${DOWNLOADED_IMAGES_URL_PREFIX}/${processedImage.webp}`;
            picture.append($('<source>').attr({ srcset: webpUrl, type: 'image/webp' }));
            picture.append($('<source>').attr('srcset', fallbackUrl));

            const imageTag = $('<img>').attr({
                'class': 'section-background-image',
                'src': fallbackUrl,
                'alt': 'Section background',
                'decoding': 'async',
                'style': 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; pointer-events: none;'
            });

            if (isFirstSection) {
                imageTag.attr('fetchpriority', 'high');
            } else {
                imageTag.attr('loading', 'lazy');
            }

            picture.append(imageTag);
            sectionEl.prepend(picture);
        }

        // Tạo preload link cho ảnh nền của section ĐẦU TIÊN
        if (isFirstSection) {
            const preloadUrl = processedImage.isSpecial ? fallbackUrl : `${DOWNLOADED_IMAGES_URL_PREFIX}/${processedImage.webp}`;
            const preloadLinkData = {
                type: 'preload-lcp-image',
                tag: 'link',
                props: { rel: 'preload', href: preloadUrl, as: 'image', fetchpriority: 'high' }
            };
            if (!specialScripts.some(s => s.props && s.props.href === preloadUrl)) {
                specialScripts.push(preloadLinkData);
            }
        }
    }
}

module.exports = processBackgroundImages;