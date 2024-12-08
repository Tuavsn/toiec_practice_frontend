import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTestState } from "../context/TestStateProvider";
import { AnswerPair, milisecond, MultipleChoiceQuestion, QuestionID, QuestionNumber, QuestionPage, TestAnswerSheet, UserAnswerTimeCounter } from "../utils/types/type";

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