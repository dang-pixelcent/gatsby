import * as React from "react"
import "./styles.scss"

const AboutBanner = ({ banner }) => {
  return (
    <>
      {banner?.isShow && (
        <section class="banner " style={{ background: `no-repeat center/cover url('${banner?.backgroundImage?.node?.sourceUrl}')` }}>
          <div class="cus-container h-100">
            <div class="ast-full-width h-100 ast-flex align-items-center justify-content-center banner-inner">
              <div class="banner-content ast-flex flex-column">
                <div class="sub-title f-soleto fw-500 text-white text-center">{banner?.subtitle}</div>
                <h1 class="h1-title fw-800 f-soleto text-white text-center">{banner?.title}</h1>
                <div class="desc text-white text-center fw-500 f-soleto">{banner?.desc}</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default AboutBanner
