// gatsby-node.js

const path = require(`path`);
const fs = require('fs');
const cheerio = require('cheerio');
const replaceInternalLinks = require('./src/helpers/replaceButtonLinks.js');
const getTerminalColors = require('./src/utils/terminalColors.js');

const { createRemoteFileNode } = require("gatsby-source-filesystem");

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@templates': path.resolve(__dirname, 'src/components/templates'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@context': path.resolve(__dirname, 'src/context'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@helpers': path.resolve(__dirname, 'src/helpers'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};

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
 * Hàm xử lý seoData, tách riêng meta tags và schema JSON.
 * @param {string} seoDataString - Chuỗi HTML SEO từ WordPress.
 * @returns {{metaHtml: string, schemas: Array<Object>}}
 */
function processSeoData(seoDataString) {
  if (!seoDataString) {
    return { metaHtml: '', schemas: [] };
  }

  const $ = cheerio.load(seoDataString);
  const schemas = [];

  // Tìm tất cả các script JSON-LD
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const scriptContent = $(el).html();
      if (scriptContent) {
        // Parse nội dung JSON và đẩy vào mảng schemas
        schemas.push(JSON.parse(scriptContent));
      }
    } catch (e) {
      console.error('Error parsing JSON-LD schema:', e);
    }
    // Xóa thẻ script này khỏi DOM ảo
    $(el).remove();
  });

  // HTML còn lại là các thẻ meta, title, link...
  const metaHtml = $.html();

  console.log(`[processSeoData] Extracted ${schemas.length} schemas. Meta HTML length: ${metaHtml.length}`);

  return { metaHtml, schemas };
}


// --- START: CẤU HÌNH SCRIPT ĐẶC BIỆT : XỬ LÝ VỊ TRÍ ĐỨNG CỦA SCRIPTs ---
const SPECIAL_SCRIPT_HANDLERS = {
  // Từ khóa để nhận diện script
  'form.jotform.com/jsform/': {
    // Hàm này sẽ được gọi khi tìm thấy script
    // Nó nhận vào element script (dưới dạng cheerio) và cheerio instance ($)
    createPlaceholder: (element, $) => {
      const src = $(element).attr('src');
      const formId = src.split('/').pop();
      if (!formId) return null;

      const placeholderId = `jotform-placeholder-${formId}`;
      // Thay thế thẻ <script> bằng một thẻ <div> placeholder
      $(element).replaceWith(`<div id="${placeholderId}"></div>`);

      // Trả về thông tin cần thiết cho client-side
      return { type: 'jotform', id: formId, placeholderId: placeholderId };
    }
  },
  // Bạn có thể thêm các handler khác ở đây trong tương lai
  // 'some-other-service.com/widget.js': {
  //   createPlaceholder: (element, $) => { ... }
  // }
};
// --- END: CẤU HÌNH SCRIPT ĐẶC BIỆT ---

/**
 * Trích xuất tất cả các thẻ script từ một chuỗi HTML,
 * lấy toàn bộ thuộc tính của chúng và trả về HTML đã được làm sạch.
 * @param {string} html - Chuỗi HTML đầu vào.
 * @param {string} pageSlug - Slug của trang để tạo ID duy nhất.
 * @returns {{cleanedHtml: string, scripts: Array<Object>, specialScripts: Array<Object>}}
 */
