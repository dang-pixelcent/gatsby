// gatsby-node.js

const path = require(`path`);
const fs = require('fs');
const cheerio = require('cheerio');
const replaceInternalLinks = require('./src/helpers/replaceButtonLinks.js');
const getTerminalColors = require('./src/utils/terminalColors.js');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

const colors = getTerminalColors();
const CACHE_DIR = path.join(__dirname, 'cache/seo');
const SCRIPTS_OUTPUT_DIR = path.join(__dirname, 'public/extracted-scripts');
const SEO_QUERY_URL = process.env.REACT_APP_SEO_QUERY_URL;

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
if (!fs.existsSync(SCRIPTS_OUTPUT_DIR)) fs.mkdirSync(SCRIPTS_OUTPUT_DIR, { recursive: true });

if (!SEO_QUERY_URL) {
  console.error(`${colors.red}REACT_APP_SEO_QUERY_URL must be set in .env file${colors.reset}`);
  process.exit(1);
}

function sanitizeFilename(url) {
  return url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

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

/**
 * Trích xuất tất cả các thẻ script từ một chuỗi HTML,
 * lấy toàn bộ thuộc tính của chúng và trả về HTML đã được làm sạch.
 * @param {string} html - Chuỗi HTML đầu vào.
 * @param {string} pageSlug - Slug của trang để tạo ID duy nhất.
 * @returns {{cleanedHtml: string, scripts: Array<Object>}}
 */
function processAllScripts(html = '', pageSlug) {
  if (!html || !pageSlug) {
    return { cleanedHtml: html || '', scripts: [] };
  }

  const $ = cheerio.load(html);
  const scriptTags = $('script');
  const extractedScripts = [];

  scriptTags.each((index, element) => {
    // element.attribs chứa một object với tất cả các thuộc tính của thẻ
    // Ví dụ: { src: '...', async: '', type: 'module' }
    const attributes = { ...element.attribs };

    // Chúng ta vẫn chỉ quan tâm đến các script có nguồn bên ngoài (có src)
    if (attributes.src) {
      // Đảm bảo script luôn có một ID duy nhất để làm key trong React
      if (!attributes.id) {
        attributes.id = `external-script-${pageSlug}-${index}`;
      }

      // Thêm thông tin metadata nếu cần, ví dụ 'type' ở đây là để phân biệt
      // với các loại tài nguyên khác sau này, không phải thuộc tính 'type' của script.
      extractedScripts.push({
        resourceType: 'external-script',
        attributes: attributes,
      });
    }
    // Các script inline (không có src) sẽ bị xóa cùng với các script khác mà không được xử lý
  });

  // Xóa tất cả các thẻ script khỏi HTML
  scriptTags.remove();

  return {
    cleanedHtml: $.html(),
    scripts: extractedScripts,
  };
}


async function createPaginatedBlogPages({ graphql, actions }) {
  const { createPage } = actions;
  // khung trang cho blogs
  const blogArchiveTemplate = path.resolve('./src/components/templates/blog/blogArchive.js');
  const postsPerPage = 5;
  // lấy date seo cho blogs từ cacche
  const blogsDataSeo = getCachedSeoData(`${SEO_QUERY_URL}/blogs/`);

  // Bước 1: Vẫn lấy tổng số bài viết để tính tổng số trang (numPages)
  const countResult = await graphql(`
        query GetAllPostIds {
            cms {
                posts(first: 9999) {
                    nodes { id }
                }
            }
        }
    `);

  if (countResult.errors) {
    console.error("Failed to fetch post count", countResult.errors);
    return;
  }

  const totalPosts = countResult.data.cms.posts.nodes.length;
  const numPages = Math.ceil(totalPosts / postsPerPage);

  console.log(`Total Posts: ${totalPosts}, Total Pages: ${numPages}`);


  let hasNextPage = true;
  let endCursor = null; // Ban đầu chưa có "dấu trang"
  let pageNumber = 1;

  // Dùng vòng lặp while thay vì for
  while (hasNextPage) {
    console.log(`Fetching data for blog page ${pageNumber}...`);

    // Query cho trang hiện tại, dùng `after: $endCursor`
    const pageResult = await graphql(`
            query GetPostsForPage($first: Int!, $after: String) {
                cms {
                    posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
                        edges {
                            node {
                                id
                                title
                                uri
                                excerpt(format: RENDERED)
                                featuredImage {
                                    node {
                                        sourceUrl
                                        altText
                                    }
                                }
                            }
                        }
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                    }
                }
            }
        `, { first: postsPerPage, after: endCursor });

    if (pageResult.errors) {
      console.error(`GraphQL query for blog page ${pageNumber} failed`, pageResult.errors);
      // Nếu lỗi, dừng vòng lặp
      hasNextPage = false;
      continue;
    }

    const postsOnPage = pageResult.data.cms.posts.edges;
    const pageInfo = pageResult.data.cms.posts.pageInfo;

    const pagePath = pageNumber === 1 ? '/blogs/' : `/blogs/page/${pageNumber}`;

    createPage({
      path: pagePath,
      component: blogArchiveTemplate,
      context: {
        posts: postsOnPage.map(edge => edge.node),
        pageNumber: pageNumber,
        numPages: numPages, // Tổng số trang vẫn được truyền xuống
        hasNextPage: pageInfo.hasNextPage,
        seoData: blogsDataSeo || null,
      },
    });

    // Cập nhật các biến cho vòng lặp tiếp theo
    endCursor = pageInfo.endCursor;
    hasNextPage = pageInfo.hasNextPage;
    pageNumber++;
  }
}


exports.createPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
    query {
      cms {
        pages(where: {status: PUBLISH}, first: 99) { edges { node { id, slug, uri, title, flexibleContentHtml, isFrontPage, date } } }
        services(first: 99) { nodes { id, slug, uri, title, flexibleContentHtml, date } }
        events(first: 99) { nodes { id, slug, uri, title, flexibleContentHtml, date } }
        posts(first: 99) { nodes { id, slug, uri, title, flexibleContentHtml, date } }
        caseStudies(first: 99) { nodes { id, slug, uri, title, flexibleContentHtml, date } }
        themeSettings { themeOptionsSettings { headerFooter { body, footer, header } } }
      }
    }
  `);

  // XỬ LÝ BLOG
  await createPaginatedBlogPages({ graphql, actions });

  // trang home riêng + SEO
  const homeDataSeo = getCachedSeoData(`${SEO_QUERY_URL}/`);
  actions.createPage({
    path: `/`,
    component: path.resolve(`./src/components/templates/home.js`),
    context: {
      seoData: homeDataSeo || null
    },
  });

  const processNode = (node) => {
    const seoData = getCachedSeoData(`${SEO_QUERY_URL}${node.uri}`);
    // Bước 1: Thay thế các link nội bộ trước
    const htmlWithReplacedLinks = replaceInternalLinks(node.flexibleContentHtml);
    // Bước 2: Xử lý script trên HTML đã được cập nhật
    const { cleanedHtml, scripts } = processAllScripts(htmlWithReplacedLinks, node.slug);

    return {
      ...node,
      flexibleContentHtml: cleanedHtml,
      scripts: scripts,
      seoData: seoData,
    };
  };

  const createPageFromNode = (node, pathPrefix = '') => {
    actions.createPage({
      path: `${pathPrefix}${node.uri}`,
      component: path.resolve(`./src/components/templates/dynamicPages.js`),
      context: { ...node },
    });
  };

  // Xử lý và tạo trang cho từng loại
  console.log(`${colors.cyan}Processing pages...${colors.reset}`);
  data.cms.pages.edges
    .filter(({ node }) => node.uri !== '/blogs/') // Lọc bỏ trang /blogs/
    .map(({ node }) => processNode(node))
    .forEach(page => {
      if (!page.isFrontPage) {
        createPageFromNode(page);
      }
    });

  console.log(`${colors.cyan}Processing services...${colors.reset}`);
  data.cms.services.nodes.map(processNode).forEach(service => createPageFromNode(service, ''));

  console.log(`${colors.cyan}Processing events...${colors.reset}`);
  data.cms.events.nodes.map(processNode).forEach(event => createPageFromNode(event, ''));

  console.log(`${colors.cyan}Processing blogs...${colors.reset}`);
  data.cms.posts.nodes.map(processNode).forEach(blog => createPageFromNode(blog, ''));

  console.log(`${colors.cyan}Processing case studies...${colors.reset}`);
  data.cms.caseStudies.nodes.map(processNode).forEach(caseStudy => createPageFromNode(caseStudy, ''));

  // tạo trang kết quả tìm kiếm cho blogs
  console.log(`${colors.cyan}Creating search result page for blogs...${colors.reset}`);
  actions.createPage({
    path: "/blogs/search",
    matchPath: "/blogs/search/*", // Dấu * cho phép các query param như ?q=...
    component: path.resolve("./src/components/templates/blog/searchResult.js"),
  });


  /** Lưu tracking codes vào cache */
  if (data.cms.themeSettings?.themeOptionsSettings?.headerFooter) {
    const headerFooterData = data.cms.themeSettings.themeOptionsSettings.headerFooter;
    const cacheDir = path.join(__dirname, '.cache');
    const trackingCodesCachePath = path.join(cacheDir, 'theme-tracking-codes.json');
    try {
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(trackingCodesCachePath, JSON.stringify(headerFooterData, null, 2));
      console.log(`${colors.green}Theme tracking codes saved to cache.${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}Error saving theme tracking codes:${colors.reset}`, error);
    }
  }
};