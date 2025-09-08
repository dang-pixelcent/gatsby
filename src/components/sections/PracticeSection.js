import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { extractPathname } from "@utils/urlUtils.js";

const PracticeSection = () => {
    const data = useStaticQuery(graphql`
        query {
            cms {
                pageBy(uri: "/") {
                    template {
                        ... on GraphCMS_Template_Home {
                            homeContent {
                                flexibleContent {
                                    ... on GraphCMS_HomeContentFlexibleContentYourPracticeLayout {
                                        __typename
                                        title
                                        desc
                                        backgroundImage {
                                            node {
                                                altText
                                                sourceUrl
                                                mediaDetails {
                                                    sizes {
                                                        name
                                                        sourceUrl
                                                        width
                                                        height
                                                    }
                                                }
                                                localFile {
                                                    publicURL
                                                    childImageSharp {
                                                        gatsbyImageData(
                                                            quality: 90
                                                            formats: [AUTO, WEBP, AVIF]
                                                            placeholder: BLURRED
                                                            height: 80
                                                        )
                                                    }
                                                }
                                            }
                                        }
                                        button {
                                            title
                                            url
                                        }
                                        item {
                                            title
                                            desc
                                            icon {
                                                node {
                                                    altText
                                                    sourceUrl
                                                }
                                            }
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

    const practice = data.cms.pageBy.template?.homeContent?.flexibleContent.find(
        item => item.__typename === "GraphCMS_HomeContentFlexibleContentYourPracticeLayout"
    );

    const bgImagePractice = getImage(practice?.backgroundImage?.node?.localFile);

    if (!practice) {
        return null;
    }

    return (
        <section className="section sc-practice">
            {bgImagePractice && (
                <GatsbyImage
                    decoding="async"
                    loading="lazy"
                    fadeIn={false}
                    image={bgImagePractice}
                    alt={practice?.backgroundImage?.node?.altText || "Practice background"}
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
                <h2 className="h2-title fs-48 f-soletoxbold text-white text-center">
                    {practice?.title}
                </h2>
                <div className="desc text-white fs-22 text-center">
                    {practice?.desc}
                </div>
                <div className="boxies-practice-list">
                    {practice?.item?.map((item, key) => {
                        const iconNode = item?.icon?.node;
                        const iconImage = getImage(iconNode?.localFile);

                        return (
                            <div key={key} className="practice-item position-relative ast-flex justify-content-center">
                                <div className="inner ast-flex flex-column">
                                    {iconImage ? (
                                        // Dùng GatsbyImage cho images đã được optimize
                                        <GatsbyImage
                                            decoding="async"
                                            image={iconImage}
                                            alt={iconNode?.altText || item.title}
                                            loading="lazy"
                                            fadeIn={false}
                                            style={{
                                                maxWidth: "100%",
                                                height: "auto"
                                            }}
                                        />
                                    ) : (
                                        // Fallback cho SVG hoặc images không có localFile
                                        <img
                                            decoding="async"
                                            src={iconNode?.localFile?.publicURL || iconNode?.sourceUrl}
                                            alt={iconNode?.altText || item.title}
                                            loading="lazy"
                                            style={{
                                                maxWidth: "100%",
                                                height: "auto"
                                            }}
                                        />
                                    )}
                                    <div className="practice-content f-soleto color-0659A9">
                                        <h3 className="h3-title f-soletoxbold color-0659A9">
                                            {item.title}
                                        </h3>
                                        <div className="desc f-soleto fw-500">
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="sc-btn ast-flex justify-content-center">
                    <Link
                        to={extractPathname(practice?.button?.url, '#')}
                        className="btn-bg bg-F2771A btn-size-18 fw-700"
                    >
                        {practice?.button?.title}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PracticeSection;