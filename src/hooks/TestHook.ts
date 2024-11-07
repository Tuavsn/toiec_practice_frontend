import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { callGetTestPaper, callPostTestRecord } from '../api/api';
import { MappingPageWithQuestionNum } from '../utils/convertToHTML';
import { AnswerPair, milisecond, MultipleChoiceQuestion, QuestionID, QuestionNumber, QuestionPage, AnswerRecord, TestAnswerSheet, TestID, UserAnswerTimeCounter, TestRecord, TestType } from '../utils/types/type';
import { useTestState } from '../context/TestStateProvider';

//------------------ Custom Hook: useTestPage ------------------//

const useTestPage = (id: TestID, parts: string, testType: TestType) => {
    // ---------------- Khởi tạo State và Context ---------------- //
    const [questionList, setQuestionList] = useState<MultipleChoiceQuestion[]>([]);
    const [pageMapper, setPageMapper] = useState<QuestionPage[]>([]);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [userAnswerSheet, setUserAnswerSheet] = useState<TestAnswerSheet>(new Map<QuestionNumber, AnswerPair>());
    const { setIsOnTest } = useTestState();

    // Ref dùng để ghi lại thời gian
    const lastTimeStampRef = useRef(Date.now());
    // thời gian người dùng đã tốn 
    const timeDoTest = useRef<number>(0);
    const timeSpentListRef = useRef<UserAnswerTimeCounter>(new Map<QuestionNumber, milisecond>());

    // ---------------- Hàm Xử Lý và Tiện Ích ---------------- //

    // Hàm chuyển trang khi người dùng nhấn nút điều hướng
    const changePage = useCallback((offset: number) => {
        const newPageIndex = currentPageIndex + offset;
        if (newPageIndex >= 0 && newPageIndex < questionList.length) {
            updateTimeSpentOnEachQuestionInCurrentPage();
            setCurrentPageIndex(newPageIndex);
        }
    }, [currentPageIndex, questionList.length]);

    // Hàm cập nhật câu trả lời của người dùng
    const setTestAnswerSheet = (qNum: QuestionNumber, qID: QuestionID, answer: string) => {
        const newMap = new Map(userAnswerSheet);
        newMap.set(qNum, { questionId: qID, userAnswer: answer });
        setUserAnswerSheet(newMap);

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
    // hàm gửi dữ liệu bài  làm kết thúc của người dùng về server
    const sendFinalResultToServer = async () => {
        const resultBodyObject: TestRecord = {
            totalSeconds: timeDoTest.current,
            testId: id,
            parts: parts,
            type: testType,
            userAnswer: GroupUserAnswerSheetAndTimeSpent(userAnswerSheet, timeSpentListRef.current)
        }
        callPostTestRecord(resultBodyObject);
    }
    // ---------------- useEffect Khởi Tạo và Cleanup ---------------- //

    // Gọi API để lấy dữ liệu bài thi khi component được mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsOnTest(true);
                localStorage.removeItem('userAnswerSheet');
                const responseData = await callGetTestPaper(id, parts);

                const newPageMapper = MappingPageWithQuestionNum(responseData.data.listMultipleChoiceQuestions);
                setTotalQuestions(responseData.data.totalQuestion);
                timeSpentListRef.current = new Map<QuestionNumber, milisecond>();
                prepareAnswerSheet(responseData.data.listMultipleChoiceQuestions, setUserAnswerSheet, timeSpentListRef);
                setPageMapper(newPageMapper);
                setQuestionList(responseData.data.listMultipleChoiceQuestions);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };
        fetchData();
    }, [id, parts]);

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
        };
    }, []);

    // ---------------- Trả Về Giá Trị từ Hook ---------------- //

    return {
        questionList,
        pageMapper,
        totalQuestions,
        setIsOnTest,
        userAnswerSheet,
        setTestAnswerSheet,
        updateTimeSpentOnEachQuestionInCurrentPage,
        setCurrentPageIndex,
        currentPageIndex,
        changePage,
        timeSpentListRef,
        timeDoTest,
        sendFinalResultToServer
    };
};

export default useTestPage;

// ---------------- Hàm Chuẩn Bị Phiếu Trả Lời Rỗng ---------------- //

function prepareAnswerSheet(
    listMultipleChoiceQuestions: MultipleChoiceQuestion[],
    setUserAnswerSheet: Dispatch<SetStateAction<TestAnswerSheet>>,
    timeSpentListRef: MutableRefObject<UserAnswerTimeCounter>
) {
    const testAnswerSheet: TestAnswerSheet = new Map<QuestionNumber, AnswerPair>();

    for (const question of listMultipleChoiceQuestions) {
        if (question.subQuestions.length !== 0) {
            for (const subQuestion of question.subQuestions) {
                testAnswerSheet.set(subQuestion.questionNum, ({ questionId: subQuestion.id, userAnswer: "" }));
                timeSpentListRef.current.set(subQuestion.questionNum, 0);
            }
        } else {
            testAnswerSheet.set(question.questionNum, { questionId: question.id, userAnswer: "" });
            timeSpentListRef.current.set(question.questionNum, 0);
        }
    }

    setUserAnswerSheet(testAnswerSheet);
}

function GroupUserAnswerSheetAndTimeSpent(userAnswerSheet: TestAnswerSheet, timeSpentList: UserAnswerTimeCounter): AnswerRecord[] {
    const resultRecords: AnswerRecord[] = [];
    userAnswerSheet.forEach((answerPair, questionNumber) => {
        const time = timeSpentList.get(questionNumber) || 0;
        resultRecords.push({ ...answerPair, timeSpent: time });
    })
    return resultRecords;
}