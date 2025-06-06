import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import './styles.scss';

const ServiceFBAbout = () => {
  const WP_BASE_URL = process.env.REACT_APP_BASE_URL_SITE
  const siteBaseUrl = process.env.REACT_APP_BASE_URL
  if (!WP_BASE_URL) {
    console.error("REACT_APP_BASE_URL_SITE must be set in .env file");
  }
  const query = useStaticQuery(graphql`
    query {
      cms {
        serviceBy(uri: "/facebook-advertising") {
          services {
            flexibleContent {
              fieldGroupName
              ... on GraphCMS_ServicesFlexibleContentFbAdsAboutLayout {
                image {
                  node {
                    sourceUrl
                  }
                }
                content
                item {
                  title
                  icon {
                    node {
                      sourceUrl
                    }
                  }
                  content
                }
              }
            }
          }
        }
      }
    }
  `);

  const data = query?.cms?.serviceBy?.services?.flexibleContent[1];

  return (
    <>
      <section className="section service-about website-about">
        <div className="cus-container">
          <div className="cols-2 ast-flex flex-wrap align-items-center">
            <figure className="mb-0">
              <img src={data?.image?.node?.sourceUrl} alt="" />
            </figure>
            <div class="col-content f-soleto fs-22" dangerouslySetInnerHTML={{ __html: data?.content }}></div>
          </div>
          <div class="list">
            {data?.item?.map((item, index) => (
              <>
                <div key={index} class={`list-item ${(index + 1) % 2 === 0 ? "item-2" : ""} ast-flex flex-wrap align-items-center`}>
                  <figure class="mb-0"><img src={item?.icon?.node?.sourceUrl} alt="Facebook Ads that Attract Quality Leads" /></figure>
                  <div class="list-item--content">
                    <h2 class="f-soleto fw-700">{item?.title}</h2>
                    <div class="content f-soleto" dangerouslySetInnerHTML={{ __html: item?.content }}></div>
                  </div>
                </div>
                {(index + 1) !== data?.item?.length && (
                  (index + 1) % 2 === 0 ? (
                    <div className="sep-curve-line sep-line-2">
                      <img src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/curve-line-2.png`} alt="" />
                    </div>
                  ) : (
                    <div className="sep-curve-line">
                      <img src={`${WP_BASE_URL}/wp-content/themes/agencymarketing/assets/img/curve-line-1.png`} alt="" />
                    </div>
                  )
                )}
              </>
            ))}

          </div>
        </div>
      </section>
    </>
  )
}

export default ServiceFBAbout;