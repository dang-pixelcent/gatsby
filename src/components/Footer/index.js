import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import "./styles.scss"

const Footer = ({ data }) => {
  const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL
  const siteBaseUrl = process.env.GATSBY_SITE_URL

  return (
    <>
      <footer className="site-footer" id="colophon">
        <div className="site-primary-footer-wrap ast-builder-grid-row-container site-footer-focus-item ast-builder-grid-row-3-equal ast-builder-grid-row-tablet-3-equal ast-builder-grid-row-mobile-full ast-footer-row-stack ast-footer-row-tablet-stack ast-footer-row-mobile-stack" data-section="section-primary-footer-builder" style={{ position: "relative" }}>
          <StaticImage
            src="../../assets/img/bg-footer-2.jpg"
            alt="Footer Background"
            layout="fullWidth"
            placeholder="blurred"
            loading="lazy"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
          />
          <div className="ast-builder-grid-row-container-inner">
            <div className="ast-builder-footer-grid-columns site-primary-footer-inner-wrap ast-builder-grid-row">
              <div className="site-footer-primary-section-1 site-footer-section site-footer-section-1">
                <aside className="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner" data-section="sidebar-widgets-footer-widget-2" aria-label="Footer Widget 2">
                  <section id="media_image-3" className="widget widget_media_image">
                    <StaticImage
                      src="../../assets/logo/logo-foot.png"
                      alt="MD Marketing Agency Footer Logo"
                      width={300}
                      height={86}
                      placeholder="blurred"
                      loading="lazy"
                      formats={["auto", "webp", "avif"]}
                      className="image wp-image-1952 attachment-medium size-medium footer-logo"
                      quality={80}
                    />
                  </section>
                  <section id="text-3" className="widget widget_text">
                    <div className="textwidget">
                      <p>The Complete Patient Acquisition Solution For Cash-Based Medical Practices Offering Hormone Therapy, Medical Weight Loss, Sexual Health and Aesthetic procedures.</p>
                    </div>
                  </section>
                  <section id="text-21" className="widget widget_text">
                    <div className="textwidget">
                      <div className="ast-flex gap-20">
                        <Link className="btn-bg bg-F2771A btn-size-16 fw-600" to="/get-started/">FREE ASSESSMENT</Link>
                        <StaticImage
                          src="../../assets/images/a4m-logo.png"
                          alt="A4M Logo"
                          width={62}
                          height={60}
                          placeholder="none"
                          loading="lazy"
                          className="alignnone size-full wp-image-38"
                          quality={90}
                        />
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
              <div className="site-footer-primary-section-2 site-footer-section site-footer-section-2">
                <aside className="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner" data-section="sidebar-widgets-footer-widget-3" aria-label="Footer Widget 3">
                  <section id="text-5" className="widget widget_text">
                    <div className="widget-title">Working Hours</div>
                    <div className="textwidget"><div className="schedule">
                      <div className="item">
                        <div className="day">Monday to Friday</div>
                        <div className="time">10:00am-6:00pm</div>
                      </div>
                    </div>
                    </div>
                  </section>
                  <section id="text-6" className="widget widget_text">
                    <div className="widget-title">Connect with Us</div>
                    <div className="textwidget">
                      <div className="ast-flex socials">
                        <a className="fb" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.facebook} target="_blank" rel="noopener noreferrer">
                          <StaticImage
                            src="../../assets/images/socials/icon-fb.svg"
                            alt="Facebook"
                            width={32}
                            height={32}
                            placeholder="none"
                            loading="lazy"
                            quality={90}
                          />
                        </a>
                        <a className="youtube" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.youtube} target="_blank" rel="noopener noreferrer">
                          <StaticImage
                            src="../../assets/images/socials/icon-youtube.svg"
                            alt="YouTube"
                            width={32}
                            height={32}
                            placeholder="none"
                            loading="lazy"
                            quality={90}
                          />
                        </a>
                        <a className="twitter" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.twitter} target="_blank" rel="noopener noreferrer">
                          <StaticImage
                            src="../../assets/images/socials/icon-twitter.svg"
                            alt="Twitter"
                            width={32}
                            height={32}
                            placeholder="none"
                            loading="lazy"
                            quality={90}
                          />
                        </a>
                        <a className="instagram" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.instagram} target="_blank" rel="noopener noreferrer">
                          <StaticImage
                            src="../../assets/images/socials/icon-ig.svg"
                            alt="Instagram"
                            width={32}
                            height={32}
                            placeholder="none"
                            loading="lazy"
                            quality={90}
                          />
                        </a>
                        <a className="linkedin" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.linkedin} target="_blank" rel="noopener noreferrer">
                          <StaticImage
                            src="../../assets/images/socials/icon-linkedin.svg"
                            alt="LinkedIn"
                            width={32}
                            height={32}
                            placeholder="none"
                            loading="lazy"
                            quality={90}
                          />
                        </a>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
              <div className="site-footer-primary-section-3 site-footer-section site-footer-section-3">
                <aside className="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner" data-section="sidebar-widgets-footer-widget-4" aria-label="Footer Widget 4">
                  <section id="text-7" className="widget widget_text">
                    <div className="widget-title">Find Us</div>
                    <div className="textwidget"><div className="footer-address">
                      <a className="text-underline" href="#" target="_blank" rel="noopener">1470 Biscayne Blvd, Miami, FL 33132
                      </a>
                    </div>
                    </div>
                  </section>
                  <section id="text-19" className="widget widget_text">
                    <div className="textwidget">
                      <div className="ast-flex gap-20">
                        <Link className="btn-bg bg-F2771A btn-size-16 fw-600" to="/get-started/">FREE ASSESSMENT</Link>
                        {/* <img loading="lazy" decoding="async" className="alignnone size-full wp-image-38" src={`/a4m-logo.png`} alt="" width="62" height="60" /> */}
                        <StaticImage
                          src="../../assets/images/a4m-logo.png"
                          alt=""
                          width={62}
                          height={60}
                          placeholder="none"
                          loading="lazy"
                          quality={90}
                        />
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </div>
        <div className="site-below-footer-wrap ast-builder-grid-row-container site-footer-focus-item ast-builder-grid-row-full ast-builder-grid-row-tablet-full ast-builder-grid-row-mobile-full ast-footer-row-stack ast-footer-row-tablet-stack ast-footer-row-mobile-stack" data-section="section-below-footer-builder">
          <div className="ast-builder-grid-row-container-inner">
            <div className="ast-builder-footer-grid-columns site-below-footer-inner-wrap ast-builder-grid-row">
              <div className="site-footer-below-section-1 site-footer-section site-footer-section-1">
                <div className="ast-builder-layout-element ast-flex site-footer-focus-item ast-footer-copyright" data-section="section-footer-builder">
                  <div className="ast-footer-copyright"><p>© 2025 All rights reserved | MD Marketing Agency |&nbsp;<Link to={`/privacy-policy`} target="_self">Privacy Policy</Link>&nbsp;|&nbsp;<Link to={`/contact-us`} target="_self">Contact Us</Link></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer