import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import "./styles/awards.scss";

const AwardsSection = () => {
    const data = useStaticQuery(graphql`
        query {
            cms {
                pageBy(uri: "/") {
                    template {
                        ... on GraphCMS_Template_Home {
                            homeContent {
                                flexibleContent {
                                    ... on GraphCMS_HomeContentFlexibleContentFeaturedAwardsLayout {
                                        __typename
                                        backgroundImage {
                                            node {
                                                sourceUrl
                                                localFile {
                                                    childImageSharp {
                                                        gatsbyImageData(
                                                            quality: 60
                                                            formats: [AUTO, WEBP, AVIF]
                                                            placeholder: BLURRED
                                                            layout: FULL_WIDTH
                                                        )
                                                    }
                                                }
                                                title
                                                altText
                                            }
                                        }
                                        featuredAwards {
                                            awardGallery {
                                                nodes {
                                                    altText
                                                    sourceUrl
                                                    localFile {
                                                        childImageSharp {
                                                            gatsbyImageData(
                                                                placeholder: BLURRED
                                                                formats: [AUTO, WEBP]
                                                                quality: 60
                                                            )
                                                        }
                                                    }
                                                }
                                            }
                                            title
                                        }
                                        featuredOn {
                                            gallery {
                                                nodes {
                                                    altText
                                                    sourceUrl
                                                    localFile {
                                                        childImageSharp {
                                                            gatsbyImageData(
                                                                placeholder: BLURRED
                                                                formats: [AUTO, WEBP]
                                                                quality: 60
                                                            )
                                                        }
                                                    }
                                                }
                                            }
                                            title
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

    const awards = data.cms.pageBy.template?.homeContent?.flexibleContent.find(
        item => item.__typename === "GraphCMS_HomeContentFlexibleContentFeaturedAwardsLayout"
    );

    const bgImageAwards = getImage(awards?.backgroundImage?.node?.localFile);

    const awardSizes = [
        { width: 235, height: 469 },
        { width: 313, height: 242 },
        { width: 313, height: 242 },
    ];

    if (!awards) {
        return null;
    }

    return (
        <section
            className="section sc-featured-awards"
        // style={{
        //     background: `no-repeat top center /cover url('${awards?.backgroundImage?.node?.sourceUrl}')`
        // }}
        >
            {/* Thay thế background image bằng GatsbyImage */}
            {bgImageAwards && (
                <GatsbyImage
                    image={bgImageAwards}
                    alt={awards?.backgroundImage?.node?.altText || "Awards background"}
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
                <div className="featured-awards">
                    <h2 className="h2-title f-soleto fw-800 fs-48 color-0659A9 text-center">
                        {awards?.featuredAwards?.title}
                    </h2>
                    <div className="awards-list">
                        {awards?.featuredAwards?.awardGallery?.nodes?.map((awardNode, idx) => {
                            // 1. Dùng `getImage` để lấy dữ liệu ảnh
                            const imageData = getImage(awardNode?.localFile);

                            // 2. Kiểm tra nếu không có ảnh thì không render gì cả
                            if (!imageData) {
                                return null;
                            }

                            const size = awardSizes[idx];

                            // 3. Render component <GatsbyImage>
                            return (
                                <div className="item" key={idx}>
                                    <GatsbyImage
                                        image={imageData}
                                        alt={awardNode?.altText || ""}
                                        sizes={`(max-width: 600px) 100vw, ${size.width}px`}
                                        style={{ height: `auto` }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="featured-on">
                    <h2 className="h2-title f-soleto fw-800 fs-48 color-0659A9 text-center">
                        {awards?.featuredOn?.title}
                    </h2>
                    <div className="list">
                        {awards?.featuredOn?.gallery?.nodes?.map((featuredNode, idx) => {
                            const featuredImageData = getImage(featuredNode?.localFile);
                            if (!featuredImageData) return null;
                            return (
                                <div className="item" key={idx}>
                                    <GatsbyImage
                                        image={featuredImageData}
                                        alt={featuredNode?.altText || ""}
                                        sizes="(max-width: 412px) 352px, (max-width: 1366px) 304px"
                                        style={{ height: "416px" }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AwardsSection;
