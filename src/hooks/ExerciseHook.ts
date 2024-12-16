import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { callGetExercisePaper, callPostTestRecord } from "../api/api";
import { MappingPageWithQuestionRowNum } from "../utils/convertToHTML";
import prepareForTest from "../utils/prepareForTest";
import SetWebPageTitle from "../utils/setTitlePage";
import { AnswerRecord, ExerciseType, milisecond, QuestionNumber, QuestionRow, ResultID, TestRecord } from "../utils/types/type";
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
        setIsSumit,
        startTest,
        isOnTest,
        navigate,
        isSumit,
        start,
    } = useMultipleQuestion();
    // Hàm kết thúc bài thi và điều hướng đến trang xem lại
    const onEndTest = async () => {
        setIsSumit(true);
        setIsOnTest(false);
        updateTimeSpentOnEachQuestionInCurrentPage();
        let userAnswerList = prepareForTest.GroupUserAnswerSheetAndTimeSpent(userAnswerSheet, timeSpentListRef.current)
        userAnswerList = userAnswerList.filter(ans => ans.userAnswer !== "");

        if (userAnswerList.length === 0) {
            navigate('/exercise');
            return;
        }
        sendFinalResultToServer(userAnswerList).then((resultId: ResultID) => navigate(`/test/${resultId}/review`));
    };

    // hàm gửi dữ liệu bài  làm kết thúc của người dùng về server
    const sendFinalResultToServer = async (userAnswerList: AnswerRecord[]) => {
        // tính thời gian làm trang cuối cùng

        console.dir(timeSpentListRef.current);
        const resultBodyObject: TestRecord = {
            totalSeconds: (Date.now() - timeDoTest.current) / 1000, // khép lại thời gian làm bài ( đơn vị giây)
            testId: "",
            parts: exerciseType.split("=")[1],
            type: "exercise",
            userAnswer: userAnswerList
        }
        return (await callPostTestRecord(resultBodyObject)).data.resultId;
    }
    // Gọi API để lấy dữ liệu bài thi khi component được mount
    useEffect(() => {
        SetWebPageTitle("Luyện tập")
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
                const newList = ReCountQuestionNumber(responseData.data.result);
                const newPageMapper = MappingPageWithQuestionRowNum(newList);
                const totalQuestions = responseData.data.meta.totalItems <= responseData.data.meta.pageSize ? responseData.data.meta.totalItems : responseData.data.meta.pageSize;
                setTotalQuestions(totalQuestions);
                timeSpentListRef.current = new Map<QuestionNumber, milisecond>();
                prepareForTest.prepareAnswerSheet(newList, setUserAnswerSheet, timeSpentListRef);
                setPageMapper(newPageMapper);
                setQuestionList(newList);
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
        isSumit,
        start,
    };
};
export default useExercisePage;

function ReCountQuestionNumber(questions: QuestionRow[]): QuestionRow[] {
    let count = 0;
    return questions.map((q, index) => {
        const newSubQuestions = q.subQuestions.map((sq) => { count += 1; return { ...sq, questionNum: count } })
        return {
            ...q,
            questionNum: index + 1,
            subQuestions: newSubQuestions
        }
    })
}
