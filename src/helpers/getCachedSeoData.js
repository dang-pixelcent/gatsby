
const path = require(`path`);
const appRoot = require('app-root-path');
const fs = require('fs');
const sanitizeFilename = require('./sanitizeFilename.js');
const getTerminalColors = require('../utils/terminalColors.js');
const colors = getTerminalColors();

const rootDir = appRoot.path; // Đường dẫn đến thư mục gốc của dự án
const CACHE_DIR = path.join(rootDir, 'cache/seo');
function getCachedSeoData(url) {
    try {
        const filename = sanitizeFilename(url);
        const filePath = path.join(CACHE_DIR, `${filename}.json`);
        if (fs.existsSync(filePath)) {
            const cached = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log(`${colors.cyan}Using cached SEO data for ${url}${colors.reset}`);
            return cached.seoData;
        }
    } catch (error) {
        console.error(`${colors.red}Error reading cached SEO data for ${url}: ${error.message}${colors.reset}`);
    }
    return null;
}

module.exports = getCachedSeoData;