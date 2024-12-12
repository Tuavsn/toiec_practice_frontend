import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { callGetTestPaper, callPostTestRecord } from '../api/api';
import { MappingPageWithQuestionNum } from '../utils/convertToHTML';
import prepareForTest from '../utils/prepareForTest';
import SetWebPageTitle from '../utils/setTitlePage';
import { milisecond, QuestionNumber, ResultID, TestID, TestRecord, TestType } from '../utils/types/type';
import { useMultipleQuestionX } from './MultipleQuestionHook';

//------------------ Custom Hook: useTestPage ------------------//

const useTestPage = () => {

    // Lấy tham số từ URL (id của bài thi và các phần của bài thi)
    const { id = "", parts = "", testType = "fulltest", time = "120" } = useParams<{ id: TestID, parts: string, testType: TestType, time: string }>();
    const {
        MultiRef,
        dispatch,
        func,
        state,
    } = useMultipleQuestionX();
    const timeLimitRef = useRef<number>((Number(time) || 120) * 60);
    // Hàm kết thúc bài thi và điều hướng đến trang xem lại
    const onEndTest = useCallback(async () => {
        func.setIsOnTest(false);
        dispatch({ type: "SET_IS_SUMIT", payload: true });
        sendFinalResultToServer().then((resultId: ResultID) => func.navigate(`/test/${resultId}/review`));
    }, [state.userAnswerSheet]);

    // hàm gửi dữ liệu bài  làm kết thúc của người dùng về server
    const sendFinalResultToServer = async () => {
        // tính thời gian làm trang cuối cùng
        func.updateTimeSpentOnEachQuestionInCurrentPage();
        const resultBodyObject: TestRecord = {
            testId: id,
            type: testType,
            parts: parts === "0" ? "1234567" : parts,
            totalSeconds: (Date.now() - MultiRef.current.timeDoTest) / 1000, // khép lại thời gian làm bài ( đơn vị giây)
            userAnswer: prepareForTest.GroupUserAnswerSheetAndTimeSpent(state.userAnswerSheet, MultiRef.current.timeSpentListRef)
        }
        return (await callPostTestRecord(resultBodyObject)).data.resultId;
    }
    // Gọi API để lấy dữ liệu bài thi khi component được mount
    useEffect(() => {
        SetWebPageTitle("Làm bài thi")
        // Nếu đã có một yêu cầu đang thực hiện, thì hủy nó
        if (MultiRef.current.abortControllerRef) {
            MultiRef.current.abortControllerRef.abort();
        }

        // Tạo một AbortController mới và lưu nó vào ref
        const controller = new AbortController();
        MultiRef.current.abortControllerRef = controller;

        const fetchData = async () => {

            func.setIsOnTest(true);
            const responseData = await callGetTestPaper(id, parts);
            if (!responseData) {
                func.navigate(`/test/${id}`);
                return;
            }
            const newPageMapper = MappingPageWithQuestionNum(responseData.data.listMultipleChoiceQuestions);
            MultiRef.current.totalQuestions = responseData.data.totalQuestion;
            MultiRef.current.timeSpentListRef = new Map<QuestionNumber, milisecond>();
            prepareForTest.prepareAnswerSheetX(responseData.data.listMultipleChoiceQuestions, dispatch, MultiRef);
            dispatch({ type: "SET_TEST_DATA", payload: [newPageMapper, responseData.data.listMultipleChoiceQuestions, Array<boolean>(responseData.data.totalQuestion).fill(false)] })

        };
        fetchData();
    }, []);
    // ---------------- Trả Về Giá Trị từ Hook ---------------- //

    return {
        id,
        func,
        state,
        dispatch,
        onEndTest,
        MultiRef,
        timeLimitRef,
    };
};

export default useTestPage;

