// src/components/DynamicScriptHandler/index.js

import { useEffect } from 'react';
import { useLocation } from "@reach/router";

// // 1. Import các handler mới
// import { initializeFAQs } from '../../script-handlers/faq-handler';
// import { initializeSlickCarousel } from '../../script-handlers/slick-carousel-handler';
// import { initializeLoadMore } from '../../script-handlers/load-more-handler';
// import { initializeTabs } from '../../script-handlers/tab-handler';
// // import { initializeFormEmbed } from '../../script-handlers/form-embed-handler';
// import { initializeHeightEqualizer } from '../../script-handlers/height-equalizer-handler';
// import { initializeJotForm } from '../../script-handlers/jotform-handler';
// import { initializeResultsNavigation } from '../../script-handlers/results-navigation-handler';
// import { initializeTrackingPixels } from '../../script-handlers/trackinghandler';
// import { initializeSearchForm } from '../../script-handlers/form-handler';

// // 2. Thêm chúng vào danh sách đăng ký
// const HANDLER_REGISTRY = [
//     initializeFAQs,
//     initializeSlickCarousel,
//     initializeLoadMore,
//     initializeTabs,
//     initializeHeightEqualizer,
//     initializeJotForm,
//     initializeResultsNavigation,
//     initializeTrackingPixels,
//     initializeSearchForm,
//     // initializeFormEmbed
// ];
const HANDLER_CONFIG = {
    '.faq-container': () => import('../../script-handlers/faq-handler').then(module => module.initializeFAQs()),
    '.slick-carousel': () => import('../../script-handlers/slick-carousel-handler').then(module => module.initializeSlickCarousel()),
    '.load-more-button': () => import('../../script-handlers/load-more-handler').then(module => module.initializeLoadMore()),
    '.tabs-nav': () => import('../../script-handlers/tab-handler').then(module => module.initializeTabs()),
    '[data-equalizer]': () => import('../../script-handlers/height-equalizer-handler').then(module => module.initializeHeightEqualizer()),
    '#jotform-placeholder': () => import('../../script-handlers/jotform-handler').then(module => module.initializeJotForm()),
    '.results-navigation': () => import('../../script-handlers/results-navigation-handler').then(module => module.initializeResultsNavigation()),
    '[data-tracking-pixel]': () => import('../../script-handlers/trackinghandler').then(module => module.initializeTrackingPixels()),
    'form.search-form': () => import('../../script-handlers/form-handler').then(module => module.initializeSearchForm()),
    // Thêm các handler khác với selector tương ứng ở đây
};

const DynamicScriptHandler = () => {
    const location = useLocation();

    // useEffect(() => {
    //     const cleanupFunctions = [];

    //     HANDLER_REGISTRY.forEach(handler => {
    //         const cleanup = handler();
    //         if (cleanup && typeof cleanup === 'function') {
    //             cleanupFunctions.push(cleanup);
    //         }
    //     });

    //     return () => {
    //         cleanupFunctions.forEach(cleanup => cleanup());
    //     };

    // }, [location.pathname]);

    // return null;


    useEffect(() => {
        const cleanupFunctions = [];

        // 2. Lặp qua cấu hình, thay vì registry tĩnh
        Object.entries(HANDLER_CONFIG).forEach(([selector, loadHandler]) => {
            // 3. Kiểm tra xem phần tử có tồn tại trên trang không
            if (document.querySelector(selector)) {
                // 4. Nếu có, mới thực hiện tải động và chạy handler
                loadHandler().then(cleanup => {
                    if (cleanup && typeof cleanup === 'function') {
                        cleanupFunctions.push(cleanup);
                    }
                }).catch(err => console.error(`Failed to load handler for ${selector}`, err));
            }
        });

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };

    }, [location.pathname]); // Chạy lại mỗi khi chuyển trang

    return null; // Component này không render gì cả
};

export default DynamicScriptHandler;