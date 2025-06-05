import * as React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
// import "./styles.scss"

const Footer = () => {
  const WP_BASE_URL = process.env.REACT_APP_BASE_URL_SITE || 'https://agencysitestaging.mystagingwebsite.com'
  const siteBaseUrl = process.env.REACT_APP_BASE_URL // Giữ nguyên để siteBaseUrl được khởi tạo đúng

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
      <footer class="site-footer" id="colophon" itemtype="https://schema.org/WPFooter" itemscope="itemscope" itemid="#colophon">
        <div class="site-primary-footer-wrap ast-builder-grid-row-container site-footer-focus-item ast-builder-grid-row-3-equal ast-builder-grid-row-tablet-3-equal ast-builder-grid-row-mobile-full ast-footer-row-stack ast-footer-row-tablet-stack ast-footer-row-mobile-stack" data-section="section-primary-footer-builder">
          <div class="ast-builder-grid-row-container-inner">
            <div class="ast-builder-footer-grid-columns site-primary-footer-inner-wrap ast-builder-grid-row">
              <div class="site-footer-primary-section-1 site-footer-section site-footer-section-1">
                <aside class="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner" data-section="sidebar-widgets-footer-widget-2" aria-label="Footer Widget 2">
                  <section id="media_image-3" class="widget widget_media_image">
                    <img width="300" height="86" src={`${WP_BASE_URL}/wp-content/uploads/2025/03/logo-foot-300x86.png`} class="image wp-image-1952  attachment-medium size-medium" alt="" style={{ maxWidth: "100%", height: "auto", width: "auto" }} decoding="async" loading="lazy" srcset={`${WP_BASE_URL}/wp-content/uploads/2025/03/logo-foot-300x86.png 300w, ${WP_BASE_URL}/wp-content/uploads/2025/03/logo-foot-1024x295.png 1024w, ${WP_BASE_URL}/wp-content/uploads/2025/03/logo-foot-768x221.png 768w, ${WP_BASE_URL}/wp-content/uploads/2025/03/logo-foot.png 1039w`} sizes="auto, (max-width: 300px) 100vw, 300px" />
                  </section>
                  <section id="text-3" class="widget widget_text">
                    <div class="textwidget">
                      <p>The Complete Patient Acquisition Solution For Cash-Based Medical Practices Offering Sexual Wellness and Hormones Optimization Services</p>
                    </div>
                  </section>
                  <section id="text-21" class="widget widget_text">
                    <div class="textwidget">
                      <div class="ast-flex gap-20">
                        <Link className="btn-bg bg-F2771A btn-size-16 fw-600" to="/get-started/">FREE ASSESSMENT</Link>
                        <img loading="lazy" decoding="async" class="alignnone size-full wp-image-38" src={`${WP_BASE_URL}/wp-content/uploads/2024/11/a4m-logo.png`} alt="" width="62" height="60" />
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
              <div class="site-footer-primary-section-2 site-footer-section site-footer-section-2">
                <aside class="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner" data-section="sidebar-widgets-footer-widget-3" aria-label="Footer Widget 3">
                  <section id="text-5" class="widget widget_text">
                    <h2 class="widget-title">Working Hours</h2>
                    <div class="textwidget"><div class="schedule">
                      <div class="item">
                        <div class="day">Monday to Friday</div>
                        <div class="time">10:00am-6:00pm</div>
                      </div>
                    </div>
                    </div>
                  </section>
                  <section id="text-6" class="widget widget_text">
                    <h2 class="widget-title">Connect with Us</h2>
                    <div class="textwidget">
                      <div class="ast-flex socials">
                        <a class="fb" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.facebook} target="_blank" rel="noopener noreferrer">
                          <img decoding="async" src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/socials/icon-fb.svg`} alt="Facebook" />
                        </a>
                        <a class="youtube" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.youtube} target="_blank" rel="noopener noreferrer">
                          <img decoding="async" src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/socials/icon-youtube.svg`} alt="YouTube" />
                        </a>
                        <a class="twitter" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.twitter} target="_blank" rel="noopener noreferrer">
                          <img decoding="async" src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/socials/icon-twitter.svg`} alt="Twitter" />
                        </a>
                        <a class="instagram" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.instagram} target="_blank" rel="noopener noreferrer">
                          <img decoding="async" src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/socials/icon-ig.svg`} alt="Instagram" />
                        </a>
                        <a class="linkedin" href={data?.cms?.themeSettings?.themeOptionsSettings?.socials?.linkedin} target="_blank" rel="noopener noreferrer">
                          <img decoding="async" src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/socials/icon-linkedin.svg`} alt="LinkedIn" />
                        </a>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
              <div class="site-footer-primary-section-3 site-footer-section site-footer-section-3">
                <aside class="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner" data-section="sidebar-widgets-footer-widget-4" aria-label="Footer Widget 4">
                  <section id="text-7" class="widget widget_text">
                    <h2 class="widget-title">Find Us</h2>
                    <div class="textwidget"><div class="footer-address">
                      <a class="text-underline" href="#" target="_blank" rel="noopener">1470 Biscayne Blvd, Miami, FL 33132
                      </a>
                    </div>
                    </div>
                  </section>
                  <section id="text-19" class="widget widget_text">
                    <div class="textwidget">
                      <div class="ast-flex gap-20">
                        <Link className="btn-bg bg-F2771A btn-size-16 fw-600" to="/get-started/">FREE ASSESSMENT</Link>
                        <img loading="lazy" decoding="async" class="alignnone size-full wp-image-38" src={`${WP_BASE_URL}/wp-content/uploads/2024/11/a4m-logo.png`} alt="" width="62" height="60" />
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </div>
        <div class="site-below-footer-wrap ast-builder-grid-row-container site-footer-focus-item ast-builder-grid-row-full ast-builder-grid-row-tablet-full ast-builder-grid-row-mobile-full ast-footer-row-stack ast-footer-row-tablet-stack ast-footer-row-mobile-stack" data-section="section-below-footer-builder">
          <div class="ast-builder-grid-row-container-inner">
            <div class="ast-builder-footer-grid-columns site-below-footer-inner-wrap ast-builder-grid-row">
              <div class="site-footer-below-section-1 site-footer-section site-footer-section-1">
                <div class="ast-builder-layout-element ast-flex site-footer-focus-item ast-footer-copyright" data-section="section-footer-builder">
                  <div class="ast-footer-copyright"><p>© 2025 All rights reserved | MD Marketing Agency |&nbsp;<a href={`${WP_BASE_URL}/privacy-policy/`} target="_self">Privacy Policy</a>&nbsp;|&nbsp;<a href={`${WP_BASE_URL}/contact-us/`} target="_self">Contact Us</a></p>
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