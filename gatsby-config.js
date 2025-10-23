const path = require(`path`)

//nơi lấy dữ liệu từ GraphQL
const WPGRAPHQL_URL = process.env.GATSBY_WPGRAPHQL_URL
if (!WPGRAPHQL_URL) {
  console.error(`GATSBY_WPGRAPHQL_URL must be set in .env file`)
  process.exit(1)
}

module.exports = {
  flags: {
    // Giúp build lại nhanh hơn bằng cách lưu cache của các lần build trước.
    PRESERVE_WEBPACK_CACHE: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
    // Có thể tăng tốc quá trình lấy dữ liệu trên các máy có nhiều CPU.
    PARALLEL_SOURCING: true,

    // Tăng tốc độ SSR trong quá trình phát triển
    // DEV_SSR: true,
    // QUERY_ON_DEMAND: true,
    // LAZY_IMAGES: true,
    // PRESERVE_WEBPACK_CACHE: true,
    // PRESERVE_FILE_DOWNLOAD_CACHE: true,
    // // PARALLEL_SOURCING: true,
    // FAST_DEV: true,
  },
  plugins: [
    // {
    //   resolve: `gatsby-plugin-partytown`,
    //   options: {
    //     // Chuyển tiếp các lệnh gọi này đến luồng Partytown
    //     forward: [`dataLayer.push`, `fbq`],
    //     partytownConfig: {
    //       // --- BƯỚC 4: BẬT LẠI CẤU HÌNH PROXY ---
    //       resolveUrl: function (url, location, type) {
    //         // Danh sách các domain cần được proxy để tránh lỗi CORS
    //         const proxyingDomains = [
    //           'www.googletagmanager.com',
    //           'connect.facebook.net',
    //           'cdn.aimtell.com',
    //           'js.ubembed.com',
    //           'www.google-analytics.com',
    //           'wellnessclinicmarketing.exactmatchmarketing.com' // Thêm domain từ script của page
    //         ];

    //         if (proxyingDomains.some(domain => url.hostname.includes(domain))) {
    //           // Tạo một URL proxy mới mà Gatsby sẽ xử lý
    //           const proxyUrl = new URL(location.origin + '/__partytown-proxy');
    //           proxyUrl.searchParams.append('url', url.href);
    //           return proxyUrl;
    //         }

    //         // Trả về URL gốc cho các script không nằm trong danh sách
    //         return url;
    //       },
    //       // ------------------------------------
    //     },
    //   }
    // },
    // {
    //   resolve: `gatsby-plugin-postcss`,
    //   options: {
    //     postCssPlugins: [
    //       require("tailwindcss"),
    //       require("autoprefixer"),
    //     ],
    //   },
    // },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
    `gatsby-plugin-preload-fonts`,
    // `gatsby-plugin-webpack-bundle-analyser-v2`,
    // {
    //   resolve: `gatsby-plugin-purgecss`,
    //   options: {
    //     // In ra console các class CSS đã bị xóa (hữu ích khi gỡ lỗi)
    //     printRejected: true,
    //     // Bỏ qua các file CSS từ các thư viện bên thứ 3 nếu cần
    //     // ignore: ['swiper/'], 
    //     // BẬT tùy chọn này nếu bạn đang dùng Tailwind CSS
    //     // tailwind: true,
    //     // develop: true,
    //   },
    // },
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: path.resolve(`./src`),
    //   },
    // },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    // Thêm nguồn dữ liệu từ thư mục .cache/headerfooter: tên truy vấn là "headerfooterJson"
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data-headerfooter`,
        path: `${__dirname}/.cache/headerfooter`,
      },
    },
    `gatsby-transformer-json`,
    // Kết nối đến GraphQL API của WordPress
    {
      resolve: 'gatsby-source-graphql',
      options: {
        url: WPGRAPHQL_URL,
        fieldName: `cms`,
        typeName: `GraphCMS`,
        // BỔ SUNG CÁC TÙY CHỌN RETRY VÀ RATE LIMITING Ở ĐÂY
        // refetchInterval: 60,
        createLink: (pluginOptions) => {
          const { createHttpLink } = require(`@apollo/client`)
          const { RetryLink } = require(`@apollo/client/link/retry`)

          const httpLink = createHttpLink({
            uri: pluginOptions.url,
            headers: {
              // Nếu WordPress cần Authorization, hãy thêm vào đây
              // 'Authorization': `Bearer ${process.env.WP_ACCESS_TOKEN}`,
            },
            fetchOptions: {
              timeout: 60000, // Tăng timeout lên 60 giây
            },
          })

          const retryLink = new RetryLink({
            attempts: (count, operation, error) => {
              // Retry tối đa 7 lần cho các lỗi 429
              if (error && error.statusCode === 429 && count <= 7) {
                console.log(`Retry attempt #${count} for ${operation.operationName} due to 429`)
                // Tính toán thời gian chờ tăng dần (exponential backoff)
                const delay = Math.pow(2, count) * 1000
                setTimeout(() => true, delay)
                return true
              }
              // Không retry cho các lỗi khác
              return false
            },
          })

          // Kết hợp retryLink và httpLink
          return retryLink.concat(httpLink)
        },
      }
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: [
            // 'Inter:ital,wght@0,100..900;1,100..900', // Lấy cả normal và italic, với dải weight từ 100-900
            // 'Anek Devanagari:wght@100..800',         // Lấy dải weight từ 100-800
            // 'Assistant:wght@200..800',                // Lấy dải weight từ 200-800
            'Inter:wght@400;600;700',
            'Assistant:wght@600;700'
          ]
        }
      }
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        // Tùy chọn nếu cần  
      },
    },
    /**
     * Plugin để sử dụng các alias import 
     * Giúp bạn có thể import các module một cách ngắn gọn hơn
     */
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          "@src": "src",
          "@components": "src/components",
          "@templates": "src/components/templates",
          "@hooks": "src/hooks",
          "@context": "src/context",
          "@styles": "src/styles",
          "@helpers": "src/helpers",
          "@config": "src/config",
        },
        extensions: [
          "js",
        ],
      }
    },
    // {
    //   resolve: `gatsby-plugin-manifest`,
    //   options: {
    //     name: `Wellness Clinic Marketing`,
    //     short_name: `Wellness Clinic`,
    //     start_url: `/`,
    //     background_color: `#ffffff`,
    //     theme_color: `#0659A9`,
    //     display: `standalone`,
    //     icon: `static/favicon.png`, // Đường dẫn đến icon của bạn
    //   },
    // },
    // `gatsby-plugin-offline`,
    `gatsby-plugin-preact`,
  ],
  siteMetadata: {
    title: `Gatsby WP Theme`,
    // description: "Professional marketing services for wellness clinics and healthcare providers. Top Google rankings for keywords your ideal patients are already searching.",
    siteUrl: process.env.GATSBY_SITE_URL,
  },
}
