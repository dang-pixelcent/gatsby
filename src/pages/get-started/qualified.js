import React from 'react';
// import Layout from '@components/layout';
import QuizResult from '@components/Quiz/QuizResult';
import { SEO } from '@components/SEO';
// import { quizData } from '@components/Quiz/data/hrt-women-quiz';
import '@styles/tailwind-scoped.scss';
import { useQuizGuard } from '@components/Quiz/useQuizGuard'; // Import hook
import { useQuizData } from '@components/Quiz/data/useQuizData';
import ChatWidget from "@components/ChatWidget"

// flag Kiểm soát truy cập page
const isNewFormEnabled = process.env.FEATURE_NEW_FORM === "true";

const QualifiedResultPage = () => {
    const isAllowed = useQuizGuard({ pageType: 'result' });
    const quizData = useQuizData();
    const finalPageData = quizData?.finalpages?.qualified;

    // Kiểm tra tính năng mới
    if (!isNewFormEnabled) {
        if (typeof window !== "undefined") {
            window.location.replace("/");
        }
        return null;
    }

    if (!isAllowed) {
        // Có thể trả về một spinner loading để trải nghiệm mượt hơn
        return (
            <div className="tailwind-scope bg-page flex min-h-[50vh] items-center justify-center">
                {/* <div className="flex flex-col items-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    <p className="mt-4 text-lg">Loading your quiz...</p>
                </div> */}
            </div>
        );
    }

    return (
        <div className="tailwind-scope">
            <QuizResult finalPageData={finalPageData} />
            <ChatWidget />
        </div>
    );
};

export const Head = () => {
    const quizData = useQuizData();
    return (
        <SEO seoData={`<title>Quiz Results: Qualified | ${quizData?.heading || "HRT Women's Health Quiz"}</title>`} />
    );
};

export default QualifiedResultPage;