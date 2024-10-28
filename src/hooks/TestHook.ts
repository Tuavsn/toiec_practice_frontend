import { useEffect, useState } from 'react';
import { callGetTestPaper } from '../api/api';
import { MappingPageWithQuestionNum } from '../utils/convertToHTML';
import { MultipleChoiceQuestion, QuestionPage } from '../utils/types/type';
import { useTestState } from '../context/TestStateProvider';

const useTestPage = (id: string, parts: string) => {
    const [questionList, setQuestionList] = useState<MultipleChoiceQuestion[]>([]);
    const [pageMapper, setPageMapper] = useState<QuestionPage[]>([]);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    // Lấy giá trị setIsOnTest từ context
    const { setIsOnTest } = useTestState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsOnTest(true);
                localStorage.removeItem('userAnswerSheet')
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
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const message = "Bạn có chắc là muốn thoát khỏi bài làm chứ? kết quả sẽ mất đó !";
            event.returnValue = message;
            return message; // For older browsers
        };

        // Add event listener for beforeunload
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return { questionList, pageMapper, totalQuestions, setIsOnTest };
}

export default useTestPage;


