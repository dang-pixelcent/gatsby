import React, { useState } from "react";
import { Script } from "gatsby";

const LazyWistiaEmbed = ({ videoId }) => {
    const [showVideo, setShowVideo] = useState(false);

    if (!showVideo) {
        return (
            <div
                onClick={() => setShowVideo(true)}
                onKeyDown={(e) => e.key === 'Enter' && setShowVideo(true)}
                role="button"
                tabIndex={0}
                style={{ position: 'relative', cursor: 'pointer', aspectRatio: '16/9', backgroundColor: '#000' }}
                aria-label="Play Wistia video"
            >
                <img
                    src={`https://fast.wistia.net/embed/iframe/${videoId}/still.jpg`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', border: '0', display: 'block' }}
                    alt="Video thumbnail"
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: 68, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg height="100%" viewBox="0 0 68 48" width="100%"><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>
                </div>
            </div>
        );
    }

    return (
        <>
            <Script src="https://fast.wistia.com/assets/external/E-v1.js" strategy="idle" />
            <div className="wistia_responsive_padding" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                <div className="wistia_responsive_wrapper" style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "100%" }}>
                    <iframe
                        src={`https://fast.wistia.net/embed/iframe/${videoId}?autoplay=1&videoFoam=true`}
                        title="Wistia video player"
                        allow="autoplay; fullscreen"
                        frameBorder="0"
                        scrolling="no"
                        className="wistia_embed"
                        name="wistia_embed"
                        width="100%"
                        height="100%"
                    ></iframe>
                </div>
            </div>
        </>
    );
};

export default LazyWistiaEmbed;