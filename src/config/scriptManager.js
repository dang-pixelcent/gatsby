// src/config/scriptManager.js

export const SCRIPT_HANDLING_CONFIG = {
    // Key là một phần đặc trưng của URL script
    'instagram.com/embed.js': {
        keepOnUnmount: true,
        // Hàm này sẽ được gọi lại mỗi khi component chứa embed được mount
        process: () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        }
    },
    'tiktok.com/embed.js': {
        keepOnUnmount: false,
        // Script của TikTok không cần hàm process thủ công
        process: null 
    },
    'maps.googleapis.com/maps/api/js': {
        keepOnUnmount: false, // Script Google Maps cũng nên được giữ lại
        process: null
    },
    // Các script khác không có trong danh sách này sẽ dùng cài đặt mặc định
};

export const DEFAULT_SCRIPT_HANDLING = {
    keepOnUnmount: false, // Mặc định: An toàn là trên hết, dọn dẹp script khi không cần
    process: null,
};