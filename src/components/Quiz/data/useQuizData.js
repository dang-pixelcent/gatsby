import { graphql, useStaticQuery } from 'gatsby';

export const useQuizData = () => {
    const data = useStaticQuery(graphql`
        query SharedQuizData {
            cms {
                formSnippets {
                    hrtWomenQuiz: scheduleform 
                }
            }
        }
    `);

    return data.cms.formSnippets.hrtWomenQuiz;
};