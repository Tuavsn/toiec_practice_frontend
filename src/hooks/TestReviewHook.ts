import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { callGetResult } from "../api/api";
import { TestResultSummary } from "../utils/types/type";

export function useTestReview() {
    const empty: TestResultSummary = {
        id: "",
        testId: "",
        totalTime: 0,
        totalReadingScore: 0,
        totalListeningScore: 0,
        totalCorrectAnswer: 0,
        totalIncorrectAnswer: 0,
        totalSkipAnswer: 0,
        type: "practice",
        parts: "",
        userAnswers: []
    }

    const { id = "" } = useParams<{ id: string }>();
    const testName: string = "Đề thi cuối kì";
    const [overallDetail, setOverallDetail] = useState<TestResultSummary>(empty);
    useEffect(() => {
        const fetchResult = async () => {
            const response = await callGetResult(id);
            setOverallDetail(response.data);
        }
        fetchResult();
    },[])

    return {
        testName,
        overallDetail
    }
}