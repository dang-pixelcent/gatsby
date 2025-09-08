import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import { extractPathname } from "@utils/urlUtils.js";
import LazyEmbed from '@components/Video/LazyEmbed';

const TestimonialsSection = () => {
    const data = useStaticQuery(graphql`
        query {
            cms {
                pageBy(uri: "/") {
                    template {
                        ... on GraphCMS_Template_Home {
                            homeContent {
                                flexibleContent {
                                    ... on GraphCMS_HomeContentFlexibleContentTestimonialsLayout {
                                        __typename
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
                                        title
                                        video
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `);

    const testimonials = data.cms.pageBy.template?.homeContent?.flexibleContent.find(
        item => item.__typename === "GraphCMS_HomeContentFlexibleContentTestimonialsLayout"
    );

    if (!testimonials) {
        return null;
    }

    return (
        <section className="section sc-testimonials">
            <div className="cus-container">
                <h2 className="h2-title f-soleto fs-32 fw-500 color-00255B text-center text-uppercase">
                    {testimonials?.title}
                </h2>
                <div className="blockquote text-center">
                    <blockquote dangerouslySetInnerHTML={{ __html: testimonials?.blockquote || '' }}></blockquote>
                    <div className="author f-soleto">
                        - {testimonials?.authorName}
                    </div>
                </div>
                <div className="testimonials-list">
                    <div className="item ast-flex">
                        <div className="col-video">
                            {/* <div className="video-inner-home" dangerouslySetInnerHTML={{ __html: testimonials?.video }}></div> */}
                            <div className="video-inner-home"><LazyEmbed embedCode={testimonials?.video} rootMargin="400px" /></div>
                        </div>
                        <div className="col-content ast-flex flex-column">
                            <div className="boxies ast-flex">
                                {
                                    testimonials?.testimonialContent?.box?.map((item, key) => (
                                        <div className="box" key={key}>
                                            <div className="testi-box-number ast-flex justify-content-center align-items-center">
                                                <img decoding="async" src={item.icon?.node?.sourceUrl} alt={item.icon?.node?.altText} loading="lazy" />
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
                                        testimonials?.testimonialContent?.tags?.map((item, key) => (
                                            <a href="#" key={key}>{item?.tag}</a>
                                        ))
                                    }
                                </div>
                                <div className="content" dangerouslySetInnerHTML={{ __html: testimonials?.testimonialContent?.content || '' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="desc f-soleto fw-500 text-center">
                    {testimonials?.desc}
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
    );
};

export default TestimonialsSection;
