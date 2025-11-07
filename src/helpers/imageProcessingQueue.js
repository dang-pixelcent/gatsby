const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const axios = require('axios');
const optimizeImage = require('./optimizeImage');

const currentlyProcessingImages = new Set();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Tải một file với cơ chế thử lại.
 * @param {string} url - URL để tải.
 * @param {number} retries - Số lần thử lại.
 * @param {number} timeout - Thời gian chờ cho mỗi yêu cầu.
 * @returns {Promise<Buffer>} - Dữ liệu file dưới dạng Buffer.
 */
async function downloadWithRetry(url, retries = 3, timeout = 30000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'arraybuffer',
                timeout: timeout,
            });
            return response.data;
        } catch (error) {
            if (i < retries - 1) {
                await delay(1000 * (i + 1)); // Chờ 1s, 2s, ... trước khi thử lại
            } else {
                throw error; // Ném lỗi ở lần thử cuối cùng
            }
        }
    }
}

/**
 * Hàm xử lý toàn bộ cho một ảnh: tải, lưu cache, và tối ưu.
 * @param {string} imageName - Tên file ảnh.
 * @param {string} url - URL của ảnh.
 * @param {string} DOWNLOADED_IMAGES_DIR - Thư mục lưu ảnh.
 * @param {object} colors - Màu cho console.
 * @param {Map<string, object|null>} processedCache - Cache để tránh xử lý lại.
 */
async function downloadAndProcessImage(imageName, url, DOWNLOADED_IMAGES_DIR, colors, processedCache) {
    if (processedCache.has(imageName)) {
        return processedCache.get(imageName);
    }

    // Chờ nếu ảnh này đang được xử lý bởi một tiến trình khác.
    while (currentlyProcessingImages.has(imageName)) {
        // Đợi một chút và thử lại.
        await delay(100);
        // Nếu trong lúc chờ, ảnh đã được xử lý xong và có trong cache, trả về kết quả ngay.
        if (processedCache.has(imageName)) {
            return processedCache.get(imageName);
        }
    }

    const originalImagePath = path.join(DOWNLOADED_IMAGES_DIR, imageName);
    let imageBuffer;

    try {
        // Đánh dấu ảnh này đang được xử lý để các tiến trình khác phải chờ.
        currentlyProcessingImages.add(imageName);

        if (fs.existsSync(originalImagePath)) {
            imageBuffer = await fsp.readFile(originalImagePath);
        } else {
            imageBuffer = await downloadWithRetry(url, 2, 30000);
            await fsp.writeFile(originalImagePath, imageBuffer);
        }

        const processed = await optimizeImage(imageBuffer, imageName, DOWNLOADED_IMAGES_DIR, colors);
        const result = processed || { error: true, original: imageName, originalUrl: url };
        processedCache.set(imageName, result);
        return result;

    } catch (error) {
        console.warn(`${colors.yellow}Failed to download/process ${url}: ${error.message}${colors.reset}`);
        const result = { error: true, original: imageName, originalUrl: url };
        processedCache.set(imageName, result);
        return result;
    } finally {
        // Bỏ đánh dấu ảnh này đã xong xử lý.
        currentlyProcessingImages.delete(imageName);
    }
}

/**
 * Xử lý một hàng đợi các ảnh với giới hạn đồng thời.
 * @param {Array<[string, string]>} imageQueue - Mảng các [imageName, url].
 * @param {string} DOWNLOADED_IMAGES_DIR - Thư mục lưu ảnh.
 * @param {object} colors - Màu cho console.
 * @param {number} concurrencyLimit - Số lượng ảnh xử lý đồng thời.
 * @returns {Promise<Map<string, object|null>>} - Map chứa kết quả xử lý.
 */
async function processImageTasks(imageQueue, DOWNLOADED_IMAGES_DIR, colors, concurrencyLimit = 10) {
    const results = new Map();
    const queue = [...imageQueue];
    const processing = new Set();

    const runTask = async () => {
        while (queue.length > 0) {
            const [imageName, url] = queue.shift();
            const task = downloadAndProcessImage(imageName, url, DOWNLOADED_IMAGES_DIR, colors, results);
            processing.add(task);

            task.finally(() => {
                processing.delete(task);
            });

            if (processing.size >= concurrencyLimit) {
                await Promise.race(processing);
            }
        }
        await Promise.all(processing);
    };

    await runTask();
    return results;
}

module.exports = { processImageTasks, downloadAndProcessImage };