/**
 * File này chứa tất cả logic liên quan đến việc gửi sự kiện tracking.
 * Bằng cách tập trung logic ở đây, chúng ta có thể dễ dàng thay đổi
 * cấu trúc payload hoặc thêm thông tin mà không cần sửa nhiều file.
 */
// import { quizData } from '@components/Quiz/data/hrt-women-quiz.js';

// Hàm gốc để gửi sự kiện, sử dụng edgetag giả lập của bạn
const track = (eventName, properties = {}) => {
    if (typeof window !== 'undefined' && typeof window.edgetag === 'function') {
        window.edgetag('track', eventName, properties);
    }
};

/**
 * Xây dựng payload cơ bản chứa thông tin chung về quiz.
 * @returns {object}
 */
const getBasePayload = (quizData) => ({
    quiz_id: 'hrt-women-quiz',
    quiz_title: quizData.title,
});

/**
 * Sự kiện khi người dùng bắt đầu làm quiz (nhấn Next ở câu đầu tiên).
 */
export const trackQuizStarted = (quizData) => {
    track('quiz_started', {
        ...getBasePayload(quizData),
        start_location: window.location.pathname, // Ghi lại trang mà quiz bắt đầu
    });
};

/**
 * Sự kiện khi người dùng trả lời một câu hỏi.
 * @param {object} questionData - Dữ liệu của câu hỏi hiện tại.
 * @param {string} answer - Câu trả lời người dùng đã chọn.
 * @param {number} stepNumber - Số thứ tự của câu hỏi (1-based).
 */
export const trackQuestionAnswered = (questionData, answer, stepNumber, quizData) => {
    track('question_answered', {
        ...getBasePayload(quizData),
        step_number: stepNumber,
        section_id: questionData.sectionId,
        section_title: questionData.sectionTitle,
        question_id: questionData.id,
        question_text: questionData.question,
        answer_selected: answer,
    });
};

/**
 * Sự kiện khi người dùng hoàn thành quiz và nhận kết quả.
 * @param {string} resultStatus - Trạng thái kết quả ('qualified' hoặc 'not-qualified').
 * @param {object} allAnswers - Toàn bộ các câu trả lời của người dùng.
 */
export const trackQuizCompleted = (resultStatus, allAnswers, quizData) => {
    track('quiz_completed', {
        ...getBasePayload(quizData),
        final_status: resultStatus,
        // Gửi toàn bộ câu trả lời dưới dạng một đối tượng JSON
        // Rất hữu ích cho việc phân tích sâu sau này
        full_submission: allAnswers,
    });
};