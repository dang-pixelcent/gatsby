// gatsby-node.js

const path = require(`path`);
const fs = require('fs');
const cheerio = require('cheerio');

// Các helper functions
const replaceInternalLinks = require('./src/helpers/replaceButtonLinks.js');
const getTerminalColors = require('./src/utils/terminalColors.js');
const getCachedSeoData = require('./src/helpers/getCachedSeoData.js');
const processSeoData = require('./src/helpers/processSeoData.js');
const processAllScripts = require('./src/helpers/processAllScripts.js');

// dotenv
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

// path
const SNIPPETS_CACHE_DIR = path.join(__dirname, '.cache/page-snippets');

// Các phần logic tách riêng
const createResolvers = require('./gatsby-node-logic/createResolvers');
const onCreateWebpackConfig = require('./gatsby-node-logic/onCreateWebpackConfig');
const onPreInit = require('./gatsby-node-logic/onPreInit');
const onPreBootstrap = require('./gatsby-node-logic/onPreBootstrap');

// lấy màu terminal
const colors = getTerminalColors();

/** ==========================KIỂM TRA BIẾN MÔI TRƯỜNG========================== */
const SEO_QUERY_URL = process.env.REACT_APP_SEO_QUERY_URL;

if (!SEO_QUERY_URL) {
  console.error(`${colors.red}REACT_APP_SEO_QUERY_URL must be set in .env file${colors.reset}`);
  process.exit(1);
}
/**========================== END KIỂM TRA ========================== */

