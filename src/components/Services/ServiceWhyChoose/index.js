import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import './styles.scss';

const ServiceWhyChoose = () => {
  const WP_BASE_URL = process.env.REACT_APP_BASE_URL_SITE
  const siteBaseUrl = process.env.REACT_APP_BASE_URL
  if (!WP_BASE_URL || !siteBaseUrl) {
    console.error("REACT_APP_BASE_URL_SITE and REACT_APP_BASE_URL must be set in .env file");
    return null;
  }
  return (
    <section className="service-why-choose" style={{ background: `no-repeat center/cover url('${WP_BASE_URL}/wp-content/uploads/2024/12/fb-ads-sec3.jpg')` }}>
      <div className="cus-container">
        <h2 class="h2-title fs-48 f-soletoxbold text-white text-center">Why Choose Facebook Ads for Your Medical Practice?</h2>
        <div class="desc f-soleto text-white fs-28 text-center">
          Facebook and Instagram provide a unique opportunity to reach a large, <br />
          highly targeted audience. Our experts know how to:
        </div>
        <div className="why-choose-list">

          <div class="w-box position-relative ast-flex justify-content-center">
            <div class="inner ast-flex flex-column">
              <h3 class="h3-title f-soleto fw-700 text-white">Drive ad reach to the right <br />people at the right time.</h3>
              <figure><img src={`${WP_BASE_URL}/wp-content/uploads/2024/12/fb-ads-2.png`} alt="Drive ad reach to the right <br>people at the right time." /></figure>
            </div>
          </div>

          <div class="w-box position-relative ast-flex justify-content-center">
            <div class="inner ast-flex flex-column">
              <h3 class="h3-title f-soleto fw-700 text-white">Drive ad reach to the right <br />people at the right time.</h3>
              <figure><img src={`${WP_BASE_URL}/wp-content/uploads/2024/12/fb-ads-2.png`} alt="Drive ad reach to the right <br>people at the right time." /></figure>
            </div>
          </div>

          <div class="w-box position-relative ast-flex justify-content-center">
            <div class="inner ast-flex flex-column">
              <h3 class="h3-title f-soleto fw-700 text-white">Drive ad reach to the right <br />people at the right time.</h3>
              <figure><img src={`${WP_BASE_URL}/wp-content/uploads/2024/12/fb-ads-2.png`} alt="Drive ad reach to the right <br>people at the right time." /></figure>
            </div>
          </div>

        </div>
        <div class="bottom-content f-soleto text-center text-white">
          <p>When you partner with us for Facebook advertising, you’re not just getting ads—you’re getting a strategic, data-driven approach that helps you bring in the right patients, the right way.</p>
          <p><strong>Ready to attract more patients with Facebook ads?</strong><br />
            Contact us today to take the next step toward growing your medical practice.</p>
        </div>
        <div class="sc-btn ast-flex justify-content-center">
          <a href={`${siteBaseUrl}/get-started-b/`} target="_self" class="btn-bg bg-F2771A btn-size-18 fw-700">Schedule A Strategy Session</a>
        </div>
      </div>
    </section>
  )
}

export default ServiceWhyChoose;