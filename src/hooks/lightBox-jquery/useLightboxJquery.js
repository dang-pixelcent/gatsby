import React, { useEffect } from "react";

// mảng chứa các page dùng lightbox 
const lightboxPages = [
    "/events/",
    // Thêm các trang khác nếu cần
];

const useLightBoxJquery = ({ uri }) => {
    useEffect(() => {
        if (lightboxPages.includes(uri)) {
            // Thêm script jQuery
            const jqueryScript = document.createElement("script");
            jqueryScript.src = "https://code.jquery.com/jquery-3.7.1.min.js";
            jqueryScript.async = true;
            document.body.appendChild(jqueryScript);

            // Thêm script lightbox2
            const lightboxScript = document.createElement("script");
            lightboxScript.src = "https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js";
            lightboxScript.async = true;
            document.body.appendChild(lightboxScript);

            // Thêm CSS lightbox2
            const lightboxCSS = document.createElement("link");
            lightboxCSS.rel = "stylesheet";
            lightboxCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css";
            document.head.appendChild(lightboxCSS);

            // Cleanup khi rời trang
            return () => {
                if (jqueryScript.parentNode) document.body.removeChild(jqueryScript);
                if (lightboxScript.parentNode) document.body.removeChild(lightboxScript);
                if (lightboxCSS.parentNode) document.head.removeChild(lightboxCSS);
            };
        }
    }, [uri]);

    return null; // Không cần render gì cả
};

export default useLightBoxJquery;