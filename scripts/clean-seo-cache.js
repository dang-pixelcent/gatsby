const fs = require('fs')
const path = require('path')

const CACHE_DIR = path.join(__dirname, '../cache/seo')

function cleanSeoCache() {
    try {
        if (fs.existsSync(CACHE_DIR)) {
            console.log('Cleaning SEO cache...')

            // Đọc tất cả files trong cache directory
            const files = fs.readdirSync(CACHE_DIR)

            // Xóa từng file
            files.forEach(file => {
                const filePath = path.join(CACHE_DIR, file)
                fs.unlinkSync(filePath)
                console.log(`Deleted: ${file}`)
            })

            console.log(`Cleaned ${files.length} SEO cache files`)
        } else {
            console.log('No SEO cache directory found')
        }
    } catch (error) {
        console.error('Error cleaning SEO cache:', error.message)
    }
}

cleanSeoCache()