import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callGetTestPaper, callPostTestRecord } from '../api/api';
import { useTestState } from '../context/TestStateProvider';
import { MappingPageWithQuestionNum } from '../utils/helperFunction/convertToHTML';
import hasSessionStorageItem from '../utils/helperFunction/hasItemInSessionStorage';
import prepareForTest from '../utils/helperFunction/prepareForTest';
import SetWebPageTitle from '../utils/helperFunction/setTitlePage';
import { FullTestScreenAction, RenderTestActiion } from '../utils/types/action';
import { FullTestScreenState, RenderTestState } from '../utils/types/state';
import { AnswerPair, QuestionNumber, QuestionPage, ResultID, TestID, TestPaper, TestRecord, TestType, milisecond, renderTestRefType } from '../utils/types/type';
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
    const { id = "" } = useParams<{ id: TestID }>();
    const { setIsOnTest } = useTestState();
    let currentState: TestScreenState = "DOING_TEST";

    if (!hasSessionStorageItem("testPapaer")) {
        currentState = "OTHER";
    } else {
        setIsOnTest(true);
    }
    const [testScreenState, setTestScreenState] = useState<TestScreenState>(currentState);



    return {
        id,
        testScreenState,
        setTestScreenState,
    }
}



// Define types for state and action


// Initial state
const initFullTestScreenState: FullTestScreenState = {
    tutorials: Array<boolean>(7).fill(false),
    currentPageIndex: -9999999,
};

// Reducer function
function fullTestScreenReducer(
    state: FullTestScreenState,
    action: FullTestScreenAction
): FullTestScreenState {
    switch (action.type) {
        case "SET_TUTORIALS":
            return { ...state, tutorials: action.payload };
        case "SET_CURRENT_PAGE_INDEX":
            return { ...state, currentPageIndex: action.payload };
        case "SET_CURRENT_PAGE_OFFSET":
            return { ...state, currentPageIndex: state.currentPageIndex + action.payload };
        default:
            return state;
    }
}

export function useFullTestScreen() {
    const [fullTestScreenState, fullTestScreenDispatch] = useReducer(fullTestScreenReducer, initFullTestScreenState);
    const testPaperRef = useRef<TestPaper>(GetQuestionFromSessionStorage());
    const changePage = (offset: number) => {
        const newPageIndex = fullTestScreenState.currentPageIndex + offset;
        if (newPageIndex >= 0 && newPageIndex < testPaperRef.current.listMultipleChoiceQuestions.length) {
            fullTestScreenDispatch({ type: "SET_CURRENT_PAGE_INDEX", payload: newPageIndex });
        }
    }
    return {
        fullTestScreenDispatch,
        fullTestScreenState,
        testPaperRef,
        changePage
    }
}

function GetQuestionFromSessionStorage(): TestPaper {
    const questionListStr = sessionStorage.getItem("questionList");
    if (questionListStr) {
        const questionList = JSON.parse(questionListStr) as TestPaper;
        sessionStorage.removeItem("testPapaer");
        sessionStorage.removeItem("testPapaer");
        return questionList
    }
    return { listMultipleChoiceQuestions: [], totalQuestion: 0 };
}





function renderTestReducer(state: RenderTestState, action: RenderTestActiion): RenderTestState {
    switch (action.type) {
        case "SET_USER_CHOICE_ANSWER_SHEET": {
            const newMap = new Map(state.userAnswerSheet);
            const { qNum, qID, answer } = action.payload;
            newMap.set(qNum, { questionId: qID, userAnswer: answer });
            return { ...state, userAnswerSheet: newMap };
        }
        case "TOGGLE_FLAGS":
            {
                const newFlags = state.flags.map((item:boolean, i:number) => (i === action.payload ? !item : item))
                return { ...state, flags: newFlags }
            }
        default:
            return state;
    }
}



export function useRenderTest(testPaper: TestPaper) {
    const {
        flags,
        pageMapper,
        timeSpentList,
        userAnswerSheet,
    } = useMemo(() => GetInitRenderTest(testPaper), [])

    const renderTestRef = useRef<renderTestRefType>({ pageMapper, timeSpentList });
    const [renderTestState, renderTestDispatch] = useReducer(renderTestReducer, { flags, userAnswerSheet });



    return {
        renderTestRef,
        renderTestState,
        renderTestDispatch,
    }
}

function GetInitRenderTest(testPaper: TestPaper) {
    const userAnswerSheet = new Map<QuestionNumber, AnswerPair>();
    const pageMapper: QuestionPage[] = MappingPageWithQuestionNum(testPaper.listMultipleChoiceQuestions);
    const timeSpentList = new Map<QuestionNumber, milisecond>();
    for (const question of testPaper.listMultipleChoiceQuestions) {
        if (question.subQuestions.length !== 0) {
            for (const subQuestion of question.subQuestions) {
                userAnswerSheet.set(subQuestion.questionNum, ({ questionId: subQuestion.id, userAnswer: "" }));
                timeSpentList.set(subQuestion.questionNum, 0);
            }
        } else {
            userAnswerSheet.set(question.questionNum, { questionId: question.id, userAnswer: "" });
            timeSpentList.set(question.questionNum, 0);
        }
    }

    return {
        flags: Array<boolean>(testPaper.totalQuestion).fill(false),
        pageMapper,
        timeSpentList,
        userAnswerSheet,
    }
}