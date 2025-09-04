import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Layout from "@components/layout"
import HomeBanner from '@components/HomeBanner'
import { SEO } from '@components/SEO'

import loadable from '@loadable/component';


// Dùng loadable để import động tất cả các section
const ExpertsSection = loadable(() => import('@components/sections/ExpertsSection'), { ssr: false });
const PatientsSection = loadable(() => import('@components/sections/PatientsSection'), { ssr: false });
const PracticeSection = loadable(() => import('@components/sections/PracticeSection'), { ssr: false });
const GetMoreSection = loadable(() => import('@components/sections/GetMoreSection'), { ssr: false });
const HowWeCanHelpSection = loadable(() => import('@components/sections/HowWeCanHelpSection'), { ssr: false });
const AwardsSection = loadable(() => import('@components/sections/AwardsSection'), { ssr: false });
const TestimonialsSection = loadable(() => import('@components/sections/TestimonialsSection'), { ssr: false });
const StatsSection = loadable(() => import('@components/sections/StatsSection'), { ssr: false });
const SpecialtySection = loadable(() => import('@components/sections/SpecialtySection'), { ssr: false });
const GiftBookSection = loadable(() => import('@components/sections/GiftBookSection'), { ssr: false });


const Home = () => {
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
                    ... on GraphCMS_HomeContentFlexibleContentBannerLayout {
                        __typename
                        desc
                        title
                        subTitle
                        sepText
                        serviceList {
                            link
                            title
                        }
                        boxDesktop {
                            node {
                                sourceUrl
                                localFile {
                                    childImageSharp {
                                        gatsbyImageData(quality: 60, formats: [AUTO, WEBP, AVIF], placeholder: NONE)
                                    }
                                }
                            }
                        }
                        boxMobile {
                            node {
                                sourceUrl
                                localFile {
                                    childImageSharp {
                                        gatsbyImageData(width: 303, height: 216, quality: 60, formats: [AUTO, WEBP, AVIF], placeholder: NONE)
                                    }
                                }
                            }
                        }
                        badgeLogo {
                            node {
                                sourceUrl
                                localFile {
                                    childImageSharp {
                                        gatsbyImageData(quality: 60, formats: [AUTO, WEBP, AVIF], placeholder: NONE)
                                    }
                                }
                            }
                        }
                        backgroundImage {
                            node {
                                sourceUrl
                                localFile {
                                    childImageSharp {
                                        gatsbyImageData(quality: 60, formats: [AUTO, WEBP, AVIF], placeholder: NONE, layout: FULL_WIDTH)
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

    // Tìm đúng dữ liệu cho Banner
    const bannerContent = query.cms.pageBy.template?.homeContent?.flexibleContent.find(
        item => item.__typename === "GraphCMS_HomeContentFlexibleContentBannerLayout"
    );

    return (
        <Layout>
            <div id="content" className="site-content">
                <div className="main-content">
                    {bannerContent && <HomeBanner content={bannerContent} />}

                    {/* Các component này sẽ chỉ được tải khi người dùng cuộn đến */}
                    <ExpertsSection />
                    <PatientsSection />
                    <PracticeSection />
                    <GetMoreSection />
                    <HowWeCanHelpSection />
                    <AwardsSection />
                    <TestimonialsSection />
                    <StatsSection />
                    <SpecialtySection />
                    <GiftBookSection />
                </div>
            </div>
        </Layout>
    )
}

export const Head = ({ pageContext }) => (
    <SEO
        seoData={pageContext.seoData || {}}
    // lcpImageUrl="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2024/11/hero-banner-v2-png.webp"
    >
        <meta name="keywords" data-otto-pixel="dynamic-seo" content="Medical Wellness, Hormone Optimization, Sexual Wellness, Anti-Aging Procedures, Hormones Optimization, Medical Weight Loss, Cash-based Medical Practice, Practice Accelerator Program, Lead Generating Strategies"></meta>
    </SEO>
);

export default Home;