import React from "react"
import { Script } from "gatsby"
import Layout from "@components/layout"
import HomeBanner from '@components/HomeBanner'
import { SEO } from '@components/SEO'

import loadable from '@loadable/component';

// 1. Import trực tiếp các component trong khung nhìn đầu tiên
import ExpertsSection from '@components/sections/ExpertsSection';
import PatientsSection from '@components/sections/PatientsSection';

// Dùng loadable để import động tất cả các section
const PracticeSection = loadable(() => import('@components/sections/PracticeSection'));
const GetMoreSection = loadable(() => import('@components/sections/GetMoreSection'));
const HowWeCanHelpSection = loadable(() => import('@components/sections/HowWeCanHelpSection'));
const AwardsSection = loadable(() => import('@components/sections/AwardsSection'));
const TestimonialsSection = loadable(() => import('@components/sections/TestimonialsSection'));
const StatsSection = loadable(() => import('@components/sections/StatsSection'));
const SpecialtySection = loadable(() => import('@components/sections/SpecialtySection'));
const GiftBookSection = loadable(() => import('@components/sections/GiftBookSection'));


// Component `Home` giờ nhận `pageContext`
const Home = ({ pageContext }) => {
    const { schemas } = pageContext;
    // Dữ liệu được lấy từ `pageContext.pageData`
    const bannerContent = pageContext.pageData?.cms.pageBy.template?.homeContent?.flexibleContent.find(
        item => item.__typename === "GraphCMS_HomeContentFlexibleContentBannerLayout"
    );

    return (
        <React.Fragment>
            <Layout>
                <div id="content" className="site-content">
                    <div className="main-content">
                        {bannerContent && <HomeBanner content={bannerContent} />}

                        {/* Các component này giờ sẽ được render ngay từ đầu */}
                        <ExpertsSection />
                        <PatientsSection />

                        {/* Các component này vẫn được lazy-load */}
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
            {/* {schemas && schemas.length > 0 && schemas.map((schema, index) => (
                <Script
                    key={`schema-ld-${index}`}
                    type="application/ld+json"
                    className="rank-math-schema-pro"
                    strategy="post-hydrate" // Tải script khi trình duyệt rảnh rỗi
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema),
                    }}
                />
            ))} */}
        </React.Fragment>
    )
}

// Component `Head` cũng nhận `pageContext`
export const Head = ({ pageContext }) => {
    // Dữ liệu được lấy từ `pageContext.pageData`
    const bannerContent = pageContext.pageData?.cms.pageBy.template?.homeContent?.flexibleContent.find(
        item => item.__typename === "GraphCMS_HomeContentFlexibleContentBannerLayout"
    );

    // Lấy ra tất cả các đối tượng ảnh cần preload
    const imagesToPreload = [
        // bannerContent?.backgroundImage?.node?.localFile?.childImageSharp?.gatsbyImageData,
        bannerContent?.badgeLogo?.node?.localFile?.childImageSharp?.gatsbyImageData,
        bannerContent?.boxDesktop?.node?.localFile?.childImageSharp?.gatsbyImageData,
        bannerContent?.boxMobile?.node?.localFile?.childImageSharp?.gatsbyImageData,
    ].filter(Boolean); // Lọc bỏ các giá trị null hoặc undefined

    return (
        <SEO
            metaHtml={pageContext.metaHtml || {}}
        // schemas={pageContext.schemas || []}
        >
            {/* Tạo thẻ link preload cho mỗi ảnh */}
            {imagesToPreload.map(image => {
                // `gatsby-plugin-image` cung cấp sẵn các thuộc tính cần thiết
                const { src, srcSet, sizes } = image.images.fallback;
                return (
                    <link
                        key={src}
                        rel="preload"
                        as="image"
                        href={src}
                        imageSrcSet={srcSet}
                        imageSizes={sizes}
                    />
                );
            })}
            {/* <meta name="keywords" data-otto-pixel="dynamic-seo" content="Medical Wellness, Hormone Optimization, Sexual Wellness, Anti-Aging Procedures, Hormones Optimization, Medical Weight Loss, Cash-based Medical Practice, Practice Accelerator Program, Lead Generating Strategies"></meta> */}
        </SEO>
    );
};

export default Home;