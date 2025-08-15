import React from 'react';
// import Layout from '@components/layout';
import QuizResult from '@components/Quiz/QuizResult';
import { SEO } from '@components/SEO';
// import { quizData } from '@components/Quiz/data/hrt-women-quiz';
import '@styles/tailwind-scoped.scss';
import { useQuizGuard } from '@components/Quiz/useQuizGuard'; // Import hook
import { useQuizData } from '@components/Quiz/data/useQuizData';

const QualifiedResultPage = () => {
    // Sử dụng "người gác cổng"
    const isAllowed = useQuizGuard({ pageType: 'result' });
    const finalPageData = useQuizData().finalpages.qualified;

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