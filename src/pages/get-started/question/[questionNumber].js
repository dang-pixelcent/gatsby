import React from 'react';
// import Layout from '@components/layout';
import Quiz from '@components/Quiz';
import { SEO } from '@components/SEO';
import '@styles/tailwind-scoped.scss';
import { useQuizGuard } from '@components/Quiz/useQuizGuard'; // Import hook
import { useQuizData } from '@components/Quiz/data/useQuizData';
import ChatWidget from "@components/ChatWidget"

// flag Kiểm soát truy cập page
const isNewFormEnabled = process.env.FEATURE_NEW_FORM === "true";

// Gatsby sẽ tự động truyền các tham số từ URL vào props
const HrtQuizQuestionPage = ({ params }) => {
    // Lấy số thứ tự câu hỏi từ URL và chuyển thành số nguyên
    const questionNumber = parseInt(params.questionNumber, 10);

    // Sử dụng "người gác cổng"
    const isAllowed = useQuizGuard({ pageType: 'question', questionNumber });
    // Kiểm tra tính năng mới
    if (!isNewFormEnabled) {
        if (typeof window !== "undefined") {
            window.location.replace("/");
        }
        return null;
    }

    // Nếu questionNumber không phải là một số hợp lệ, không render gì cả
    if (isNaN(questionNumber)) {
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
        <>
            <div className="tailwind-scope">
                {/* Truyền questionNumber vào component Quiz */}
                <Quiz mode="full" questionNumber={questionNumber} />
                {/* <ChatWidget /> */}
            </div>

        </>
    );
};

export const Head = ({ params }) => {
    const quizData = useQuizData();
    return (
        <SEO seoData={`<title>Question ${params.questionNumber} | ${quizData?.heading || "HRT Women's Health Quiz"}</title>`} />
    );
};

export default HrtQuizQuestionPage;