import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { extractPathname } from "@utils/urlUtils.js";

const StatsSection = () => {
    const data = useStaticQuery(graphql`
        query {
            cms {
                pageBy(uri: "/") {
                    template {
                        ... on GraphCMS_Template_Home {
                            homeContent {
                                flexibleContent {
                                    ... on GraphCMS_HomeContentFlexibleContentStatsLayout {
                                        __typename
                                        title
                                        backgroundImage {
                                            node {
                                                id
                                                sourceUrl
                                                altText
                                                localFile {
                                                    childImageSharp {
                                                        gatsbyImageData(
                                                            quality: 80
                                                            formats: [AUTO, WEBP, AVIF]
                                                            placeholder: BLURRED
                                                            layout: FULL_WIDTH
                                                        )
                                                    }
                                                }
                                            }
                                        }
                                        item {
                                            desc
                                            title
                                            icon {
                                                node {
                                                    altText
                                                    id
                                                    sourceUrl
                                                }
                                            }
                                        }
                                        button {
                                            title
                                            url
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

    const stats = data.cms.pageBy.template?.homeContent?.flexibleContent.find(
        item => item.__typename === "GraphCMS_HomeContentFlexibleContentStatsLayout"
    );

    const bgImageStats = getImage(stats?.backgroundImage?.node?.localFile);

    if (!stats) {
        return null;
    }

    return (
        <section
            className="section sc-how-we-do-it"
        // style={{ background: `no-repeat center/cover url(${stats?.backgroundImage?.node?.sourceUrl})` }}
        >
            {/* Thay thế background image bằng GatsbyImage */}
            {bgImageStats && (
                <GatsbyImage
                    imgStyle={{ transition: 'none' }}
                    decoding="async"
                    loading="lazy"
                    fadeIn={false}
                    image={bgImageStats}
                    alt={stats?.backgroundImage?.node?.altText || "Stats background"}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: -1,
                    }}
                    className="section-bg-image"
                />
            )}
            <div className="cus-container">
                <h2 className="h2-title f-soletoxbold text-white mb-0 text-center">
                    {stats?.title}
                </h2>
                <div className="number-infor ast-flex align-items-center">
                    {
                        stats?.item?.map((x, key) => (
                            <div key={key} className="box-number ast-flex align-items-center">
                                <div className="ast-flex align-items-center">
                                    <div className="box-img">
                                        <figure className="mb-0">
                                            <img decoding="async" src={x?.icon?.node?.sourceUrl} alt={x?.icon?.node?.altText} loading="lazy" />
                                        </figure>
                                    </div>
                                    <div className="desc f-soleto fw-800 text-white">
                                        {x?.desc}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="sc-btn ast-flex justify-content-center">
                    <Link
                        to={extractPathname(stats?.button?.url, '#')}
                        className="btn-bg bg-F2771A btn-size-18 fw-700"
                    >
                        {stats?.button?.title}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
