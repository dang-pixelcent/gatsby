
import React from "react"
import Layout from "@components/layout"
// Tạo component wrapper có điều kiện
const ConditionalLayout = ({ children, noLayout }) => {
    if (noLayout) {
        return <>{children}</>;
    }
    return <Layout>{children}</Layout>;
};

export default ConditionalLayout;