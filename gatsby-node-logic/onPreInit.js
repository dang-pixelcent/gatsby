const path = require('path');
const appRoot = require('app-root-path');
const fs = require('fs');
const rootDir = appRoot.path;

/**
 * onPreInit: Chạy đầu tiên nhất trong lifecycle của Gatsby.
 * Nhiệm vụ: Đảm bảo tất cả các thư mục cần thiết cho quá trình build đều tồn tại.
 */
module.exports = () => {
    const dirsToCreate = [
        path.join(rootDir, '.cache/headerfooter'),
        path.join(rootDir, '.cache/page-snippets'),
        path.join(rootDir, 'cache/seo'),
        path.join(rootDir, 'public/extracted-scripts'),
    ];

    console.log('Ensuring required directories exist...');

    dirsToCreate.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`  ✓ Created directory: ${dir}`);
        }
    });
};