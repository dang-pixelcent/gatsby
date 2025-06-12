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
 * @description Xử lý HTML cho production: Chỉ trích xuất thông tin script có 'src' và làm sạch HTML.
 * @param {string} html - Chuỗi HTML đầu vào.
 * @param {string} pageSlug - Slug của trang để tạo ID cho script.
 * @returns {{cleanedHtml: string, scripts: Array<object>}} - Một object chứa HTML đã sạch và mảng script external.
 */
function processScripts(html = '', pageSlug) {
  if (!html || !pageSlug) {
    return { cleanedHtml: html || '', scripts: [] };
  }

  const $ = cheerio.load(html);
  const scriptTags = $('script');
  const extractedScripts = [];

  scriptTags.each((index, element) => {
    const script = $(element);
    const src = script.attr('src');

    // Chỉ quan tâm đến các script có thuộc tính 'src'
    if (src) {
      extractedScripts.push({
        type: 'external',
        src: src,
        id: script.attr('id') || `external-script-${pageSlug}-${index}`,
        async: script.attr('async') !== undefined,
        defer: script.attr('defer') !== undefined,
      });
    }
    // Bỏ qua hoàn toàn các script inline
  });

  // Xóa tất cả các thẻ script khỏi HTML
  scriptTags.remove();

  return {
    cleanedHtml: $.html(),
    scripts: extractedScripts,
  };
}

exports.createPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
    query {
      cms {
        pages(where: {status: PUBLISH}, first: 99) { edges { node { id, slug, uri, title, flexibleContentHtml, isFrontPage, date } } }
        services(first: 99) { nodes { id, slug, uri, title, flexibleContentHtml, date } }
        events(first: 99) { nodes { id, slug, uri, title, flexibleContentHtml, date } }
        posts(first: 99) { nodes { id, slug, uri, title, flexibleContentHtml, date } }
        themeSettings { themeOptionsSettings { headerFooter { body, footer, header } } }
      }
    }
  `);

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
    const { cleanedHtml, scripts } = processScripts(htmlWithReplacedLinks, node.slug);

    return {
      ...node,
      flexibleContentHtml: cleanedHtml,
      scripts: scripts,
      seoData: seoData,
    };
  };

  const createPageFromNode = (node, pathPrefix = '') => {
    actions.createPage({
      path: `${pathPrefix}${node.slug}`,
      component: path.resolve(`./src/components/templates/dynamicPages.js`),
      context: { ...node },
    });
  };

  // Xử lý và tạo trang cho từng loại
  console.log(`${colors.cyan}Processing pages...${colors.reset}`);
  data.cms.pages.edges.map(({ node }) => processNode(node)).forEach(page => {
    createPageFromNode(page);
  });

  console.log(`${colors.cyan}Processing services...${colors.reset}`);
  data.cms.services.nodes.map(processNode).forEach(service => createPageFromNode(service, 'service/'));

  console.log(`${colors.cyan}Processing events...${colors.reset}`);
  data.cms.events.nodes.map(processNode).forEach(event => createPageFromNode(event, 'events/'));

  console.log(`${colors.cyan}Processing blogs...${colors.reset}`);
  data.cms.posts.nodes.map(processNode).forEach(blog => createPageFromNode(blog, 'blog/'));


  // Lưu tracking codes vào cache
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