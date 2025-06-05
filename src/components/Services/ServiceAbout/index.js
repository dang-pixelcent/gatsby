import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import './styles.scss';

const ServiceAbout = () => {

  const query = useStaticQuery(graphql`
    query {
      cms {
        serviceBy(uri: "/website-development") {
          services {
            flexibleContent {
              fieldGroupName
              ... on GraphCMS_ServicesFlexibleContentWebsiteAboutLayout {
              fieldGroupName
                leftimage: image {
                  node {
                    sourceUrl
                  }
                }
                content
                title
                item {
                  content
                  title
                  icon {
                    node {
                      sourceUrl
                    }
                  }
                }
                boxCenter {
                  fieldGroupName
                  subTitle
                  title	
                }
                whyService {
                  content
                  title
                  image {
                    node {
                      sourceUrl
                    }
                  }
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
              <img src={data?.leftimage?.node?.sourceUrl} alt="" />
            </figure>
            <div className="col-content f-soleto fs-22" dangerouslySetInnerHTML={{ __html: data.content }}></div>
          </div>
        </div>
      </section>
      <section className="section service-features">
        <div className="cus-container">
          <h2 className="h2-title title-list f-soleto fw-800 color-0659A9 mb-0 text-center">{data?.title}</h2>
          <div className="features position-relative">
            <div className="list circle-list ast-flex">
              {data?.item?.map((item, index) => (
                <div key={index} className={`circle-item circle-item-${index + 1} ast-flex flex-column align-items-center text-center`}>
                  <figure><img src={item?.icon?.node?.sourceUrl} alt="SEO-Optimized Design" /></figure>
                  <h2 className="f-soleto fw-700">{item?.title}</h2>
                  <div className="circle-item--content">
                    <div className="content f-soleto" dangerouslySetInnerHTML={{ __html: item?.content }}></div>
                  </div>
                </div>
              ))}

            </div>
            <div className="feature-center position-absolute ast-flex align-items-center">
              <div className="center ast-flex">
                <h3 className="center-title f-soleto fw-800 text-white text-center">{data?.boxCenter?.title}</h3>
                <div className="center-sub-title f-soleto fw-500 text-white text-center">{data?.boxCenter?.subtitle}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section sc-why-service">
        <div className="cus-container">
          <div className="why-service ast-flex flex-wrap align-items-center">
            <figure><img src={data?.whyService?.image?.node?.sourceUrl} alt="" /></figure>
            <div className="why--content">
              <h3 className="f-soleto fw-700 text-black">{data?.whyService?.title}</h3>
              <div className="content f-soleto text-black">{data?.whyService?.content}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ServiceAbout;