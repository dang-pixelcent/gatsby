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

// Tạo thư mục cache cho snippets từng page nếu chưa có
const SNIPPETS_CACHE_DIR = path.join(__dirname, '.cache/page-snippets');
if (!fs.existsSync(SNIPPETS_CACHE_DIR)) {
  fs.mkdirSync(SNIPPETS_CACHE_DIR, { recursive: true });
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
    else {
      // Xử lý script inline (không có src)
      const inlineContent = $(element).html(); // Lấy nội dung bên trong thẻ <script>

      // Chỉ thêm vào nếu có nội dung
      if (inlineContent) {
        extractedScripts.push({
          resourceType: 'inline-script',
          content: `(function(){\n${inlineContent}\n})();`,
          id: `inline-script-${pageSlug}-${index}` // Tạo ID để làm key
        });
      }
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
          seoData: categoryDataSeo || null,
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


exports.createPages = async ({ actions, graphql }) => {
  //=======================PHẦN TRUY VẤN===================================
  const result = await graphql(`
        query {
            cms {
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
   * PHẦN XỬ LÝ RIÊNG CHO TRANG HOME
   * - Lấy dữ liệu SEO từ cache
   *  - Tạo trang home với template riêng
   *  - Lưu các snippets HTML riêng cho trang home vào cache
   */
  // trang home riêng + SEO
  const homeDataSeo = getCachedSeoData(`${SEO_QUERY_URL}/`);

  // Tìm homepage node để xử lý snippets
  const homepageNode = data.cms.pages.edges.find(({ node }) => node.isFrontPage)?.node;
  let homepageSnippets = null;

  if (homepageNode && homepageNode.htmlSnippets) {
    // Lưu snippets riêng cho homepage
    const snippetPath = path.join(SNIPPETS_CACHE_DIR, 'homepage.json');
    try {
      fs.writeFileSync(snippetPath, JSON.stringify(homepageNode.htmlSnippets));
      homepageSnippets = homepageNode.htmlSnippets;
      console.log(`${colors.green}Homepage snippets saved to cache.${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}Error saving homepage snippets:${colors.reset}`, error);
    }
  }

  actions.createPage({
    path: `/`,
    component: path.resolve(`./src/components/templates/home.js`),
    context: {
      seoData: homeDataSeo || null,
      htmlSnippets: homepageSnippets
    },
  });
  /**
   * END PHẦN XỬ LÝ TRANG HOME
   */

  /**
   * PHẦN XỬ LÝ CÁC TRANG DYNAMIC
   */
  const processNode = (node) => {
    const seoData = getCachedSeoData(`${SEO_QUERY_URL}${node.uri}`);
    let htmlContent = node.flexibleContentHtml;

    // --- BƯỚC 1: XỬ LÝ VIDEO EMBEDS ---
    if (htmlContent) {
      const $ = cheerio.load(htmlContent);

      // 1a. Tìm và thay thế YouTube iframes
      $('iframe[src*="youtube.com/embed"]').each((index, element) => {
        const iframe = $(element);
        const src = iframe.attr('src');
        const videoIdMatch = src.match(/embed\/([^?]+)/);
        if (videoIdMatch && videoIdMatch[1]) {
          const videoId = videoIdMatch[1];
          const placeholder = `<div 
                                      class="youtube-placeholder" 
                                      data-videoid="${videoId}"
                                      id="youtube-${node.slug}-${index}"
                                   ></div>`;
          iframe.replaceWith(placeholder);
        }
      });

      // 1b. Tìm và thay thế Wistia iframes
      $('iframe[src*="fast.wistia.net/embed"]').each((index, element) => {
        const iframe = $(element);
        const src = iframe.attr('src');
        // Wistia ID thường nằm trong URL dạng .../iframe/VIDEO_ID
        const videoIdMatch = src.match(/iframe\/([a-z0-9]+)/);
        if (videoIdMatch && videoIdMatch[1]) {
          const videoId = videoIdMatch[1];
          const placeholder = `<div 
                                      class="wistia-placeholder" 
                                      data-videoid="${videoId}"
                                      id="wistia-${node.slug}-${index}"
                                   ></div>`;
          iframe.replaceWith(placeholder);
        }
      });

      // 1c. ✨ Xử lý TikTok (cho tương lai)
      $('blockquote.tiktok-embed').each((index, element) => {
        const blockquote = $(element);
        // Lấy toàn bộ mã nhúng và mã hóa để truyền an toàn qua data attribute
        const embedCode = encodeURIComponent(blockquote.parent().html());
        blockquote.parent().replaceWith(`<div class="tiktok-placeholder" data-embed-code="${embedCode}" id="tiktok-${node.slug}-${index}"></div>`);
      });

      // 1d. ✨ Xử lý X / Twitter (cho tương lai)
      $('blockquote.twitter-tweet').each((index, element) => {
        const blockquote = $(element);
        const embedCode = encodeURIComponent(blockquote.parent().html());
        blockquote.parent().replaceWith(`<div class="twitter-placeholder" data-embed-code="${embedCode}" id="twitter-${node.slug}-${index}"></div>`);
      });

      // Cập nhật lại nội dung HTML đã xử lý
      htmlContent = $.html();
    }
    // --- KẾT THÚC XỬ LÝ VIDEO ---

    // Bước 1: Thay thế các link nội bộ trước
    const htmlWithReplacedLinks = replaceInternalLinks(htmlContent);
    // Bước 2: Xử lý script trên HTML đã được cập nhật
    const { cleanedHtml, scripts } = processAllScripts(htmlWithReplacedLinks, node.slug);
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