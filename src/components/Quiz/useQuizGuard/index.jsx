import { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
// THÊM: Import cả getTotalQuestions
import { getQuestionData, getTotalQuestions } from '../data/quizHelpers';
import { useQuizData } from '../data/useQuizData';

const LOCAL_STORAGE_KEY = 'hrt_quiz_progress';

export const useQuizGuard = ({ pageType, questionNumber }) => {
    const [isAllowed, setIsAllowed] = useState(false);
    const quizData = useQuizData();

    useEffect(() => {
        if (typeof window === 'undefined' || !quizData) return;

        const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);

        // --- KỊCH BẢN 1: NGƯỜI DÙNG MỚI (Không thay đổi) ---
        if (!savedProgress) {
            if (pageType === 'question' && questionNumber === 1) {
                setIsAllowed(true);
            } else {
                navigate('/hrt-quiz/question/1', { replace: true });
            }
            return;
        }

        // --- KỊCH BẢN 2: NGƯỜI DÙNG ĐÃ CÓ TIẾN TRÌNH ---
        const { savedStep, isCompleted, savedAnswers } = JSON.parse(savedProgress);
        const lastAnsweredStep = savedStep ?? -1;
        const totalQuestions = getTotalQuestions(quizData); // Lấy tổng số câu hỏi
        const nextAvailableQuestionNumber = lastAnsweredStep + 2;

        // THAY ĐỔI: Xác định URL chuyển hướng dự phòng một cách an toàn
        let fallbackUrl;
        if (nextAvailableQuestionNumber > totalQuestions) {
            // Nếu "câu tiếp theo" vượt quá giới hạn, thì URL dự phòng là CÂU CUỐI CÙNG.
            fallbackUrl = `/hrt-quiz/question/${totalQuestions}`;
        } else {
            // Nếu không, URL dự phòng là câu tiếp theo như bình thường.
            fallbackUrl = `/hrt-quiz/question/${nextAvailableQuestionNumber}`;
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