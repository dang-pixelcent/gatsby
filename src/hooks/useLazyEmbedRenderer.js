import React, { useEffect } from 'react'
import ReactDOM from 'react-dom';
import LazyEmbed from '@components/Video/LazyEmbed';

const useLazyEmbedRenderer = ({ flexibleContentHtml }) => {
    useEffect(() => {
        const contentContainer = document.getElementById('content');
        if (!contentContainer) return;

        const cleanupTasks = [];
        const totalContentHeight = contentContainer.offsetHeight;

        // Tìm tất cả các placeholder vạn năng
        document.querySelectorAll('.lazy-embed-placeholder').forEach(placeholder => {
            const embedCode = placeholder.dataset.embedCode;
            if (embedCode) {
                const placeholderTop = placeholder.offsetTop;
                const rootMargin = (placeholderTop < totalContentHeight * 0.6) ? '300px' : '100px';

                ReactDOM.render(
                    <LazyEmbed
                        embedCode={decodeURIComponent(embedCode)}
                        rootMargin={rootMargin}
                    />,
                    placeholder
                );
                cleanupTasks.push(placeholder);
            }
        });

        return () => {
            cleanupTasks.forEach(placeholder => {
                ReactDOM.unmountComponentAtNode(placeholder);
            });
        };
    }, [flexibleContentHtml]);

    return null
}

export default useLazyEmbedRenderer