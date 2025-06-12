import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * Một component đa dụng để render bất kỳ component con nào (children)
 * vào một phần tử DOM được chỉ định bởi một CSS selector.
 * * @param {object} props - Props của component.
 * @param {string} props.selector - CSS selector của phần tử DOM mục tiêu (ví dụ: '#my-id', '.my-class').
 * @param {React.ReactNode} props.children - Component React cần được "tiêm" vào.
 */
const ComponentPortal = ({ selector, children }) => {
    // State để lưu trữ DOM node mục tiêu
    const [mountNode, setMountNode] = useState(null);

    // useEffect sẽ chạy trên trình duyệt để tìm DOM node
    useEffect(() => {
        // Tìm phần tử DOM mục tiêu bằng selector đã cung cấp
        const targetNode = document.querySelector(selector);

        // Nếu tìm thấy, lưu nó vào state.
        // Việc này sẽ kích hoạt việc render lại và tạo portal.
        if (targetNode) {
            setMountNode(targetNode);
        }

        // Chúng ta muốn hook này chỉ chạy một lần để tìm node,
        // và chạy lại nếu selector thay đổi (mặc dù trường hợp này hiếm).
    }, [selector]);

    // Nếu mountNode đã được tìm thấy, sử dụng React Portal để render `children` vào đó.
    // Nếu không, không render gì cả.
    return mountNode ? ReactDOM.createPortal(children, mountNode) : null;
};

export default ComponentPortal;