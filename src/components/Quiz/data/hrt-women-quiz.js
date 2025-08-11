// src/data/hrt-women-quiz.js

export const quizData = {
    title: "HRT Women's Health Quiz",
    sections: [
        {
            id: 'section1',
            title: 'Symptom Awareness',
            description: 'Understanding your current symptoms',
            questions: [
                {
                    id: 'fatigue_frequency',
                    question: "How often do you experience fatigue, even after a full night's sleep?",
                    type: 'radio',
                    options: ['Almost every day', 'A few times a week', 'Rarely', 'Never']
                },
                {
                    id: 'mood_changes',
                    question: "Have you noticed recent changes in your mood (e.g., increased anxiety, irritability, or sadness)?",
                    type: 'radio',
                    options: ["Yes, it's been noticeable", 'Sometimes', 'Not really', 'Not at all']
                },
                {
                    id: 'hot_flashes',
                    question: "Do you experience hot flashes or night sweats?",
                    type: 'radio',
                    options: ['Frequently', 'Occasionally', 'Rarely', 'Never']
                },
                {
                    id: 'sex_drive_change',
                    question: "How would you rate your current sex drive compared to a few years ago?",
                    type: 'radio',
                    options: ['Much lower', 'Slightly lower', 'About the same', 'Higher']
                }
            ]
        },
        {
            id: 'section2',
            title: 'Physical or Cognitive Changes',
            description: 'Changes in your body and mind',
            questions: [
                {
                    id: 'weight_gain',
                    question: "Have you gained weight (especially around the belly) without major changes to diet or exercise?",
                    type: 'radio',
                    options: ['Yes', 'A little', 'No']
                },
                {
                    id: 'brain_fog',
                    question: "Are you noticing brain fog, forgetfulness, or difficulty concentrating?",
                    type: 'radio',
                    options: ['Yes, frequently', 'Occasionally', 'Rarely', 'Not at all']
                },
                {
                    id: 'period_changes',
                    question: "Are you having irregular or missed periods (if applicable)?",
                    type: 'radio',
                    options: ['Yes', 'Sometimes', 'No', "I've already reached menopause"]
                }
            ]
        },
        {
            id: 'section3',
            title: 'Lifestyle Impact',
            description: 'How symptoms affect your daily life',
            questions: [
                {
                    id: 'life_quality_impact',
                    question: "How much are these symptoms affecting your quality of life?",
                    type: 'radio',
                    options: ['A lot I want help now', 'Somewhat', 'Not much', 'Not at all']
                },
                {
                    id: 'doctor_discussion',
                    question: "Have you ever discussed hormone health with a doctor or specialist before?",
                    type: 'radio',
                    options: ["Yes, but didn't get answers", 'Yes, currently under care', 'No, never', "I've tried to, but gave up"]
                },
                {
                    id: 'open_to_specialist',
                    question: "Would you be open to speaking with a specialist about how to rebalance your hormones and feel better?",
                    type: 'radio',
                    options: ["Yes, I'd like to learn more", 'Maybe I have questions', 'Not right now']
                }
            ]
        }
    ],
    finalPage: {
        headline: "Based on your answers, you may be experiencing\n symptoms of hormonal imbalance.",
        message: "Our specialists can help you uncover the root cause and build a plan that works for your body.",
        ctaButton: "BOOK MY CONSULTATION"
    }
};
