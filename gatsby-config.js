const path = require(`path`)

//nơi lấy dữ liệu từ GraphQL
const WPGRAPHQL_URL = process.env.REACT_APP_WPGRAPHQL_URL
if (!WPGRAPHQL_URL) {
  console.error(`REACT_APP_WPGRAPHQL_URL must be set in .env file`)
  process.exit(1)
}

module.exports = {
  flags: {
    DEV_SSR: true
  },
  plugins: [
    // `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
    // `gatsby-plugin-preload-fonts`,
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
    //   },
    // },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(`./src`),
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        url:  WPGRAPHQL_URL,
        fieldName: `cms`,
        typeName: `GraphCMS`,
      }
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
  ],
  siteMetadata: {
    title: `Gatsby Redux`,
    // description: "Professional marketing services for wellness clinics and healthcare providers. Top Google rankings for keywords your ideal patients are already searching.",
    // siteUrl: process.env.GATSBY_SITE_URL || "http://localhost:8000",
  },
}
