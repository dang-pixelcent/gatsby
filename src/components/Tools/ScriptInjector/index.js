import React, { useLayoutEffect, useRef } from 'react'

const ScriptInjector = ({ scripts }) => {
    // Dùng useRef để theo dõi các script đã được chèn, tránh chèn lại khi component re-render
    const injectedRef = useRef(new Set());

    // Dùng useLayoutEffect để chạy đồng bộ sau khi DOM được tạo nhưng trước khi trình duyệt paint.
    // Điều này giúp tránh hiện tượng "nhấp nháy" (flickering).
    useLayoutEffect(() => {
        if (!scripts || scripts.length === 0) {
            return;
        }

        scripts.forEach(scriptInfo => {
            // Nếu script này đã được chèn, bỏ qua
            if (injectedRef.current.has(scriptInfo.placeholderId)) {
                return;
            }

            const placeholder = document.getElementById(scriptInfo.placeholderId);

            if (placeholder) {
                // Tạo một thẻ script mới để trình duyệt có thể thực thi nó.
                // Việc chèn trực tiếp HTML bằng innerHTML sẽ không chạy script.
                const newScript = document.createElement('script');

                // Dùng một div tạm để phân tích chuỗi HTML của script
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = scriptInfo.scriptHtml;
                const originalScriptNode = tempDiv.firstChild;

                if (originalScriptNode) {
                    let isInline = true;
                    let hasSrc = false;
                    let hasFetchPriority = false;

                    // Sao chép tất cả các thuộc tính (src, async, defer, type, v.v.)
                    for (const attr of originalScriptNode.attributes) {
                        const attrName = attr.name.toLowerCase();
                        // nếu có thuộc tính src thì đây không phải là script inline
                        if (attrName === 'src') {
                            hasSrc = true;
                            isInline = false;
                        }
                        if (attrName === 'fetchpriority') {
                            hasFetchPriority = true;
                        }
                        // // Bỏ qua thuộc tính 'type' cũ nếu chúng ta sẽ dùng Partytown
                        // if (scriptInfo.usePartytown && attrName === 'type') {
                        //     continue;
                        // }
                        newScript.setAttribute(attr.name, attr.value);
                    }

                    // // Nếu script được đánh dấu, hãy đặt type là 'text/partytown'
                    // if (scriptInfo.usePartytown) {
                    //     newScript.setAttribute('type', 'text/partytown');
                    //     console.log(`ScriptInjector: Offloading script from placeholder #${scriptInfo.placeholderId} to Partytown.`);
                    // }

                    //Thêm fetchpriority="low" nếu là script bên ngoài và chưa có
                    if (hasSrc && !hasFetchPriority) {
                        newScript.setAttribute('fetchpriority', 'low');
                    }

                    const inlineContent = originalScriptNode.innerHTML;
                    // Sao chép nội dung của script inline
                    if (inlineContent) {
                        //chỉ bọc IIFE nếu các script inline và có nội dung
                        if (isInline) {
                            newScript.innerHTML = `(function(){\ntry {\n${inlineContent}\n} catch (e) { console.error('Error in injected inline script:', e); }\n})();`;
                        } else {
                            newScript.innerHTML = inlineContent;
                        }
                    }

                    // Thay thế placeholder bằng thẻ script mới đã được tạo
                    placeholder.parentNode.replaceChild(newScript, placeholder);

                    // Đánh dấu là đã chèn
                    injectedRef.current.add(scriptInfo.placeholderId);
                }
            }
        });
    }, [scripts]); // Chỉ chạy lại effect này nếu danh sách script thay đổi

    return null; // Component này không render ra bất cứ thứ gì trong cây React
};

export default ScriptInjector