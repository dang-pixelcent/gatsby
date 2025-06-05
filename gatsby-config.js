const path = require(`path`)

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
        url:  process.env.REACT_APP_WPGRAPHQL_URL || 'https://agencysitestaging.mystagingwebsite.com/graphql',
        fieldName: `cms`,
        typeName: `GraphCMS`,
      }
    }
  ],
  siteMetadata: {
    title: `Gatsby Redux`,
    // description: "Professional marketing services for wellness clinics and healthcare providers. Top Google rankings for keywords your ideal patients are already searching.",
    // siteUrl: process.env.REACT_APP_BASE_URL || "http://localhost:8000",
  },
}
