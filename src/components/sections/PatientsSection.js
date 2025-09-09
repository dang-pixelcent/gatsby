import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { extractPathname } from "@utils/urlUtils.js";
import LazyEmbed from '@components/Video/LazyEmbed';

const PatientsSection = () => {
    const data = useStaticQuery(graphql`
        query {
            cms {
                pageBy(uri: "/") {
                    template {
                        ... on GraphCMS_Template_Home {
                            homeContent {
                                flexibleContent {
                                    ... on GraphCMS_HomeContentFlexibleContentPatientsLayout {
                                        desc
                                        title
                                        video
                                        button {
                                            url
                                            title
                                            target
                                        }
                                        backgroundImage {
                                            node {
                                                altText
                                                sourceUrl
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
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `);

    const patients = data.cms.pageBy.template?.homeContent?.flexibleContent[2];

    const bgImagePatients = getImage(patients?.backgroundImage?.node?.localFile);

    return (
        <section
            className="section sc-patients"
            style={{ backgroundColor: "#F3F3F3" }}
        >
            {bgImagePatients && (
                <GatsbyImage
                    imgStyle={{ transition: 'none' }}
                    decoding="async"
                    loading="lazy"
                    fadeIn={false}
                    image={bgImagePatients}
                    alt={patients?.backgroundImage?.node?.altText || "Patients background"}
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
                <div className="ast-flex col-patients">
                    <div className="col-content ast-flex flex-column">
                        <div className="col-content-text">
                            <h3 className="fs-48 f-soletoxbold" dangerouslySetInnerHTML={{ __html: patients?.title || '' }}></h3>
                            <div className="desc f-soleto fs-26">
                                {patients?.desc}
                            </div>
                        </div>
                        <div className="sc-btn">
                            <Link
                                to={extractPathname(patients?.button?.url, '#')}
                                className="btn-bg bg-F2771A patients-button btn-size-18 fw-700"
                            >
                                {patients?.button?.title}
                            </Link>
                        </div>
                    </div>
                    <div className="home-video">
                        <LazyEmbed embedCode={patients?.video} rootMargin="200px" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PatientsSection;