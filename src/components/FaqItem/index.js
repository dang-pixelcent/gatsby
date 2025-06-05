import * as React from "react"
// import "./styles.scss"

const FaqItem = ({ title, description }) => {
  React.useEffect(() => {
    const faqList = document.querySelectorAll('.faq-item');
    faqList.forEach((item, index)=>{
        faqList[index].addEventListener('click',function(){
            if (faqList[index].classList.contains('active'))
            {
                faqList[index].classList.remove('active');
            }else{
                faqList[index].classList.add('active');
            }
        });
        
    });
  }, []);
  return (
    <>
      <div className="faq-item position-relative">
        <h3 className="title f-soleto fw-700 color-0659A9 mb-0">{title}</h3>
        <div className="content">
          <p>{description}</p>
        </div>
      </div>
    </>
  )
}

export default FaqItem
