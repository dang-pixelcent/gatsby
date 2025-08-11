// src/pages/hrt-quiz.js
import React from 'react';
import Layout from '../components/layout';
import Quiz from '../components/Quiz';
import { SEO } from '../components/SEO';
import '../styles/tailwind-scoped.scss';
const HrtQuizPage = () => {
    return (
        <Layout>
            {/* BỌC TOÀN BỘ QUIZ TRONG DIV NÀY */}
            <div className="tailwind-scope">
                <Quiz />
            </div>
        </Layout>
    );
};

export const Head = () => (
    <SEO seoData={`<title>HRT Women's Health Quiz</title>`} />
);

export default HrtQuizPage;