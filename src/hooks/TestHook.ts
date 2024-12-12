import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { callGetTestPaper, callPostTestRecord } from '../api/api';
import { MappingPageWithQuestionNum } from '../utils/convertToHTML';
import prepareForTest from '../utils/prepareForTest';
import { milisecond, QuestionNumber, ResultID, TestID, TestRecord, TestType } from '../utils/types/type';
import { useMultipleQuestion } from './MultipleQuestionHook';
import SetWebPageTitle from '../utils/setTitlePage';

//------------------ Custom Hook: useTestPage ------------------//

const useTestPage = () => {

    // Lấy tham số từ URL (id của bài thi và các phần của bài thi)
    const { id = "", parts = "", testType = "fulltest", time = "120" } = useParams<{ id: TestID, parts: string, testType: TestType, time: string }>();
    const {
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
    } = useMultipleQuestion();
    const timeLimit = useRef<number>((Number(time) || 120) * 60);
    // Hàm kết thúc bài thi và điều hướng đến trang xem lại
    const onEndTest = useCallback(async () => {
        setIsOnTest(false);
        setIsSumit(true);

        sendFinalResultToServer().then((resultId: ResultID) => navigate(`/test/${resultId}/review`));
    }, [userAnswerSheet]);

    // hàm gửi dữ liệu bài  làm kết thúc của người dùng về server
    const sendFinalResultToServer = async () => {
        // tính thời gian làm trang cuối cùng
        updateTimeSpentOnEachQuestionInCurrentPage();
        const resultBodyObject: TestRecord = {
            totalSeconds: (Date.now() - timeDoTest.current) / 1000, // khép lại thời gian làm bài ( đơn vị giây)
            testId: id,
            parts: parts === "0" ? "1234567" : parts,
            type: testType,
            userAnswer: prepareForTest.GroupUserAnswerSheetAndTimeSpent(userAnswerSheet, timeSpentListRef.current)
        }
        return (await callPostTestRecord(resultBodyObject)).data.resultId;
    }
    // Gọi API để lấy dữ liệu bài thi khi component được mount
    useEffect(() => {
        SetWebPageTitle("Làm bài thi")
        // Nếu đã có một yêu cầu đang thực hiện, thì hủy nó
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Tạo một AbortController mới và lưu nó vào ref
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const fetchData = async () => {
            try {
                setIsOnTest(true);
                localStorage.removeItem('userAnswerSheet');
                const responseData = await callGetTestPaper(id, parts);

                const newPageMapper = MappingPageWithQuestionNum(responseData.data.listMultipleChoiceQuestions);
                setTotalQuestions(responseData.data.totalQuestion);
                timeSpentListRef.current = new Map<QuestionNumber, milisecond>();
                prepareForTest.prepareAnswerSheet(responseData.data.listMultipleChoiceQuestions, setUserAnswerSheet, timeSpentListRef);
                setPageMapper(newPageMapper);
                setQuestionList(responseData.data.listMultipleChoiceQuestions);
                setFlags(Array<boolean>(responseData.data.totalQuestion).fill(false));
            } catch (error: any) {
                // Kiểm tra nếu lỗi là do yêu cầu bị hủy
                if (error.name === "CanceledError") {
                    console.log("Yêu cầu đã bị hủy");
                } else {
                    console.error("Lỗi khi lấy dữ liệu:", error);
                }
            }
        };
        fetchData();
    }, []);
    const toggleFlag = (index: number) => {
        setFlags((prevFlags) =>
            prevFlags.map((item, i) => (i === index ? !item : item))
        );
    }
    // ---------------- Trả Về Giá Trị từ Hook ---------------- //

    return {
        setIsUserAnswerSheetVisible,
        isUserAnswerSheetVisible,
        setCurrentPageIndex,
        setTestAnswerSheet,
        currentPageIndex,
        userAnswerSheet,
        totalQuestions,
        questionList,
        setVisiable,
        pageMapper,
        changePage,
        timeDoTest,
        toggleFlag,
        onEndTest,
        startTest,
        timeLimit,
        isVisible,
        isOnTest,
        testType,
        isSumit,
        flags,
        start,
        id,
    };
};

export default useTestPage;

