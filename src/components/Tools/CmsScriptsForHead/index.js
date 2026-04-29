// components/Tools/CmsScriptsForHead.tsx
import { Script } from "gatsby";
import React from "react";

const CmsScriptsForHead = ({ scripts = [] }) => {
  // Nếu không có script, không render gì cả
  if (!scripts || scripts.length === 0) {
    return null;
  }

  // DEBUG: Log head scripts ra console
  console.log("[CmsScriptsForHead] Head Scripts:", scripts);

  // TEST: Bỏ script có id "sa-dynamic-optimization"
  const filteredScripts = scripts.filter(
    (script) => script.props?.id !== "sa-dynamic-optimization",
  );

  return (
    <>
      {filteredScripts.map((script, index) => {
        const scriptProps = script.props || {};

        if (script.src) {
          return (
            <Script
              key={`cms-script-${index}`}
              src={script.src}
              {...scriptProps}
              // Dùng "idle" để Gatsby tự đợi trình duyệt rảnh rỗi mới load,
              // thay vì mình phải tự viết event listener
              strategy="idle"
            />
          );
        }
        if (script.content) {
          return (
            <Script
              key={`cms-script-${index}`}
              {...scriptProps}
              // Dùng "idle" cho các script tracking/CMS
              strategy="idle"
              dangerouslySetInnerHTML={{ __html: script.content }}
            />
          );
        }
        return null;
      })}
    </>
  );
};

export default CmsScriptsForHead;
