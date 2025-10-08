
import React from "react"
import Layout from "@components/layout"
import NoLayout from "@components/noLayout"
// Tạo component wrapper có điều kiện
const ConditionalLayout = ({ children, noLayout }) => {
    if (noLayout) {
        return <NoLayout>{children}</NoLayout>;
    }
    return <Layout>{children}</Layout>;
};

export default ConditionalLayout;