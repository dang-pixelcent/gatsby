import * as React from "react"
import "./styles.scss"

const AboutBanner = ({ banner }) => {
  return (
    <>
      {banner?.isShow && (
        <section className="banner " style={{ background: `no-repeat center/cover url('${banner?.backgroundImage?.node?.sourceUrl}')` }}>
          <div className="cus-container h-100">
            <div className="ast-full-width h-100 ast-flex align-items-center justify-content-center banner-inner">
              <div className="banner-content ast-flex flex-column">
                <div className="sub-title f-soleto fw-500 text-white text-center">{banner?.subtitle}</div>
                <h1 className="h1-title fw-800 f-soleto text-white text-center">{banner?.title}</h1>
                <div className="desc text-white text-center fw-500 f-soleto">{banner?.desc}</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default AboutBanner
