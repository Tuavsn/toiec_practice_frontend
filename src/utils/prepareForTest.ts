// ---------------- Hàm Chuẩn Bị Phiếu Trả Lời Rỗng ---------------- //

import { Dispatch, SetStateAction, MutableRefObject } from "react";
import { MultipleChoiceQuestion, TestAnswerSheet, UserAnswerTimeCounter, QuestionNumber, AnswerPair, AnswerRecord } from "./types/type";

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
        resultRecords.push({ ...answerPair, timeSpent: ~~(time / 1000) });// đổi từ mili giây sang giây (chỉ lấy phần nguyên)
    })
    return resultRecords;
}

export default {
    prepareAnswerSheet,
    GroupUserAnswerSheetAndTimeSpent
}