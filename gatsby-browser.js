import wrapWithProvider from "./wrap-with-provider"

// Import Tailwind CSS trước
// import './src/styles/tailwind.css';

// Import custom SCSS sau
// import './src/styles/main.scss';

// // Global styles và libraries
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';


// 3. GATSBY THEME STYLES - với lower priority
import './src/styles/main.scss';

// 4. EXTERNAL LIBRARIES CUỐI CÙNG
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// if (process.env.NODE_ENV === 'development') {
    console.log(
        '%c EdgeTag Mock Mode: Bật chế độ giả lập EdgeTag. ',
        'background: #7b5ed4; color: #fff; padding: 4px;'
    );

    window.edgetag = function (...args) {
        console.groupCollapsed(`🚀 EdgeTag Event: ${args[1]}`);
        console.log('Payload:', args[2] || 'No payload');
        console.groupEnd();
    };
// }


export const wrapRootElement = wrapWithProvider