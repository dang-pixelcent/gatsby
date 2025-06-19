import React from "react"
import { Helmet } from "react-helmet"
import parse from 'html-react-parser';
const SEO = ({
    seoData,
}) => {
    if (!seoData) {
        return null
    }

    return (
        <Helmet>
            <html lang="en-US" />
            <meta charSet="utf-8" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            {/* {parse(seoData)} */}
            <meta name="description" content="aaaaa" />
            <link rel="canonical" href="https://gatsby-mu-eight.vercel.app/" />

            <meta property="og:url" content="https://gatsby-mu-eight.vercel.app/" />
            <meta property="og:title" content="Medical Marketing Company For Med Spa & Medical Wellness Centers" />
            <meta property="og:description" content="aaaaa" />
            {/* <meta property="og:image" content={metaImage} /> */}
            <meta property="og:type" content="website" />
            <link rel="icon" href="/favicon.png" sizes="32x32" />
            <link rel="icon" href="/favicon.png" sizes="192x192" />
            <link rel="apple-touch-icon" href="/favicon.png" />
            <meta name="msapplication-TileImage" content="/favicon.png" />
        </Helmet>
    )
}

export default SEO