function processAllScripts(html = '', pageSlug) {
  if (!html || !pageSlug) {
    return { cleanedHtml: html || '', scripts: [], specialScripts: [] };
  }

  const $ = cheerio.load(html, null, false);
  const scriptTags = $('script');
  const extractedScripts = [];
  const specialScriptsFound = []; // Lưu các script đặc biệt đã được xử lý

  scriptTags.each((index, element) => {
    const attributes = { ...element.attribs };
    const src = attributes.src || '';
    const scriptType = attributes.type || 'text/javascript'; // Lấy type, mặc định là JS
    let isSpecial = false;

    // 1. Kiểm tra xem có phải script đặc biệt không
    for (const key in SPECIAL_SCRIPT_HANDLERS) {
      if (src.includes(key)) {
        const handler = SPECIAL_SCRIPT_HANDLERS[key];
        const specialScriptInfo = handler.createPlaceholder(element, $);
        if (specialScriptInfo) {
          specialScriptsFound.push(specialScriptInfo);
        }
        isSpecial = true;
        break; // Đã xử lý, chuyển sang script tiếp theo
      }
    }

    // 2. Nếu là script đặc biệt, bỏ qua và không làm gì thêm
    if (isSpecial) {
      return;
    }

    // 3. Xử lý script thông thường (như cũ)
    if (src) {
      if (!attributes.id) {
        attributes.id = `external-script-${pageSlug}-${index}`;
      }
      extractedScripts.push({
        resourceType: 'external-script',
        attributes: attributes,
      });
    } else {
      const inlineContent = $(element).html();
      if (inlineContent) {
        // Phân loại dựa trên 'type'
        if (scriptType === 'text/javascript') {
          // Chỉ bọc IIFE cho các script JavaScript thực thi
          extractedScripts.push({
            resourceType: 'inline-script', // Script để chạy
            content: `(function(){\n${inlineContent}\n})();`,
            id: `inline-script-${pageSlug}-${index}`
          });
        } else {
          // Đối với 'speculationrules', 'application/ld+json', etc.
          extractedScripts.push({
            resourceType: 'data-script', // Script dữ liệu
            content: inlineContent,
            attributes: attributes, // Giữ lại các attributes gốc (quan trọng là 'type')
            id: `data-script-${pageSlug}-${index}`
          });
        }
      }
    }
    $(element).remove();
  });

  return {
    cleanedHtml: $.html(),
    scripts: extractedScripts,
    specialScripts: specialScriptsFound, // Trả về danh sách script đặc biệt
  };
  // return { cleanedHtml: html, scripts: [], specialScripts: [] };
}


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
   * PHẦN XỬ LÝ RIÊNG CHO TRANG HOME
   * - Lấy dữ liệu SEO từ cache
   *  - Tạo trang home với template riêng
   *  - Lưu các snippets HTML riêng cho trang home vào cache
   */

  // 1. Chạy query cho trang chủ một cách thủ công
  const homePageDataResult = await graphql(`
    query HomePageQueryForNode {
      cms {
        pageBy(uri: "/") {
          title
          id
          template {
            templateName
            ... on GraphCMS_Template_Home {
              templateName
              homeContent {
                flexibleContent {
                  ... on GraphCMS_HomeContentFlexibleContentBannerLayout {
                    __typename
                    desc
                    title
                    subTitle
                    sepText
                    serviceList {
                      link
                      title
                    }
                    boxDesktop {
                      node {
                        sourceUrl
                        localFile {
                          childImageSharp {
                            gatsbyImageData(quality: 60, formats: [AUTO, WEBP, AVIF], placeholder: NONE)
                          }
                        }
                      }
                    }
                    boxMobile {
                      node {
                        sourceUrl
                        localFile {
                          childImageSharp {
                            gatsbyImageData(width: 303, height: 216, quality: 60, formats: [AUTO, WEBP, AVIF], placeholder: NONE)
                          }
                        }
                      }
                    }
                    badgeLogo {
                      node {
                        sourceUrl
                        localFile {
                          childImageSharp {
                            gatsbyImageData(quality: 60, formats: [AUTO, WEBP, AVIF], placeholder: NONE)
                          }
                        }
                      }
                    }
                    backgroundImage {
                      node {
                        sourceUrl
                        localFile {
                          childImageSharp {
                            gatsbyImageData(quality: 60, formats: [AUTO, WEBP, AVIF], placeholder: NONE, layout: FULL_WIDTH)
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  if (homePageDataResult.errors) {
    console.error(`${colors.red}Homepage query in gatsby-node.js failed!${colors.reset}`, homePageDataResult.errors);
    throw new Error("Homepage query in gatsby-node.js failed!");
  }

  // trang home riêng + SEO
  const homeDataSeo = getCachedSeoData(`${SEO_QUERY_URL}/`);
  // [THAY ĐỔI] Xử lý seoData cho trang chủ
  const processedSeo = processSeoData(homeDataSeo);

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
      // seoData: homeDataSeo || null,
      // [THAY ĐỔI] Truyền dữ liệu đã xử lý vào context
      metaHtml: processedSeo.metaHtml || null,
      schemas: processedSeo.schemas || [],
      htmlSnippets: homepageSnippets,
      pageData: homePageDataResult.data
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
    .filter(({ node }) => node.uri !== '/blogs/') // Lọc bỏ trang /blogs/
    .map(({ node }) => processNode(node))
    .forEach(page => {
      if (!page.isFrontPage) {
        createPageFromNode(page, '');
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

  // ===================================================================
  // PHẦN THÊM MỚI: Xử lý và cache Header/Footer
  // ===================================================================
  console.log(`${colors.cyan}Processing and caching global Header/Footer HTML...${colors.reset}`);
  if (data.cms.headerHtmlall || data.cms.footerHtmlall) {
    console.log(`${colors.cyan}Raw Header/Footer HTML fetched. Processing...${colors.reset}`);
    const rawHeaderHtml = data.cms.headerHtmlall || "";
    const rawFooterHtml = data.cms.footerHtmlall || "";

    // Gọi hàm xử lý link của bạn
    const processedHeaderHtml = replaceInternalLinks(rawHeaderHtml);
    const processedFooterHtml = replaceInternalLinks(rawFooterHtml);

    // Lưu file vào thư mục cache đã được tạo bởi onPreInit
    const CUSTOM_CACHE_DIR = path.join(__dirname, 'data');
    const processedHtmlPath = path.join(CUSTOM_CACHE_DIR, 'processedglobalhtml.json');

    try {
      fs.writeFileSync(processedHtmlPath, JSON.stringify({
        headerHtmlall: processedHeaderHtml,
        footerHtmlall: processedFooterHtml
      }));
      console.log(`${colors.green}✓ Global Header/Footer HTML cached successfully.${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}Error caching global HTML: ${error.message}${colors.reset}`);
    }
  }
  // ===================================================================
  // KẾT THÚC PHẦN THÊM MỚI
  // ===================================================================
};

// Hàm này sẽ "dạy" Gatsby cách tìm URL ảnh và biến nó thành file cục bộ
// để các plugin sharp có thể xử lý.
exports.createResolvers = ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
}) => {
  const { createNode } = actions;

  createResolvers({
    // Tên Type này ("GraphCMS_MediaItem") là phỏng đoán dựa trên
    // schema thông thường của WPGraphQL. Nếu sau khi chạy lại server
    // bạn vẫn gặp lỗi, hãy vào http://localhost:8000/___graphql
    // để tìm tên Type chính xác cho đối tượng ảnh của bạn (đối tượng có chứa sourceUrl).
    GraphCMS_MediaItem: {
      // 1. Tạo ra một trường GraphQL mới tên là `localFile`
      localFile: {
        type: `File`, // Trường này sẽ trả về một node kiểu `File`
        // 2. Hàm `resolve` này sẽ được chạy để tạo ra giá trị cho trường `localFile`
        async resolve(source, args, context, info) {
          // 3. Dùng hàm `createRemoteFileNode` để tải ảnh từ URL
          // và tạo ra một file node cục bộ để Sharp có thể xử lý.
          if (source.sourceUrl &&
            typeof source.sourceUrl === 'string' &&
            /^https?:\/\//.test(source.sourceUrl)) {
            return await createRemoteFileNode({
              url: source.sourceUrl, // Lấy URL ảnh từ WordPress
              store,
              cache,
              createNode,
              createNodeId,
              reporter,
            });
          }
          return null;
        },
      },
    },
  });
};

// Tạo thư mục data để lưu header/footer đã xử lý nếu chưa có
exports.onPreInit = () => {
  const CUSTOM_CACHE_DIR = path.join(__dirname, 'data');
  if (!fs.existsSync(CUSTOM_CACHE_DIR)) {
    fs.mkdirSync(CUSTOM_CACHE_DIR, { recursive: true });
  }
};

// /**
//  * Hook này chạy một lần trước khi build.
//  * Rất lý tưởng để fetch và cache dữ liệu toàn cục như header/footer.
//  */
// exports.onPreBuild = async ({ graphql }) => {
//   console.log(`${colors.cyan}Processing global header/footer HTML...${colors.reset}`);

//   // Query để lấy headerHtmlall và footerHtmlall
//   const globalHtmlResult = await graphql(`
//         query GlobalHtmlQuery {
//             cms {
//                 headerHtmlall
//                 footerHtmlall
//             }
//         }
//     `);

//   if (!globalHtmlResult.errors && globalHtmlResult.data?.cms) {
//     let processedHeaderHtml = globalHtmlResult.data.cms.headerHtmlall || "";
//     let processedFooterHtml = globalHtmlResult.data.cms.footerHtmlall || "";

//     // Xử lý header HTML
//     if (processedHeaderHtml) {
//       console.log(`${colors.cyan}Processing header HTML with replaceInternalLinks...${colors.reset}`);
//       processedHeaderHtml = replaceInternalLinks(processedHeaderHtml);
//     }

//     // Xử lý footer HTML
//     if (processedFooterHtml) {
//       console.log(`${colors.cyan}Processing footer HTML with replaceInternalLinks...${colors.reset}`);
//       processedFooterHtml = replaceInternalLinks(processedFooterHtml);
//     }

//     // Lưu vào cache
//     const processedHtmlPath = path.join(__dirname, '.cache/processed-global-html.json');
//     try {
//       fs.writeFileSync(processedHtmlPath, JSON.stringify({
//         headerHtmlall: processedHeaderHtml,
//         footerHtmlall: processedFooterHtml
//       }, null, 2));
//       console.log(`${colors.green}✓ Processed global HTML saved to cache${colors.reset}`);
//     } catch (error) {
//       console.error(`${colors.red}Failed to save processed global HTML: ${error.message}${colors.reset}`);
//     }
//   } else if (globalHtmlResult.errors) {
//     console.error(`${colors.red}Failed to fetch global HTML:`, globalHtmlResult.errors);
//   }
// };