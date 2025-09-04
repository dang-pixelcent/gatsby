import React, { useState, useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Slider from "react-slick";

const ExpertsSection = () => {
    // State để chỉ render Slider ở phía client, tránh lỗi build
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const data = useStaticQuery(graphql`
        query {
            cms {
                pageBy(uri: "/") {
                    template {
                        ... on GraphCMS_Template_Home {
                            homeContent {
                                flexibleContent {
                                    ... on GraphCMS_HomeContentFlexibleContentExpertsLayout {
                                        __typename
                                        title
                                        logo {
                                            image {
                                                node {
                                                    id
                                                    sourceUrl
                                                    localFile {
                                                        childImageSharp {
                                                            gatsbyImageData(
                                                                quality: 50
                                                                formats: [AUTO, WEBP, AVIF]
                                                                placeholder: BLURRED
                                                            )
                                                        }
                                                    }
                                                    link
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

    const experts = data.cms.pageBy.template?.homeContent?.flexibleContent.find(
        item => item.__typename === "GraphCMS_HomeContentFlexibleContentExpertsLayout"
    );

    const expertsImages = experts?.logo?.map(item => ({
        imageData: getImage(item?.image?.node?.localFile),
        sourceUrl: item?.image?.node?.sourceUrl,
        altText: `Expert partner logo`,
        link: item?.image?.node?.link
    }));

    const settings = {
        draggable: false,
        dots: false,
        infinite: true,
        lazyLoad: 'ondemand',
        speed: 300,
        centerPadding: "100px",
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: (<div className="slick-arrow slick-prev"><svg width="10" height="19" viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.6625 18.4567L0 9.65669L8.8 0.856689L9.7625 1.81919L1.925 9.65669L9.625 17.3567L8.6625 18.4567Z" fill="#AAAAAA" /></svg></div>),
        nextArrow: (<div className="slick-arrow slick-next"><svg width="10" height="19" viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.33726 18.4567L9.99976 9.65669L1.19976 0.856689L0.237257 1.81919L8.07476 9.65669L0.374756 17.3567L1.33726 18.4567Z" fill="#AAAAAA" /></svg></div>),
        responsive: [{
            breakpoint: 1024,
            settings: { slidesToShow: 4, arrows: false, dots: true }
        }, {
            breakpoint: 600,
            settings: { slidesToShow: 2, arrows: false, dots: true }
        }],
    };

    return (
        <section className="section sc-experts">
            <div className="ast-container-fluid px-0">
                <h2 className="fs-22 fw-500 color-0659A9 text-center">
                    {experts?.title}
                </h2>
                {isClient && (
                    <Slider {...settings} className="experts-list ast-flex align-items-center">
                        {expertsImages?.map((item, key) => (
                            <a key={key} href={item.link || '#'} aria-label={`Expert partner ${key + 1}`}>
                                {item.imageData ? (
                                    <GatsbyImage image={item.imageData} alt={item.altText} style={{ maxWidth: "150px", height: "auto" }} />
                                ) : (
                                    <img src={item.sourceUrl} alt={item.altText} style={{ maxWidth: "150px", height: "auto" }} loading="lazy" />
                                )}
                            </a>
                        ))}
                    </Slider>
                )}
            </div>
        </section>
    );
};

export default ExpertsSection;