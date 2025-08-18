import { GraphQLClient, gql } from 'graphql-request';

// Lấy URL của GraphQL endpoint từ biến môi trường
const endpoint = process.env.REACT_APP_WPGRAPHQL_URL;

// Tạo một GraphQL client
const client = new GraphQLClient(endpoint);

// Định nghĩa mutation GraphQL mà bạn đã cung cấp
const SUBMIT_FORM_MUTATION = gql`
  mutation Submit($input: SubmitScheduleFormInput!) {
    submitScheduleForm(input: $input) {
      success
      submissionId
      qualified
      finalPage
      score
      errors
      answersById
    }
  }
`;

/**
 * Chuyển đổi định dạng câu trả lời từ { questionId: "answer text" }
 * sang định dạng API yêu cầu: { questionId: { answers: [{ label: "...", value: "..."}] } }
 * @param {object} answers - Đối tượng câu trả lời từ state của Quiz.
 * @returns {object} - Đối tượng đã được chuyển đổi.
 */
const transformAnswersForApi = (answers) => {
    const transformed = {};
    for (const questionId in answers) {
        const answerText = answers[questionId];
        // API yêu cầu một định dạng cụ thể, chúng ta tạo nó ở đây.
        // Hiện tại, label và value có thể giống nhau.
        transformed[questionId] = {
            answers: [{ label: answerText, value: answerText }]
        };
    }
    // Bổ sung trường state để testing
    transformed.state = {
        answers: [{ label: "Allowed", value: "Allowed" }]
    };
    return transformed;
};


/**
 * Gửi dữ liệu quiz đến backend.
 * @param {object} answers - Đối tượng chứa các câu trả lời của người dùng.
 * @returns {Promise<object>} - Promise chứa dữ liệu trả về từ server.
 */
export const submitQuizAnswers = async (answers) => {
    const answersById = transformAnswersForApi(answers);

    // Dữ liệu liên hệ mẫu. Sau này bạn sẽ lấy từ một form khác.
    const contactInfo = {
        name: "Quiz Taker",
        email: "user@example.com"
    };

    const variables = {
        input: {
            formKey: "schedule_form", // Giống như trong ví dụ của bạn
            answersById: answersById,
            // API yêu cầu contact là một chuỗi JSON
            contact: JSON.stringify(contactInfo)
        }
    };

    try {
        console.log("🚀 Sending GraphQL Mutation with variables:", variables);
        const data = await client.request(SUBMIT_FORM_MUTATION, variables);
        console.log("✅ GraphQL Mutation Success:", data);
        return data.submitScheduleForm;
    } catch (error) {
        console.error("❌ GraphQL Mutation Failed:", error);
        // Ném lỗi để component có thể bắt và xử lý
        throw error;
    }
};