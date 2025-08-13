import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * Tìm một phần tử DOM dựa trên `selector`,
 * thay thế TOÀN BỘ phần tử đó bằng các `children` được cung cấp.
 * @param {string} selector - CSS selector của phần tử cần thay thế (ví dụ: '#scheduleform').
 * @param {React.ReactNode} children - Component React bạn muốn dùng để thay thế.
 */
const DomReplacer = ({ selector, children }) => {
    const [mountNode, setMountNode] = useState(null);

    useEffect(() => {
        // Chỉ thực hiện ở phía client
        if (typeof window === 'undefined') {
            return;
        }

        // Tìm phần tử mục tiêu cần thay thế
        const targetNode = document.querySelector(selector);

        // Nếu không tìm thấy hoặc nó không có cha, thì không làm gì cả
        if (!targetNode || !targetNode.parentNode) {
            return;
        }

        // Tạo một div neo tạm thời để React có thể render vào
        const mountPoint = document.createElement('div');

        // Đây là bước quan trọng:
        // Thay thế node cũ (`targetNode`) bằng node neo mới (`mountPoint`)
        targetNode.parentNode.replaceChild(mountPoint, targetNode);

        // Lưu lại node neo để React Portal có thể sử dụng
        setMountNode(mountPoint);

    }, [selector]); // Chạy lại effect này nếu selector thay đổi

    // Khi đã có điểm neo, dùng Portal để render component con vào đó.
    // Component con sẽ thay thế hoàn toàn div neo tạm thời.
    return mountNode ? ReactDOM.createPortal(children, mountNode) : null;
};

export default DomReplacer;