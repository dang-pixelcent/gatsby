// src/components/Blocks/LazyPracticeFlowForm.js

import React from 'react';
import { navigate } from 'gatsby';
import Quiz from '@components/Quiz';
import { trackQuizStarted, trackQuestionAnswered } from '@src/utils/tracking'; // ✅ Import helper
import { getQuestionData } from '@components/Quiz/data/quizHelpers'; // ✅ Import helper
import '@styles/tailwind-scoped.scss';

const LOCAL_STORAGE_KEY = 'hrt_quiz_progress';

// Component này giờ sẽ render ngay lập tức, không còn "lazy" nữa.
const PracticeFlowForm = () => {

    // Hàm này được gọi khi người dùng nhấn "Next" trên câu hỏi đầu tiên của quiz
    const handleQuizStart = (answers) => {
        // 1. Tạo đối tượng tiến trình ban đầu
        const initialProgress = {
            savedAnswers: answers,
            savedStep: 0, // Bắt đầu từ câu hỏi đầu tiên (index 0)
            isCompleted: false,
        };

        // 2. Lưu vào localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProgress));

        // GỬI SỰ KIỆN TRACKING
        const firstQuestion = getQuestionData(0); // Lấy dữ liệu câu hỏi đầu tiên
        trackQuizStarted();
        trackQuestionAnswered(firstQuestion, answers[firstQuestion.id], 1);

        // 3. Chuyển hướng người dùng đến câu hỏi số 2 trong giao diện quiz đầy đủ
        navigate('/hrt-quiz/question/2');
    };

    // Trả về trực tiếp giao diện Quiz mà không cần chờ đợi
    return (
        <div class="col-item col-right-custom" id="scheduleform">
            <div className="tailwind-scope">
                <div className="w-full">
                    {/* Thẻ div này sẽ giới hạn chiều rộng, làm cho quiz trông giống như trên điện thoại */}
                    <div className="shadow-2xl rounded-2xl overflow-hidden border-4 border-neutral">
                        <Quiz
                            mode="embedded"
                            onEmbeddedNext={handleQuizStart}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeFlowForm;