import React, { useState, useEffect } from 'react';
import { Script } from 'gatsby'; // Dùng <Script> của Gatsby

const LazyCmsScripts = ({ scripts = [] }) => {
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // Nếu đã chạy rồi thì không làm gì cả
        if (hasInteracted) return;

        let timerId = null;

        // --- 1. HÀM KÍCH HOẠT (Sẽ được gọi 1 lần duy nhất) ---
        const triggerLoad = () => {
            // Dọn dẹp các trình lắng nghe và hẹn giờ
            window.removeEventListener('scroll', triggerLoad, { capture: true });
            window.removeEventListener('mousemove', triggerLoad, { capture: true });
            window.removeEventListener('touchstart', triggerLoad, { capture: true });
            if (timerId) {
                clearTimeout(timerId);
            }

            // Kích hoạt việc tải script!
            setHasInteracted(true);
        };

        // --- 2. LẮNG NGHE TƯƠNG TÁC (Cách 1) ---
        // (Dùng `once: true` để nó tự động gỡ bỏ sau khi chạy)
        window.addEventListener('scroll', triggerLoad, { once: true, passive: true, capture: true });
        window.addEventListener('mousemove', triggerLoad, { once: true, passive: true, capture: true });
        window.addEventListener('touchstart', triggerLoad, { once: true, passive: true, capture: true });

        // --- 3. HẸN GIỜ TỰ ĐỘNG (Cách 2 - "Failsafe") ---
        // Tự động kích hoạt sau 2.5 giây nếu không có tương tác
        timerId = setTimeout(triggerLoad, 3000);

        // Hàm dọn dẹp cuối cùng (nếu component bị gỡ bỏ)
        return () => {
            // Đảm bảo dọn dẹp nếu component unmount trước khi trigger
            window.removeEventListener('scroll', triggerLoad, { capture: true });
            window.removeEventListener('mousemove', triggerLoad, { capture: true });
            window.removeEventListener('touchstart', triggerLoad, { capture: true });
            if (timerId) {
                clearTimeout(timerId);
            }
        };

    }, [hasInteracted]); // Dependency vẫn là [hasInteracted]

    // --- Phần render không thay đổi ---
    if (!hasInteracted || !scripts || scripts.length === 0) {
        return null;
    }

    // Đã tương tác, render các script
    return (
        <>
            {scripts.map((script, index) => {
                // Lấy các props từ gatsby-node (như id, data-uuid)
                const scriptProps = script.props || {};

                if (script.src) {
                    // Script có src ngoài
                    return (
                        <Script
                            key={`cms-script-${index}`}
                            src={script.src}
                            {...scriptProps} // Truyền tất cả props
                        />
                    );
                }
                if (script.content) {
                    // Script inline
                    return (
                        <Script
                            key={`cms-script-${index}`}
                            {...scriptProps}
                            dangerouslySetInnerHTML={{ __html: script.content }}
                        />
                    );
                }
                return null;
            })}
        </>
    );
};

export default LazyCmsScripts;