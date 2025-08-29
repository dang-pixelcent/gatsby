import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
// import { StaticImage } from "gatsby-plugin-image"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { extractPathname } from "/src/utils/urlUtils"
import "./styles.scss"

const HomeBanner = () => {
  const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL
  // const siteBaseUrl = process.env.GATSBY_SITE_URL
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
                        localFile {
                          childImageSharp {
                            gatsbyImageData(
                              quality: 60
                              formats: [AUTO, WEBP, AVIF]
                              placeholder: BLURRED
                            )
                          }
                        }
                      }
                    }
                    boxMobile {
                      node {
                        id
                        sourceUrl
                        localFile {
                          childImageSharp {
                            gatsbyImageData(
                              width: 303
                              height: 216
                              quality: 60
                              formats: [AUTO, WEBP, AVIF]
                              placeholder: BLURRED
                            )
                          }
                        }
                      }
                    }
                    badgeLogo {
                      node {
                        id
                        sourceUrl
                        localFile {
                          childImageSharp {
                            gatsbyImageData(
                              quality: 90
                              formats: [AUTO, WEBP, AVIF]
                              placeholder: BLURRED
                            )
                          }
                        }
                      }
                    }
                    backgroundImage {
                      node {
                        id
                        sourceUrl
                        localFile {
                          childImageSharp {
                            gatsbyImageData(
                              quality: 90
                              formats: [AUTO, WEBP, AVIF]
                              placeholder: BLURRED
                              layout: FULL_WIDTH
                            )
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

  const content = data.cms.pageBy.template.homeContent.flexibleContent[0]
  // Lấy hình ảnh tối ưu hóa bằng Gatsby Image
  const backgroundImage = getImage(content?.backgroundImage?.node?.localFile)
  const badgeImage = getImage(content?.badgeLogo?.node?.localFile)
  const boxDesktopImage = getImage(content?.boxDesktop?.node?.localFile)
  const boxMobileImage = getImage(content?.boxMobile?.node?.localFile)

  return (
    <>
      <section
        className="home-banner"
      // style={{
      //   backgroundImage: "url('https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2024/11/hero-banner-v2-png.webp')",
      //   backgroundPosition: 'center',
      //   backgroundRepeat: 'no-repeat',
      //   backgroundSize: 'cover',
      // }}
      >
        {/* Background Image với Gatsby Image */}
        {backgroundImage && (
          <GatsbyImage
            image={backgroundImage}
            alt="Wellness Clinic Marketing Hero Banner"
            className="banner-bg"
            loading="eager"
            fetchPriority="high"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
          />
        )}
        {/* <StaticImage
          src="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2024/11/hero-banner-v2-png.webp"
          alt="Wellness Clinic Marketing Hero Banner"
          // placeholder="blurred"
          formats={["auto", "webp", "avif"]}
          quality={90}
          className="banner-bg"
          loading="eager" // Critical above-fold image
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        /> */}
        <div className="cus-container">
          <div className="banner-title position-relative text-center">
            {/* Badge với Gatsby Image */}
            {badgeImage && (
              <GatsbyImage
                image={badgeImage}
                alt="Badge"
                className="img-badge position-absolute"
                loading="eager"
              />
            )}
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
                const pathForLink = extractPathname(item?.link, '#');

                return (
                  <Link key={key} to={extractPathname(item?.link, '#')} className="link-item">
                    {item?.title}
                  </Link>
                );
              })
            } */}
            {
              content?.serviceList?.map((item, key) => {
                return (
                  <Link key={key} to={extractPathname(item?.link, '#')} className="link-item">
                    {item?.title}
                  </Link>
                );
              })
            }

          </div>
          <div className="box-desktop">
            {boxDesktopImage && (
              <GatsbyImage
                image={boxDesktopImage}
                alt="Desktop Box"
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 600px) 100vw, 518px"
              />
            )}
            {/* <img alt="Desktop Box" decoding="async" src="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/hero-orange-icons-desktop-png.webp" sizes="(max-width: 1366px) 524px, " data-fluid-image="1" srcset="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/hero-orange-icons-desktop-524w-1x-png.webp 524w, https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/hero-orange-icons-desktop-524w-2x-png.webp 1048w, "></img> */}
            {/* <img alt="Desktop Box" src={content?.boxDesktop?.node?.sourceUrl} nitro-lazy-src="https://cdn-ildkbbb.nitrocdn.com/fkaQeaaaKzvRPORNguIPgjvTQBtCcEbQ/assets/images/optimized/rev-22f84eb/www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/hero-orange-icons-desktop.png" className="lazyloaded" decoding="async" nitro-lazy-empty="true" id="NzgwOjExMQ==-1" /> */}
            {/* <img alt="Desktop Box"
              src="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/hero-orange-icons-desktop-png.webp"
              nitro-lazy-src="https://cdn-ildkbbb.nitrocdn.com/fkaQeaaaKzvRPORNguIPgjvTQBtCcEbQ/assets/images/optimized/rev-22f84eb/www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/hero-orange-icons-desktop.png" className="lazyloaded" decoding="async" nitro-lazy-empty="true" id="NzgwOjExMQ==-1" /> */}
          </div>
          <div className="box-mobile">
            {boxMobileImage && (
              <GatsbyImage
                image={boxMobileImage}
                alt="Mobile Box"
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 412px) 303px, 303px"
              />
            )}
            {/* <img alt="Mobile Box" decoding="async" src="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/hero-orange-icons-mobile-png.webp" sizes="(max-width: 412px) 303px, " data-fluid-image="1" srcset="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/hero-orange-icons-mobile-303w-1x-png.webp 303w, https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/hero-orange-icons-mobile-303w-2x-png.webp 606w, "></img> */}
            {/* <img alt="Mobile Box"
              decoding="async"
              data-berqwpsrc="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.wellnessclinicmarketing.com/wp-content/uploads/2025/03/hero-orange-icons-mobile-png.webp"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDU1IiBoZWlnaHQ9IjMyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9Im5vbmUiIC8+PC9zdmc+"
              className="nitro-lazy" /> */}
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