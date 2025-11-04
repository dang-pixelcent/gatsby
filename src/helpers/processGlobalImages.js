const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const optimizeImage = require('./optimizeImage');

/**
 * Tải, tối ưu và thay thế hình ảnh trong một đoạn HTML (header/footer).
 * @param {object} params
 * @param {string} params.html - Chuỗi HTML cần xử lý.
 * @param {'header' | 'footer'} params.imageType - Loại HTML để áp dụng logic loading phù hợp.
 * @param {object} params.colors - Đối tượng màu cho console.
 * @param {string} params.DOWNLOADED_IMAGES_DIR - Thư mục lưu ảnh.
 * @param {string} params.DOWNLOADED_IMAGES_URL_PREFIX - Tiền tố URL cho ảnh đã lưu.
 * @returns {Promise<string>} - Chuỗi HTML đã được xử lý.
 */
async function processGlobalImages({ html, imageType, colors, DOWNLOADED_IMAGES_DIR, DOWNLOADED_IMAGES_URL_PREFIX }) {
    if (!html) return '';

    const $ = cheerio.load(html);
    const imagesToProcess = new Map();

    // --- 1. THU THẬP TẤT CẢ CÁC ẢNH CẦN XỬ LÝ ---
    $('img').each((index, imgEl) => {
        const img = $(imgEl);
        if (img.parent().is('picture')) return; // Bỏ qua nếu đã có trong <picture>

        const imageSources = new Map();
        const originalSrc = img.attr('src');
        if (originalSrc && originalSrc.startsWith('http')) {
            try {
                const imageName = path.basename(new URL(originalSrc).pathname);
                imageSources.set(imageName, { url: originalSrc, descriptor: '' });
            } catch (e) {
                console.warn(`${colors.yellow}Invalid image URL in src: ${originalSrc}${colors.reset}`);
            }
        }

        const originalSrcset = img.attr('srcset');
        if (originalSrcset) {
            originalSrcset.split(',').forEach(part => {
                const [url, descriptor] = part.trim().split(/\s+/);
                if (url && url.startsWith('http')) {
                    try {
                        const imageName = path.basename(new URL(url).pathname);
                        imageSources.set(imageName, { url, descriptor: descriptor || '' });
                    } catch (e) {
                        console.warn(`${colors.yellow}Invalid image URL in srcset: ${url}${colors.reset}`);
                    }
                }
            });
        }

        if (imageSources.size > 0) {
            imagesToProcess.set(img, imageSources);
        }
    });

    if (imagesToProcess.size === 0) return $.html();

    // --- 2. TẢI VÀ XỬ LÝ TẤT CẢ ẢNH DUY NHẤT ---
    const allUniqueImages = new Map();
    imagesToProcess.forEach(sources => {
        sources.forEach(({ url }, imageName) => {
            if (!allUniqueImages.has(imageName)) {
                allUniqueImages.set(imageName, { url });
            }
        });
    });

    console.log(`${colors.cyan}Processing ${allUniqueImages.size} images for ${imageType}...${colors.reset}`);

    const processingPromises = Array.from(allUniqueImages.entries()).map(async ([imageName, { url }]) => {
        const originalImagePath = path.join(DOWNLOADED_IMAGES_DIR, imageName);
        try {
            if (!fs.existsSync(originalImagePath)) {
                const response = await axios({ url, method: 'GET', responseType: 'arraybuffer', timeout: 15000 });
                await fs.promises.writeFile(originalImagePath, response.data);
            }
            const imageBuffer = await fs.promises.readFile(originalImagePath);
            const processed = await optimizeImage(imageBuffer, imageName, DOWNLOADED_IMAGES_DIR, colors);
            allUniqueImages.set(imageName, processed || { error: true, originalUrl: url });
        } catch (error) {
            console.warn(`${colors.yellow}Failed to download/process ${url}: ${error.message}${colors.reset}`);
            allUniqueImages.set(imageName, { error: true, originalUrl: url });
        }
    });
    await Promise.all(processingPromises);

    // --- 3. CẬP NHẬT LẠI HTML ---
    imagesToProcess.forEach((sources, imgElement) => {
        const srcsetParts = [];
        const webpSrcsetParts = [];
        let isSpecial = false;
        let hasError = false;

        sources.forEach(({ descriptor }, imageName) => {
            const processed = allUniqueImages.get(imageName);
            if (processed) {
                if (processed.error) {
                    hasError = true;
                    srcsetParts.push(`${processed.originalUrl} ${descriptor}`.trim());
                } else {
                    if (processed.isSpecial) isSpecial = true;
                    srcsetParts.push(`${DOWNLOADED_IMAGES_URL_PREFIX}/${processed.fallback} ${descriptor}`.trim());
                    if (processed.webp) {
                        webpSrcsetParts.push(`${DOWNLOADED_IMAGES_URL_PREFIX}/${processed.webp} ${descriptor}`.trim());
                    }
                }
            }
        });

        if (srcsetParts.length === 0) return;

        // Nếu có lỗi hoặc là ảnh đặc biệt (svg, gif), chỉ cập nhật <img>
        if (hasError || isSpecial) {
            const newSrc = srcsetParts[0].split(' ')[0];
            imgElement.attr('src', newSrc);
            if (sources.size > 1) {
                imgElement.attr('srcset', srcsetParts.join(', '));
            } else {
                imgElement.removeAttr('srcset');
            }
        } else {
            // Nếu là ảnh raster, tạo <picture>
            const picture = $('<picture></picture>');
            picture.append($('<source>').attr({ srcset: webpSrcsetParts.join(', '), type: 'image/webp' }));
            picture.append($('<source>').attr('srcset', srcsetParts.join(', ')));

            const fallbackSrc = srcsetParts[0].split(' ')[0];
            const newImg = $('<img>').attr(imgElement.attr()).attr('src', fallbackSrc).removeAttr('srcset');
            picture.append(newImg);
            imgElement.replaceWith(picture);
        }
    });

    // --- 4. ÁP DỤNG THUỘC TÍNH LOADING ---
    $('img').each((i, el) => {
        const img = $(el);
        if (!img.attr('decoding')) img.attr('decoding', 'async');

        if (imageType === 'header') {
            if (!img.hasClass('custom-logo')) {
                if (!img.attr('loading')) img.attr('loading', 'lazy');
            }

            //  if (img.hasClass('custom-logo')) {
            //     if (!img.attr('fetchpriority')) img.attr('fetchpriority', 'high');
            // } else {
            //     if (!img.attr('loading')) img.attr('loading', 'lazy');
            // }
        } else { // footer
            if (!img.attr('loading')) img.attr('loading', 'lazy');
        }
    });

    return $.html();
}

module.exports = processGlobalImages;