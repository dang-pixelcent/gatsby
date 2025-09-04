import React, { useEffect } from 'react';

const injectJotformScript = (scriptInfo) => {
    const placeholder = document.getElementById(scriptInfo.placeholderId);
    if (!placeholder || placeholder.querySelector('script')) {
        return; // Không tìm thấy hoặc đã tiêm script
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://form.jotform.com/jsform/${scriptInfo.id}`;
    placeholder.appendChild(script);
};

// Map loại script với hàm xử lý tương ứng
const SCRIPT_INJECTORS = {
    'jotform': injectJotformScript,
    // Thêm các injector khác ở đây trong tương lai
};

const SpecialScriptInjector = ({ scripts = [] }) => {
    useEffect(() => {
        if (!scripts || scripts.length === 0) return;

        scripts.forEach(scriptInfo => {
            const injector = SCRIPT_INJECTORS[scriptInfo.type];
            if (injector) {
                injector(scriptInfo);
            } else {
                console.warn(`No injector found for special script type: "${scriptInfo.type}"`);
            }
        });
    }, [scripts]); // Chạy lại nếu danh sách scripts thay đổi

    return null; // Component này không render UI
};

export default SpecialScriptInjector;