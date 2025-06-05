import React, { useEffect } from "react"
import { navigate } from "gatsby"

const NotFoundPage = () => {
    useEffect(() => {
        // Redirect ngay lập tức về trang chủ
        navigate("/", { replace: true })
    }, [])

    return null
}

export default NotFoundPage