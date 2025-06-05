import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"

const HomeBanner = () => {
  const WP_BASE_URL = process.env.REACT_APP_BASE_URL_SITE || 'https://agencysitestaging.mystagingwebsite.com'
  const siteBaseUrl = process.env.REACT_APP_BASE_URL
  const data = useStaticQuery(graphql`
    query {
      cms {
        pageBy(uri: "/") {
          id
          title
          template {
            templateName
            ... on GraphCMS_Template_Home {
              templateName
              homeContent {
                flexibleContent {
                  ... on GraphCMS_HomeContentFlexibleContentBannerLayout {
                    desc
                    title
                    subTitle
                    sepText
                    serviceList {
                      link
                      title
                    }
                    box {
                      title
                      fieldGroupName
                      icon {
                        node {
                          id
                          sourceUrl
                        }
                      }
                    }
                    boxDesktop {
                      node {
                        id
                        sourceUrl
                      }
                    }
                    boxMobile {
                      node {
                        id
                        sourceUrl
                      }
                    }
                    badgeLogo {
                      node {
                        id
                        sourceUrl
                      }
                    }
                    backgroundImage {
                      node {
                        id
                        sourceUrl
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

  const content = data.cms.pageBy.template.homeContent.flexibleContent[0]

  return (
    <>
      <section
        className="home-banner"
        style={{ background: `no-repeat center/cover url(${content?.backgroundImage?.node?.sourceUrl})` }}
      >
        <div className="ast-container">
          <div className="banner-title position-relative text-center">
            <img
              src={content?.badgeLogo?.node?.sourceUrl}
              alt="Badge"
              className="img-badge"
            />
            <div className="sub-title f-soleto fw-500 text-white">
              {content?.subTitle}
            </div>
            <h1 className="h1-title f-soletoxbold text-white fw-800">
              {content?.title}
            </h1>
          </div>
          <div className="banner-sep ast-flex">
            <div className="sep-left">

              <img src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/brush-stroke-1.svg`} alt="" />
            </div>
            <div className="sep-text f-soleto fw-500 text-white">{content?.sepText}</div>
            <div className="sep-right">

              <img src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/brush-stroke-2.svg`} alt="" />
            </div>
          </div>
          <div className="banner-list ast-flex  justify-content-center">
            {/* {
              content?.serviceList?.map((item, key) => {
                let pathForLink = item?.link;

                if (item?.link) {
                  try {
                    const urlObject = new URL(item.link);
                    pathForLink = urlObject.pathname;
                  } catch (error) {
                    console.error("Đã xảy ra lỗi khi phân tích URL:", item.link, error);
                  }
                }

                return (
                  <Link key={key} to={pathForLink} className="link-item">
                    {item?.title}
                  </Link>
                );
              })
            } */}
            {
              content?.serviceList?.map((item, key) => {
                return (
                  <Link key={key} to={item?.link} className="link-item">
                    {item?.title}
                  </Link>
                );
              })
            }
          </div>
          <div className="box-desktop">
            <img src={content?.boxDesktop?.node?.sourceUrl} />
          </div>
          <div className="box-mobile">
            <img src={content?.boxMobile?.node?.sourceUrl} />
          </div>
          {/* <div className="banner-services text-white ast-flex justify-content-center">
            {
              content?.box?.map((item, key) => (
                <div className="box-ser" key={key}>
                  <img src={item?.icon?.node?.sourceUrl} alt="" />
                  <span className="f-soleto fw-500" dangerouslySetInnerHTML={{ __html: item?.title }}></span>
                </div>
              ))
            }
          </div> */}

          <div className="banner-desc f-soleto fw-500 text-white text-center">
            {content?.desc}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomeBanner