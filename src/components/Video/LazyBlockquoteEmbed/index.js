import React, { useState } from 'react';
import { Script } from 'gatsby';
import parse from 'html-react-parser';

const LazyBlockquoteEmbed = ({ embedCode, scriptSrc, platformName }) => {
    const [showEmbed, setShowEmbed] = useState(false);

    if (!showEmbed) {
        return (
            <div
                onClick={() => setShowEmbed(true)}
                onKeyDown={(e) => e.key === 'Enter' && setShowEmbed(true)}
                role="button"
                tabIndex={0}
                style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9f9f9' }}
                aria-label={`Load content from ${platformName}`}
            >
                <p style={{ fontWeight: 'bold', margin: 0 }}>🎥 Bấm để xem nội dung từ {platformName}</p>
                <p style={{ fontSize: 'small', color: '#666', margin: 0 }}>Nội dung sẽ được tải từ {platformName}.</p>
            </div>
        );
    }

    return (
        <>
            {parse(embedCode)}
            <Script src={scriptSrc} strategy="idle" />
        </>
    );
};

export default LazyBlockquoteEmbed;