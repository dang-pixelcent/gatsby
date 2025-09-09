import React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { extractPathname } from "/src/utils/urlUtils"
import "./styles.scss"

// Component giờ sẽ nhận `content` từ props, không tự query nữa
const HomeBanner = ({ content }) => {
  const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL

  // Dữ liệu đã được truyền vào, chỉ cần sử dụng
  const backgroundImage = getImage(content?.backgroundImage?.node?.localFile)
  const badgeImage = getImage(content?.badgeLogo?.node?.localFile)
  const boxDesktopImage = getImage(content?.boxDesktop?.node?.localFile)
  const boxMobileImage = getImage(content?.boxMobile?.node?.localFile)

  return (
    <>
      <section className="home-banner">
        {backgroundImage && (
          <GatsbyImage
            decoding="async"
            image={backgroundImage}
            alt="Wellness Clinic Marketing Hero Banner"
            className="banner-bg"
            loading="eager"
            fadeIn={false}
            fetchPriority="high"
            imgStyle={{ transition: 'none' }}
            placeholder="none"
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
        <div className="cus-container">
          <div className="banner-title position-relative text-center">
            {badgeImage && (
              <GatsbyImage
                decoding="async"
                image={badgeImage}
                alt="Badge"
                className="img-badge position-absolute"
                loading="eager"
                fadeIn={false}
                fetchPriority="high"
                placeholder="none"
                imgStyle={{ transition: 'none' }}
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
              <img src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/brush-stroke-1.svg`} alt="Brush Stroke 1" width="600" height="20" style={{ objectFit: "contain" }} />
            </div>
            <div className="sep-text f-soleto fw-500 text-white">{content?.sepText}</div>
            <div className="sep-right">
              <img src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/brush-stroke-2.svg`} alt="Brush Stroke 2" width="600" height="20" style={{ objectFit: "contain" }} />
            </div>
          </div>
          <div className="banner-list ast-flex  justify-content-center">
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
                decoding="async"
                image={boxDesktopImage}
                alt="Desktop Box"
                loading="eager"
                fadeIn={false}
                placeholder="none"
                fetchPriority="high"
                sizes="(max-width: 600px) 100vw, 518px"
                imgStyle={{ transition: 'none' }}
              />
            )}
          </div>
          <div className="box-mobile">
            {boxMobileImage && (
              <GatsbyImage
                decoding="async"
                image={boxMobileImage}
                alt="Mobile Box"
                loading="eager"
                fadeIn={false}
                placeholder="none"
                fetchPriority="high"
                sizes="(max-width: 412px) 303px, 303px"
                imgStyle={{ transition: 'none' }}
              />
            )}
          </div>
          <div className="banner-desc f-soleto fw-500 text-white text-center">
            {content?.desc}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomeBanner