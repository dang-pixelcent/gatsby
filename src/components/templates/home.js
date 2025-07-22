import React, { useEffect, useState } from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import Layout from "@components/layout"
import Slider from "react-slick";
import HomeBanner from '@components/HomeBanner'
import { SEO } from '@components/SEO'
import { extractPathname } from "/src/utils/urlUtils"

const Home = () => {
    // const { seoData } = pageContext;

    // const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL
    // const siteBaseUrl = process.env.GATSBY_SITE_URL

    const query = useStaticQuery(graphql`
    query {
      cms {
        pageBy(uri: "/") {
          title
          id
          template {
            templateName
            ... on GraphCMS_Template_Home {
              templateName
              homeContent {
                flexibleContent {
                  ... on GraphCMS_HomeContentFlexibleContentExpertsLayout {
                    title
                    logo {
                      image {
                        node {
                          id
                          sourceUrl
                          link
                        }
                      }
                    }
                  }
                  ... on GraphCMS_HomeContentFlexibleContentPatientsLayout {
                    desc
                    fieldGroupName
                    backgroundImage {
                      node {
                        id
                        link
                        sourceUrl
                        altText
                      }
                    }
                    button {
                      url
                      title
                      target
                    }
                    image {
                      node {
                        id
                        sourceUrl
                        link
                        altText
                      }
                    }
                    title
                    video
                  }
                  ... on GraphCMS_HomeContentFlexibleContentYourPracticeLayout {
                    title
                    desc
                    fieldGroupName
                    backgroundImage {
                      node {
                        id
                        link
                        sourceUrl
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
                          id
                          sourceUrl
                          title
                        }
                      }
                    }
                  }
                  ... on GraphCMS_HomeContentFlexibleContentGetMoreLayout {
                    fieldGroupName
                    title
                    item {
                      desc
                      title
                    }
                  }
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
                      }
                    }
                    button {
                      title
                      url
                      target
                    }
                  }
                  ... on GraphCMS_HomeContentFlexibleContentTestimonialsLayout {
                    authorName
                    blockquote
                    desc
                    button {
                      title
                      url
                      target
                    }
                    testimonialContent {
                      content
                      box {
                        number
                        text
                        icon {
                          node {
                            sourceUrl
                            altText
                            id
                          }
                        }
                      }
                      tags {
                        tag
                      }
                    }
                    fieldGroupName
                    title
                    video
                  }
                  ... on GraphCMS_HomeContentFlexibleContentStatsLayout {
                    fieldGroupName
                    title
                    backgroundImage {
                      node {
                        id
                        sourceUrl
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
                  ... on GraphCMS_HomeContentFlexibleContentSpecialtyLayout {
                    fieldGroupName
                    title
                    backgroundImage {
                      node {
                        id
                        sourceUrl
                      }
                    }
                    items {
                      image {
                        node {
                          altText
                          id
                          sourceUrl
                        }
                      }
                      title
                      link
                    }
                  }
                  ... on GraphCMS_HomeContentFlexibleContentGiftBookLayout {
                    content
                    fieldGroupName
                    image {
                      node {
                        altText
                        sourceUrl
                        id
                      }
                    }
                    title
                    link {
                      title
                      url
                      target
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
    const experts = query.cms.pageBy.template?.homeContent?.flexibleContent[1];
    const patients = query.cms.pageBy.template?.homeContent?.flexibleContent[2];
    const practice = query.cms.pageBy.template?.homeContent?.flexibleContent[3];
    const getMore = query.cms.pageBy.template?.homeContent?.flexibleContent[4];
    const howWeCanHelp = query.cms.pageBy.template?.homeContent?.flexibleContent[5];
    const testimonials = query.cms.pageBy.template?.homeContent?.flexibleContent[6];
    const stats = query.cms.pageBy.template?.homeContent?.flexibleContent[7];
    const special = query.cms.pageBy.template?.homeContent?.flexibleContent[8];
    const giftBook = query.cms.pageBy.template?.homeContent?.flexibleContent[9];

    // /**
    //  * xử lý SEO cho trang chủ
    //  */
    // const [homeSeoData, setHomeSeoData] = React.useState(null)

    // React.useEffect(() => {
    //   (async () => {
    //     setHomeSeoData(await fetchSeoData({
    //       url: WP_BASE_URL
    //     }))
    //   })()
    // }, [])
    // //----

    // Thêm state để track drag state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);

    // Function để handle mouse/touch events
    const handleMouseDown = (e) => {
        setIsDragging(false);
        setDragStartX(e.clientX || e.touches?.[0]?.clientX || 0);
    };

    const handleMouseMove = (e) => {
        const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
        const diffX = Math.abs(currentX - dragStartX);

        // Nếu di chuyển quá 5px thì coi như đang drag
        if (diffX > 5) {
            setIsDragging(true);
        }
    };

    const handleItemClick = (e, link) => {
        // Nếu đang drag thì không cho click
        if (isDragging) {
            e.preventDefault();
            return false;
        }

        // Nếu không drag thì cho phép navigate
        if (link && link !== '#') {
            window.location.href = extractPathname(link, '#');
        }
    };

    useEffect(() => {
        if (patients) {

            const script1 = document.createElement("script");
            script1.src = "https://fast.wistia.com/embed/medias/xf7qhxzcf3.jsonp";
            script1.async = true;
            document.body.appendChild(script1);


            const script2 = document.createElement("script");
            script2.src = "https://fast.wistia.com/assets/external/E-v1.js";
            script2.async = true;
            document.body.appendChild(script2);

            return () => {
                document.body.removeChild(script1);
                document.body.removeChild(script2);
            };
        }

    }, [patients]);

    const settings = {
        draggable: false,
        dots: false,
        infinite: true,
        speed: 300,
        centerPadding: "100px",
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: (<button type="button" className="slick-arrow slick-prev" aria-label="Previous experts"><svg width="10" height="19" viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.6625 18.4567L0 9.65669L8.8 0.856689L9.7625 1.81919L1.925 9.65669L9.625 17.3567L8.6625 18.4567Z" fill="#AAAAAA" /></svg></button>),
        nextArrow: (<button type="button" className="slick-arrow slick-next" aria-label="Next experts"><svg width="10" height="19" viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.33726 18.4567L9.99976 9.65669L1.19976 0.856689L0.237257 1.81919L8.07476 9.65669L0.374756 17.3567L1.33726 18.4567Z" fill="#AAAAAA" /></svg></button>),
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 4,
                arrows: false,
                dots: true,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                arrows: false,
                dots: true,
            }
        },
        ],
    };
    const settings2 = {
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
        prevArrow: (<button type="button" className="slick-arrow slick-prev" aria-label="Previous specialty"> <svg width="54" height="100" viewBox="0 0 54 100" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M52.3223 93.129C53.0704 93.8873 53.4898 94.9096 53.4898 95.9748C53.4898 97.04 53.0704 98.0623 52.3223 98.8206C51.9544 99.1941 51.516 99.4908 51.0324 99.6933C50.5488 99.8957 50.0298 100 49.5056 100C48.9813 100 48.4623 99.8957 47.9787 99.6933C47.4951 99.4908 47.0567 99.1941 46.6888 98.8206L1.16748 52.8458C0.419413 52.0875 0 51.0652 0 50C0 48.9348 0.419413 47.9125 1.16748 47.1542L46.6888 1.17939C47.0567 0.805857 47.4951 0.509222 47.9787 0.306747C48.4623 0.104272 48.9813 0 49.5056 0C50.0298 0 50.5488 0.104272 51.0324 0.306747C51.516 0.509222 51.9544 0.805857 52.3223 1.17939C53.0704 1.93767 53.4898 2.96002 53.4898 4.0252C53.4898 5.09038 53.0704 6.11272 52.3223 6.87101L10.8066 50.0029L52.3223 93.129Z" fill="#0568B9" /> </svg> </button>),
        nextArrow: (<button type="button" className="slick-arrow slick-next" aria-label="Next specialty"> <svg width="54" height="100" viewBox="0 0 54 100" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M1.16793 93.129C0.419865 93.8873 0.000442505 94.9096 0.000442505 95.9748C0.000442505 97.04 0.419865 98.0623 1.16793 98.8206C1.53579 99.1941 1.97426 99.4908 2.45784 99.6933C2.94141 99.8957 3.46042 100 3.98467 100C4.50892 100 5.02794 99.8957 5.51152 99.6933C5.99509 99.4908 6.43356 99.1941 6.80142 98.8206L52.3228 52.8458C53.0708 52.0875 53.4902 51.0652 53.4902 50C53.4902 48.9348 53.0708 47.9125 52.3228 47.1542L6.80142 1.17939C6.43356 0.805857 5.99509 0.509222 5.51152 0.306747C5.02794 0.104272 4.50892 0 3.98467 0C3.46042 0 2.94141 0.104272 2.45784 0.306747C1.97426 0.509222 1.53579 0.805857 1.16793 1.17939C0.419865 1.93767 0.000442505 2.96002 0.000442505 4.0252C0.000442505 5.09038 0.419865 6.11272 1.16793 6.87101L42.6836 50.0029L1.16793 93.129Z" fill="#0568B9" /> </svg> </button>),
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

    return (
        <Layout>
            <div id="content" className="site-content">
                <div className="main-content">
                    <HomeBanner />
                    <section className="section sc-experts">
                        <div className="ast-container-fluid px-0">
                            <h2 className="fs-22 fw-500 color-0659A9 text-center">
                                {experts?.title}
                            </h2>
                            <Slider {...settings} className="experts-list ast-flex align-items-center">
                                {
                                    experts?.logo?.map((item, key) => (
                                        // <Link key={key} href={item?.image?.node?.link ?? '#'}>
                                        <a key={key} href='#' aria-label={`Expert partner ${key + 1}`} title={`View expert partner ${key + 1}`}>
                                            <img src={item?.image?.node?.sourceUrl} alt={`Expert partner logo ${key + 1}`} decoding="async"/>
                                        </a>
                                    ))
                                }
                            </Slider>
                        </div>
                    </section>
                    <section
                        className="section sc-patients"
                        style={{ backgroundColor: "#F3F3F3" }}
                    >
                        <div className="cus-container">
                            <div className="ast-flex col-patients">
                                <div className="col-content ast-flex flex-column">
                                    <div className="col-content-text">
                                        <h3 className="fs-48 f-soletoxbold" dangerouslySetInnerHTML={{ __html: patients?.title }}></h3>
                                        <div className="desc f-soleto fs-26">
                                            {patients?.desc}
                                        </div>
                                    </div>
                                    <div className="sc-btn">
                                        <Link
                                            to={extractPathname(patients?.button?.url, '#')}
                                            className="btn-bg bg-F2771A patients-button btn-size-18 fw-700"
                                        >
                                            {patients.button?.title}
                                        </Link>
                                    </div>
                                </div>
                                <div className="home-video">
                                    <div
                                        className="wistia_responsive_padding"
                                        style={{ padding: "56.25% 0 0 0", position: "relative" }}
                                    >
                                        <div
                                            className="wistia_responsive_wrapper"
                                            style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "100%" }}
                                        >
                                            <div
                                                className="wistia_embed wistia_async_xf7qhxzcf3 videoFoam=true seo=false"
                                                style={{ height: "100%", position: "relative", width: "100%" }}
                                            >
                                                <div
                                                    className="wistia_swatch"
                                                    style={{
                                                        height: "100%",
                                                        left: 0,
                                                        opacity: 0,
                                                        overflow: "hidden",
                                                        position: "absolute",
                                                        top: 0,
                                                        transition: "opacity 200ms",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <img
                                                        src="https://fast.wistia.com/embed/medias/xf7qhxzcf3/swatch"
                                                        style={{
                                                            filter: "blur(5px)",
                                                            height: "100%",
                                                            objectFit: "contain",
                                                            width: "100%",
                                                        }}
                                                        alt=""
                                                        aria-hidden="true"
                                                        onLoad={(e) => (e.target.parentNode.style.opacity = 1)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section
                        className="section sc-practice"
                        style={{
                            background: `no-repeat center/cover url(${practice?.backgroundImage?.node?.sourceUrl})`
                        }}
                    >
                        <div className="cus-container">
                            <h2 className="h2-title fs-48 f-soletoxbold text-white text-center">
                                {practice?.title}
                            </h2>
                            <div className="desc text-white fs-22 text-center">
                                {practice.desc}
                            </div>
                            <div className="boxies-practice-list">
                                {
                                    practice.item?.map((item, key) => (
                                        <div key={key} className="practice-item position-relative ast-flex justify-content-center">
                                            <div className="inner ast-flex flex-column">
                                                <img src={item?.icon?.node?.sourceUrl} alt={item?.icon?.node?.altText} />
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
                                    ))
                                }
                            </div>
                            <div className="sc-btn ast-flex justify-content-center">
                                <Link
                                    to={extractPathname(practice.button?.url, '#')}
                                    className="btn-bg bg-F2771A btn-size-18 fw-700"
                                >
                                    {practice.button?.title}
                                </Link>
                            </div>
                        </div>
                    </section>
                    <section className="section sc-get-more">
                        <div className="cus-container flex-column">
                            <h2 className="h2-title fs-48 f-soleto fw-800 color-00255B text-center mb-0">
                                {getMore.title}
                            </h2>
                            <div className="steps ast-flex justify-content-center align-items-center">
                                {
                                    getMore.item?.map((item, key) => (
                                        <Link key={key} to="/" className="step f-soleto fw-500">
                                            {item.title}
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    </section>
                    <section
                        className="section sc-how-we-can-help pt-100 pb-100"
                        style={{
                            background: `no-repeat center/cover url(${howWeCanHelp?.backgroundImage?.node?.sourceUrl})`
                        }}
                    >
                        <div className="cus-container">
                            <div className="header-title ast-flex flex-column align-items-center text-center">
                                <div className="sub-title f-soleto fs-32 fw-500 color-00255B text-uppercase">
                                    {howWeCanHelp?.subTitle}
                                </div>
                                <h2 className="h2-title f-soletoxbold fs-56 color-2c2c2c" dangerouslySetInnerHTML={{ __html: howWeCanHelp?.title }}></h2>
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
                                        howWeCanHelp.boxs?.map((item, key) => (
                                            <div key={key} item={item} className={`circle-box box-${key + 1}`}>
                                                <figure>
                                                    <img src={item.icon?.node?.sourceUrl} alt={item.icon?.node?.altText} />
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
                    <section className="section sc-testimonials">
                        <div className="cus-container">
                            <h2 className="h2-title f-soleto fs-32 fw-500 color-00255B text-center text-uppercase">
                                {testimonials?.title}
                            </h2>
                            <div className="blockquote text-center">
                                <blockquote dangerouslySetInnerHTML={{ __html: testimonials?.blockquote }}></blockquote>
                                <div className="author f-soleto">
                                    - {testimonials?.authorName}
                                </div>
                            </div>
                            <div className="testimonials-list">
                                <div className="item ast-flex">
                                    <div className="col-video">
                                        <div className="video-inner-home" dangerouslySetInnerHTML={{ __html: testimonials?.video }}></div>
                                    </div>
                                    <div className="col-content ast-flex flex-column">
                                        <div className="boxies ast-flex">
                                            {
                                                testimonials.testimonialContent.box?.map((item, key) => (
                                                    <div className="box" key={key}>
                                                        <div className="testi-box-number ast-flex justify-content-center align-items-center">
                                                            <img src={item.icon?.node?.sourceUrl} alt={item.icon?.node?.altText} />
                                                            <span className="number f-soleto fw-800">{item.number}</span>
                                                        </div>
                                                        <span className="box-text f-soleto fw-700 text-center">
                                                            {item.text}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="testi-content">
                                            <div className="tags ast-flex">
                                                {
                                                    testimonials.testimonialContent.tags?.map((item, key) => (
                                                        <a href="#" key={key}>{item?.tag}</a>
                                                    ))
                                                }
                                            </div>
                                            <div className="content" dangerouslySetInnerHTML={{ __html: testimonials?.testimonialContent?.content }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="desc f-soleto fw-500 text-center">
                                {testimonials.desc}
                            </div>
                            <div className="sc-btn ast-flex justify-content-center">
                                <Link
                                    to={extractPathname(testimonials?.button?.url, '#')}
                                    className="btn-bg bg-F2771A btn-size-18 fw-700"
                                >
                                    {testimonials?.button?.title}
                                </Link>
                            </div>
                        </div>
                    </section>
                    <section
                        className="section sc-how-we-do-it"
                        style={{ background: `no-repeat center/cover url(${stats.backgroundImage?.node?.sourceUrl})` }}
                    >
                        <div className="cus-container">
                            <h2 className="h2-title f-soletoxbold text-white mb-0 text-center">
                                {stats.title}
                            </h2>
                            <div className="number-infor ast-flex align-items-center">
                                {
                                    stats.item?.map((x, key) => (
                                        <div key={key} className="box-number ast-flex align-items-center">
                                            <div className="ast-flex align-items-center">
                                                <div className="box-img">
                                                    <figure className="mb-0">
                                                        <img src={x.icon?.node?.sourceUrl} alt={x.icon?.node?.altText} />
                                                    </figure>
                                                </div>
                                                <div className="desc f-soleto fw-800 text-white">
                                                    {x.desc}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="sc-btn ast-flex justify-content-center">
                                <Link
                                    to={extractPathname(stats.button?.url, '#')}
                                    className="btn-bg bg-F2771A btn-size-18 fw-700"
                                >
                                    {stats.button?.title}
                                </Link>
                            </div>
                        </div>
                    </section>
                    <section
                        className="section sc-specialty"
                        style={{ background: `no-repeat center/cover url(${special.backgroundImage?.node?.sourceUrl})` }}
                    >
                        <div className="ast-container-fluid padding-left padding-right">
                            <h2 className="h2-title f-soletoxbold fs-56 color-2c2c2c text-center">
                                {special.title}
                            </h2>
                            <Slider {...settings2} className="specialty-list ast-flex">
                                {
                                    special.items?.map((item, key) => (
                                        <div key={key} className="s-box-slide">
                                            <div className="s-box  position-relative first">
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
                                                    <div
                                                        onMouseDown={handleMouseDown}
                                                        onMouseMove={handleMouseMove}
                                                        onTouchStart={handleMouseDown}
                                                        onTouchMove={handleMouseMove}
                                                        onClick={(e) => handleItemClick(e, item?.link)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <figure className="mb-0">
                                                            <img src={item.image?.node?.sourceUrl} alt={item.image?.node?.altText} />
                                                        </figure>
                                                        <div className="s-content">
                                                            <h3 className="h3-title f-soleto fw-700 fs-32 mb-0">
                                                                {item.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </Slider>
                        </div>
                    </section>
                    <section className="section sc-gift-book">
                        <div className="cus-container">
                            <div className="sc-free-gift ast-flex">
                                <div className="free-gift-content display-mobile">
                                    <h2 className="fs-36 fw-800 color-00255B">
                                        <a href={giftBook?.link?.url} target="_blank">{giftBook.title}</a>
                                    </h2>
                                </div>
                                <figure>
                                    <img src="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2025/06/book-only-png.webp" alt={giftBook?.image?.node?.altText} width={150} height={180} />
                                </figure>
                                <div className="free-gift-content display-desktop">
                                    <h2 className="fs-36 fw-800 color-00255B">
                                        <a href={giftBook?.link?.url} target="_blank">{giftBook.title}</a>
                                    </h2>
                                    <div className="desc color-00255B" dangerouslySetInnerHTML={{ __html: giftBook?.content }}></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    )
}

export const Head = ({ pageContext }) => (
    <SEO
        seoData={pageContext.seoData || {}}
    >
        <meta name="keywords" data-otto-pixel="dynamic-seo" content="Medical Wellness, Hormone Optimization, Sexual Wellness, Anti-Aging Procedures, Hormones Optimization, Medical Weight Loss, Cash-based Medical Practice, Practice Accelerator Program, Lead Generating Strategies"></meta>
    </SEO>
);

export default Home;