// src/components/DynamicScriptHandler/index.js

import { useEffect } from 'react';
import { useLocation } from "@reach/router";

// 1. Import các handler mới
import { initializeFAQs } from '../../script-handlers/faq-handler';
import { initializeSlickCarousel } from '../../script-handlers/slick-carousel-handler';
import { initializeLoadMore } from '../../script-handlers/load-more-handler';
import { initializeTabs } from '../../script-handlers/tab-handler';
//import { initializeFormEmbed } from '../../script-handlers/form-embed-handler';
import { initializeHeightEqualizer } from '../../script-handlers/height-equalizer-handler';
import { initializeJotForm } from '../../script-handlers/jotform-handler';
import { initializeResultsNavigation } from '../../script-handlers/results-navigation-handler';
import { initializeTrackingPixels } from '../../script-handlers/trackinghandler';
import { initializeSearchForm } from '../../script-handlers/form-handler';

// 2. Thêm chúng vào danh sách đăng ký
const HANDLER_REGISTRY = [
    // initializeFAQs,
    // initializeSlickCarousel,
    initializeLoadMore,
    // initializeTabs,
    // initializeHeightEqualizer,
    // initializeJotForm,
    // initializeResultsNavigation,
    initializeTrackingPixels,
    initializeSearchForm
];

const DynamicScriptHandler = () => {
    const location = useLocation();

    useEffect(() => {
        const cleanupFunctions = [];

        HANDLER_REGISTRY.forEach(handler => {
            const cleanup = handler();
            if (cleanup && typeof cleanup === 'function') {
                cleanupFunctions.push(cleanup);
            }
        });

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };

    }, [location.pathname]);

    return null;
};

export default DynamicScriptHandler;