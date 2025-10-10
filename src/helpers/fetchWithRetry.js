/**
 * Hàm fetch với logic retry và backoff tăng dần.
 * @param {object} options - Các tùy chọn.
 * @param {string} options.endpoint - URL để fetch.
 * @param {string} options.query - Chuỗi query GraphQL.
 * @param {object} options.reporter - Gatsby reporter để log.
 * @param {number} [options.retries=7] - Số lần thử lại tối đa.
 * @returns {Promise<object>} - Dữ liệu trả về từ CMS.
 */
async function fetchWithRetry({ endpoint, query, reporter, retries = 7 }) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            reporter.info(`Attempt ${attempt}/${retries}: Fetching data from ${endpoint}`);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            // Nếu response không phải 429 hoặc lỗi server khác, chúng ta xử lý nó
            if (response.ok) {
                const jsonResponse = await response.json();
                if (jsonResponse.errors) {
                    throw new Error(`GraphQL returned errors: ${JSON.stringify(jsonResponse.errors)}`);
                }
                reporter.success(`Fetch successful on attempt ${attempt}.`);
                return jsonResponse.data; // Trả về dữ liệu và thoát khỏi vòng lặp
            }

            // Nếu là lỗi 429 hoặc lỗi server khác thì ném ra để đi vào catch
            throw new Error(`Fetch failed with status: ${response.status} ${response.statusText}`);

        } catch (error) {
            // Nếu là lần thử cuối cùng, ném lỗi ra ngoài để panicOnBuild
            if (attempt === retries) {
                reporter.error(`Final attempt (${attempt}/${retries}) failed. Aborting.`);
                throw error; // Ném lỗi cuối cùng ra ngoài
            }

            // Tính thời gian chờ tăng dần (vd: 1s, 2s, 4s, 8s...)
            const delay = Math.pow(2, attempt) * 1000;
            reporter.warn(`Attempt ${attempt}/${retries} failed: ${error.message}. Retrying in ${delay / 1000}s...`);

            // Chờ trước khi thử lại
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

module.exports = fetchWithRetry;