import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callGetIsDraftTestExist, callGetTestPaper, callPostTestRecord } from '../api/api';
import { useTestState } from '../context/TestStateProvider';
import { deleteDraftFromIndexDB, getDraftFromIndexDB, queryByPartIndex, upsertDraftToIndexDB } from '../database/indexdb';
import { MappingPageWithQuestionNum } from '../utils/helperFunction/convertToHTML';
import prepareForTest from '../utils/helperFunction/prepareForTest';
import SetWebPageTitle from '../utils/helperFunction/setTitlePage';
import { FullTestScreenAction } from '../utils/types/action';
import { emptyDoTestData } from '../utils/types/emptyValue';
import { FullTestScreenState } from '../utils/types/state';
import { AnswerRecord, DraftLocation, milisecond, Question_PageIndex, QuestionAnswerRecord, QuestionNumber, ResultID, TestDraft, TestID, TestRecord, TestSheet, TestType } from '../utils/types/type';
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

export type TestScreenState = {
    state: "SUBMITING" | "DOING_TEST" | "NAVIGATE_TO_RESULT" | "OTHER"
    resultID: ResultID
}

export function useTestScreen() {
    const { setIsOnTest } = useTestState();
    let currentState: TestScreenState = { state: "DOING_TEST", resultID: "" };

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
    isLoading: true,
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
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_TUTORIALS_DONE":
            const index = action.payload - 1;
            return { ...state, tutorials: state.tutorials.map((item, i) => (i === index ? true : item)) };
        case "SET_CURRENT_PAGE_INDEX":
            return { ...state, currentPageIndex: action.payload };
        case "SET_CURRENT_PAGE_OFFSET":
            return { ...state, currentPageIndex: state.currentPageIndex + action.payload };
        case "SET_STATE":
            return { ...state, ...action.payload };
        default:
            return state;
    }
}



export function useTestFrame(setTestScreenState: React.Dispatch<React.SetStateAction<TestScreenState>>) {

    const [fullTestScreenState, fullTestScreenDispatch] = useReducer(fullTestScreenReducer, initFullTestScreenState);

    const doTestDataRef = useRef<TestSheet>(emptyDoTestData);
    const { id = "", parts = "0", testType = "practice", time = "10" } = useParams<{ id: TestID, parts: string, testType: TestType, time: string }>();
    const thisQuestion: QuestionAnswerRecord = doTestDataRef.current.questionList[fullTestScreenState.currentPageIndex];
    const changePage = (offset: number) => {
        const newPageIndex = fullTestScreenState.currentPageIndex + offset;
        console.log("Changing page to:", newPageIndex, "Current page index:", fullTestScreenState.currentPageIndex);
        if (newPageIndex >= 0 && newPageIndex < doTestDataRef.current.questionList.length) {
            CalculateTimeSpent(thisQuestion, doTestDataRef.current.timeCountStart);
            fullTestScreenDispatch({ type: "SET_CURRENT_PAGE_INDEX", payload: newPageIndex });
        }
    }
    const moveToPage = (pageIndex: number) => {
        CalculateTimeSpent(thisQuestion, doTestDataRef.current.timeCountStart);
        fullTestScreenDispatch({ type: "SET_CURRENT_PAGE_INDEX", payload: pageIndex });
        autoSaveDraftTest();
    }
    const onEndTest = async () => {
        setTestScreenState({ state: "SUBMITING", resultID: "" });
        const resultId: ResultID = await sendFinalResultToServer()
        setTestScreenState({ state: "NAVIGATE_TO_RESULT", resultID: resultId });
        await deleteDraftFromIndexDB(id);
    }

    // hàm gửi dữ liệu bài  làm kết thúc của người dùng về server
    const sendFinalResultToServer = async () => {
        // tính thời gian làm trang cuối cùng
        CalculateTimeSpent(thisQuestion, doTestDataRef.current.timeCountStart);
        const [totalSeconds, userAnswers] = ExtractUserAnswerAndTimeSpent(doTestDataRef.current.questionList);
        const resultBodyObject: TestRecord = {
            testId: id,
            type: testType,
            parts: parts === "0" ? "1234567" : parts,
            totalSeconds: totalSeconds,// khép lại thời gian làm bài ( đơn vị giây)
            userAnswer: userAnswers
        }
        return (await callPostTestRecord(resultBodyObject)).data.resultId;
    }

    const autoSaveDraftTest = useCallback(() => {
        console.log("Auto-saving draft test...", fullTestScreenState.currentPageIndex);

        upsertDraftToIndexDB(id, {
            draftTestData: doTestDataRef.current,
            draftTestScreenState: fullTestScreenState
        } as TestDraft);
        //callSaveDreftTestToServer();
    }, [fullTestScreenState, id])

    useEffect(() => {
        if (fullTestScreenState.isLoading) return;
        autoSaveDraftTest();
    }, [fullTestScreenState.currentPageIndex, autoSaveDraftTest]);

    useEffect(() => {
        SetWebPageTitle("Làm bài thi");
        callGetIsDraftTestExist(id).then(async (draftLocationExist: DraftLocation) => {
            switch (draftLocationExist) {
                case "server":
                    break;
                case "indexDB":
                    const { draftTestScreenState, draftTestData } = await getDraftFromIndexDB(id);
                    doTestDataRef.current = draftTestData;
                    fullTestScreenDispatch({ type: "SET_STATE", payload: draftTestScreenState })
                    break;
                case "none":
                    const QnAList = await GetQuestionFromIndexDB(parts);
                    doTestDataRef.current = { ...QnAList, secondsLeft: Number(time) * 60, testType: testType };
                    break;
                default:
                    console.error("Unknown draft location:", draftLocationExist);
                    break;
            }
            fullTestScreenDispatch({ type: "SET_LOADING", payload: false });
        });


    }, [])
    return {
        fullTestScreenDispatch,
        fullTestScreenState,
        doTestDataRef,
        thisQuestion,
        changePage,
        moveToPage,
        onEndTest,
        autoSaveDraftTest
    }
}





async function GetQuestionFromIndexDB(parts: string): Promise<TestSheet> {
    if (parts === "0") parts = "1234567";
    const questionFinalList: QuestionAnswerRecord[] = [];
    let finalTotalQuestions: number = 0;
    for (const p of parts) {
        const { questionList, totalQuestions } = await queryByPartIndex(Number(p) - 1);
        questionFinalList.push(...questionList.map((q: Question_PageIndex) => ConvertQuestionMetaToQuestionAnswerRecord(q)));
        finalTotalQuestions += totalQuestions;
    }

    return {
        totalQuestions: finalTotalQuestions,
        questionList: questionFinalList,
        timeCountStart: 0,
        answeredCount: 0,
        secondsLeft: 0,
        testType: "fulltest",
    };

}
function ConvertQuestionMetaToQuestionAnswerRecord({ answers, content, questionId, pageIndex, partNum, questionNum, resources, subQuestions, type }: Question_PageIndex): QuestionAnswerRecord {

    return {
        subQuestions: subQuestions.length > 0 ? subQuestions.map(sq => ConvertQuestionMetaToQuestionAnswerRecord(sq)) : [],
        type, partNum, content, answers, pageIndex,
        questionId, questionNum, resources,
        userAnswer: "",
        timeSpent: 0,
        flag: false,
    };
}


function CalculateTimeSpent(thisQuestion: QuestionAnswerRecord, timeCountStart: number) {
    let timeSpent = Date.now() - timeCountStart;
    thisQuestion.timeSpent = timeSpent;
}

function ExtractUserAnswerAndTimeSpent(questionList: QuestionAnswerRecord[]): [number, AnswerRecord[]] {
    let totalMiliseconds: milisecond = 0;
    const answerList: AnswerRecord[] = [];
    questionList.forEach(({ userAnswer, timeSpent, questionId, subQuestions }) => {
        totalMiliseconds += timeSpent;
        timeSpent /= 1000;
        if (subQuestions.length > 0) {
            timeSpent /= subQuestions.length;
            subQuestions.forEach((sq: QuestionAnswerRecord) => {
                answerList.push({
                    userAnswer: sq.userAnswer,
                    timeSpent: timeSpent,
                    questionId: sq.questionId,
                });
            });
        } else {
            answerList.push({
                userAnswer,
                timeSpent,
                questionId,
            });
        }
    });
    return [totalMiliseconds / 1000, answerList];
}

