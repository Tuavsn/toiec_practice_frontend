import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { callGetResult } from "../api/api";
import { TestResultSummary } from "../utils/types/type";
import { emptyTestResultSummaryValue } from "../utils/types/emptyValue";

export function useTestReview() {


    const { id = "" } = useParams<{ id: string }>();
    const testName: string = "Đề thi cuối kì";
    const [overallDetail, setOverallDetail] = useState<TestResultSummary>(emptyTestResultSummaryValue);
    useEffect(() => {
        const fetchResult = async () => {
            const response = await callGetResult(id);
            setOverallDetail(response.data);
        }
        fetchResult();
    }, [])

    return {
        testName,
        overallDetail
    }
}