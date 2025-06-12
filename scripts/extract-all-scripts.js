// scripts/extract-all-scripts.js

const { GraphQLClient, gql } = require('graphql-request');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const readline = require('readline');

// Tải các biến môi trường từ tệp .env tương ứng
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

// --- CẤU HÌNH ---
const WPGRAPHQL_URL = process.env.REACT_APP_WPGRAPHQL_URL;
const OUTPUT_DIR = path.join(__dirname, '../extracted-scripts');
const BLOCKS_DIR = path.join(__dirname, '../src/components/Blocks');
// -----------------

// Hàm để định dạng màu cho terminal
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
};

// Kiểm tra xem URL của GraphQL đã được cấu hình chưa
if (!WPGRAPHQL_URL) {
    console.error(`${colors.red}Lỗi: Biến môi trường REACT_APP_WPGRAPHQL_URL chưa được thiết lập trong tệp .env của bạn.${colors.reset}`);
    process.exit(1);
}

// Câu truy vấn GraphQL để lấy tất cả nội dung cần thiết
const GET_ALL_CONTENT_QUERY = gql`
  query GetAllContentWithScripts {
    pages(where: {status: PUBLISH}, first: 100) { # Tăng giới hạn nếu cần
      nodes {
        slug
        uri
        flexibleContentHtml
      }
    }
    services(first: 100) {
      nodes {
        slug
        uri
        flexibleContentHtml
      }
    }
    posts(first: 100) {
      nodes {
        slug
        uri
        flexibleContentHtml
      }
    }
    events(first: 100) {
        nodes {
          slug
          uri
          flexibleContentHtml
        }
      }
  }
`;

/**
 * Hàm chính để chạy toàn bộ quá trình
 */
async function fetchAndExtractAllScripts() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let createComponentBlocks = false;

    await new Promise(resolve => {
        rl.question(`${colors.yellow}Bạn có muốn tạo cấu trúc thư mục cho Blocks (src/components/Blocks/<slug>/index.js) không? (y/n): ${colors.reset}`, (answer) => {
            if (answer.toLowerCase() === 'y') {
                createComponentBlocks = true;
            }
            rl.close();
            resolve();
        });
    });

    console.log(`${colors.cyan}Đang kết nối đến WPGraphQL tại:${colors.reset} ${WPGRAPHQL_URL}`);

    // Tạo một client GraphQL
    const client = new GraphQLClient(WPGRAPHQL_URL);

    try {
        // Gửi truy vấn
        const data = await client.request(GET_ALL_CONTENT_QUERY);
        console.log(`${colors.green}✓ Lấy dữ liệu từ GraphQL thành công.${colors.reset}`);

        // Đảm bảo thư mục đầu ra tồn tại
        if (fs.existsSync(OUTPUT_DIR)) {
            fs.rmSync(OUTPUT_DIR, { recursive: true, force: true }); // Xóa thư mục cũ để làm sạch
        }
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });

        // Tạo một hàm để xử lý từng nhóm nội dung (pages, services, etc.)
        const processEntries = (entries, type, shouldCreateBlocks) => {
            if (!entries || entries.length === 0) {
                console.log(`${colors.yellow}Không tìm thấy mục nào cho loại: ${type}.${colors.reset}`);
                return;
            }
            
            console.log(`\n${colors.cyan}--- Bắt đầu xử lý ${entries.length} mục loại: ${type} ---${colors.reset}`);
            
            entries.forEach(entry => {
                const { slug, flexibleContentHtml } = entry;
                if (!flexibleContentHtml) return;

                const $ = cheerio.load(flexibleContentHtml);
                const scripts = $('script');

                if (scripts.length > 0) {
                    const entryDir = path.join(OUTPUT_DIR, type, slug);
                    fs.mkdirSync(entryDir, { recursive: true });

                    scripts.each((index, element) => {
                        const scriptTagContent = $.html(element); // Get the full script tag
                        if (scriptTagContent && scriptTagContent.trim()) {
                            const scriptPath = path.join(entryDir, `script_tag_${index + 1}.html`); // Save as .html or .txt if preferred
                            fs.writeFileSync(scriptPath, scriptTagContent, 'utf8');
                        }
                    });
                    console.log(`[${type}] ${colors.green}✓ Trích xuất ${scripts.length} script tag từ '${slug}'.${colors.reset}`);

                    if (shouldCreateBlocks && slug) {
                        const blockBasePath = path.join(BLOCKS_DIR, type); // Create type specific base path
                        const blockPath = path.join(blockBasePath, slug);
                        const indexFilePath = path.join(blockPath, 'index.js');
                        if (!fs.existsSync(blockPath)) {
                            fs.mkdirSync(blockPath, { recursive: true });
                            const componentName = slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
                            const componentContent = `// filepath: src/components/Blocks/${type}/${slug}/index.js\nimport React from 'react';\n\nconst ${componentName}Block = (props) => {\n    return (\n        <div>\n            {/* TODO: Implement ${componentName}Block component for ${slug} */}\n            Content for ${slug}\n        </div>\n    );\n};\n\nexport default ${componentName}Block;\n`;
                            fs.writeFileSync(indexFilePath, componentContent, 'utf8');
                            console.log(`[Block] ${colors.green}✓ Tạo cấu trúc Block: src/components/Blocks/${type}/${slug}/index.js (vì có script)${colors.reset}`);
                        } else {
                            console.log(`[Block] ${colors.yellow}ℹ Thư mục Block đã tồn tại: src/components/Blocks/${type}/${slug}${colors.reset}`);
                        }
                    }
                }
            });
        };
        
        // Xử lý tất cả các loại nội dung
        processEntries(data.pages.nodes, 'pages', createComponentBlocks);
        processEntries(data.services.nodes, 'services', createComponentBlocks);
        processEntries(data.posts.nodes, 'posts', createComponentBlocks);
        processEntries(data.events.nodes, 'events', createComponentBlocks);

        console.log(`\n${colors.green}✓✓✓ QUÁ TRÌNH HOÀN TẤT! Tất cả các script đã được lưu trong thư mục:${colors.reset} ${OUTPUT_DIR}`);

    } catch (error) {
        console.error(`${colors.red}✗ Đã xảy ra lỗi nghiêm trọng:${colors.reset}`);
        console.error(error);
    }
}

// Chạy hàm chính
fetchAndExtractAllScripts();