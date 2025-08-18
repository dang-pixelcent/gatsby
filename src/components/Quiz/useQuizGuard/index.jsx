import { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';
// THÊM: Import cả getTotalQuestions
import { getQuestionData, getTotalQuestions } from '../data/quizHelpers';
import { useQuizData } from '../data/useQuizData';

const LOCAL_STORAGE_KEY = 'hrt_quiz_progress';
const QUIZ_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 ngày hết hạn

export const useQuizGuard = ({ pageType, questionNumber }) => {
    const [isAllowed, setIsAllowed] = useState(false);
    const quizData = useQuizData();
    const location = useLocation();

    useEffect(() => {
        if (typeof window === 'undefined' || !quizData) return;

        const savedProgressJSON = localStorage.getItem(LOCAL_STORAGE_KEY);

        // KIỂM TRA VÀ XỬ LÝ HẾT HẠN TRƯỚC TIÊN ---
        if (savedProgressJSON) {
            const savedProgress = JSON.parse(savedProgressJSON);
            const now = new Date().getTime();

            if (!savedProgress.timestamp || (now - savedProgress.timestamp > QUIZ_EXPIRY_MS)) {
                // Dữ liệu đã hết hạn
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                savedProgressJSON = null; // Cập nhật lại biến để logic phía sau chạy đúng

                // Nếu người dùng KHÔNG ở trang bắt đầu, chuyển hướng họ về đó
                if (location.pathname !== '/get-started/question/1') {
                    navigate('/get-started/question/1', { replace: true });
                    return; // Dừng thực thi ngay sau khi chuyển hướng
                }
                // Nếu họ ĐÃ ở trang bắt đầu, không làm gì cả, cứ để luồng chạy tiếp xuống dưới
                // như một người dùng mới.
            } else {
                // Nếu dữ liệu hợp lệ, cập nhật lại timestamp để "reset bộ đếm 7 ngày"
                savedProgress.timestamp = now;
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedProgress));
            }
        }

        // --- KỊCH BẢN 1: NGƯỜI DÙNG MỚI (Không thay đổi) ---
        if (!savedProgressJSON) {
            if (pageType === 'question' && questionNumber === 1) {
                setIsAllowed(true);
            } else {
                navigate('/get-started/question/1', { replace: true });
            }
            return;
        }

        // --- KỊCH BẢN 2: NGƯỜI DÙNG ĐÃ CÓ TIẾN TRÌNH ---

        const { savedStep, isCompleted, savedAnswers } = JSON.parse(savedProgressJSON);
        const lastAnsweredStep = savedStep ?? -1;
        const totalQuestions = getTotalQuestions(quizData); // Lấy tổng số câu hỏi
        const nextAvailableQuestionNumber = lastAnsweredStep + 2;

        // THAY ĐỔI: Xác định URL chuyển hướng dự phòng một cách an toàn
        let fallbackUrl;
        if (nextAvailableQuestionNumber > totalQuestions) {
            // Nếu "câu tiếp theo" vượt quá giới hạn, thì URL dự phòng là CÂU CUỐI CÙNG.
            fallbackUrl = `/get-started/question/${totalQuestions}`;
        } else {
            // Nếu không, URL dự phòng là câu tiếp theo như bình thường.
            fallbackUrl = `/get-started/question/${nextAvailableQuestionNumber}`;
        }

        // Nếu bảo vệ trang CÂU HỎI
        if (pageType === 'question') {
            const targetQuestionData = getQuestionData(quizData, questionNumber - 1);

            if (!targetQuestionData) {
                navigate(fallbackUrl, { replace: true });
                return;
            }

            const hasBeenAnswered = savedAnswers && savedAnswers.hasOwnProperty(targetQuestionData.id);
            const isNextQuestion = questionNumber === nextAvailableQuestionNumber;

            if (hasBeenAnswered || isNextQuestion) {
                setIsAllowed(true);
            } else {
                navigate(fallbackUrl, { replace: true });
            }
        }

        // Nếu bảo vệ trang KẾT QUẢ
        if (pageType === 'result') {
            if (!isCompleted) {
                navigate(fallbackUrl, { replace: true });
            } else {
                setIsAllowed(true);
            }
        }

    }, [pageType, questionNumber, quizData]);

    return isAllowed;
};