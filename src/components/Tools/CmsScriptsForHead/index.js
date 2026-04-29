// components/Tools/CmsScriptsForHead.jsx
import React, { useEffect } from "react";

const CmsScriptsForHead = ({ scripts = [] }) => {
  useEffect(() => {
    // Nếu không có script, dừng luôn
    if (!scripts || scripts.length === 0) return;

    console.log(
      "[CmsScriptsForHead] Bắt đầu ép tiêm Scripts thuần vào HEAD:",
      scripts,
    );

    // Mảng lưu lại các script đã tiêm để dọn dẹp (tránh bị tiêm trùng lặp nếu React re-render)
    const injectedScripts = [];

    // Lọc bỏ các script không cần thiết
    const filteredScripts = scripts.filter(
      (script) => script.props?.id !== "sa-dynamic-optimization",
    );

    filteredScripts.forEach((scriptData) => {
      // 1. Tự tay tạo một thẻ <script> thật của HTML
      const scriptElement = document.createElement("script");

      // 2. Bê nguyên toàn bộ thuộc tính (id, data-uuid, type...) gắn vào
      if (scriptData.props) {
        Object.entries(scriptData.props).forEach(([key, value]) => {
          scriptElement.setAttribute(key, value);
        });
      }

      // 3. Xử lý Script có link ngoài (src)
      if (scriptData.src) {
        scriptElement.src = scriptData.src;
        scriptElement.async = true; // Cho phép tải ngầm không block web
      }
      // 4. Xử lý Script chứa code trực tiếp (như GTM)
      else if (scriptData.content) {
        // Nhét code vào là trình duyệt sẽ TỰ ĐỘNG CHẠY NGAY LẬP TỨC
        scriptElement.innerHTML = scriptData.content;
      }

      // 5. Đóng đinh nó vào <head> của trang web
      document.head.appendChild(scriptElement);
      injectedScripts.push(scriptElement);
    });

    // Cleanup: Xóa thẻ script khỏi HTML khi component bị hủy (để tránh rác DOM)
    // (Lưu ý: Code tracking đã chạy trên RAM rồi, xóa thẻ script không làm mất tracking, chỉ làm sạch HTML)
    return () => {
      injectedScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [scripts]); // Chỉ chạy 1 lần khi danh sách scripts được truyền vào

  // Component này chạy ngầm thao tác với DOM, không cần render ra giao diện gì cả
  return null;
};

export default CmsScriptsForHead;
