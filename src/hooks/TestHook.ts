import { useEffect, useState } from 'react';
import { callGetTestPaper } from '../api/api';
import { MappingPageWithQuestionNum } from '../utils/convertToHTML';
import { MultipleChoiceQuestion, QuestionPage } from '../utils/types/type';

const useTestPage = (id: string, parts: string) => {
    const [questionList, setQuestionList] = useState<MultipleChoiceQuestion[]>([]);
    const [pageMapper, setPageMapper] = useState<QuestionPage[]>([]);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await callGetTestPaper(id, parts);
                const newPageMapper = MappingPageWithQuestionNum(responseData.data.listMultipleChoiceQuestions);
                setTotalQuestions(responseData.data.totalQuestion);
                setPageMapper(newPageMapper);
                setQuestionList(responseData.data.listMultipleChoiceQuestions);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id, parts]);

    return { questionList, pageMapper, totalQuestions };
}

export default useTestPage;


