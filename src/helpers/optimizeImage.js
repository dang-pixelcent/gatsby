const sharp = require('sharp');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

/**
 * Tối ưu hóa hình ảnh.
 * - Bỏ qua tối ưu hóa cho SVG, GIF, và WEBP; chỉ sao chép chúng.
 * - Tạo phiên bản WebP và fallback cho các định dạng khác.
 * @returns {Promise<object|null>} - Trả về object chứa đường dẫn file hoặc null nếu lỗi.
 *   - { webp: '...', fallback: '...' } cho ảnh thường.
 *   - { fallback: '...', isSpecial: true } cho SVG/GIF/WEBP.
 */
async function optimizeImage(imageBuffer, originalFileName, outputDir, colors) {
    const parsedPath = path.parse(originalFileName);
    const imageName = parsedPath.name;
    const originalExt = parsedPath.ext.toLowerCase();

    // --- XỬ LÝ CÁC ĐỊNH DẠNG ĐẶC BIỆT (SVG, GIF, WEBP) ---
    if (['.svg', '.gif', '.webp'].includes(originalExt)) {
        const filePath = path.join(outputDir, originalFileName);
        try {
            if (!fs.existsSync(filePath)) {
                await fsp.writeFile(filePath, imageBuffer);
            }
            // Trả về một cấu trúc đơn giản, chỉ có fallback và đánh dấu là loại đặc biệt
            return {
                fallback: originalFileName,
                isSpecial: true,
            };
        } catch (error) {
            console.warn(`${colors.red}Error saving special file ${originalFileName}:${colors.reset}`, error);
            return null;
        }
    }

    // --- XỬ LÝ CÁC ĐỊNH DẠNG ẢNH CẦN TỐI ƯU (JPG, PNG, etc.) ---
    const webpFileName = `${imageName}.webp`;
    const fallbackFileName = `${imageName}-fallback${parsedPath.ext}`;

    const webpPath = path.join(outputDir, webpFileName);
    const fallbackPath = path.join(outputDir, fallbackFileName);

    if (fs.existsSync(webpPath) && fs.existsSync(fallbackPath)) {
        return {
            webp: webpFileName,
            fallback: fallbackFileName,
            isSpecial: false,
        };
    }

    try {
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        const optimizationPromises = [];

        if (!fs.existsSync(webpPath)) {
            optimizationPromises.push(image.webp({ quality: 80 }).toFile(webpPath));
        }

        if (!fs.existsSync(fallbackPath)) {
            let fallbackPromise;
            if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
                fallbackPromise = image.jpeg({ quality: 85, progressive: true, mozjpeg: true }).toFile(fallbackPath);
            } else if (metadata.format === 'png') {
                fallbackPromise = image.png({ quality: 85, compressionLevel: 8 }).toFile(fallbackPath);
            } else {
                fallbackPromise = fsp.writeFile(fallbackPath, imageBuffer);
            }
            optimizationPromises.push(fallbackPromise);
        }

        await Promise.all(optimizationPromises);

        return {
            webp: webpFileName,
            fallback: fallbackFileName,
            isSpecial: false,
        };
    } catch (error) {
        // console.warn(`${colors.red}Error optimizing image ${originalFileName}:${colors.reset}`, error);
        console.warn(`${colors.red}Error optimizing image ${originalFileName}`);
        return null;
    }
}

module.exports = optimizeImage;