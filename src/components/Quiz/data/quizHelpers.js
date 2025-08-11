// src/data/quiz-helpers.js
import { quizData } from './hrt-women-quiz.js';

// Chuyển đổi cấu trúc section thành một mảng câu hỏi phẳng để dễ xử lý
const allQuestions = quizData.sections.flatMap((section, sectionIndex) =>
    section.questions.map((question, questionIndex) => ({
        ...question,
        sectionId: section.id,
        sectionTitle: section.title,
        sectionIndex,
        questionIndexInSection: questionIndex,
    }))
);

export const getQuestionData = (step) => allQuestions[step];

export const getTotalQuestions = () => allQuestions.length;

// Đây là hàm cốt lõi, tính toán tất cả các thông số cho progress bar
export const getProgressInfo = (currentStep) => {
    const currentQuestion = getQuestionData(currentStep);
    if (!currentQuestion) return null;

    const { sectionIndex, questionIndexInSection } = currentQuestion;
    const totalSections = quizData.sections.length;
    const totalDiamonds = totalSections;

    // Width mặc định của 1 section (25% cho 4 diamonds)
    const sectionWidth = 1 / totalDiamonds; // 0.25 = 25% 

    const questionsPerSection = quizData.sections.map(s => s.questions.length);

    // Tính width cho mỗi câu hỏi trong từng section
    const widthPerQuestionInSection = questionsPerSection.map(questionCount =>
        sectionWidth / questionCount
    );

    let baseProgress = 0; // Bắt đầu từ 25%

    // Cộng dồn width của các section đã hoàn thành
    for (let i = 0; i < sectionIndex; i++) {
        baseProgress += sectionWidth;
    }

    // Tính progress trong section hiện tại
    const progressInCurrentSection = (questionIndexInSection + 1) * widthPerQuestionInSection[sectionIndex];

    // Tổng progress
    const overallProgress = baseProgress + progressInCurrentSection;

    return {
        currentStep,
        totalSteps: getTotalQuestions(),
        currentSectionIndex: sectionIndex,
        totalSections: totalSections,
        overallProgress: overallProgress,
        sectionTitle: currentQuestion.sectionTitle,
    };
};