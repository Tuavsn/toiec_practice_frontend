import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callGetResult, callGetReviewTestPaper } from "../api/api";
import { ResultID, TestResultSummary } from "../utils/types/type";
import { emptyTestResultSummaryValue } from "../utils/types/emptyValue";

export function useTestOverallResult() {


    const { id = "" } = useParams<{ id: ResultID }>();
    const navigate = useNavigate();
    const [overallDetail, setOverallDetail] = useState<TestResultSummary>(emptyTestResultSummaryValue);
    useEffect(() => {
        const fetchResult = async () => {
            const response = await callGetResult(id);
            callGetReviewTestPaper(id).then(testReviewAnswerSheet => sessionStorage.setItem("review", JSON.stringify(testReviewAnswerSheet)));
            setOverallDetail(response.data);
        }
        fetchResult();
    }, [])
    const gotoReviewPage = () => navigate("detail")
    return {
        overallDetail,
        gotoReviewPage,
    }
}