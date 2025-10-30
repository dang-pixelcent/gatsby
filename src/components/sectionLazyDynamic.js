import React from 'react';

const LazySectionDynamic = ({ belowTheFoldSections }) => {
    // belowTheFoldSections là 1 mảng các secion chưa được nối lại, nên ta cần nối chúng lại thành 1 chuỗi HTML

    const sectionsHtml = belowTheFoldSections.join('');
    return (
        <div dangerouslySetInnerHTML={{ __html: sectionsHtml }} />
    );
}

export default LazySectionDynamic;