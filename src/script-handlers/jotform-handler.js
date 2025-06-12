/**
 * Khởi tạo xử lý JotForm iframe với parameter passing và message handling,
 * và trả về một hàm để dọn dẹp các sự kiện đó.
 * @returns {function|null} - Trả về một hàm dọn dẹp nếu tìm thấy phần tử, hoặc null nếu không.
 */
export const initializeJotForm = () => {
    const jotformIframe = document.querySelector('[id^="JotFormIFrame-"]');

    // Nếu không có JotForm iframe nào, không làm gì cả.
    if (!jotformIframe) {
        return null;
    }

    // Setup iframe parameters
    const setupIframeParams = () => {
        const ifr = jotformIframe;
        if (ifr) {
            let src = ifr.src;
            let iframeParams = [];
            
            if (window.location.href && window.location.href.indexOf("?") > -1) {
                iframeParams = iframeParams.concat(window.location.href.substr(window.location.href.indexOf("?") + 1).split('&'));
            }
            
            if (src && src.indexOf("?") > -1) {
                iframeParams = iframeParams.concat(src.substr(src.indexOf("?") + 1).split("&"));
                src = src.substr(0, src.indexOf("?"));
            }
            
            iframeParams.push("isIframeEmbed=1");
            ifr.src = src + "?" + iframeParams.join('&');
        }
    };

    // Handle iframe messages
    const handleIFrameMessage = (e) => {
        if (typeof e.data === 'object') { return; }
        
        const args = e.data.split(":");
        let iframe;
        
        if (args.length > 2) { 
            iframe = document.getElementById("JotFormIFrame-" + args[(args.length - 1)]); 
        } else { 
            iframe = document.getElementById("JotFormIFrame"); 
        }
        
        if (!iframe) { return; }
        
        switch (args[0]) {
            case "scrollIntoView":
                iframe.scrollIntoView();
                break;
            case "setHeight":
                iframe.style.height = args[1] + "px";
                if (!isNaN(args[1]) && parseInt(iframe.style.minHeight) > parseInt(args[1])) {
                    iframe.style.minHeight = args[1] + "px";
                }
                break;
            case "collapseErrorPage":
                if (iframe.clientHeight > window.innerHeight) {
                    iframe.style.height = window.innerHeight + "px";
                }
                break;
            case "reloadPage":
                window.location.reload();
                break;
            case "loadScript":
                if (!window.isPermitted(e.origin, ['jotform.com', 'jotform.pro'])) { break; }
                let src = args[1];
                if (args.length > 3) {
                    src = args[1] + ':' + args[2];
                }
                const script = document.createElement('script');
                script.src = src;
                script.type = 'text/javascript';
                document.body.appendChild(script);
                break;
            case "exitFullscreen":
                if (window.document.exitFullscreen) window.document.exitFullscreen();
                else if (window.document.mozCancelFullScreen) window.document.mozCancelFullScreen();
                else if (window.document.mozCancelFullscreen) window.document.mozCancelFullScreen();
                else if (window.document.webkitExitFullscreen) window.document.webkitExitFullscreen();
                else if (window.document.msExitFullscreen) window.document.msExitFullscreen();
                break;
        }
        
        const isJotForm = (e.origin.indexOf("jotform") > -1);
        if (isJotForm && "contentWindow" in iframe && "postMessage" in iframe.contentWindow) {
            const urls = {
                "docurl": encodeURIComponent(document.URL),
                "referrer": encodeURIComponent(document.referrer)
            };
            iframe.contentWindow.postMessage(JSON.stringify({"type": "urls", "value": urls}), "*");
        }
    };

    // Permission checker
    window.isPermitted = function(originUrl, whitelisted_domains) {
        const url = document.createElement('a');
        url.href = originUrl;
        const hostname = url.hostname;
        let result = false;
        
        if (typeof hostname !== 'undefined') {
            whitelisted_domains.forEach(function(element) {
                if (hostname.slice((-1 * element.length - 1)) === '.'.concat(element) || hostname === element) {
                    result = true;
                }
            });
            return result;
        }
        return false;
    };

    window.handleIFrameMessage = handleIFrameMessage;

    // Setup initial iframe params
    setupIframeParams();

    // Add event listeners
    if (window.addEventListener) {
        window.addEventListener("message", handleIFrameMessage, false);
    } else if (window.attachEvent) {
        window.attachEvent("onmessage", handleIFrameMessage);
    }

    // Trả về hàm dọn dẹp
    return () => {
        if (window.removeEventListener) {
            window.removeEventListener("message", handleIFrameMessage, false);
        } else if (window.detachEvent) {
            window.detachEvent("onmessage", handleIFrameMessage);
        }
        
        // Clean up global functions
        if (window.handleIFrameMessage) {
            delete window.handleIFrameMessage;
        }
        if (window.isPermitted) {
            delete window.isPermitted;
        }
    };
};
