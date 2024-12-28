import axios from "../api/axios-customize";
import { ApiResponse, MultipleChoiceQuestion, Question_PageIndex, TestDocument, TestID, TestPaper, WorkerResponse } from "../utils/types/type";
interface TestPaperWorkerRequest {
    testId: TestID;
    parts: string;
}

self.onmessage = async (event: MessageEvent<TestPaperWorkerRequest>) => {
    const { testId, parts } = event.data;
    const postfix = parts === '0' ? 'full-test' : `practice?parts=${parts}`;

    try {
        const response = await axios.get<ApiResponse<TestPaper>>(
            `${import.meta.env.VITE_API_URL}/tests/${testId}/${postfix}`
        );

        if (response.data) {
            const testPaper = response.data.data;
            const testDocument: TestDocument = ConvertTestPaperToTestDocument(testPaper);
            self.postMessage({ status: 'success', data: testDocument } as WorkerResponse<TestDocument>);
        }
    } catch (error: any) {
        self.postMessage({ status: 'error', message: error.message } as WorkerResponse<null>);
    }
};


function ConvertTestPaperToTestDocument(testPaper: TestPaper): TestDocument {
    const testDoc: TestDocument = [];
    let pageNum = 0;
    testPaper.listMultipleChoiceQuestions.forEach((question: MultipleChoiceQuestion) => {
        //-- Chia câu hỏi theo phần
        const partIndex = question.partNum - 1;
        if (!testDoc[partIndex]) {
            testDoc[partIndex] = { totalQuestions: 0, questionList: [] };
        }
        testDoc[partIndex].questionList.push(ConvertMultipleChoiceQuestionToQuestionAnswerRecord(question, pageNum));
        const totalSubQuestions = question.subQuestions.length;
        testDoc[partIndex].totalQuestions += totalSubQuestions > 0 ? totalSubQuestions : 1;

        pageNum += 1;
    })
    return testDoc

}

function ConvertMultipleChoiceQuestionToQuestionAnswerRecord(question: MultipleChoiceQuestion, pageIndex: number): Question_PageIndex {
    const subQuestionAnswers: Question_PageIndex[] = [];
    if (question.subQuestions.length > 0) {
        subQuestionAnswers.push(...question.subQuestions.map((subQuestion: MultipleChoiceQuestion) => {
            return ConvertMultipleChoiceQuestionToQuestionAnswerRecord(subQuestion, pageIndex);
        }))
    }
    const questionAnswerRecord: Question_PageIndex = { questionId: question.id, ...question, subQuestions: subQuestionAnswers, pageIndex };
    return questionAnswerRecord;
}