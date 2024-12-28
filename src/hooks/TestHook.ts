import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callGetTestPaper, callPostTestRecord } from '../api/api';
import { useTestState } from '../context/TestStateProvider';
import { queryByPartIndex } from '../database/indexdb';
import { MappingPageWithQuestionNum } from '../utils/helperFunction/convertToHTML';
import prepareForTest from '../utils/helperFunction/prepareForTest';
import SetWebPageTitle from '../utils/helperFunction/setTitlePage';
import { FullTestScreenAction } from '../utils/types/action';
import { FullTestScreenState } from '../utils/types/state';
import { milisecond, QuestionAnswerRecord, QuestionNumber, ResultID, TestID, TestRecord, TestSheet, TestType } from '../utils/types/type';
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

export type TestScreenState = "SUBMITING" | "DOING_TEST" | "OTHER"

export function useTestScreen() {
    const { setIsOnTest } = useTestState();
    let currentState: TestScreenState = "DOING_TEST";

    useLayoutEffect(() => {

        setIsOnTest(true);
        return () => {
            setIsOnTest(false);
        }
    }, [])
    const [testScreenState, setTestScreenState] = useState<TestScreenState>(currentState);

    return {
        testScreenState,
        setTestScreenState,
    }
}

// Initial state
const initFullTestScreenState: FullTestScreenState = {
    tutorials: Array<boolean>(7).fill(false),
    currentPageIndex: 0,
};

// Reducer function
function fullTestScreenReducer(
    state: FullTestScreenState,
    action: FullTestScreenAction
): FullTestScreenState {
    switch (action.type) {
        case "SET_TUTORIALS":
            return { ...state, tutorials: action.payload };
        case "SET_TUTORIALS_DONE":
            const index = action.payload - 1;
            return { ...state, tutorials: state.tutorials.map((item, i) => (i === index ? true : item)) };
        case "SET_CURRENT_PAGE_INDEX":
            return { ...state, currentPageIndex: action.payload };
        case "SET_CURRENT_PAGE_OFFSET":
            return { ...state, currentPageIndex: state.currentPageIndex + action.payload };
        default:
            return state;
    }
}



export function useTestFrame() {

    const [fullTestScreenState, fullTestScreenDispatch] = useReducer(fullTestScreenReducer, initFullTestScreenState);

    const doTestDataRef = useRef<TestSheet>({ questionList: [], totalQuestions: 0 });
    const { parts = "0" } = useParams<{ id: TestID, parts: string }>();
    const [doneLoading, setDoneLoading] = useState<boolean>(true);
    const changePage = (offset: number) => {
        const newPageIndex = fullTestScreenState.currentPageIndex + offset;
        if (newPageIndex >= 0 && newPageIndex < doTestDataRef.current.questionList.length) {
            fullTestScreenDispatch({ type: "SET_CURRENT_PAGE_INDEX", payload: newPageIndex });
            console.dir(doTestDataRef.current.questionList);
        }
    }
    useEffect(() => {
        GetQuestionFromIndexDB(parts).then((QnAList) => {
            doTestDataRef.current = QnAList;

            setDoneLoading(false);
        });

    }, [])
    return {
        fullTestScreenDispatch,
        fullTestScreenState,
        doTestDataRef,
        changePage,
        doneLoading,
        thisQuestion: doTestDataRef.current.questionList[fullTestScreenState.currentPageIndex]
    }
}

async function GetQuestionFromIndexDB(parts: string): Promise<TestSheet> {
    if (parts === "0") parts = "1234567";
    const questionFinalList: QuestionAnswerRecord[] = [];
    let finalTotalQuestions: number = 0;
    for (const p of parts) {
        const partNumIndex = Number(p) - 1;
        const { questionList, totalQuestions } = await queryByPartIndex(partNumIndex);
        questionFinalList.push(...questionList);
        finalTotalQuestions += totalQuestions;
    }

    return { questionList: questionFinalList, totalQuestions: finalTotalQuestions };

}
