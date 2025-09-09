import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { extractPathname } from "@utils/urlUtils.js";

const HowWeCanHelpSection = () => {
    const data = useStaticQuery(graphql`
        query {
            cms {
                pageBy(uri: "/") {
                    template {
                        ... on GraphCMS_Template_Home {
                            homeContent {
                                flexibleContent {
                                    ... on GraphCMS_HomeContentFlexibleContentHowWeCanHelpLayout {
                                        descCenter
                                        fieldGroupName
                                        boxs {
                                        borderBoxColor
                                        content
                                        icon {
                                            node {
                                            altText
                                            id
                                            sourceUrl
                                            }
                                        }
                                        title
                                        }
                                        subTitle
                                        textCenter
                                        title
                                        backgroundImage {
                                        node {
                                            id
                                            sourceUrl
                                            localFile {
                                            childImageSharp {
                                                gatsbyImageData(
                                                quality: 70
                                                formats: [AUTO, WEBP, AVIF]
                                                placeholder: BLURRED
                                                layout: FULL_WIDTH
                                                )
                                            }
                                            }
                                        }
                                        }
                                        button {
                                        title
                                        url
                                        target
                                        }
                                    }
                                    __typename
                                }
                            }
                        }
                    }
                }
            }
        }
    `);

    const howWeCanHelp = data.cms.pageBy.template?.homeContent?.flexibleContent.find(
        item => item.__typename === "GraphCMS_HomeContentFlexibleContentHowWeCanHelpLayout"
    );

    const bgImageHowWeCanHelp = getImage(howWeCanHelp?.backgroundImage?.node?.localFile);

    if (!howWeCanHelp) {
        return null;
    }

    return (
        <section
            className="section sc-how-we-can-help pt-100 pb-100"
        // style={{
        //     background: `no-repeat center/cover url(${howWeCanHelp?.backgroundImage?.node?.sourceUrl})`
        // }}
        >
            {/* Thay thế background image bằng GatsbyImage */}
            {bgImageHowWeCanHelp && (
                <GatsbyImage
                    imgStyle={{ transition: 'none' }}
                    decoding="async"
                    loading="lazy"
                    fadeIn={false}
                    image={bgImageHowWeCanHelp}
                    alt={howWeCanHelp?.backgroundImage?.node?.altText || "How we can help background"}
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
                <div className="header-title ast-flex flex-column align-items-center text-center">
                    <div className="sub-title f-soleto fs-32 fw-500 color-00255B text-uppercase">
                        {howWeCanHelp?.subTitle}
                    </div>
                    <h2 className="h2-title f-soletoxbold fs-56 color-2c2c2c" dangerouslySetInnerHTML={{ __html: howWeCanHelp?.title || '' }}></h2>
                </div>
                <div className="box-circle-list position-relative">
                    <div className="box-center position-absolute ast-flex justify-content-center">
                        <div className="arrow arrow-1"> </div>
                        <div className="arrow arrow-2"> </div>
                        <div className="arrow arrow-3"> </div>
                        <div className="arrow arrow-4"> </div>
                        <div className="arrow arrow-5"> </div>
                        <div className="arrow arrow-6"> </div>
                        <div className="cir-box-center ast-flex flex-column align-items-center justify-content-center">
                            <h3 className="h3-title f-soleto fw-800 text-white text-uppercase">
                                {howWeCanHelp?.textCenter}
                            </h3>
                            <div className="desc f-soleto fw-500 text-white text-uppercase text-center">
                                {howWeCanHelp?.descCenter}
                            </div>
                        </div>
                        <div className="m-arrow"><svg xmlns="http://www.w3.org/2000/sv</svg>g" width="24" height="149" viewBox="0 0 24 149" fill="none">
                            <path d="M10.9393 148.061C11.5251 148.646 12.4749 148.646 13.0607 148.061L22.6066 138.515C23.1924 137.929 23.1924 136.979 22.6066 136.393C22.0208 135.808 21.0711 135.808 20.4853 136.393L12 144.879L3.51472 136.393C2.92894 135.808 1.97919 135.808 1.3934 136.393C0.807617 136.979 0.807617 137.929 1.3934 138.515L10.9393 148.061ZM10.5 6.55671e-08L10.5 3.0625L13.5 3.0625L13.5 -6.55671e-08L10.5 6.55671e-08ZM10.5 9.1875L10.5 15.3125L13.5 15.3125L13.5 9.1875L10.5 9.1875ZM10.5 21.4375L10.5 27.5625L13.5 27.5625L13.5 21.4375L10.5 21.4375ZM10.5 33.6875L10.5 39.8125L13.5 39.8125L13.5 33.6875L10.5 33.6875ZM10.5 45.9375L10.5 52.0625L13.5 52.0625L13.5 45.9375L10.5 45.9375ZM10.5 58.1875L10.5 64.3125L13.5 64.3125L13.5 58.1875L10.5 58.1875ZM10.5 70.4375L10.5 76.5625L13.5 76.5625L13.5 70.4375L10.5 70.4375ZM10.5 82.6875L10.5 88.8125L13.5 88.8125L13.5 82.6875L10.5 82.6875ZM10.5 94.9375L10.5 101.063L13.5 101.062L13.5 94.9375L10.5 94.9375ZM10.5 107.188L10.5 113.313L13.5 113.312L13.5 107.187L10.5 107.188ZM10.5 119.438L10.5 125.563L13.5 125.562L13.5 119.437L10.5 119.438ZM10.5 131.688L10.5 137.813L13.5 137.812L13.5 131.687L10.5 131.688ZM10.5 143.938L10.5 147L13.5 147L13.5 143.937L10.5 143.938ZM10.9393 148.061C11.5251 148.646 12.4749 148.646 13.0607 148.061L22.6066 138.515C23.1924 137.929 23.1924 136.979 22.6066 136.393C22.0208 135.808 21.0711 135.808 20.4853 136.393L12 144.879L3.51472 136.393C2.92894 135.808 1.97919 135.808 1.3934 136.393C0.807617 136.979 0.807617 137.929 1.3934 138.515L10.9393 148.061ZM10.5 6.55671e-08L10.5 3.0625L13.5 3.0625L13.5 -6.55671e-08L10.5 6.55671e-08ZM10.5 9.1875L10.5 15.3125L13.5 15.3125L13.5 9.1875L10.5 9.1875ZM10.5 21.4375L10.5 27.5625L13.5 27.5625L13.5 21.4375L10.5 21.4375ZM10.5 33.6875L10.5 39.8125L13.5 39.8125L13.5 33.6875L10.5 33.6875ZM10.5 45.9375L10.5 52.0625L13.5 52.0625L13.5 45.9375L10.5 45.9375ZM10.5 58.1875L10.5 64.3125L13.5 64.3125L13.5 58.1875L10.5 58.1875ZM10.5 70.4375L10.5 76.5625L13.5 76.5625L13.5 70.4375L10.5 70.4375ZM10.5 82.6875L10.5 88.8125L13.5 88.8125L13.5 82.6875L10.5 82.6875ZM10.5 94.9375L10.5 101.063L13.5 101.062L13.5 94.9375L10.5 94.9375ZM10.5 107.188L10.5 113.313L13.5 113.312L13.5 107.187L10.5 107.188ZM10.5 119.438L10.5 125.563L13.5 125.562L13.5 119.437L10.5 119.438ZM10.5 131.688L10.5 137.813L13.5 137.812L13.5 131.687L10.5 131.688ZM10.5 143.938L10.5 147L13.5 147L13.5 143.937L10.5 143.938Z" fill="#B2B2B2"></path>
                        </svg></div>
                    </div>
                    <div className="boxies-outer position-relative ast-flex">
                        {
                            howWeCanHelp?.boxs?.map((item, key) => (
                                <div key={key} item={item} className={`circle-box box-${key + 1}`}>
                                    <figure data-aos="fade-down-right" data-aos-duration="1500" className="aos-init">
                                        <img decoding="async" className="animation-wiggle" src={item.icon?.node?.sourceUrl} alt={item.icon?.node?.altText} loading="lazy" />
                                    </figure>
                                    <h3 className="h3-title fs-26 f-soleto fw-800 color-000000 text-center">
                                        {item.title}
                                    </h3>
                                    <div className={`box-content fw-300 color-000000 border-${item.borderBoxColor}`}>
                                        {item.content}
                                    </div>
                                    <div className="m-arrow"><svg xmlns="http://www.w3.org/2000/sv</svg>g" width="24" height="149" viewBox="0 0 24 149" fill="none">
                                        <path d="M10.9393 148.061C11.5251 148.646 12.4749 148.646 13.0607 148.061L22.6066 138.515C23.1924 137.929 23.1924 136.979 22.6066 136.393C22.0208 135.808 21.0711 135.808 20.4853 136.393L12 144.879L3.51472 136.393C2.92894 135.808 1.97919 135.808 1.3934 136.393C0.807617 136.979 0.807617 137.929 1.3934 138.515L10.9393 148.061ZM10.5 6.55671e-08L10.5 3.0625L13.5 3.0625L13.5 -6.55671e-08L10.5 6.55671e-08ZM10.5 9.1875L10.5 15.3125L13.5 15.3125L13.5 9.1875L10.5 9.1875ZM10.5 21.4375L10.5 27.5625L13.5 27.5625L13.5 21.4375L10.5 21.4375ZM10.5 33.6875L10.5 39.8125L13.5 39.8125L13.5 33.6875L10.5 33.6875ZM10.5 45.9375L10.5 52.0625L13.5 52.0625L13.5 45.9375L10.5 45.9375ZM10.5 58.1875L10.5 64.3125L13.5 64.3125L13.5 58.1875L10.5 58.1875ZM10.5 70.4375L10.5 76.5625L13.5 76.5625L13.5 70.4375L10.5 70.4375ZM10.5 82.6875L10.5 88.8125L13.5 88.8125L13.5 82.6875L10.5 82.6875ZM10.5 94.9375L10.5 101.063L13.5 101.062L13.5 94.9375L10.5 94.9375ZM10.5 107.188L10.5 113.313L13.5 113.312L13.5 107.187L10.5 107.188ZM10.5 119.438L10.5 125.563L13.5 125.562L13.5 119.437L10.5 119.438ZM10.5 131.688L10.5 137.813L13.5 137.812L13.5 131.687L10.5 131.688ZM10.5 143.938L10.5 147L13.5 147L13.5 143.937L10.5 143.938ZM10.9393 148.061C11.5251 148.646 12.4749 148.646 13.0607 148.061L22.6066 138.515C23.1924 137.929 23.1924 136.979 22.6066 136.393C22.0208 135.808 21.0711 135.808 20.4853 136.393L12 144.879L3.51472 136.393C2.92894 135.808 1.97919 135.808 1.3934 136.393C0.807617 136.979 0.807617 137.929 1.3934 138.515L10.9393 148.061ZM10.5 6.55671e-08L10.5 3.0625L13.5 3.0625L13.5 -6.55671e-08L10.5 6.55671e-08ZM10.5 9.1875L10.5 15.3125L13.5 15.3125L13.5 9.1875L10.5 9.1875ZM10.5 21.4375L10.5 27.5625L13.5 27.5625L13.5 21.4375L10.5 21.4375ZM10.5 33.6875L10.5 39.8125L13.5 39.8125L13.5 33.6875L10.5 33.6875ZM10.5 45.9375L10.5 52.0625L13.5 52.0625L13.5 45.9375L10.5 45.9375ZM10.5 58.1875L10.5 64.3125L13.5 64.3125L13.5 58.1875L10.5 58.1875ZM10.5 70.4375L10.5 76.5625L13.5 76.5625L13.5 70.4375L10.5 70.4375ZM10.5 82.6875L10.5 88.8125L13.5 88.8125L13.5 82.6875L10.5 82.6875ZM10.5 94.9375L10.5 101.063L13.5 101.062L13.5 94.9375L10.5 94.9375ZM10.5 107.188L10.5 113.313L13.5 113.312L13.5 107.187L10.5 107.188ZM10.5 119.438L10.5 125.563L13.5 125.562L13.5 119.437L10.5 119.438ZM10.5 131.688L10.5 137.813L13.5 137.812L13.5 131.687L10.5 131.688ZM10.5 143.938L10.5 147L13.5 147L13.5 143.937L10.5 143.938Z" fill="#B2B2B2"></path>
                                    </svg></div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="sc-btn ast-flex justify-content-center">
                    <Link
                        to={extractPathname(howWeCanHelp?.button?.url, '#')}
                        target="_self"
                        className="btn-bg bg-F2771A btn-size-18 fw-700"
                    >
                        {howWeCanHelp?.button?.title}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HowWeCanHelpSection;
