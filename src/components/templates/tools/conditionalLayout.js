
import React from "react"
import Layout from "@components/layout"
import NoLayout from "@components/noLayout"
// Tạo component wrapper có điều kiện
const ConditionalLayout = ({ children, isLayout }) => {
    if (isLayout) {
        return <Layout>{children}</Layout>;
    }
    return <NoLayout>{children}</NoLayout>;
};

export default ConditionalLayout;