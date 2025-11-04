// /static/sw.js
// Nhiệm vụ: Tự hủy chính nó và mọi Service Worker cũ, sau đó tải lại trang.

self.addEventListener('install', (e) => {
    // Bỏ qua việc chờ đợi và kích hoạt ngay lập tức
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    // Kích hoạt ngay lập tức
    e.waitUntil(
        // 1. Lệnh quan trọng: TỰ GỠ BỎ ĐĂNG KÝ
        self.registration.unregister()
            .then(() => {
                // 2. Lấy tất cả các tab đang mở của trang web này
                return self.clients.matchAll();
            })
            .then((clients) => {
                // 3. BUỘC TẤT CẢ CÁC TAB TẢI LẠI TRANG
                // Sau khi tải lại, chúng sẽ không còn bị kiểm soát bởi Service Worker nữa
                clients.forEach(client => client.navigate(client.url));
            })
    );
});