import React, { useState, useRef } from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Slider from 'react-slick';
import { extractPathname } from "/src/utils/urlUtils"

import './styles/specialty.scss';

const SpecialtySection = () => {
    const data = useStaticQuery(graphql`
        query {
            cms {
                pageBy(uri: "/") {
                    template {
                        ... on GraphCMS_Template_Home {
                            homeContent {
                                flexibleContent {
                                    ... on GraphCMS_HomeContentFlexibleContentSpecialtyLayout {
                                        __typename
                                        fieldGroupName
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
                                        items {
                                            image {
                                                node {
                                                    altText
                                                    id
                                                    sourceUrl
                                                    localFile {
                                                        childImageSharp {
                                                            gatsbyImageData(
                                                                quality: 80
                                                                formats: [AUTO, WEBP, AVIF]
                                                                placeholder: BLURRED
                                                            )
                                                        }
                                                    }
                                                }
                                            }
                                            title
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
    `);

    const special = data.cms.pageBy.template.homeContent.flexibleContent.find(
        item => item.__typename === 'GraphCMS_HomeContentFlexibleContentSpecialtyLayout'
    );

    const bgImageSpecial = getImage(special?.backgroundImage?.node?.localFile);

    const specialItemsImages = special?.items?.map(item => ({
        imageData: getImage(item?.image?.node?.localFile),
        sourceUrl: item?.image?.node?.sourceUrl,
        altText: item?.image?.node?.altText || "Specialty image",
        title: item.title,
        link: item.link
    }));

    const settings = {
        dots: false,
        infinite: true,
        speed: 300,
        centerPadding: "100px",
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        draggable: true, // Cho phép drag
        swipe: true,     // Cho phép swipe
        touchMove: true, // Cho phép touch move
        prevArrow: (<div className="slick-arrow slick-prev"> <svg width="54" height="100" viewBox="0 0 54 100" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M52.3223 93.129C53.0704 93.8873 53.4898 94.9096 53.4898 95.9748C53.4898 97.04 53.0704 98.0623 52.3223 98.8206C51.9544 99.1941 51.516 99.4908 51.0324 99.6933C50.5488 99.8957 50.0298 100 49.5056 100C48.9813 100 48.4623 99.8957 47.9787 99.6933C47.4951 99.4908 47.0567 99.1941 46.6888 98.8206L1.16748 52.8458C0.419413 52.0875 0 51.0652 0 50C0 48.9348 0.419413 47.9125 1.16748 47.1542L46.6888 1.17939C47.0567 0.805857 47.4951 0.509222 47.9787 0.306747C48.4623 0.104272 48.9813 0 49.5056 0C50.0298 0 50.5488 0.104272 51.0324 0.306747C51.516 0.509222 51.9544 0.805857 52.3223 1.17939C53.0704 1.93767 53.4898 2.96002 53.4898 4.0252C53.4898 5.09038 53.0704 6.11272 52.3223 6.87101L10.8066 50.0029L52.3223 93.129Z" fill="#0568B9" /> </svg> </div>),
        nextArrow: (<div className="slick-arrow slick-next"> <svg width="54" height="100" viewBox="0 0 54 100" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M1.16793 93.129C0.419865 93.8873 0.000442505 94.9096 0.000442505 95.9748C0.000442505 97.04 0.419865 98.0623 1.16793 98.8206C1.53579 99.1941 1.97426 99.4908 2.45784 99.6933C2.94141 99.8957 3.46042 100 3.98467 100C4.50892 100 5.02794 99.8957 5.51152 99.6933C5.99509 99.4908 6.43356 99.1941 6.80142 98.8206L52.3228 52.8458C53.0708 52.0875 53.4902 51.0652 53.4902 50C53.4902 48.9348 53.0708 47.9125 52.3228 47.1542L6.80142 1.17939C6.43356 0.805857 5.99509 0.509222 5.51152 0.306747C5.02794 0.104272 4.50892 0 3.98467 0C3.46042 0 2.94141 0.104272 2.45784 0.306747C1.97426 0.509222 1.53579 0.805857 1.16793 1.17939C0.419865 1.93767 0.000442505 2.96002 0.000442505 4.0252C0.000442505 5.09038 0.419865 6.11272 1.16793 6.87101L42.6836 50.0029L1.16793 93.129Z" fill="#0568B9" /> </svg> </div>),
        responsive: [{
            breakpoint: 1200,
            settings: {
                slidesToShow: 2,
                arrows: true,
                dots: true,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                arrows: true,
                dots: true,
            }
        },
        ],
    };

    // Drag handling logic
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });

    // Function để handle mouse/touch events
    const handleDragStart = (e) => {
        setIsDragging(false);
        dragStartRef.current = {
            x: e.clientX || e.touches?.[0]?.clientX || 0,
            y: e.clientY || e.touches?.[0]?.clientY || 0
        };
    };

    const handleDragMove = (e) => {
        const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
        const currentY = e.clientY || e.touches?.[0]?.clientY || 0;
        const diffX = Math.abs(currentX - dragStartRef.current.x);
        const diffY = Math.abs(currentY - dragStartRef.current.y);

        // Nếu di chuyển quá 5px thì coi như đang drag (cuộn)
        if (diffX > 5 || diffY > 5) {
            setIsDragging(true);
        }
    };

    const handleLinkClick = (e, path) => {
        // Nếu đang drag thì không cho navigate
        if (isDragging) {
            e.preventDefault();
            return false;
        }

        // Nếu không drag thì cho phép navigate
        if (path && path !== '#') {
            // Link của Gatsby sẽ xử lý phần còn lại
            return true;
        }

        e.preventDefault();
        return false;
    };

    if (!special) {
        return null;
    }

    return (
        <section
            className="section sc-specialty"
        >
            {bgImageSpecial && (
                <GatsbyImage
                    decoding="async"
                    loading="lazy"
                    fadeIn={false}
                    image={bgImageSpecial}
                    alt={special?.backgroundImage?.node?.altText || "Specialty background"}
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
            <div className="ast-container-fluid padding-left padding-right">
                <h2 className="h2-title f-soletoxbold fs-56 color-2c2c2c text-center">
                    {special?.title}
                </h2>
                <Slider {...settings} className="specialty-list ast-flex">
                    {specialItemsImages?.map((item, key) => {
                        const path = extractPathname(item?.link, '#');

                        return (
                            <div key={key} className="s-box-slide">
                                <div className="s-box position-relative first">
                                    <svg
                                        width={144}
                                        height={145}
                                        viewBox="0 0 144 145"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M36.206 77.3156L66.4848 70.7025L87.784 93.7526L78.8043 123.416L48.5254 130.029L27.2263 106.979L36.206 77.3156Z"
                                            fill={key % 2 !== 0 ? '#A1CBED' : '#F6BA8D'}
                                        />
                                        <path
                                            d="M22.6659 20.9445L52.9448 14.3314L74.2439 37.3815L65.2642 67.0447L34.9854 73.6578L13.6862 50.6077L22.6659 20.9445Z"
                                            fill={key % 2 !== 0 ? '#A1CBED' : '#F6BA8D'}
                                        />
                                        <path
                                            d="M78.6415 37.9718L108.92 31.3587L130.22 54.4088L121.24 84.072L90.961 90.6852L69.6618 67.6351L78.6415 37.9718Z"
                                            fill={key % 2 !== 0 ? '#A1CBED' : '#F6BA8D'}
                                        />
                                    </svg>
                                    <div className="s-box-inner">
                                        {path && path !== '#' ? (
                                            <Link
                                                to={path}
                                                style={{
                                                    cursor: 'pointer',
                                                    display: 'block',
                                                    textDecoration: 'none',
                                                    color: 'inherit'
                                                }}
                                                onMouseDown={handleDragStart}
                                                onTouchStart={handleDragStart}
                                                onMouseMove={handleDragMove}
                                                onTouchMove={handleDragMove}
                                                onClick={(e) => handleLinkClick(e, path)}
                                            >
                                                <figure className="mb-0">
                                                    {item.imageData ? (
                                                        <GatsbyImage
                                                            decoding="async"
                                                            loading="lazy"
                                                            fadeIn={false}
                                                            image={item.imageData}
                                                            alt={item.altText}
                                                            style={{ width: "100%", height: "auto" }}
                                                        />
                                                    ) : (
                                                        <img
                                                            decoding="async"
                                                            src={item.sourceUrl}
                                                            alt={item.altText}
                                                            style={{ width: "100%", height: "auto" }}
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </figure>
                                                <div className="s-content">
                                                    <h3 className="h3-title f-soleto fw-700 fs-32 mb-0">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div style={{ cursor: 'default' }}>
                                                <figure className="mb-0">
                                                    {item.imageData ? (
                                                        <GatsbyImage
                                                            decoding="async"
                                                            loading="lazy"
                                                            fadeIn={false}
                                                            image={item.imageData}
                                                            alt={item.altText}
                                                            style={{ width: "100%", height: "auto" }}
                                                        />
                                                    ) : (
                                                        <img
                                                            decoding="async"
                                                            src={item.sourceUrl}
                                                            alt={item.altText}
                                                            style={{ width: "100%", height: "auto" }}
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </figure>
                                                <div className="s-content">
                                                    <h3 className="h3-title f-soleto fw-700 fs-32 mb-0">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </Slider>
            </div>
        </section>
    );
};

export default SpecialtySection;
