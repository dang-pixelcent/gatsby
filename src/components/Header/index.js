import * as React from "react"
import "./styles.scss"
import { useMegaMenu } from "@hooks/header/useMegaMenu"
import { useScrollHeader } from "@hooks/header/useScrollHeader"
import { useMobileMenu } from "@hooks/header/useMobileMenu"

const Header = ({ isMobileMenuOpen, setMobileMenuOpen, data }) => {

  useMegaMenu();

  // === FIXED HEADER ===
  useScrollHeader(isMobileMenuOpen);
  // === END ===

  // === XỬ LÝ MỞ/ĐÓNG MENU VÀ SUB-MENU ===
  useMobileMenu(isMobileMenuOpen, setMobileMenuOpen);
  // === END ===


  if (!data) {
    return null;
  }
  return (
    <div dangerouslySetInnerHTML={{ __html: data }} />
  )
}

export default Header
