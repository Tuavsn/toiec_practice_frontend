import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { callGetExercisePaper, callPostTestRecord } from "../api/api";
import { MappingPageWithQuestionNum } from "../utils/convertToHTML";
import prepareForTest from "../utils/prepareForTest";
import {  ExerciseType, milisecond, QuestionNumber, QuestionRow, ResultID, TestRecord } from "../utils/types/type";
import { useMultipleQuestion } from "./MultipleQuestionHook";

const useExercisePage = () => {

    // Lấy tham số từ URL (loại của bài tập)
    const { exerciseType = "partNum=1" } = useParams<{ exerciseType: ExerciseType }>();
    const {
        updateTimeSpentOnEachQuestionInCurrentPage,
        setIsUserAnswerSheetVisible,
        isUserAnswerSheetVisible,
        setCurrentPageIndex,
        setUserAnswerSheet,
        setTestAnswerSheet,
        abortControllerRef,
        setTotalQuestions,
        timeSpentListRef,
        currentPageIndex,
        userAnswerSheet,
        setQuestionList,
        totalQuestions,
        setPageMapper,
        questionList,
        setIsOnTest,
        pageMapper,
        changePage,
        timeDoTest,
        startTest,
        isOnTest,
        navigate,
        start,
    } = useMultipleQuestion();
    // Hàm kết thúc bài thi và điều hướng đến trang xem lại
    const onEndTest = async () => {
        setIsOnTest(false);
        sendFinalResultToServer().then((resultId: ResultID) => navigate(`/test/${resultId}/review`));
    };

    // hàm gửi dữ liệu bài  làm kết thúc của người dùng về server
    const sendFinalResultToServer = async () => {
        // tính thời gian làm trang cuối cùng
        updateTimeSpentOnEachQuestionInCurrentPage();
        const resultBodyObject: TestRecord = {
            totalSeconds: (Date.now() - timeDoTest.current) / 1000, // khép lại thời gian làm bài ( đơn vị giây)
            testId: "671a25094dbe5f4c165c31dc",
            parts: exerciseType,
            type: "practice",
            userAnswer: prepareForTest.GroupUserAnswerSheetAndTimeSpent(userAnswerSheet, timeSpentListRef.current)
        }
        console.dir(resultBodyObject);
        return (await callPostTestRecord(resultBodyObject)).data.resultId;
    }
    // Gọi API để lấy dữ liệu bài thi khi component được mount
    useEffect(() => {
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
                const responseData = await callGetExercisePaper(exerciseType);
                responseData.data.result = ReCountQuestionNumber(responseData.data.result);
                const newPageMapper = MappingPageWithQuestionNum(responseData.data.result);
                setTotalQuestions(responseData.data.meta.totalItems);
                timeSpentListRef.current = new Map<QuestionNumber, milisecond>();
                prepareForTest.prepareAnswerSheet(responseData.data.result, setUserAnswerSheet, timeSpentListRef);
                setPageMapper(newPageMapper);
                setQuestionList(responseData.data.result);
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

        // Dọn dẹp để hủy yêu cầu nếu component unmount hoặc khi dependencies thay đổi
        return () => {
            controller.abort();
        };
    }, []);


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
        pageMapper,
        changePage,
        timeDoTest,
        onEndTest,
        startTest,
        isOnTest,
        start,
    };
};
export default useExercisePage;

function ReCountQuestionNumber(questions: QuestionRow[]): QuestionRow[] {
    return questions.map((q, index) => {
        return {
            ...q,
            questionNum: index + 1
        }
    })
}
