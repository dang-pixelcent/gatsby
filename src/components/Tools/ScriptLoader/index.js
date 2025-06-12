import { useEffect } from 'react';

/**
 * Một component React tổng quát để tải và quản lý các file script bên ngoài.
 *
 * @param {object} props - Các thuộc tính của component.
 * @param {object} props.attributes - Một object chứa tất cả các thuộc tính của thẻ script.
 * @param {function} [props.onLoad] - Callback khi script tải xong.
 * @param {function} [props.onError] - Callback khi có lỗi tải script.
 * @param {boolean} [props.keepOnUnmount=false] - Quyết định có giữ lại script khi unmount (chuyển trang) hay không.
 */
const ScriptLoader = ({
    attributes,
    onLoad = () => { },
    onError = () => { },
    keepOnUnmount = false,
}) => {
    const { src, id } = attributes;

    useEffect(() => {
        if (!src) return;

        const existingScript = id
            ? document.getElementById(id)
            : document.querySelector(`script[src="${src}"]`);

        if (existingScript) {
            if (existingScript.dataset.loaded) {
                onLoad();
            } else {
                existingScript.addEventListener('load', onLoad);
            }
            return () => {
                existingScript.removeEventListener('load', onLoad);
            };
        }

        const script = document.createElement('script');
        Object.entries(attributes).forEach(([key, value]) => {
            script.setAttribute(key, value);
        });

        const handleLoad = () => {
            script.dataset.loaded = 'true';
            onLoad();
        };

        const handleError = () => {
            onError();
        };

        script.addEventListener('load', handleLoad);
        script.addEventListener('error', handleError);

        document.body.appendChild(script);

        return () => {
            script.removeEventListener('load', handleLoad);
            script.removeEventListener('error', handleError);

            // Nếu không giữ lại, thì xóa nó đi.
            if (!keepOnUnmount) {
                const scriptToRemove = document.getElementById(id);
                if (scriptToRemove) {
                    document.body.removeChild(scriptToRemove);
                }
            }
        };
    }, [JSON.stringify(attributes), onLoad, onError, keepOnUnmount]);

    return null;
};

export default ScriptLoader;