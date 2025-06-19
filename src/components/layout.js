import React, { useState, useEffect } from "react"
import { Script } from "gatsby"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/main.min.scss"
import "../styles/lightbox.min.css"
import "../styles/slick.css"
import "../styles/main.scss"
import "../styles/customStyle.scss"
import "../styles/dashicons.min.css"
import Header from './Header'
import Footer from './Footer'
import ScrollTop from "./ScrollTop";
import ChatWidget from "./ChatWidget"

const DefaultLayout = ({ children }) => {
  return (
    <div>
      {/* <Helmet>
        <body className={bodyClass} />
      </Helmet> */}
      <Header />
      {children}
      <Footer />
      <ScrollTop />
      <ChatWidget />
    </div>
  )
}

export default DefaultLayout
