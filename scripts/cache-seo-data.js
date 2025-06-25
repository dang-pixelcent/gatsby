const axios = require('axios')
const fs = require('fs')
const path = require('path')
const getTerminalColors = require('../src/utils/terminalColors.js')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})

// ANSI color codes
const colors = getTerminalColors()

const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL
const SEO_QUERY_URL = process.env.REACT_APP_SEO_QUERY_URL
if (!WP_BASE_URL || !SEO_QUERY_URL) {
  console.error(`${colors.red}GATSBY_WP_BASE_URL and REACT_APP_SEO_QUERY_URL must be set in .env file${colors.reset}`)
  process.exit(1)
}
const CACHE_DIR = path.join(__dirname, '../cache/seo')

// Tạo thư mục cache nếu chưa có
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
}

async function fetchSeoData(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`${colors.blue}Fetching SEO data for ${url} (attempt ${i + 1}/${retries})${colors.reset}`)

      const response = await axios.get(`${WP_BASE_URL}/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(url)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GatsbyJS/4.0; +https://agencysitestaging.mystagingwebsite.com/)',
          'Accept': 'application/json',
        },
        timeout: 10000
      })

      if (response.status !== 200) {
        console.warn(`${colors.yellow}HTTP error! status: ${response.status} for ${url} on attempt ${i + 1}${colors.reset}`)
        if (i === retries - 1) return null
        continue
      }

      const result = response.data.success && response.data.head ? response.data.head : null
      if (result) {
        console.log(`${colors.green}✓ SEO data fetched successfully for ${url}${colors.reset}`)
      } else {
        console.warn(`${colors.yellow}⚠ No SEO data available for ${url}${colors.reset}`)
      }
      return result
    } catch (error) {
      console.error(`${colors.red}✗ Error fetching SEO data for ${url} (attempt ${i + 1}): ${error.message}${colors.reset}`)
      if (i === retries - 1) {
        console.error(`${colors.red}Failed to fetch SEO data for ${url} after ${retries} attempts${colors.reset}`)
        return null
      }
      await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)))
    }
  }
}

function sanitizeFilename(url) {
  return url.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

async function cacheSeoData() {
  console.log(`${colors.cyan}${colors.bright}Starting SEO data caching...${colors.reset}`)

  // List of URLs to cache
  const urls = [
    `${SEO_QUERY_URL}/`, // Home page
    // Add more URLs here or fetch from GraphQL
  ]

  // Fetch URLs from GraphQL
  const { GraphQLClient } = require('graphql-request')
  const client = new GraphQLClient(process.env.REACT_APP_WPGRAPHQL_URL)

  const query = `
  query {
    pages(where: {status: PUBLISH}, first: 999) {
      edges {
        node {
        uri
        slug
        }
      }
    }
    services(first: 999) {
      nodes {
        uri
        slug
      }
    }
    events(first: 999) {
      nodes {
        uri
        slug
      }
    }
    posts(first: 999) {
      nodes {
        uri
        slug
      }
    }
    caseStudiesPost(first: 999) {
      nodes {
        uri
        slug
      }
    }
    categories(first: 999) {
      nodes {
        slug
        uri
      }
    }
  }
  `

  try {
    const data = await client.request(query)

    // Add all URLs to cache list
    data.pages.edges.forEach(({ node }) => {
      urls.push(`${SEO_QUERY_URL}${node.uri}`)
    })

    data.services.nodes.forEach(node => {
      urls.push(`${SEO_QUERY_URL}${node.uri}`)
    })

    data.events.nodes.forEach(node => {
      urls.push(`${SEO_QUERY_URL}${node.uri}`)
    })

    data.posts.nodes.forEach(node => {
      urls.push(`${SEO_QUERY_URL}${node.uri}`)
    })

    data.caseStudiesPost.nodes.forEach(node => {
      urls.push(`${SEO_QUERY_URL}${node.uri}`)
    })

    console.log(`${colors.magenta}Found ${urls.length} URLs to cache${colors.reset}`)

    // Tối ưu: Xử lý song song với giới hạn concurrency
    const BATCH_SIZE = 10 // Xử lý 10 URLs cùng lúc
    const batches = []

    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      batches.push(urls.slice(i, i + BATCH_SIZE))
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      console.log(`${colors.cyan}Processing batch ${batchIndex + 1}/${batches.length}${colors.reset}`)

      // Xử lý song song trong batch
      await Promise.allSettled(
        batch.map(async (url, index) => {
          const filename = sanitizeFilename(url)
          const filePath = path.join(CACHE_DIR, `${filename}.json`)

          // // Check cache exists và còn fresh (ví dụ: trong 24h)
          // if (fs.existsSync(filePath)) {
          //   const cached = JSON.parse(fs.readFileSync(filePath, 'utf8'))
          //   const cacheAge = Date.now() - new Date(cached.cachedAt).getTime()
          //   if (cacheAge < 24 * 60 * 60 * 1000) { // 24 hours
          //     console.log(`${colors.gray}⚡ Using cached data for ${url}${colors.reset}`)
          //     return
          //   }
          // }

          const seoData = await fetchSeoData(url)
          fs.writeFileSync(filePath, JSON.stringify({
            url,
            seoData,
            cachedAt: new Date().toISOString()
          }, null, 2))
        })
      )
    }

    console.log(`${colors.green}${colors.bright}✓ SEO data caching completed!${colors.reset}`)

  } catch (error) {
    console.error(`${colors.red}✗ Error caching SEO data: ${error}${colors.reset}`)
  }
}

cacheSeoData()