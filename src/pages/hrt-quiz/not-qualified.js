import React from 'react';
// import Layout from '@components/layout';
import QuizResult from '@components/Quiz/QuizResult';
import { SEO } from '@components/SEO';
import { quizData } from '@components/Quiz/data/hrt-women-quiz';
import '@styles/tailwind-scoped.scss';
import { useQuizGuard } from '@components/Quiz/useQuizGuard'; // Import hook

const NotQualifiedResultPage = () => {
    // Sử dụng "người gác cổng"
    const isAllowed = useQuizGuard({ pageType: 'result' });
    const finalPageData = quizData.finalPages['not-qualified'];

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

export const Head = () => (
    <SEO seoData={`<title>Quiz Results: Not Qualified | HRT Women's Health Quiz</title>`} />
);

export default NotQualifiedResultPage;