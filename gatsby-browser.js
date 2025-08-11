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

export const wrapRootElement = wrapWithProvider