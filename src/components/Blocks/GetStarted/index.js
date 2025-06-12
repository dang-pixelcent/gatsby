// src/components/ScheduleForm/index.js

import React, { useEffect, useRef } from 'react';

export const ScheduleForm = () => {
    // useRef để tham chiếu đến div container, giúp tránh các vấn đề về re-render
    const formContainerRef = useRef(null);

    // useEffect sẽ chạy một lần sau khi component được render vào DOM
    useEffect(() => {
        // Kiểm tra xem div container đã tồn tại chưa
        if (!formContainerRef.current) {
            return;
        }

        // Tránh việc chèn lại form nếu nó đã được chèn trước đó
        if (formContainerRef.current.querySelector('iframe')) {
            return;
        }

        // Tạo iframe chứa form
        const ghliframe = document.createElement('iframe');
        ghliframe.id = "pZ5us1TDI3kKin0xSGLQ";
        ghliframe.style.width = "100%";
        ghliframe.style.height = "700px"; // Thêm chiều cao mặc định để iframe có không gian
        ghliframe.style.border = "none";
        ghliframe.src = "https://book.practiceflow.md/widget/survey/pZ5us1TDI3kKin0xSGLQ";
        ghliframe.setAttribute("nitro-exclude", "true");

        // Tạo thẻ script để tải logic của form
        const ghlscript = document.createElement('script');
        ghlscript.src = "https://book.practiceflow.md/js/form_embed.js";
        ghlscript.setAttribute("nitro-exclude", "true");
        ghlscript.defer = true; // Dùng defer để không chặn render

        // Thêm iframe và script vào container
        formContainerRef.current.appendChild(ghliframe);
        formContainerRef.current.appendChild(ghlscript);

    }, []); // Mảng rỗng [] đảm bảo hook này chỉ chạy một lần

    // Trả về JSX với một div container để script có thể tìm thấy và chèn form vào
    return (
        <div ref={formContainerRef}></div>
    );
};