
// filepath: d:\Codebase\gatsby\gatsby-node-logic\onPreBootstrap.js
const path = require('path');
const appRoot = require('app-root-path');
const fs = require('fs');
const replaceInternalLinks = require('../src/helpers/replaceButtonLinks.js');
const getTerminalColors = require('../src/utils/terminalColors.js');
const fetchWithRetry = require('../src/helpers/fetchWithRetry.js');

const rootDir = appRoot.path;

/**
 * Hàm Sao chép các file thư viện Partytown vào thư mục static.
 */
const { copyLibFiles } = require("@qwik.dev/partytown/utils");
async function copyPartytownFiles({ reporter, colors }) {
    reporter.info(`${colors.cyan}Copying Partytown library files...${colors.reset}`);
    try {
        await copyLibFiles(path.join(rootDir, "static", "~partytown"));
        reporter.success(`${colors.green}✓ Partytown files copied successfully.${colors.reset}`);
    } catch (error) {
        reporter.panicOnBuild(`${colors.red}Failed to copy Partytown files.${colors.reset}`, error);
    }
}

/**
 * Hàm Lấy HTML của Header/Footer từ CMS và cache lại.
 */
async function fetchAndCacheGlobalHtml({ reporter, colors }) {
    reporter.info(`${colors.cyan}Starting onPreBootstrap: Fetching and processing Header/Footer from CMS...${colors.reset}`);

    const endpoint = process.env.GATSBY_WPGRAPHQL_URL;
    if (!endpoint) {
        reporter.panicOnBuild(`${colors.red}GATSBY_WPGRAPHQL_URL must be set in .env file${colors.reset}`);
        return;
    }

    const query = `
    query GetGlobalHTML {
      headerHtmlall
      footerHtmlall
    }
  `;

    try {
        // Gọi hàm fetchWithRetry thay vì fetch trực tiếp
        const data = await fetchWithRetry({
            endpoint,
            query,
            reporter,
            retries: 7
        });

        // Phần ghi file giữ nguyên như cũ
        if (data && (data.headerHtmlall || data.footerHtmlall)) {
            reporter.info(`${colors.cyan}Raw Header/Footer HTML fetched. Processing...${colors.reset}`);
            const rawHeaderHtml = data.headerHtmlall || "";
            const rawFooterHtml = data.footerHtmlall || "";

            // Giả sử bạn có hàm replaceInternalLinks
            const processedHeaderHtml = replaceInternalLinks(rawHeaderHtml);
            const processedFooterHtml = replaceInternalLinks(rawFooterHtml);

            const DATA_DIR = path.join(rootDir, '.cache/headerfooter/');
            // onPreInit đã tạo thư mục này rồi, nhưng kiểm tra lại cho chắc
            if (!fs.existsSync(DATA_DIR)) {
                fs.mkdirSync(DATA_DIR, { recursive: true });
            }

            const filePath = path.join(DATA_DIR, 'processedglobalhtml.json');
            fs.writeFileSync(filePath, JSON.stringify({
                headerHtmlall: processedHeaderHtml,
                footerHtmlall: processedFooterHtml
            }));
            reporter.success(`${colors.green}✓ Global Header/Footer HTML cached successfully at: ${filePath}${colors.reset}`);
        } else {
            reporter.warn(`${colors.yellow}No header/footer data found from CMS.${colors.reset}`);
        }

    } catch (error) {
        reporter.panicOnBuild(`${colors.red}Critical error in onPreBootstrap after multiple retries${colors.reset}`, error);
    }
}

/**
 * Factory function to create the onPreBootstrap hook.
 * @returns {function} The async onPreBootstrap function for Gatsby.
 */
module.exports = async ({ reporter }) => {
    const colors = getTerminalColors();
    reporter.info(`${colors.cyan}--- Running onPreBootstrap tasks ---${colors.reset}`);

    // Chạy tuần tự các tác vụ
    await copyPartytownFiles({ reporter, colors });
    await fetchAndCacheGlobalHtml({ reporter, colors });

    reporter.info(`${colors.cyan}--- Finished onPreBootstrap tasks ---${colors.reset}`);
};

/** END PHẦN LẤY DỮ LIỆU HEADER */