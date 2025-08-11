// src/components/Quiz/QuizResult.js
import React from 'react';
import { motion } from 'framer-motion';

const QuizResult = ({ finalPageData }) => {
    return (
        <motion.div
            className="flex flex-col items-center text-center pt-4xl px-page"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl md:text-5xl text-neutral font-medium whitespace-pre-line">
                {finalPageData.headline}
            </h1>
            <p className="text-lg text-neutral-faded mt-4 max-w-xl">
                {finalPageData.message}
            </p>
            <button className="animate-glowing-border button-root rounded-full capitalize gap-s hover:bg-primary-highlighted bg-primary text-onprimary shadow-raised text-center px-l py-[calc(1em*0.9)] mt-8">
                {finalPageData.ctaButton}
            </button>
        </motion.div>
    );
};

export default QuizResult;