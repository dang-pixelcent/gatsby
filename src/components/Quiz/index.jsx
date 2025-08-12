// src/components/Quiz/index.js
import React, { useState, useEffect, useMemo } from 'react';
import { quizData } from './data/hrt-women-quiz.js';
// import { quizHelpers } from '../../data/quizHelpers.js';
import ProgressBar from './ProgressBar.jsx';
import Question from './Question.jsx';
import QuizResult from './QuizResult.jsx'; // Sẽ tạo ở bước cuối
import { AnimatePresence } from 'framer-motion';
import { getQuestionData, getTotalQuestions, getProgressInfo } from './data/quizHelpers.js';
// IMPORT CSS CHỈ CHO COMPONENT NÀY
// import '../../styles/tailwind.css';

const LOCAL_STORAGE_KEY = 'hrt_quiz_progress';

const Quiz = () => {
    // const allQuestions = quizHelpers.getAllQuestions();
    // console.log('All Questions:', allQuestions);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedProgress) {
            const { savedAnswers, savedStep } = JSON.parse(savedProgress);
            if (savedAnswers && typeof savedStep === 'number') {
                setAnswers(savedAnswers);
                setCurrentStep(savedStep);
            }
        }
    }, []);

    useEffect(() => {
        if (Object.keys(answers).length > 0) {
            const progress = { savedAnswers: answers, savedStep: currentStep };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
        }
    }, [answers, currentStep]);

    const handleAnswer = (questionId, answerValue) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerValue }));
    };

    const handleNext = () => {
        if (currentStep < getTotalQuestions() - 1) {
            setDirection(1);
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => setIsCompleted(true);

    // const currentQuestionData = allQuestions[currentStep];
    // const progressInfo = quizHelpers.getProgressInfo(currentStep);

    // Tính toán thông tin tiến trình bằng helper
    const progressInfo = useMemo(() => getProgressInfo(currentStep), [currentStep]);
    const currentQuestionData = useMemo(() => getQuestionData(currentStep), [currentStep]);

    if (!progressInfo || !currentQuestionData) return null;

    if (isCompleted) {
        return <QuizResult finalPageData={quizData.finalPage} />;
    }


    return (
        <div
            className="flex flex-col bg-page"
            style={{ textRendering: 'optimizeSpeed' }}
        >
            <main>
                <section className="pt-s">
                   <div className="@container/quiz container mx-auto flex flex-col px-4 "
                        style={{
                            maxWidth: 'calc(var(--container-s) * var(--quiz-scale-90))'
                        }}
                    >
                        <ProgressBar
                            progressInfo={progressInfo}
                            onBack={handlePrev}
                        />

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