// src/components/Quiz/index.js
import React, { useState, useEffect, useMemo } from 'react';
import { quizData } from './data/hrt-women-quiz.js';
// import { quizHelpers } from '../../data/quizHelpers.js';
import ProgressBar from './ProgressBar.jsx';
import Question from './Question.jsx';
// import QuizResult from './QuizResult.jsx'; // Sẽ tạo ở bước cuối
import { AnimatePresence } from 'framer-motion';
import { getQuestionData, getTotalQuestions, getProgressInfo, calculateResult } from './data/quizHelpers.js';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
// IMPORT CSS CHỈ CHO COMPONENT NÀY
// import '../../styles/tailwind.css';
import { graphql, useStaticQuery, navigate } from 'gatsby'; // Import navigate của Gatsby
import toast from 'react-hot-toast';

const LOCAL_STORAGE_KEY = 'hrt_quiz_progress';

const Quiz = ({ mode = 'full', questionNumber, onEmbeddedNext }) => {
    const data = useStaticQuery(graphql`
        query {
            logoImage: file(relativePath: { eq: "logo/logo-head.png" }) {
                childImageSharp {
                    gatsbyImageData(
                        width: 250
                        placeholder: BLURRED
                        formats: [AUTO, WEBP]
                        quality: 90
                    )
                }
            }
        }
    `);

    const logo = getImage(data.logoImage);

    // Nếu là mode 'embedded', luôn bắt đầu từ câu 1. Nếu không, lấy từ prop.
    const currentStep = mode === 'embedded' ? 0 : questionNumber - 1;
    // const [currentStep, setCurrentStep] = useState(initialStep);

    const [answers, setAnswers] = useState({});
    // const [isCompleted, setIsCompleted] = useState(false);
    const [direction, setDirection] = useState(1);

    const currentQuestionData = useMemo(() => getQuestionData(currentStep), [currentStep]);

    useEffect(() => {
        const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedProgress) {
            const { savedAnswers } = JSON.parse(savedProgress);
            if (savedAnswers) {
                setAnswers(savedAnswers);
                // setCurrentStep(savedStep);
            }
        }
    }, []);

    // useEffect(() => {
    //     if (Object.keys(answers).length > 0 || currentStep > 0) {
    //         const progress = { savedAnswers: answers, savedStep: currentStep };
    //         localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    //     }
    // }, [answers, currentStep]);

    // useEffect(() => {
    //     const progress = {
    //         savedAnswers: answers,
    //         savedStep: currentStep,
    //         isCompleted: isCompleted,
    //         // Chỉ lưu resultStatus khi đã hoàn thành
    //         resultStatus: isCompleted ? calculateResult(answers) : null
    //     };
    //     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    // }, [answers, currentStep, isCompleted]);

    // Cập nhật câu trả lời và LƯU TIẾN TRÌNH ngay lập tức
    const handleAnswer = (questionId, answerValue) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerValue }));
    };


    const handleNext = () => {
        // Kiểm tra xem câu hỏi hiện tại đã được trả lời chưa
        if (answers[currentQuestionData.id] === undefined) {
            // Nếu chưa, hiển thị thông báo lỗi và dừng lại
            toast.error('Please select an answer to continue.');
            return;
        }


        // Logic cho chế độ 'embedded'
        if (mode === 'embedded') {
            // Nếu là câu hỏi đầu tiên, gọi callback để trang cha xử lý
            if (currentStep === 0) {
                onEmbeddedNext(answers);
                return;
            }
        }

        /** Logic chế độ full */
        // 1. Tạo đối tượng tiến trình mới
        const progress = {
            savedAnswers: answers,
            savedStep: currentStep, // `currentStep` là bước của câu hỏi vừa hoàn thành
            isCompleted: false,
        };

        // 2. Lưu vào localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));

        const totalQuestions = getTotalQuestions();
        if (currentStep < totalQuestions - 1) {
            setDirection(1);
            // setCurrentStep(currentStep + 1);
            navigate(`/hrt-quiz/question/${questionNumber + 1}`);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setDirection(-1);
            // setCurrentStep(currentStep - 1);
            navigate(`/hrt-quiz/question/${questionNumber - 1}`);
        }
    };

    const handleSubmit = () => {
        const resultStatus = calculateResult(answers);
        const finalProgress = {
            savedAnswers: answers,
            savedStep: currentStep,
            isCompleted: true,
            resultStatus: resultStatus
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalProgress));

        // Điều hướng đến trang kết quả tương ứng
        navigate(`/hrt-quiz/${resultStatus}`);
    };

    // const currentQuestionData = allQuestions[currentStep];
    // const progressInfo = quizHelpers.getProgressInfo(currentStep);

    // Tính toán thông tin tiến trình bằng helper
    const progressInfo = useMemo(() => getProgressInfo(currentStep), [currentStep]);

    if (!progressInfo || !currentQuestionData) return null;

    // // Xử lý trường hợp URL không hợp lệ (ví dụ: /question/99)
    // if (!currentQuestionData && !isCompleted) {
    //     // Nếu ở phía client, chuyển hướng về trang quiz chính để logic điều hướng xử lý
    //     if (typeof window !== 'undefined') {
    //         const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
    //         if (savedProgress) {
    //             const { savedStep } = JSON.parse(savedProgress);
    //             // `savedStep` là 0-based, `questionNumber` là 1-based
    //             const lastQuestionNumber = savedStep + 1;
    //             navigate(`/hrt-quiz/question/${lastQuestionNumber}`, { replace: true });
    //         } else {
    //             // Nếu không có tiến trình đã lưu, quay về trang bắt đầu quiz
    //             navigate('/hrt-quiz/', { replace: true });
    //         }
    //     }
    //     return null; // Không render gì trong khi chờ chuyển hướng
    // }

    // if (isCompleted) {
    //     return <QuizResult finalPageData={quizData.finalPage} />;
    // }


    return (
        <div
            className={`form-body`}
            style={mode === 'embedded' ? { minHeight: 'unset' } : {}}
        >
            {mode === 'full' && (
                <header className="flex-v-c text-neutral border-b-2 border-b-neutral-faded">
                    <GatsbyImage
                        objectFit='contain'
                        image={logo}
                        alt="Wellness Clinic Marketing"
                        className="w-auto h-2xl my-xs"
                    />
                </header>
            )}
            <main>
                <section className="pt-s">
                    <div className="@container/quiz container mx-auto flex flex-col px-4 "
                        style={{
                            maxWidth: 'calc(var(--container-s) * var(--quiz-scale-90))'
                        }}
                    >
                        {mode === 'full' && (
                            <ProgressBar
                                progressInfo={progressInfo}
                                onBack={handlePrev}
                            />
                        )}

                        <AnimatePresence mode="wait">
                            <Question
                                key={currentStep}
                                direction={direction}
                                data={currentQuestionData}
                                onAnswer={handleAnswer}
                                currentAnswer={answers[currentQuestionData.id]}
                                onNext={handleNext}
                            />
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Quiz;