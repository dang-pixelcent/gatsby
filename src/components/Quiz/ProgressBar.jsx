// src/components/Quiz/ProgressBar.js
import React from 'react';
import { ArrowLeft } from './icons/ArrowLeft';
import { DiamondIcon } from './icons/DiamondIcon';

const ProgressBar = ({ onBack, progressInfo }) => {
    const { currentStep, totalSteps, overallProgress, sectionTitle, totalSections } = progressInfo;

    const totalDiamonds = totalSections; // 4 diamonds for 3 sections
    
    const renderDiamonds = () => {
        const diamonds = [];
        
        for (let i = 0; i < totalDiamonds; i++) {
            // Diamond thresholds: 0.25, 0.5, 0.75, 1.0
            const diamondThreshold = (i + 1) / totalDiamonds;
            const isCompleted = overallProgress >= diamondThreshold;
            const isCurrent = !isCompleted && overallProgress > (i / totalDiamonds);
            
            diamonds.push(
                <span
                    key={i}
                    aria-hidden="true"
                    className="flex justify-center items-center aspect-square"
                    style={{
                        width: 'calc(var(--space-s) * var(--quiz-scale))',
                        height: 'calc(var(--space-s) * var(--quiz-scale))',
                        padding: 'calc(var(--space-s) * var(--quiz-scale) / 6)',
                        backgroundColor: 'inherit',
                        color: 'inherit'
                    }}
                >
                    <DiamondIcon />
                </span>
            );
        }
        return diamonds;
    };

    return (
        <>
            <div className="relative flex w-full text-neutral-faded text-[calc(0.875rem_*_var(--quiz-scale))] font-sans tracking-wider uppercase items-center justify-between pb-2">
                {currentStep > 0 ? (
                    <button onClick={onBack} className="button-root rounded-full capitalize gap-s hover: bg-transparent text-[#F2FCFE] inline-flex items-center gap-[calc(1em/3.5)] w-auto text-left px-[calc(var(--space-l)_*_var(--quiz-scale))] py-[calc(1em*0.9)] pl-0 shadow-none">
                        <span className="flex justify-center aspect-square" style={{ width: 'calc(var(--space-l) * var(--quiz-scale))', height: 'calc(var(--space-l) * var(--quiz-scale))', padding: 'calc(var(--space-l) * var(--quiz-scale) / 6)', backgroundColor: 'inherit', color: 'inherit' }}>
                            <ArrowLeft />
                        </span>
                        Back.25, 0.5, 0.75, 1.0
            const diamondThreshold = (i + 1) / totalDiamonds;
            const isCompleted = overallProgress >= diamondThreshold;
            const isCurrent = !isCompleted && overallProgress > (i / totalDiamonds);
            
            diamonds.push(
                <span
                    key={i}
                    aria-hidden="true"
                    className="flex justify-center items-center aspect-square"
                    style={{
                        width: 'calc(var(--space-s) * var(--quiz-scale))',
                        height: 'calc(var(--space-s) * var(--quiz-scale))',
                        padding: 'calc(var(--space-s) * var(--quiz-scale) / 6)',
                        backgroundColor: 'inherit',
                        color: 'inherit'
                    }}
                >
                    <DiamondIcon />
                </span>
            );
        }
        return diamonds;
    };

    return (
        <>
            <div className="relative flex w-full text-neutral-faded text-[calc(0.875rem_*_var(--quiz-scale))] font-sans tracking-wider uppercase items-center justify-between pb-2">
                {currentStep > 0 ? (
                    <button onClick={onBack} className="button-root rounded-full capitalize gap-s hover: bg-transparent text-[#F2FCFE] inline-flex items-center gap-[calc(1em/3.5)] w-auto text-left px-[calc(var(--space-l)_*_var(--quiz-scale))] py-[calc(1em*0.9)] pl-0 shadow-none">
                        <span className="flex justify-center aspect-square" style={{ width: 'calc(var(--space-l) * var(--quiz-scale))', height: 'calc(var(--space-l) * var(--quiz-scale))', padding: 'calc(var(--space-l) * var(--quiz-scale) / 6)', backgroundColor: 'inherit', color: 'inherit' }}>
                            <ArrowLeft />
                        </span>
                        Back
                    </button>
                ) : <button onClick={onBack} className="button-root rounded-full capitalize gap-s hover: bg-transparent text-[#F2FCFE] inline-flex items-center gap-[calc(1em/3.5)] w-auto text-left px-[calc(var(--space-l)_*_var(--quiz-scale))] py-[calc(1em*0.9)] pl-0 shadow-none" style={{ cursor: 'default' }}>
                    <span className="flex justify-center aspect-square" style={{ width: 'calc(var(--space-l) * var(--quiz-scale))', height: 'calc(var(--space-l) * var(--quiz-scale))', padding: 'calc(var(--space-l) * var(--quiz-scale) / 6)', backgroundColor: 'inherit', color: 'inherit' }}>
                    </span>
                </button>}

                <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-semibold text-neutral text-center">
                    {sectionTitle}
                </span>
                <span className="font-semibold text-neutral">{currentStep + 1} / {totalSteps}</span>
            </div>

            <div className="relative mb-[calc(var(--space-l)_*_var(--quiz-scale))] flex h-[calc(var(--space-s)_*_var(--quiz-scale))] w-full justify-between rounded-full overflow-hidden bg-neutral-faded">
                <div
                    className="absolute h-[calc(var(--space-s)_*_var(--quiz-scale))] rounded-xl bg-primary bg-opacity-50"
                    style={{ width: `${overallProgress * 100}%`, transition: 'width 0.5s ease-in-out' }}
                ></div>
                <div></div>
                {renderDiamonds()}
            </div>
        </>
    );
};

export default ProgressBar;