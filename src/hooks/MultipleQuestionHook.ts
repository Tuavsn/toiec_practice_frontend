import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTestState } from "../context/TestStateProvider";
import { initialState } from "../utils/types/emptyValue";
import { AnswerPair, milisecond, MultipleChoiceQuestion, MultiQuestionAction, MultiQuestionRef, MultiQuestionState, QuestionID, QuestionNumber, QuestionPage, TestAnswerSheet, UserAnswerTimeCounter } from "../utils/types/type";

export function useMultipleQuestion() {
    // ---------------- Khởi tạo State và Context ---------------- //
    const [questionList, setQuestionList] = useState<MultipleChoiceQuestion[]>([]);
    const [pageMapper, setPageMapper] = useState<QuestionPage[]>([]);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [userAnswerSheet, setUserAnswerSheet] = useState<TestAnswerSheet>(new Map<QuestionNumber, AnswerPair>());
    const { isOnTest, setIsOnTest } = useTestState();
    const [flags, setFlags] = useState<boolean[]>([]);
    const [isVisible, setVisiable] = useState<boolean>(false);
    // Sử dụng hook điều hướng
    const navigate = useNavigate();

    // State để kiểm soát việc hiển thị phiếu trả lời của người dùng
    const [isUserAnswerSheetVisible, setIsUserAnswerSheetVisible] = useState(false);

    // State để kiểm soát trạng thái bắt đầu bài thi
    const [start, setStart] = useState<boolean>(false);
    // State để kiểm soát trạng thái nộp bài thi
    const [isSumit, setIsSumit] = useState<boolean>(false);
    // Ref dùng để ghi lại thời gian
    const lastTimeStampRef = useRef<number>(0);
    // thời gian người dùng đã tốn 
    const timeDoTest = useRef<number>(0);
    const timeSpentListRef = useRef<UserAnswerTimeCounter>(new Map<QuestionNumber, milisecond>());
    const abortControllerRef = useRef<AbortController | null>(null); // Tạo một ref để lưu trữ AbortController

    // ---------------- Hàm Xử Lý và Tiện Ích ---------------- //

    // Hàm chuyển trang khi người dùng nhấn nút điều hướng
    const changePage = useCallback((offset: number) => {
        const newPageIndex = currentPageIndex + offset;
        if (newPageIndex >= 0 && newPageIndex < questionList.length) {
            updateTimeSpentOnEachQuestionInCurrentPage();
            setCurrentPageIndex(newPageIndex);
        }
    }, [currentPageIndex, questionList.length]);

    const startTest = () => {
        setStart(true);
        setIsOnTest(true);
        timeDoTest.current = lastTimeStampRef.current = Date.now();
    }

    // Hàm cập nhật câu trả lời của người dùng
    const setTestAnswerSheet = (qNum: QuestionNumber, qID: QuestionID, answer: string) => {
        setUserAnswerSheet((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(qNum, { questionId: qID, userAnswer: answer });
            return newMap;
        });

    };

    // Hàm cập nhật thời gian đã dùng cho từng câu hỏi trong trang hiện tại
    const updateTimeSpentOnEachQuestionInCurrentPage = () => {
        const allQuestionsInCurrentPage: QuestionNumber[] = pageMapper
            .filter((page) => page.page === currentPageIndex)
            .map((page) => page.questionNum);

        const newTimeStamp = Date.now();
        const timeDiff: number = (newTimeStamp - lastTimeStampRef.current) / allQuestionsInCurrentPage.length;
        for (const qNum of allQuestionsInCurrentPage) {
            const newTime = timeDiff + (timeSpentListRef.current.get(qNum) ?? 0);
            timeSpentListRef.current.set(qNum, newTime);
        }
        lastTimeStampRef.current = newTimeStamp;
    };

    // ---------------- useEffect Khởi Tạo và Cleanup ---------------- //


    // Thêm sự kiện trước khi thoát trang
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const message = "Bạn có chắc là muốn thoát khỏi bài làm chứ? Kết quả sẽ bị mất!";
            event.returnValue = message;
            return message; // Cho trình duyệt cũ
        };

        // Thêm sự kiện "beforeunload" khi component được mount
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Xóa sự kiện khi component được unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            setIsOnTest(false);
        };
    }, []);

    return {
        updateTimeSpentOnEachQuestionInCurrentPage,
        setIsUserAnswerSheetVisible,
        isUserAnswerSheetVisible,
        setCurrentPageIndex,
        setUserAnswerSheet,
        abortControllerRef,
        setTestAnswerSheet,
        setTotalQuestions,
        timeSpentListRef,
        currentPageIndex,
        userAnswerSheet,
        setQuestionList,
        totalQuestions,
        setPageMapper,
        questionList,
        setIsOnTest,
        setVisiable,
        pageMapper,
        changePage,
        timeDoTest,
        setIsSumit,
        startTest,
        isVisible,
        isOnTest,
        navigate,
        setFlags,
        isSumit,
        flags,
        start,
    }
}



