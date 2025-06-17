// src/components/Tools/DomInjector.js
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * Component này tìm một phần tử DOM dựa trên `selector`,
 * xóa nội dung của nó, và render các `children` vào bên trong bằng Portal.
 * @param {string} selector - CSS selector của phần tử container (ví dụ: '#my-div').
 * @param {React.ReactNode} children - Component React bạn muốn tiêm vào.
 */
const DomInjector = ({ selector, children }) => {
    const [mountNode, setMountNode] = useState(null);

    useEffect(() => {
        // Tìm phần tử container trên trang
        const targetNode = document.querySelector(selector);

        if (targetNode) {
            // Xóa sạch nội dung tĩnh bên trong nó
            targetNode.innerHTML = '';
            // Đặt nó làm nơi để portal của React render vào
            setMountNode(targetNode);
        }
    }, [selector]); // Chỉ chạy lại effect này nếu selector thay đổi

    // Nếu đã tìm thấy nơi để render, dùng Portal để tiêm component vào
    // Nếu không, không render gì cả
    return mountNode ? ReactDOM.createPortal(children, mountNode) : null;
};

export default DomInjector;