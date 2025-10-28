import wrapWithProvider from "./wrap-with-provider"

if (process.env.NODE_ENV === 'development') {
    console.log(
        '%c EdgeTag Mock Mode: Bật chế độ giả lập EdgeTag. ',
        'background: #7b5ed4; color: #fff; padding: 4px;'
    );

    window.edgetag = function (...args) {
        console.groupCollapsed(`🚀 EdgeTag Event: ${args[1]}`);
        console.log('Payload:', args[2] || 'No payload');
        console.groupEnd();
    };
}


export const wrapRootElement = wrapWithProvider;