const axios = require('axios')
const fs = require('fs')
const path = require('path')

require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
})

const WP_BASE_URL = process.env.REACT_APP_BASE_URL_SITE || 'https://agencysitestaging.mystagingwebsite.com'
const SEO_QUERY_URL = `https://headless-plum-eight.vercel.app`

const CACHE_DIR = path.join(__dirname, '../cache/seo')

// Tạo thư mục cache nếu chưa có
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
}

async function fetchSeoData(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Fetching SEO data for ${url} (attempt ${i + 1}/${retries})`)

            const response = await axios.get(`${WP_BASE_URL}/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(url)}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; GatsbyJS/4.0; +https://agencysitestaging.mystagingwebsite.com/)',
                    'Accept': 'application/json',
                },
                timeout: 30000
            })

            if (response.status !== 200) {
                console.error(`HTTP error! status: ${response.status} for ${url} on attempt ${i + 1}`)
                if (i === retries - 1) return null
                continue
            }

            const result = response.data.success && response.data.head ? response.data.head : null
            console.log(`SEO data fetched successfully for ${url}:`, result ? 'SUCCESS' : 'NO DATA')
            return result
        } catch (error) {
            console.error(`Error fetching SEO data for ${url} (attempt ${i + 1}):`, error.message)
            if (i === retries - 1) {
                console.error(`Failed to fetch SEO data for ${url} after ${retries} attempts`)
                return null
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
    }
}

function sanitizeFilename(url) {
    return url.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

async function cacheSeoData() {
    console.log('Starting SEO data caching...')

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
      pages(where: {status: PUBLISH}, first: 99) {
        edges {
          node {
            uri
            slug
          }
        }
      }
      services(first: 99) {
        nodes {
          uri
          slug
        }
      }
      events(first: 99) {
        nodes {
          uri
          slug
        }
      }
      posts(first: 99) {
        nodes {
          uri
          slug
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

        console.log(`Found ${urls.length} URLs to cache`)

        // Cache SEO data for each URL
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i]
            const filename = sanitizeFilename(url)
            const filePath = path.join(CACHE_DIR, `${filename}.json`)

            console.log(`Caching ${i + 1}/${urls.length}: ${url}`)

            const seoData = await fetchSeoData(url)

            // Save to file
            fs.writeFileSync(filePath, JSON.stringify({
                url,
                seoData,
                cachedAt: new Date().toISOString()
            }, null, 2))

            // Delay between requests
            await new Promise(resolve => setTimeout(resolve, 300))
        }

        console.log('SEO data caching completed!')

    } catch (error) {
        console.error('Error caching SEO data:', error)
    }
}

cacheSeoData()