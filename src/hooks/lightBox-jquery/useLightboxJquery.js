import React, { useEffect } from "react";
import { Script } from "gatsby"
const LightboxScripts = ({ uri }) => {
    if (!uri || !["/events/"].includes(uri)) return null;

    return (
        <>
            <Script
                src="https://code.jquery.com/jquery-3.7.1.min.js"
                strategy="idle"
            />
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js"
                strategy="idle"
            />
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css"
            />
        </>
    );
};

export default LightboxScripts;