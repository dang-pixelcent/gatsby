const { createRemoteFileNode } = require("gatsby-source-filesystem");
// Hàm này sẽ "dạy" Gatsby cách tìm URL ảnh và biến nó thành file cục bộ
// để các plugin sharp có thể xử lý.
module.exports = ({
    actions,
    cache,
    createNodeId,
    createResolvers,
    store,
    reporter,
}) => {
    const { createNode } = actions;

    createResolvers({
        // Tên Type này ("GraphCMS_MediaItem") là phỏng đoán dựa trên
        // schema thông thường của WPGraphQL. Nếu sau khi chạy lại server
        // bạn vẫn gặp lỗi, hãy vào http://localhost:8000/___graphql
        // để tìm tên Type chính xác cho đối tượng ảnh của bạn (đối tượng có chứa sourceUrl).
        GraphCMS_MediaItem: {
            // 1. Tạo ra một trường GraphQL mới tên là `localFile`
            localFile: {
                type: `File`, // Trường này sẽ trả về một node kiểu `File`
                // 2. Hàm `resolve` này sẽ được chạy để tạo ra giá trị cho trường `localFile`
                async resolve(source, args, context, info) {
                    // 3. Dùng hàm `createRemoteFileNode` để tải ảnh từ URL
                    // và tạo ra một file node cục bộ để Sharp có thể xử lý.
                    if (source.sourceUrl &&
                        typeof source.sourceUrl === 'string' &&
                        /^https?:\/\//.test(source.sourceUrl)) {
                        return await createRemoteFileNode({
                            url: source.sourceUrl, // Lấy URL ảnh từ WordPress
                            store,
                            cache,
                            createNode,
                            createNodeId,
                            reporter,
                        });
                    }
                    return null;
                },
            },
        },
    });
};