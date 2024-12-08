import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callGetResult, callGetReviewTestPaper } from "../api/api";
import { UserReviewSingleAnswerToHTML } from "../utils/convertToHTML";
import { emptyTestResultSummaryValue } from "../utils/types/emptyValue";
import { ResultID, SelectedQuestionDialogTestOverallPage, TestResultSummary, UserAnswerResult } from "../utils/types/type";
import SetWebPageTitle from "../utils/setTitlePage";


export function useTestOverallResult() {


    const { id = "" } = useParams<{ id: ResultID }>();
    const navigate = useNavigate();
    const [overallDetail, setOverallDetail] = useState<TestResultSummary>(emptyTestResultSummaryValue);
    const [currentSelectedQuestion, setCurrentSelectedQuestion] = useState<SelectedQuestionDialogTestOverallPage>({ body: null, title: null })
    useEffect(() => {
        SetWebPageTitle("Kết quả bài làm")
        const fetchResult = async () => {
            const response = await callGetResult(id);
            callGetReviewTestPaper(id).then(testReviewAnswerSheet => sessionStorage.setItem("review", JSON.stringify(testReviewAnswerSheet)));
            if (response.data.type === "exercise") {
                response.data.testName = "Ngân hàng câu hỏi"
            }
            ConvertEnglishToVietnamese(response.data);
            setOverallDetail(response.data);
        }
        fetchResult();
    }, [])
    const gotoReviewPage = () => navigate("detail")
    const onClickToView = (userAnswerResult: UserAnswerResult) => {
        console.dir(userAnswerResult);

        setCurrentSelectedQuestion(
            UserReviewSingleAnswerToHTML(userAnswerResult),

        );
    }
    return {
        overallDetail,
        gotoReviewPage,
        onClickToView,
        currentSelectedQuestion,
        setCurrentSelectedQuestion,
    }
}


function ConvertEnglishToVietnamese(data: TestResultSummary) {
    switch (data.type) {
        case "exercise":
            data.type = "luyện tập";
            return;
        case "practice":
            data.type = "làm 1 phần";
            return;
        case "fulltest":
            data.type = "thi thử";
            return;
        default:
            return;
    }
}

