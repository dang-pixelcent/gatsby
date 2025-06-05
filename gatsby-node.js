const path = require(`path`)
const remark = require(`remark`)
const html = require(`remark-html`)
const fs = require('fs')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})

const CACHE_DIR = path.join(__dirname, 'cache/seo')
const SEO_QUERY_URL = process.env.REACT_APP_SEO_QUERY_URL

function sanitizeFilename(url) {
  return url.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

function getCachedSeoData(url) {
  try {
    const filename = sanitizeFilename(url)
    const filePath = path.join(CACHE_DIR, `${filename}.json`)

    if (fs.existsSync(filePath)) {
      const cached = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      console.log(`Using cached SEO data for ${url}`)
      return cached.seoData
    }
  } catch (error) {
    console.error(`Error reading cached SEO data for ${url}:`, error.message)
  }

  console.log(`No cached SEO data found for ${url}`)
  return null
}

exports.createPages = async ({ actions, graphql }) => {
  const WP_BASE_URL = process.env.REACT_APP_BASE_URL_SITE || 'https://agencysitestaging.mystagingwebsite.com'

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
  console.log('Getting home SEO data from cache...')
  const homeDataSeo = getCachedSeoData(`${SEO_QUERY_URL}/`)
  console.log('Home SEO data result:', homeDataSeo ? 'SUCCESS' : 'FAILED')

  // Always create home page programmatically
  actions.createPage({
    path: `/`,
    component: path.resolve(`./src/components/templates/home.js`),
    context: {
      seoData: homeDataSeo || null
    },
  });

  // Process pages with cached SEO data
  console.log('Processing pages...')
  const pages = data.cms.pages.edges.map(({ node }) => {
    console.log(`Processing page: ${node.slug}`)
    const seoData = getCachedSeoData(`${SEO_QUERY_URL}${node.uri}`)
    return {
      ...node,
      flexibleContentHtml: node.flexibleContentHtml,
      seoData: seoData,
    }
  })
  console.log('Pages processing completed')

  // Process services with cached SEO data
  console.log('Processing services...')
  const services = data.cms.services.nodes.map(node => {
    console.log(`Processing service: ${node.slug}`)
    const seoData = getCachedSeoData(`${SEO_QUERY_URL}${node.uri}`)
    return {
      ...node,
      flexibleContentHtml: node.flexibleContentHtml,
      seoData: seoData,
    }
  })
  console.log('Services processing completed')

  // Process events with cached SEO data
  console.log('Processing events...')
  const events = data.cms.events.nodes.map(node => {
    console.log(`Processing event: ${node.slug}`)
    const seoData = getCachedSeoData(`${SEO_QUERY_URL}${node.uri}`)
    return {
      ...node,
      flexibleContentHtml: node.flexibleContentHtml,
      seoData: seoData,
    }
  })
  console.log('Events processing completed')

  // Process blogs with cached SEO data
  console.log('Processing blogs...')
  const blogs = data.cms.posts.nodes.map(node => {
    console.log(`Processing blog: ${node.slug}`)
    const seoData = getCachedSeoData(`${SEO_QUERY_URL}${node.uri}`)
    return {
      ...node,
      flexibleContentHtml: node.flexibleContentHtml,
      seoData: seoData,
    }
  })
  console.log('Blogs processing completed')

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
      // Gatsby tự động tạo thư mục .cache, nhưng bạn có thể kiểm tra nếu muốn
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      fs.writeFileSync(trackingCodesCachePath, JSON.stringify(headerFooterData, null, 2));
      console.log('Theme tracking codes saved to cache:', trackingCodesCachePath);
    } catch (error) {
      console.error('Error saving theme tracking codes to cache:', error);
    }
  } else {
    console.warn('Theme tracking codes (headerFooter) not found in GraphQL response. Skipping cache write.');
  }
  // === KẾT THÚC PHẦN THÊM MỚI ===
}