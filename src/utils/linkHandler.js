import { navigate } from "gatsby"
import React from "react";

/**
 * Xử lý click event cho thẻ <a> để hoạt động giống Link component
 * @param {Event} event - Click event
 * @param {string} href - URL đích
 * @param {string} target - Target attribute (_blank, _self, etc.)
 */
export const handleInternalLink = (event, href, target = '_self') => {
    // Chỉ xử lý internal links (không có target="_blank")
    if (target === '_blank' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return; // Để browser xử lý bình thường
    }

    event.preventDefault(); // Ngăn page reload
    navigate(href); // Client-side navigation
}

/**
 * Hook để tự động xử lý tất cả thẻ <a> internal trong component
 */
export const useInternalLinkHandler = () => {
    React.useEffect(() => {
        const handleClick = (event) => {
            const link = event.target.closest('a[data-internal]');

            if (link) {
                const href = link.getAttribute('href');
                const target = link.getAttribute('target');
                handleInternalLink(event, href, target);
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);
}