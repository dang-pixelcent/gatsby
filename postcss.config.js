module.exports = {
    plugins: [
        require('cssnano')({ // Yêu cầu và cấu hình cssnano
            preset: 'default', // Sử dụng bộ quy tắc tối ưu mặc định, đã bao gồm loại bỏ trùng lặp
        }),
    ],
}