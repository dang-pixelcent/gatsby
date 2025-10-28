import { useEffect } from 'react';

const loadScript = (src, id) => new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
        resolve();
        return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
});

const loadStylesheet = (href, id) => {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = id;
    document.head.appendChild(link);
};

let isJqueryLoadingOrLoaded = false;
let jqueryPromise = null;

const useJqueryPlugins = (plugins) => {
    useEffect(() => {
        const initializePlugins = async () => {
            // Lọc ra các plugin thực sự cần tải
            const pluginsToLoad = plugins.filter(p => p.shouldLoad ? p.shouldLoad() : true);

            if (pluginsToLoad.length === 0) return;

            try {
                // Quản lý việc tải jQuery bằng Promise để tránh race condition
                if (!isJqueryLoadingOrLoaded) {
                    isJqueryLoadingOrLoaded = true;
                    jqueryPromise = loadScript("https://code.jquery.com/jquery-3.7.1.min.js", "jquery-core-script");
                }
                await jqueryPromise;

                // Tải và khởi tạo các plugin
                for (const plugin of pluginsToLoad) {
                    if (plugin.css) {
                        // Xử lý trường hợp css là mảng hoặc chuỗi
                        (Array.isArray(plugin.css) ? plugin.css : [plugin.css]).forEach((href, index) => {
                            loadStylesheet(href, `${plugin.id}-css-${index}`);
                        });
                    }
                    if (plugin.js) {
                        await loadScript(plugin.js, `${plugin.id}-js`);
                    }
                    if (plugin.initialize && typeof window.jQuery === 'function') {
                        plugin.initialize(window.jQuery);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải jQuery plugins:", error);
            }
        };

        const handle = window.requestIdleCallback(initializePlugins);
        return () => window.cancelIdleCallback(handle);

    }, [plugins]); // Chạy lại nếu danh sách plugin thay đổi
};

export default useJqueryPlugins;