//--------------------------------------------------------------------------






function reducer(state: MultiQuestionState, action: MultiQuestionAction): MultiQuestionState {
    switch (action.type) {
        case "SET_QUESTION_LIST":
            return { ...state, questionList: action.payload };
        case "SET_PAGE_MAPPER":
            return { ...state, pageMapper: action.payload };
        case "SET_CURRENT_PAGE_INDEX":
            return { ...state, currentPageIndex: action.payload };
        case "SET_USER_CHOICE_ANSWER_SHEET": {
            const newMap = new Map(state.userAnswerSheet);
            const { qNum, qID, answer } = action.payload;
            newMap.set(qNum, { questionId: qID, userAnswer: answer });
            return { ...state, userAnswerSheet: newMap };
        }
        case "SET_USER_ANSWER_SHEET":
            return { ...state, userAnswerSheet: action.payload };
        case "SET_FLAGS":
            return { ...state, flags: action.payload };
        case "SET_VISIBLE":
            return { ...state, isVisible: action.payload };
        case "SET_USER_ANSWER_SHEET_VISIBLE":
            return { ...state, isUserAnswerSheetVisible: action.payload };
        case "SET_START":
            return { ...state, start: action.payload };
        case "SET_IS_SUMIT":
            return { ...state, isSumit: action.payload };
        case "TOGGLE_FLAGS":
            {
                const newFlags = state.flags.map((item, i) => (i === action.payload ? !item : item))
                return { ...state, flags: newFlags }
            }
        case "SET_TEST_DATA":
            {
                const [newPageMapper, newQuestionList, newFlags] = action.payload;
                return { ...state, pageMapper: newPageMapper, questionList: newQuestionList, flags: newFlags };
            }
        default:
            return state;
    }
}



export function useMultipleQuestionX() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { setIsOnTest } = useTestState();
    const navigate = useNavigate();
    const MultiRef = useRef<MultiQuestionRef>({
        abortControllerRef: null,
        lastTimeStampRef: 0,
        timeDoTest: 0,
        timeSpentListRef: new Map<QuestionNumber, milisecond>(),
        totalQuestions: 0
    });
    const changePage = useCallback(
        (offset: number) => {
            const newPageIndex = state.currentPageIndex + offset;
            if (newPageIndex >= 0 && newPageIndex < state.questionList.length) {
                updateTimeSpentOnEachQuestionInCurrentPage();
                dispatch({ type: "SET_CURRENT_PAGE_INDEX", payload: newPageIndex });
            }
        },
        [state.currentPageIndex, state.questionList.length]
    );

    const startTest = () => {
        dispatch({ type: "SET_START", payload: true });
        setIsOnTest(true);
        MultiRef.current.timeDoTest = MultiRef.current.lastTimeStampRef = Date.now();
    };

    const updateTimeSpentOnEachQuestionInCurrentPage = () => {
        const allQuestionsInCurrentPage: QuestionNumber[] = state.pageMapper
            .filter((page) => page.page === state.currentPageIndex)
            .map((page) => page.questionNum);

        const newTimeStamp = Date.now();
        const timeDiff: number = (newTimeStamp - MultiRef.current.lastTimeStampRef) / allQuestionsInCurrentPage.length;
        for (const qNum of allQuestionsInCurrentPage) {
            const newTime = timeDiff + (MultiRef.current.timeSpentListRef.get(qNum) ?? 0);
            MultiRef.current.timeSpentListRef.set(qNum, newTime);
        }
        MultiRef.current.lastTimeStampRef = newTimeStamp;
    };

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const message = "Bạn có chắc là muốn thoát khỏi bài làm chứ? Kết quả sẽ bị mất!";
            event.returnValue = message;
            return message;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            setIsOnTest(false);
        };
    }, []);

    return {
        state,
        dispatch,
        MultiRef,
        func: {
            updateTimeSpentOnEachQuestionInCurrentPage,
            setIsOnTest,
            changePage,
            startTest,
            navigate
        }
    };
}

