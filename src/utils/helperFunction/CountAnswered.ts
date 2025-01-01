import { TestSheet } from "../types/type";

export default function CountNotEmptyAnswers(doTestDataRef: React.MutableRefObject<TestSheet>): number {
    let count = 0;
    const doTestDataList = doTestDataRef.current.questionList;
    for (const dotestData of doTestDataList) {
        if (dotestData.userAnswer !== "") count++;
    }
    return count;
}