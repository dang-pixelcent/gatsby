import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";

const GetMoreSection = () => {
    const data = useStaticQuery(graphql`
        query {
            cms {
                pageBy(uri: "/") {
                    template {
                        ... on GraphCMS_Template_Home {
                            homeContent {
                                flexibleContent {
                                    ... on GraphCMS_HomeContentFlexibleContentGetMoreLayout {
                                        __typename
                                        title
                                        item {
                                            desc
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

    const getMore = data.cms.pageBy.template?.homeContent?.flexibleContent.find(
        item => item.__typename === "GraphCMS_HomeContentFlexibleContentGetMoreLayout"
    );

    if (!getMore) {
        return null;
    }

    return (
        <section className="section sc-get-more">
            <div className="cus-container flex-column">
                <h2 className="h2-title fs-48 f-soleto fw-800 color-00255B text-center mb-0">
                    {getMore?.title}
                </h2>
                <div className="steps ast-flex justify-content-center align-items-center">
                    {
                        getMore?.item?.map((item, key) => (
                            <Link key={key} to="/" className="step f-soleto fw-500">
                                {item.title}
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default GetMoreSection;
