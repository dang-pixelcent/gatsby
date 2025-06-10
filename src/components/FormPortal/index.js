// src/components/FormPortal/index.js

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ScheduleForm from '../ScheduleForm'; // Import component form của bạn

const FormPortal = () => {
  const [mountNode, setMountNode] = useState(null);

  // useEffect này sẽ chạy một lần trên trình duyệt sau khi trang đã được render
  useEffect(() => {
    // Tìm phần tử DOM mục tiêu trong toàn bộ tài liệu
    const targetNode = document.getElementById('sdformthree');
    // Lưu phần tử DOM này vào state để sử dụng cho portal
    setMountNode(targetNode); 
  }, []); // Mảng rỗng đảm bảo nó chỉ chạy một lần

  // Nếu tìm thấy node mục tiêu, React sẽ tạo một "cổng" và render ScheduleForm vào đó.
  // Nếu không, nó sẽ không render gì cả (trả về null).
  return mountNode ? ReactDOM.createPortal(<ScheduleForm />, mountNode) : null;
};

export default FormPortal;