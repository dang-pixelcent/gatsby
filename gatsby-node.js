const path = require(`path`)
const remark = require(`remark`)
const html = require(`remark-html`)
const fs = require('fs')
const cheerio = require('cheerio')
const replaceInternalLinks = require('./src/helpers/replaceButtonLinks.js');
const getTerminalColors = require('./src/utils/terminalColors.js')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})

const colors = getTerminalColors()
const CACHE_DIR = path.join(__dirname, 'cache/seo')
const SEO_QUERY_URL = process.env.REACT_APP_SEO_QUERY_URL

// check seo query url
if (!SEO_QUERY_URL) {
  console.error(`${colors.red}REACT_APP_SEO_QUERY_URL must be set in .env file${colors.reset}`)
  process.exit(1)
}


// Tạo thư mục cache nếu chưa tồn tại
function sanitizeFilename(url) {
  return url.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

function getCachedSeoData(url) {
  try {
    const filename = sanitizeFilename(url)
    const filePath = path.join(CACHE_DIR, `${filename}.json`)

    if (fs.existsSync(filePath)) {
      const cached = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      console.log(`${colors.cyan}Using cached SEO data for ${url}${colors.reset}`)
      return cached.seoData
    }
  } catch (error) {
    console.error(`${colors.red}Error reading cached SEO data for ${url}: ${error.message}${colors.reset}`)
  }

  console.log(`${colors.yellow}No cached SEO data found for ${url}${colors.reset}`)
  return null
}

/**
 * Hàm bổ sung: Tự động loại bỏ tất cả các thẻ <script> khỏi một chuỗi HTML.
 * @param {string} html - Chuỗi HTML đầu vào.
 * @returns {string} - Chuỗi HTML đã được làm sạch.
 */
function removeScriptTags(html = '') {
  if (!html) return '';
  const $ = cheerio.load(html);
  $('script').remove(); // Tìm và xóa tất cả thẻ <script>
  return $.html();
}

exports.createPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
    query {
      cms {
        pages(where: {status: PUBLISH}, first: 99) {
          edges {
            node {
              id
              slug
              uri
              title
              flexibleContentHtml
              isFrontPage
              date
            }
          }
        }
        services(first: 99) {
          nodes {
            id
            slug
            uri
            title
            flexibleContentHtml
            date
          }
        }
        events(first: 99) {
          nodes {
            id
            slug
            uri
            title
            flexibleContentHtml
            date
          }
        }
        posts(first: 99) {
          nodes {
            id
            slug
            uri
            title
            flexibleContentHtml
            date
          }
        }
        themeSettings {
          themeOptionsSettings {
            headerFooter {
              body
              footer
              header
            }
          }
        }
      }
    }
  `)

  // truyền seo cho home
  console.log(`${colors.cyan}Getting home SEO data from cache...${colors.reset}`)
  const homeDataSeo = getCachedSeoData(`${SEO_QUERY_URL}/`)
  console.log(`${colors.cyan}Home SEO data result:${colors.reset}`, homeDataSeo ? 'SUCCESS' : 'FAILED')

  // Always create home page programmatically
  actions.createPage({
    path: `/`,
    component: path.resolve(`./src/components/templates/home.js`),
    context: {
      seoData: homeDataSeo || null
    },
  });

  // Hàm xử lý từng node để làm sạch HTML và lấy SEO data
  const processNode = (node) => {
    const seoData = getCachedSeoData(`${SEO_QUERY_URL}${node.uri}`);
    // Chạy cả hai hàm làm sạch
    const cleanedHtml = removeScriptTags(replaceInternalLinks(node.flexibleContentHtml));

    return {
      ...node,
      flexibleContentHtml: cleanedHtml, // Sử dụng HTML đã được làm sạch
      seoData: seoData,
    };
  };

  console.log(`${colors.cyan}Processing pages...${colors.reset}`);
  const pages = data.cms.pages.edges.map(({ node }) => processNode(node));
  console.log(`${colors.cyan}Pages processing completed${colors.reset}`);

  console.log(`${colors.cyan}Processing services...${colors.reset}`);
  const services = data.cms.services.nodes.map(processNode);
  console.log(`${colors.cyan}Services processing completed${colors.reset}`);

  console.log(`${colors.cyan}Processing events...${colors.reset}`);
  const events = data.cms.events.nodes.map(processNode);
  console.log(`${colors.cyan}Events processing completed${colors.reset}`);

  console.log(`${colors.cyan}Processing blogs...${colors.reset}`);
  const blogs = data.cms.posts.nodes.map(processNode);
  console.log(`${colors.cyan}Blogs processing completed${colors.reset}`);

  // Create pages
  pages.forEach(page => {
    if (!page.isFrontPage) {
      actions.createPage({
        path: page.slug,
        component: path.resolve(`./src/components/templates/dynamicPages.js`),
        context: {
          ...page
        },
      })
    }
  })

  services.forEach(service => {
    actions.createPage({
      path: `service/${service.slug}`,
      component: path.resolve(`./src/components/templates/dynamicPages.js`),
      context: {
        ...service
      },
    })
  })

  events.forEach(event => {
    actions.createPage({
      path: `events/${event.slug}`,
      component: path.resolve(`./src/components/templates/dynamicPages.js`),
      context: {
        ...event
      },
    })
  })

  blogs.forEach(blog => {
    actions.createPage({
      path: `blog/${blog.slug}`,
      component: path.resolve(`./src/components/templates/dynamicPages.js`),
      context: {
        ...blog
      },
    })
  })


  // === BẮT ĐẦU PHẦN THÊM MỚI: Lưu tracking codes vào tệp cache ===
  if (data.cms.themeSettings &&
    data.cms.themeSettings.themeOptionsSettings &&
    data.cms.themeSettings.themeOptionsSettings.headerFooter) {

    const headerFooterData = data.cms.themeSettings.themeOptionsSettings.headerFooter;
    const cacheDir = path.join(__dirname, '.cache'); // Thư mục .cache do Gatsby quản lý
    const trackingCodesCachePath = path.join(cacheDir, 'theme-tracking-codes.json');

    try {
      // Gatsby tự động tạo thư mục .cache
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      fs.writeFileSync(trackingCodesCachePath, JSON.stringify(headerFooterData, null, 2));
      console.log(`${colors.green}Theme tracking codes saved to cache:${colors.reset}`, trackingCodesCachePath);
    } catch (error) {
      console.error(`${colors.red}Error saving theme tracking codes to cache:${colors.reset}`, error);
    }
  } else {
    console.warn(`${colors.yellow}Theme tracking codes (headerFooter) not found in GraphQL response. Skipping cache write.${colors.reset}`);
  }
  // === KẾT THÚC PHẦN THÊM MỚI ===
}