/** ==========================PHẦN TẠO TRANG PHÂN TRANG CHO BLOGS========================== */
async function createPaginatedBlogPages({ graphql, actions }) {
  const { createPage } = actions;
  // khung trang cho blogs
  const blogArchiveTemplate = path.resolve('./src/components/templates/blog/blogArchive.js');
  const postsPerPage = 5;
  // lấy date seo cho blogs từ cacche
  const blogsDataSeo = getCachedSeoData(`${SEO_QUERY_URL}/blogs/`);
  const processedBlogsSeo = processSeoData(blogsDataSeo);

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
      const error429 = pageResult.errors.find(
        err => err.message && err.message.includes('429')
      );
      if (error429) {
        const delay = 2000 * pageNumber; // tăng dần theo số lần thử
        console.warn(`${colors.yellow}429 Too Many Requests. Delay ${delay}ms before retry...${colors.reset}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue; // thử lại vòng lặp này
      }
      console.error(`GraphQL query for blog page ${pageNumber} failed`, pageResult.errors);
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
        metaHtml: processedBlogsSeo.metaHtml || null,
        schemas: processedBlogsSeo.schemas || [],
        pageInfo: {
          name: 'Blogs',
          slug: null,
          uri: '/blogs/',
          id: null // Không cần id cho blogs, chỉ cần uri
        }
      },
    });

    // Cập nhật các biến cho vòng lặp tiếp theo
    endCursor = pageInfo.endCursor;
    hasNextPage = pageInfo.hasNextPage;
    pageNumber++;
  }
}
/** ==========================END PHẦN TẠO TRANG PHÂN TRANG CHO BLOGS========================== */

/** ==========================PHẦN TẠO TRANG PHÂN TRANG CHO CATEGORIES========================== */
async function createPaginatedCategoryPages({ graphql, actions }) {
  const { createPage } = actions;
  const blogArchiveTemplate = path.resolve('./src/components/templates/blog/blogArchive.js');
  const postsPerPage = 5;

  // Bước 1: Lấy tất cả categories
  const categoriesResult = await graphql(`
    query GetAllCategories {
      cms {
        categories(first: 999) {
          nodes {
            name
            slug
            uri
            id
          }
        }
      }
    }
  `);

  if (categoriesResult.errors) {
    console.error("Failed to fetch categories", categoriesResult.errors);
    return;
  }

  const categories = categoriesResult.data.cms.categories.nodes;
  console.log(`Processing ${categories.length} categories...`);

  // Bước 2: Xử lý từng category
  for (const category of categories) {
    console.log(`${colors.cyan}Processing category: ${category.name}${colors.reset}`);

    // Lấy cached SEO data cho category
    const categoryDataSeo = getCachedSeoData(`${SEO_QUERY_URL}${category.uri}`);
    // Xử lý seoData để tách meta và schema
    const processedCategorySeo = processSeoData(categoryDataSeo);

    // Đếm tổng số posts trong category này
    const countResult = await graphql(`
      query GetCategoryPostCount($categoryName: String!) {
        cms {
          posts(first: 9999, where: {categoryName: $categoryName}) {
            nodes { id }
          }
        }
      }
    `, { categoryName: category.name });

    if (countResult.errors) {
      console.error(`Failed to count posts for category ${category.name}`, countResult.errors);
      continue;
    }

    const totalPosts = countResult.data.cms.posts.nodes.length;
    const numPages = Math.ceil(totalPosts / postsPerPage);

    if (totalPosts === 0) {
      console.log(`${colors.yellow}Category ${category.name} has no posts, skipping...${colors.reset}`);
      continue;
    }

    console.log(`Category ${category.name}: ${totalPosts} posts, ${numPages} pages`);

    // Bước 3: Tạo các trang phân trang cho category này
    let hasNextPage = true;
    let endCursor = null;
    let pageNumber = 1;

    while (hasNextPage) {
      console.log(`Fetching data for category ${category.name}, page ${pageNumber}...`);

      const pageResult = await graphql(`
        query GetCategoryPostsForPage($categoryName: String!, $first: Int!, $after: String) {
          cms {
            posts(first: $first, after: $after, where: { 
              categoryName: $categoryName,
              orderby: { field: DATE, order: DESC } 
            }) {
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
      `, {
        categoryName: category.name,
        first: postsPerPage,
        after: endCursor
      });

      if (pageResult.errors) {
        const error429 = pageResult.errors.find(
          err => err.message && err.message.includes('429')
        );
        if (error429) {
          const delay = 2000 * pageNumber; // tăng dần theo số lần thử
          console.warn(`${colors.yellow}429 Too Many Requests. Delay ${delay}ms before retry...${colors.reset}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; // thử lại vòng lặp này
        }
        console.error(`GraphQL query for category ${category.name}, page ${pageNumber} failed`, pageResult.errors);
        hasNextPage = false;
        continue;
      }

      const postsOnPage = pageResult.data.cms.posts.edges;
      const pageInfo = pageResult.data.cms.posts.pageInfo;

      // Tạo đường dẫn cho trang category
      const pagePath = pageNumber === 1
        ? category.uri
        : `${category.uri}page/${pageNumber}/`;

      createPage({
        path: pagePath,
        component: blogArchiveTemplate,
        context: {
          posts: postsOnPage.map(edge => edge.node),
          pageNumber: pageNumber,
          numPages: numPages,
          hasNextPage: pageInfo.hasNextPage,
          metaHtml: processedCategorySeo.metaHtml || null,
          schemas: processedCategorySeo.schemas || [],
          pageInfo: {
            name: category.name,
            slug: category.slug,
            uri: category.uri,
            id: category.id
          }
        },
      });

      // Cập nhật cho vòng lặp tiếp theo
      endCursor = pageInfo.endCursor;
      hasNextPage = pageInfo.hasNextPage;
      pageNumber++;
    }
  }
}
/** ==========================END PHẦN TẠO TRANG PHÂN TRANG CHO CATEGORIES========================== */


/** ==========================PHẦN TẠO TRANG PHỔ THÔNG============================= */
exports.createPages = async ({ actions, graphql }) => {
  //=======================PHẦN TRUY VẤN===================================
  const result = await graphql(`
        query {
            cms {
                headerHtmlall
                footerHtmlall
                pages(where: {status: PUBLISH}, first: 999) { edges { node { id, slug, uri, title, flexibleContentHtml, isFrontPage, date, 
                    htmlSnippets {
                      bodyOpenHtml
                      footerHtml
                      headerHtml
                    }
                } } }
                services(first: 999) { nodes { id, slug, uri, title, flexibleContentHtml, date, 
                    htmlSnippets {
                      bodyOpenHtml
                      footerHtml
                      headerHtml
                    }
                } }
                events(first: 999) { nodes { id, slug, uri, title, flexibleContentHtml, date, 
                    htmlSnippets {
                      bodyOpenHtml
                      footerHtml
                      headerHtml
                    }
                } }
                posts(first: 999) { nodes { id, slug, uri, title, flexibleContentHtml, date, 
                    htmlSnippets {
                      bodyOpenHtml
                      footerHtml
                      headerHtml
                    }
                } }
                caseStudiesPost(first: 999) { nodes { id, slug, uri, title, flexibleContentHtml, date, 
                    htmlSnippets {
                      bodyOpenHtml
                      footerHtml
                      headerHtml
                    }
                } }

                htmlSnippets {
                    bodyOpenHtml
                    footerHtml
                    headerHtml
                }
            }
        }
    `);

  // Kiểm tra lỗi sau khi query (rất quan trọng)
  if (result.errors) {
    console.error("Main GraphQL query failed!", result.errors);
    throw new Error("Main GraphQL query failed!");
  }
  const { data } = result;

  //======================PHẦN CHÍNH===================================
  // XỬ LÝ BLOGs với phân trang
  await createPaginatedBlogPages({ graphql, actions });

  // XỬ LÝ CÁC TRANG CATEGORY với phân trang
  await createPaginatedCategoryPages({ graphql, actions });


  /**
   * PHẦN XỬ LÝ CÁC TRANG DYNAMIC
   */
  const processNode = (node) => {
    const seoData = getCachedSeoData(`${SEO_QUERY_URL}${node.uri}`);
    const processedSeo = processSeoData(seoData);

    let htmlContent = node.flexibleContentHtml;

    // --- BƯỚC 1: XỬ LÝ VIDEO EMBEDS ---
    if (htmlContent) {
      const $ = cheerio.load(htmlContent);

      const embedSelectors = [
        'iframe[src*="youtube.com"]',
        'iframe[src*="wistia.net"]',
        'blockquote.tiktok-embed',
        'blockquote.twitter-tweet'
      ];

      $(embedSelectors.join(', ')).each((index, element) => {
        const embedElement = $(element);
        const parent = embedElement.parent(); // Lấy thẻ cha

        // Lấy class và style từ thẻ cha
        const parentClass = parent.attr('class') || '';
        const parentStyle = parent.attr('style') || '';

        // Lấy HTML bên trong thẻ cha (chính là mã nhúng)
        const embedCode = encodeURIComponent(parent.html());

        // Tạo placeholder mới, sao chép class và style từ thẻ cha
        const placeholder = `<div 
                                    class="lazy-embed-placeholder ${parentClass}" 
                                    style="${parentStyle}"
                                    data-embed-code="${embedCode}"
                                 ></div>`;

        // Thay thế thẻ cha bằng placeholder đã được nâng cấp
        parent.replaceWith(placeholder);
      });

      htmlContent = $.html();
    }
    // --- KẾT THÚC XỬ LÝ VIDEO ---

    // Bước 1: Thay thế các link nội bộ trước
    const htmlWithReplacedLinks = replaceInternalLinks(htmlContent);
    // Bước 2: Xử lý script trên HTML đã được cập nhật
    const { cleanedHtml, scripts, specialScripts } = processAllScripts(htmlWithReplacedLinks, node.slug);
    // Bước 3: lưu snippets riêng vào cache
    if (node.htmlSnippets) {
      const slug = node.uri.replace(/\//g, '') || 'homepage';
      const snippetPath = path.join(SNIPPETS_CACHE_DIR, `${slug}.json`);
      try {
        fs.writeFileSync(snippetPath, JSON.stringify(node.htmlSnippets));
        console.log(`${colors.green}Page snippets saved for: ${node.uri}${colors.reset}`);
      } catch (error) {
        console.error(`${colors.red}Error saving snippets for ${node.uri}:${colors.reset}`, error);
      }
    }

    return {
      ...node,
      flexibleContentHtml: cleanedHtml,
      scripts: scripts,
      specialScripts: specialScripts,
      metaHtml: processedSeo.metaHtml || null,
      schemas: processedSeo.schemas || []
    };
  };

  /** PHẦN TẠO TRANG */
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
    .filter(({ node }) => node.uri !== '/blogs/') // Lọc bỏ trang /blogs/ để tránh trùng với trang blog chính
    .map(({ node }) => processNode(node))
    .forEach(page => createPageFromNode(page, ''));

  console.log(`${colors.cyan}Processing services...${colors.reset}`);
  data.cms.services.nodes.map(processNode).forEach(service => createPageFromNode(service, ''));

  console.log(`${colors.cyan}Processing events...${colors.reset}`);
  data.cms.events.nodes.map(processNode).forEach(event => createPageFromNode(event, ''));

  console.log(`${colors.cyan}Processing blogs...${colors.reset}`);
  data.cms.posts.nodes.map(processNode).forEach(blog => createPageFromNode(blog, ''));

  console.log(`${colors.cyan}Processing case studies...${colors.reset}`);
  data.cms.caseStudiesPost.nodes.map(processNode).forEach(caseStudy => createPageFromNode(caseStudy, ''));

  // tạo trang kết quả tìm kiếm cho blogs
  console.log(`${colors.cyan}Creating search result page for blogs...${colors.reset}`);
  actions.createPage({
    path: "/blogs/search",
    matchPath: "/blogs/search/*", // Dấu * cho phép các query param như ?q=...
    component: path.resolve("./src/components/templates/blog/searchResult.js"),
  });


  /** Lưu tracking codes vào cache */
  if (data.cms.htmlSnippets) {
    const snippetsData = data.cms.htmlSnippets;
    const cacheDir = path.join(__dirname, '.cache');
    // Đổi tên file cache cho rõ nghĩa hơn
    const snippetsCachePath = path.join(cacheDir, 'global-html-snippets.json');
    try {
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(snippetsCachePath, JSON.stringify(snippetsData, null, 2));
      console.log(`${colors.green}Global HTML snippets saved to cache.${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}Error saving global snippets:${colors.reset}`, error);
    }
  }
};
// ===================END PHẦN TẠO TRANG=======================

// ==================PHẦN XỬ LÝ SCRIPTS ĐẶC BIỆT KHI RENDER TRANG=======================
exports.onCreateWebpackConfig = onCreateWebpackConfig;
exports.createResolvers = createResolvers;
exports.onPreBootstrap = onPreBootstrap({ rootDir: __dirname });
exports.onPreInit = onPreInit({ rootDir: __dirname });
// ==================END PHẦN XỬ LÝ SCRIPTS ĐẶC BIỆT KHI RENDER TRANG=======================