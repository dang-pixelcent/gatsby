import * as React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
// import "./styles.scss"

const Footer = () => {
  const WP_BASE_URL = process.env.GATSBY_WP_BASE_URL
  const siteBaseUrl = process.env.GATSBY_SITE_URL

  const data = useStaticQuery(graphql`
    query {
      cms {
        themeSettings {
          themeOptionsSettings {
            socials {
              facebook
              fieldGroupName
              instagram
              linkedin
              twitter
              youtube
            }
          }
        }
      }
    }
  `);

  return (
    <>
      <footer className="site-footer" id="colophon" itemType="https://schema.org/WPFooter" itemScope="itemscope" itemID="#colophon">
        <div className="site-primary-footer-wrap ast-builder-grid-row-container site-footer-focus-item ast-builder-grid-row-3-equal ast-builder-grid-row-tablet-3-equal ast-builder-grid-row-mobile-full ast-footer-row-stack ast-footer-row-tablet-stack ast-footer-row-mobile-stack" data-section="section-primary-footer-builder">
          <div className="ast-builder-grid-row-container-inner">
            <div className="ast-builder-footer-grid-columns site-primary-footer-inner-wrap ast-builder-grid-row">
              <div className="site-footer-primary-section-1 site-footer-section site-footer-section-1">
                <aside className="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner" data-section="sidebar-widgets-footer-widget-2" aria-label="Footer Widget 2">
                  <section id="media_image-3" className="widget widget_media_image">
                    {/* <img width="300" height="86" src={`${WP_BASE_URL}/wp-content/uploads/2025/03/logo-foot-300x86.png`} className="image wp-image-1952  attachment-medium size-medium" alt="" style={{ maxWidth: "100%", height: "auto", width: "auto" }} decoding="async" loading="lazy" srcSet={`${WP_BASE_URL}/wp-content/uploads/2025/03/logo-foot-300x86.png 300w, ${WP_BASE_URL}/wp-content/uploads/2025/03/logo-foot-1024x295.png 1024w, ${WP_BASE_URL}/wp-content/uploads/2025/03/logo-foot-768x221.png 768w, ${WP_BASE_URL}/wp-content/uploads/2025/03/logo-foot.png 1039w`} sizes="auto, (max-width: 300px) 100vw, 300px" /> */}
                    <img width="300" height="86" src={`/logofoot/logo-foot-300x86.png`} className="image wp-image-1952  attachment-medium size-medium" alt="" style={{ maxWidth: "100%", height: "auto" }} decoding="async" loading="lazy" srcSet={`/logofoot/logo-foot-300x86.png 300w, /logofoot/logo-foot-1024x295.png 1024w, /logofoot/logo-foot-768x221.png 768w, /logofoot/logo-foot.png 1039w`} sizes="auto, (max-width: 300px) 100vw, 300px" />
                  </section>
                  <section id="text-3" className="widget widget_text">
                    <div className="textwidget">
                      <p>The Complete Patient Acquisition Solution For Cash-Based Medical Practices Offering Sexual Wellness and Hormones Optimization Services</p>
                    </div>
                  </section>
                  <section id="text-21" className="widget widget_text">
                    <div className="textwidget">
                      <div className="ast-flex gap-20">
                        <Link className="btn-bg bg-F2771A btn-size-16 fw-600" to="/get-started/">FREE ASSESSMENT</Link>
                        <img loading="lazy" decoding="async" className="alignnone size-full wp-image-38" src={`/a4m-logo.png`} alt="" width="62" height="60" />
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
              <div className="site-footer-primary-section-2 site-footer-section site-footer-section-2">
                <aside className="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner" data-section="sidebar-widgets-footer-widget-3" aria-label="Footer Widget 3">
                  <section id="text-5" className="widget widget_text">
                    <h2 className="widget-title">Working Hours</h2>
                    <div className="textwidget"><div className="schedule">
                      <div className="item">
                        <div className="day">Monday to Friday</div>
                        <div className="time">10:00am-6:00pm</div>
                      </div>
                    </div>
                    </div>
                  </section>
                  <section id="text-6" className="widget widget_text">
                    <h2 className="widget-title">Connect with Us</h2>
                    <div className="textwidget">
                      <div className="ast-flex socials">
                        <a className="fb" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.facebook} target="_blank" rel="noopener noreferrer">
                          <img decoding="async" src={`/socials/icon-fb.svg`} alt="Facebook" />
                        </a>
                        <a className="youtube" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.youtube} target="_blank" rel="noopener noreferrer">
                          <img decoding="async" src={`/socials/icon-youtube.svg`} alt="YouTube" />
                        </a>
                        <a className="twitter" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.twitter} target="_blank" rel="noopener noreferrer">
                          <img decoding="async" src={`/socials/icon-twitter.svg`} alt="Twitter" />
                        </a>
                        <a className="instagram" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.instagram} target="_blank" rel="noopener noreferrer">
                          <img decoding="async" src={`/socials/icon-ig.svg`} alt="Instagram" />
                        </a>
                        <a className="linkedin" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.linkedin} target="_blank" rel="noopener noreferrer">
                          <img decoding="async" src={`/socials/icon-linkedin.svg`} alt="LinkedIn" />
                        </a>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
              <div className="site-footer-primary-section-3 site-footer-section site-footer-section-3">
                <aside className="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner" data-section="sidebar-widgets-footer-widget-4" aria-label="Footer Widget 4">
                  <section id="text-7" className="widget widget_text">
                    <h2 className="widget-title">Find Us</h2>
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
                        <img loading="lazy" decoding="async" className="alignnone size-full wp-image-38" src={`/a4m-logo.png`} alt="" width="62" height="60" />
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