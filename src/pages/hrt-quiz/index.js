import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import Layout from '@components/layout';
import { SEO } from '@components/SEO';

const LOCAL_STORAGE_KEY = 'hrt_quiz_progress';

const HrtQuizRedirectPage = () => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
            let lastQuestionNumber = 1;

            // if (savedProgress) {
            //     const { savedStep, isCompleted, resultStatus } = JSON.parse(savedProgress);

            //     // ƯU TIÊN 1: Nếu đã hoàn thành, chuyển đến trang kết quả
            //     if (isCompleted && resultStatus) {
            //         navigate(`/hrt-quiz/${resultStatus}`, { replace: true });
            //         return; // Dừng thực thi
            //     }

            //     // ƯU TIÊN 2: Nếu chưa hoàn thành, chuyển đến câu hỏi cuối cùng
            //     if (typeof savedStep === 'number' && savedStep >= 0) {
            //         lastQuestionNumber = savedStep + 1;
            //     }
            // }
            // Mặc định: Chuyển đến câu hỏi
            navigate(`/hrt-quiz/question/${lastQuestionNumber}`, { replace: true });
        }
    }, []);

    return (
        <Layout>
            <div className="tailwind-scope bg-page flex min-h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    <p className="mt-4 text-lg">Loading your quiz...</p>
                </div>
            </div>
        </Layout>
    );
};

export const Head = () => (
    <SEO seoData={`<title>HRT Women's Health Quiz</title>`} />
);

export default HrtQuizRedirectPage;