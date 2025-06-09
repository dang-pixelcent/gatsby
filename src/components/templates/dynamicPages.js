import { graphql, Link } from "gatsby"
import React from "react"
import Layout from "../layout"
import SEO from "../SEO"
import InternalLinkInterceptor from '../InternalLinkInterceptor'


const Home = ({ data, pageContext }) => {
  const { flexibleContentHtml, uri, seoData } = pageContext

  React.useEffect(() => {
    // Tạo các script tag mới và thêm vào DOM
    const scripts = [
      "https://fast.wistia.com/player.js",
      "https://fast.wistia.com/embed/cxeoqwzjx0.js",
    ];

    const scriptEls = scripts.map((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      // Nếu là module (như wistia embed script), thêm type
      if (src.includes("embed/")) {
        script.type = "module";
      }
      document.body.appendChild(script);
      return script;
    });

    return () => {
      scriptEls.forEach((script) => {
        document.body.removeChild(script);
      });
    };
  }, []);

 // useEffect để xử lý FAQ
  React.useEffect(() => {
    const faqList = document.querySelectorAll('.faq-item');
    
    // Hàm xử lý click
    const handleFaqClick = (event) => {
      // Dùng currentTarget để đảm bảo chúng ta đang xử lý đúng phần tử được gắn sự kiện
      const faqItem = event.currentTarget;
      faqItem.classList.toggle('active');
    };

    // Gắn sự kiện cho mỗi item
    faqList.forEach(item => {
      item.addEventListener('click', handleFaqClick);
    });

    // Hàm dọn dẹp để gỡ bỏ sự kiện khi component bị hủy
    return () => {
      faqList.forEach(item => {
        item.removeEventListener('click', handleFaqClick);
      });
    };
  }, [flexibleContentHtml]);

  React.useEffect(() => {
    const styles = [
      "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
      "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css",
    ];
    styles.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    });

    const loadScripts = async () => {
      // Load jQuery
      const loadScript = (src) =>
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = resolve;
          document.body.appendChild(script);
        });

      await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js");

      // Init slick sau 300ms
      setTimeout(() => {
        if (window.jQuery && window.jQuery(".gallery-slider").slick) {
          window.jQuery(".gallery-slider").slick({
            /* infinite: true,*/
            centerMode: false,
            slidesToShow: 2,
            variableWidth: true,
            swipeToSlide: true,
            autoplay: false,
            autoplaySpeed: 8000,
            cssEase: 'ease',
            prevArrow: "<button class='slick-prev slick-arrow' aria-label='Pre' type='button'><svg xmlns='http://www.w3.org/2000/svg' width='14' height='30' viewBox='0 0 14 30' fill='none'><path d='M12.8052 27.9387C12.9883 28.1662 13.0909 28.4729 13.0909 28.7924C13.0909 29.112 12.9883 29.4187 12.8052 29.6462C12.7152 29.7582 12.6078 29.8472 12.4895 29.908C12.3711 29.9687 12.2441 30 12.1158 30C11.9875 30 11.8605 29.9687 11.7421 29.908C11.6238 29.8472 11.5165 29.7582 11.4265 29.6462L0.285726 15.8537C0.102646 15.6263 0 15.3196 0 15C0 14.6804 0.102646 14.3737 0.285726 14.1463L11.4265 0.353816C11.5165 0.241757 11.6238 0.152767 11.7421 0.0920242C11.8605 0.0312816 11.9875 0 12.1158 0C12.2441 0 12.3711 0.0312816 12.4895 0.0920242C12.6078 0.152767 12.7152 0.241757 12.8052 0.353816C12.9883 0.581302 13.0909 0.888005 13.0909 1.20756C13.0909 1.52711 12.9883 1.83382 12.8052 2.0613L2.64477 15.0009L12.8052 27.9387Z' fill='#0659A9'/></svg></button>",
            nextArrow: "<button class='slick-next slick-arrow' aria-label='Next' type='button'><svg xmlns='http://www.w3.org/2000/svg' width='14' height='30' viewBox='0 0 14 30' fill='none'><path d='M0.285642 2.0613C0.102562 1.83382 -8.62025e-05 1.52711 -8.61746e-05 1.20756C-8.61467e-05 0.888005 0.102562 0.581302 0.285642 0.353816C0.375669 0.241757 0.48298 0.152766 0.601328 0.0920228C0.719676 0.0312813 0.846697 -1.07042e-06 0.975 -1.0592e-06C1.1033 -1.04798e-06 1.23033 0.0312814 1.34868 0.0920228C1.46702 0.152766 1.57433 0.241757 1.66436 0.353816L12.8051 14.1463C12.9882 14.3737 13.0908 14.6804 13.0908 15C13.0908 15.3196 12.9882 15.6263 12.8051 15.8537L1.66436 29.6462C1.57433 29.7582 1.46702 29.8472 1.34867 29.908C1.23032 29.9687 1.1033 30 0.974998 30C0.846694 30 0.719673 29.9687 0.601325 29.908C0.482977 29.8472 0.375667 29.7582 0.28564 29.6462C0.102559 29.4187 -8.86141e-05 29.112 -8.85861e-05 28.7924C-8.85582e-05 28.4729 0.102559 28.1662 0.28564 27.9387L10.446 14.9991L0.285642 2.0613Z' fill='#0659A9'/></svg></button>",

            responsive: [
              {
                breakpoint: 1199,
                settings: {
                  variableWidth: true,
                  slidesToShow: 1,
                  autoplay: true,
                  autoplaySpeed: 8000,
                }
              },
              {
                breakpoint: 999,
                settings: {
                  variableWidth: true,
                  slidesToShow: 1,
                  autoplay: true,
                  autoplaySpeed: 8000,
                }
              },
              {
                breakpoint: 544,
                settings: {
                  variableWidth: false,
                  slidesToShow: 1,
                  autoplay: true,
                  autoplaySpeed: 8000,
                  adaptiveHeight: true
                }
              },
            ]
          });
        }
      }, 300);
    };

    loadScripts();
  }, []);

  React.useEffect(() => {
    const onReady = () => {
      const items = document.querySelectorAll(".item");
      for (let i = 0; i < Math.min(9, items.length); i++) {
        items[i].classList.add("show");
      }

      const loadMoreBtn = document.querySelector(".loadmore");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", function (e) {
          e.preventDefault();
          const hiddenItems = document.querySelectorAll(".item:not(.show)");
          for (let i = 0; i < Math.min(9, hiddenItems.length); i++) {
            hiddenItems[i].classList.add("show");
          }

          if (document.querySelectorAll(".item:not(.show)").length === 0) {
            loadMoreBtn.remove();
          } else {
            window.scrollTo({
              top: loadMoreBtn.getBoundingClientRect().top + window.pageYOffset,
              behavior: "smooth",
            });
          }
        });
      }
    };

    if (document.readyState === "complete") {
      onReady();
    } else {
      window.addEventListener("DOMContentLoaded", onReady);
    }

    return () => {
      window.removeEventListener("DOMContentLoaded", onReady);
    };
  }, []);

  return (
    <Layout>
      <SEO
        seoData={seoData}
      />
      <InternalLinkInterceptor />
      <div id="content" className="site-content" dangerouslySetInnerHTML={{ __html: flexibleContentHtml }}></div>
    </Layout>
  )
}

export default Home
