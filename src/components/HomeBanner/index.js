import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { extractPathname } from "/src/utils/urlUtils"
import "./styles.scss"
import * as styles from './HomeBanner.module.scss';
import useIsMobile from '@hooks/useIsMobile';

// Component giờ sẽ nhận `content` từ props, không tự query nữa
const HomeBanner = ({ content }) => {
  const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL
  const isMobile = useIsMobile();

  // Dữ liệu đã được truyền vào, chỉ cần sử dụng
  // const bgImageUrl = content?.backgroundImage?.node?.sourceUrl;
  const backgroundImage = getImage(content?.backgroundImage?.node?.localFile)
  const badgeImage = getImage(content?.badgeLogo?.node?.localFile)
  const boxDesktopImage = getImage(content?.boxDesktop?.node?.localFile)
  const boxMobileImage = getImage(content?.boxMobile?.node?.localFile)

  // State để kiểm soát việc hiển thị các box
  const [isLcpDelayed, setLcpDelayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLcpDelayed(true);
    }, isMobile ? 100 : 0);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // ⭐️ Tạo đối tượng style cho ảnh nền
  // const bannerStyle = {};
  // if (bgImageUrl) {
  //   // Nếu là desktop, áp dụng ảnh nền ngay
  //   if (!isMobile) {
  //     bannerStyle.backgroundImage = `url(${bgImageUrl})`;
  //   }
  //   // Nếu là mobile và đã hết thời gian trì hoãn, mới áp dụng ảnh nền
  //   else if (isMobile && isLcpDelayed) {
  //     bannerStyle.backgroundImage = `url(${bgImageUrl})`;
  //   }
  // }

  // ⭐️ Xác định xem các box có nên hiển thị hay không
  // Desktop: luôn hiển thị. Mobile: hiển thị sau khi trì hoãn.
  // const areBoxesVisible = !isMobile || (isMobile && isLcpDelayed);

  return (
    <>
      <section className={`home-banner ${styles.bannerSection}`}>
        <GatsbyImage
          decoding="async"
          image={backgroundImage}
          alt="Wellness Clinic Marketing Hero Banner"
          className={`banner-bg ${styles.boxImage} ${isLcpDelayed ? styles.visible : styles.initiallyHidden}`}
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
        {/* {backgroundImage && (
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
        )} */}
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
          <div className={`box-mobile ${styles.boxImage} ${isLcpDelayed ? styles.visible : styles.initiallyHidden}`}>
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