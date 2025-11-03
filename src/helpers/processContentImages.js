const path = require('path');
const fs = require('fs');
const axios = require('axios');
const optimizeImage = require('./optimizeImage');

/**
 * Xử lý, tải, tối ưu hóa và thay thế các thẻ <img> trong nội dung HTML.
 * - Đối với ảnh raster (jpg, png), chuyển đổi <img> thành <picture>.
 * - Đối với ảnh đặc biệt (SVG, GIF, WEBP), chỉ cập nhật lại src/srcset của <img>.
 */
async function processContentImages({ $, sections, node, colors, DOWNLOADED_IMAGES_DIR, DOWNLOADED_IMAGES_URL_PREFIX }) {
    const imagesToProcess = new Map();

    // --- 1. THU THẬP TẤT CẢ CÁC ẢNH CẦN XỬ LÝ ---
    sections.find('img').each((index, imgEl) => {
        const img = $(imgEl);
        if (img.parent().is('picture')) return;

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

    if (imagesToProcess.size === 0) return;

    // --- 2. TẢI VÀ XỬ LÝ TẤT CẢ ẢNH DUY NHẤT ---
    const allUniqueImages = new Map();
    imagesToProcess.forEach(sources => {
        sources.forEach(({ url }, imageName) => {
            if (!allUniqueImages.has(imageName)) {
                allUniqueImages.set(imageName, url);
            }
        });
    });

    const processingPromises = Array.from(allUniqueImages.entries()).map(async ([imageName, url]) => {
        const originalImagePath = path.join(DOWNLOADED_IMAGES_DIR, imageName);
        try {
            if (!fs.existsSync(originalImagePath)) {
                const response = await axios({ url, method: 'GET', responseType: 'arraybuffer', timeout: 15000 });
                await fs.promises.writeFile(originalImagePath, response.data);
            }
            const imageBuffer = await fs.promises.readFile(originalImagePath);
            const processed = await optimizeImage(imageBuffer, imageName, DOWNLOADED_IMAGES_DIR, colors);
            allUniqueImages.set(imageName, processed || { error: true, original: imageName });
        } catch (error) {
            console.warn(`${colors.yellow}Failed to download/process ${url}: ${error.message}${colors.reset}`);
            allUniqueImages.set(imageName, { error: true, original: imageName });
        }
    });
    await Promise.all(processingPromises);

    // --- 3. CẬP NHẬT LẠI HTML ---
    imagesToProcess.forEach((sources, imgElement) => {
        const srcsetParts = [];
        let isSpecial = false;

        sources.forEach(({ descriptor }, imageName) => {
            const processed = allUniqueImages.get(imageName);
            if (processed) {
                if (processed.isSpecial) isSpecial = true;
                const url = processed.error ? processed.original : processed.fallback;
                srcsetParts.push(`${DOWNLOADED_IMAGES_URL_PREFIX}/${url} ${descriptor}`.trim());
            }
        });

        if (srcsetParts.length === 0) return;

        if (isSpecial) {
            // --- XỬ LÝ CHO SVG/GIF/WEBP: CẬP NHẬT TRỰC TIẾP THẺ IMG ---
            const newSrc = srcsetParts[0].split(' ')[0];
            imgElement.attr('src', newSrc);

            // Chỉ thêm srcset nếu có nhiều hơn 1 ảnh nguồn
            if (sources.size > 1) {
                imgElement.attr('srcset', srcsetParts.join(', '));
            } else {
                imgElement.removeAttr('srcset');
            }

            // Áp dụng lazy loading
            if (!imgElement.closest('section').is(sections.first())) {
                if (!imgElement.attr('loading')) imgElement.attr('loading', 'lazy');
            }
            if (!imgElement.attr('decoding')) imgElement.attr('decoding', 'async');

        } else {
            // --- XỬ LÝ CHO ẢNH RASTER: TẠO THẺ PICTURE ---
            const webpSrcsetParts = [];
            sources.forEach(({ descriptor }, imageName) => {
                const processed = allUniqueImages.get(imageName);
                if (processed && !processed.error) {
                    webpSrcsetParts.push(`${DOWNLOADED_IMAGES_URL_PREFIX}/${processed.webp} ${descriptor}`.trim());
                }
            });

            const picture = $('<picture></picture>');
            picture.append($('<source>').attr({ srcset: webpSrcsetParts.join(', '), type: 'image/webp' }));
            picture.append($('<source>').attr('srcset', srcsetParts.join(', ')));

            const fallbackSrc = srcsetParts[0].split(' ')[0];
            const newImg = $('<img>').attr(imgElement.attr()).attr('src', fallbackSrc).removeAttr('srcset');

            // Áp dụng lazy loading cho ảnh mới trong picture
            if (!imgElement.closest('section').is(sections.first())) {
                if (!newImg.attr('loading')) newImg.attr('loading', 'lazy');
            }
            if (!newImg.attr('decoding')) newImg.attr('decoding', 'async');

            picture.append(newImg);
            imgElement.replaceWith(picture);
        }
    });
}

module.exports = processContentImages;