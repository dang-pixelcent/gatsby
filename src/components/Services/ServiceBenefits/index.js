import './styles.scss';
import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { extractPathname } from "/src/utils/urlUtils"

const ServiceBenefits = () => {
  const query = useStaticQuery(graphql`
    query {
      cms {
        serviceBy(uri: "/website-development") {
          services {
            flexibleContent {
              fieldGroupName
              ... on GraphCMS_ServicesFlexibleContentBenefitsLayout {
                backgroundImage {
                  node {
                    sourceUrl
                  }
                }
                title
                topdesc: desc
                
                bottomContent
                buttonType
                button {
                  title
                  target
                  url
                }
              }
            }
          }
        }
      }
    }
  `);

  // itemBenefits {
  //   desc
  //   title
  //   image {
  //     node {
  //       sourceUrl
  //     }
  //   }
  // }

  const data = query?.cms?.serviceBy?.services?.flexibleContent[2];

  return (
    <>
      <section className="section service-benefits" style={{ background: `no-repeat center/cover url('${data?.backgroundImage?.node?.sourceUrl}')` }}>
        <div className="cus-container">
          <h2 className="h2-title fs-48 f-soletoxbold text-white text-center">{data?.title}</h2>
          <div className="desc f-soleto text-white fs-28 text-center">{data?.topdesc}</div>
          <div className="benefit-list">
            {/* {data?.itemBenefits?.map((item, index) => (
              <div key={index} className="w-box position-relative ast-flex justify-content-center">
                <div className="inner ast-flex flex-column text-center">
                  <h3 className="h3-title fs-24 f-soleto fw-700 text-white">{item?.title}</h3>
                  <figure className="mx-height-1"><img src={item?.image?.node?.sourceUrl} alt="Increase in Organic Traffic" /></figure>
                  <div className="desc f-soleto fs-22 text-white">{item?.desc}</div>
                </div>
              </div>
            ))} */}
          </div>
          <div className="bottom-content f-soleto text-center text-white" dangerouslySetInnerHTML={{ __html: data?.bottomContent }}></div>
          <div className="sc-btn ast-flex justify-content-center">
            <Link to={extractPathname(data?.button?.url)} target={data?.button?.target} className={`btn-bg bg-F2771A btn-size-26 fw-700 ${data?.buttonType === "fluid_width" ? "w-100" : ''}`}>{data?.button?.title}</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default ServiceBenefits;