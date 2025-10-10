import * as React from "react"
import "./styles.scss"

const Footer = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: data }} />
  )
}

export default Footer