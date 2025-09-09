import wrapWithProvider from "./wrap-with-provider"
import './src/styles/customFonts.scss';
// Import Tailwind CSS trước
// import './src/styles/tailwind.css';

// Import custom SCSS sau
// import './src/styles/main.scss';

// // Global styles và libraries
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';


// 3. GATSBY THEME STYLES - với lower priority
import './src/styles/main.scss';
import './src/styles/aos.css';
import './src/styles/customStyle.scss';
import './src/styles/dashicons.min.css';
import './src/styles/slick.css';
import './src/styles/custom.scss';
import './src/styles/main.min.scss';
import './src/styles/layouts/_blog.scss';

// 4. EXTERNAL LIBRARIES CUỐI CÙNG
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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


export const wrapRootElement = wrapWithProvider