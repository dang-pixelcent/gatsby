import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import './styles/giftBook.scss';

const GiftBookSection = () => {
    const data = useStaticQuery(graphql`
        query {
            cms {
                pageBy(uri: "/") {
                    template {
                        ... on GraphCMS_Template_Home {
                            homeContent {
                                flexibleContent {
                                    ... on GraphCMS_HomeContentFlexibleContentGiftBookLayout {
                                        __typename
                                        content
                                        fieldGroupName
                                        image {
                                            node {
                                                altText
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

    const giftBook = data.cms.pageBy.template.homeContent.flexibleContent.find(
        item => item.__typename === 'GraphCMS_HomeContentFlexibleContentGiftBookLayout'
    );

    const giftBookImage = {
        imageData: getImage(giftBook?.image?.node?.localFile),
        sourceUrl: giftBook?.image?.node?.sourceUrl,
        altText: giftBook?.image?.node?.altText || "Gift book image"
    };

    if (!giftBook) {
        return null;
    }

    return (
        <section className="section sc-gift-book">
            <div className="cus-container">
                <div className="sc-free-gift ast-flex">
                    <div className="free-gift-content display-mobile">
                        <h2 className="fs-36 fw-800 color-00255B">
                            <Link href={giftBook?.link?.url} target="_blank">{giftBook?.title}</Link>
                        </h2>
                    </div>
                    <figure>
                        {giftBookImage.imageData ? (
                            <GatsbyImage
                                image={giftBookImage.imageData}
                                alt={giftBookImage.altText}
                                // style={{ width: "auto", height: "auto" }}
                                className="gift-book-image"
                                sizes="(max-width: 249px) 100vw, 249px"
                            />
                        ) : (
                            <img
                                src={giftBookImage.sourceUrl}
                                alt={giftBookImage.altText}
                                width={150}
                                height={180}
                                loading="lazy"
                            />
                        )}
                    </figure>
                    <div className="free-gift-content display-desktop">
                        <h2 className="fs-36 fw-800 color-00255B">
                            <a href={giftBook?.link?.url} target="_blank">{giftBook?.title}</a>
                        </h2>
                        <div className="desc color-00255B" dangerouslySetInnerHTML={{ __html: giftBook?.content || '' }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GiftBookSection;
