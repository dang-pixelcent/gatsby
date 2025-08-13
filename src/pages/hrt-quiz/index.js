import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
// import Layout from '@components/layout';
import '@styles/tailwind-scoped.scss';
import { SEO } from '@components/SEO';
import Quiz from '@components/Quiz';

const LOCAL_STORAGE_KEY = 'hrt_quiz_progress';

const HrtQuizRedirectPage = () => {

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         // const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
    //         let lastQuestionNumber = 1;

    //         // if (savedProgress) {
    //         //     const { savedStep, isCompleted, resultStatus } = JSON.parse(savedProgress);

    //         //     // ƯU TIÊN 1: Nếu đã hoàn thành, chuyển đến trang kết quả
    //         //     if (isCompleted && resultStatus) {
    //         //         navigate(`/hrt-quiz/${resultStatus}`, { replace: true });
    //         //         return; // Dừng thực thi
    //         //     }

    //         //     // ƯU TIÊN 2: Nếu chưa hoàn thành, chuyển đến câu hỏi cuối cùng
    //         //     if (typeof savedStep === 'number' && savedStep >= 0) {
    //         //         lastQuestionNumber = savedStep + 1;
    //         //     }
    //         // }
    //         // Mặc định: Chuyển đến câu hỏi
    //         navigate(`/hrt-quiz/question/${lastQuestionNumber}`, { replace: true });
    //     }
    // }, []);

    // Hàm này được gọi khi người dùng nhấn "Next" trên quiz nhúng
    const handleQuizStart = (answers) => {
        // 1. Tạo đối tượng tiến trình ban đầu
        const initialProgress = {
            savedAnswers: answers,
            savedStep: 0, // Vì đây là câu hỏi đầu tiên (index 0)
            isCompleted: false,
        };

        // 2. Lưu vào localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProgress));

        // 3. Chuyển hướng người dùng đến câu hỏi số 2 trong giao diện đầy đủ
        navigate('/hrt-quiz/question/2');
    };

    return (
        <div className="tailwind-scope">
            {/* Layout chung của trang Get Started */}
            <div className="container mx-auto py-8 px-4 grid md:grid-cols-2 gap-xl items-center">

                {/* Cột nội dung bên trái */}
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold">Your Health Journey Starts Here</h1>
                    <p className="text-lg mt-4 max-w-md mx-auto md:mx-0">
                        Answer a few simple questions to get a personalized insight into your hormonal health. It only takes a minute.
                    </p>
                </div>

                {/* Cột chứa Quiz Preview bên phải */}
                <div className="w-full">
                    {/* Thẻ div này sẽ giới hạn chiều rộng, làm cho quiz trông giống như trên điện thoại */}
                    <div className="shadow-2xl rounded-2xl overflow-hidden border-4 border-neutral">
                        <Quiz
                            mode="embedded"
                            onEmbeddedNext={handleQuizStart}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Head = () => (
    <SEO seoData={`<title>HRT Women's Health Quiz</title>`} />
);

export default HrtQuizRedirectPage;