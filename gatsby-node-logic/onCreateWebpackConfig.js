
const path = require('path');
const rootDir = path.join(__dirname, '..');
module.exports = ({ actions }) => {
    actions.setWebpackConfig({
        resolve: {
            alias: {
                '@src': path.resolve(rootDir, 'src'),
                '@components': path.resolve(rootDir, 'src/components'),
                '@templates': path.resolve(rootDir, 'src/components/templates'),
                '@hooks': path.resolve(rootDir, 'src/hooks'),
                '@context': path.resolve(rootDir, 'src/context'),
                '@styles': path.resolve(rootDir, 'src/styles'),
                '@helpers': path.resolve(rootDir, 'src/helpers'),
                '@config': path.resolve(rootDir, 'src/config'),
                '@assets': path.resolve(rootDir, 'src/assets'),
                '@utils': path.resolve(rootDir, 'src/utils'),
            },
        },
    });
};