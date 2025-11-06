import { slickCarouselPlugin, serviceSlickSliderPlugin, lightbox2Plugin } from '@src/script-handlers/script-plugins';
export const getJqueryPlugins = (uri) => {
    // mảng chứa cấu hình để tải jQuery cho các script cần jQuery
    const jqueryPlugins = [
        slickCarouselPlugin,
        serviceSlickSliderPlugin,
    ];

    // mảng chứa uri cần lightbox (có thể mở rộng)
    const lightboxUris = ['/events/'];

    if (uri && lightboxUris.some(lightboxUri => uri.startsWith(lightboxUri))) {
        jqueryPlugins.push(lightbox2Plugin);
    }

    return jqueryPlugins;
};