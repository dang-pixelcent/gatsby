// src/components/Quiz/Question.js
import React from 'react';
import { RadioGroup } from '@headlessui/react';
import { motion } from 'framer-motion';
import { CheckIcon } from './icons/CheckIcon';

const Question = ({ data, onAnswer, currentAnswer, onNext, direction }) => {
    if (!data) return null;

    const { id, question, type, options } = data;
    // const isAnswered = currentAnswer !== undefined;

    return (
        <motion.div
            key={id}
            className="flex flex-col gap-l"
            custom={direction}
            variants={{
                enter: (direction) => ({ opacity: 0, x: direction > 0 ? 50 : -50 }),
                center: { opacity: 1, x: 0 },
                exit: (direction) => ({ opacity: 0, x: direction < 0 ? 50 : -50 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
        >
            <div>
                <h1 className="text-[calc(var(--size-xl)_*_var(--quiz-scale))] text-neutral mt-s">{question}</h1>

                {type === 'radio' && (
                    <RadioGroup value={currentAnswer} onChange={(value) => onAnswer(id, value)} className="mt-xl">
                        <RadioGroup.Label className="sr-only">{question}</RadioGroup.Label>
                        <div className="column gap-[calc(var(--space-m)_*_var(--quiz-scale))] mt-xl text-l select-none">
                            {options.map((option) => (
                                <RadioGroup.Option key={option} value={option}
                                    className={({ checked }) =>
                                        ` ${checked ? 'bg-primary border-primary' : 'bg-transparent border-neutral'} 
                                    border-2 rounded-base group relative flex cursor-pointer px-[calc(var(--space-m)_*_var(--quiz-scale))] py-[calc(var(--space-m)_*_var(--quiz-scale-60))] shadow-raised sm:hover:bg-primary-highlighted focus:outline-none`
                                    }
                                >
                                    {({ checked }) => (
                                        <span className="flex flex-1 items-center gap-[calc(var(--space-m)_*_var(--quiz-scale))]">
                                            <div className={`${checked ? 'bg-[#fff]' : 'border border-black'} flex h-[calc(var(--space-l)_*_var(--quiz-scale))] w-[calc(var(--space-l)_*_var(--quiz-scale))] shrink-0 items-center group-hover:border-[#fff] justify-center rounded-full overflow-hidden`}>
                                                {checked && <span className="flex justify-center aspect-square" style={{ width: '100%', height: '100%', backgroundColor: 'rgba(var(--color-background-primary))', color: 'var(--color-on-background-primary)' }}>
                                                    <CheckIcon />
                                                </span>}
                                            </div>
                                            {/* <RadioGroup.Label as="span" className={`${checked ? 'text-on-primary' : 'text-on-neutral'} row items-center gap-m font-semibold text-l`}>
                                                {option}
                                            </RadioGroup.Label> */}
                                            <RadioGroup.Label as="span" className="row items-center gap-m font-semibold text-[calc(var(--size-l)_*_var(--quiz-scale))]">
                                                <div className={`${checked ? 'sm:group-hover:text-onprimary text-onprimary' : 'sm:group-hover:text-onprimary text-onneutral'}`}>
                                                    <div>{option}</div>
                                                    <div className="text-m"></div>
                                                </div>
                                            </RadioGroup.Label>
                                        </span>
                                    )}
                                </RadioGroup.Option>
                            ))}
                        </div>
                    </RadioGroup>
                )}
            </div>

            <button
                onClick={onNext}
                // disabled={!isAnswered}
                className="button-root rounded-full capitalize gap-s bg-primary sm:hover:bg-primary-highlighted text-onprimary w-auto text-left px-l py-[calc(1em*0.9)] min-w-[250px] self-end"
            >
                Next
                <div className="inline-c-c flex-shrink-0 absolute bottom-0 w-full left-0" bis_skin_checked="1">
                    <span role="progressbar" aria-label="action is loading" className="animate-glowing-border" style={{ '--loader-size': 'var(--size-l)', '--loader-stroke': 'calc(var(--size-l)*0.25)' }}>
                    </span>
                </div>
            </button>

        </motion.div>
    );
};

export default Question;