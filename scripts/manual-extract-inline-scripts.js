// scripts/manual-extract-inline-scripts.js

const { GraphQLClient, gql } = require('graphql-request');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

require('dotenv').config({
    path: path.join(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`)
});

// --- CẤU HÌNH ---
const WPGRAPHQL_URL = process.env.REACT_APP_WPGRAPHQL_URL;
const OUTPUT_DIR = path.join(__dirname, '../manual-review/inline-scripts'); // Thư mục mới để bạn xem xét
// -----------------

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

if (!WPGRAPHQL_URL) {
    console.error(`${colors.red}Lỗi: REACT_APP_WPGRAPHQL_URL chưa được thiết lập.${colors.reset}`);
    process.exit(1);
}

const GET_ALL_CONTENT_QUERY = gql`
  query GetAllContentForScriptAnalysis {
    # Tăng giới hạn 'first' nếu bạn có nhiều hơn 100 mục
    pages(where: {status: PUBLISH}, first: 100) { nodes { slug, flexibleContentHtml } }
    services(first: 100) { nodes { slug, flexibleContentHtml } }
    posts(first: 100) { nodes { slug, flexibleContentHtml } }
    events(first: 100) { nodes { slug, flexibleContentHtml } }
  }
`;

async function runManualExtraction() {
    console.log(`${colors.cyan}Bắt đầu quá trình trích xuất script INLINE để phân tích thủ công...${colors.reset}`);
    const client = new GraphQLClient(WPGRAPHQL_URL);

    try {
        const data = await client.request(GET_ALL_CONTENT_QUERY);

        if (fs.existsSync(OUTPUT_DIR)) {
            fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
        }
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });

        let totalScriptsFound = 0;

        const processEntries = (entries, type) => {
            if (!entries || entries.length === 0) return;

            entries.forEach(entry => {
                const { slug, flexibleContentHtml } = entry;
                if (!flexibleContentHtml) return;

                const $ = cheerio.load(flexibleContentHtml);
                // Chỉ tìm các script KHÔNG CÓ thuộc tính 'src'
                const inlineScripts = $('script:not([src])');

                if (inlineScripts.length > 0) {
                    const entryDir = path.join(OUTPUT_DIR, type, slug);
                    fs.mkdirSync(entryDir, { recursive: true });

                    inlineScripts.each((index, element) => {
                        const scriptContent = $(element).html();
                        if (scriptContent && scriptContent.trim()) {
                            const scriptPath = path.join(entryDir, `inline_script_${index + 1}.js`);
                            fs.writeFileSync(scriptPath, scriptContent, 'utf8');
                            totalScriptsFound++;
                        }
                    });
                }
            });
        };

        // Xử lý tất cả
        processEntries(data.pages.nodes, 'pages');
        processEntries(data.services.nodes, 'services');
        processEntries(data.posts.nodes, 'posts');
        processEntries(data.events.nodes, 'events');

        console.log(`\n${colors.green}✓✓✓ HOÀN TẤT! Đã tìm và trích xuất ${totalScriptsFound} script inline.${colors.reset}`);
        console.log(`${colors.cyan}Vui lòng kiểm tra thư mục:${colors.reset} ${OUTPUT_DIR}`);

    } catch (error) {
        console.error(`${colors.red}✗ Đã xảy ra lỗi:${colors.reset}`, error);
    }
}

runManualExtraction();