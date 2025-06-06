const path = require(`path`)

//nơi lấy dữ liệu từ GraphQL
const WPGRAPHQL_URL = process.env.REACT_APP_WPGRAPHQL_URL
if (!WPGRAPHQL_URL) {
  console.error(`REACT_APP_WPGRAPHQL_URL must be set in .env file`)
  process.exit(1)
}

module.exports = {
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
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
    }
  ],
  siteMetadata: {
    title: `Gatsby Redux`,
    // description: "Professional marketing services for wellness clinics and healthcare providers. Top Google rankings for keywords your ideal patients are already searching.",
    // siteUrl: process.env.GATSBY_SITE_URL || "http://localhost:8000",
  },
}
