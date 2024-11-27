import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { useTestReview } from "../hooks/TestReviewHook";
import convertSecondsToString from "../utils/convertSecondsToString";

export default function TestReviewPage() {

    const {
        overallDetail
    } = useTestReview();
    return (
        <main className="pt-8 w-full family-font">
            <Card title={`Kết quả thi: ${overallDetail.type} phần ${overallDetail.parts}`}>
                <section className="flex flex-wrap justify-content-around gap-3">
                    <table className="bg-gray-300 p-2 border-round-md flex-1 shadow-4">
                        <tbody>
                            <tr>
                                <td>Kết quả làm bài:</td>
                                <td>{overallDetail.totalListeningScore + overallDetail.totalReadingScore}/200</td>
                            </tr>
                            <tr>
                                <td>Thời gian làm bài:</td>
                                <td>{convertSecondsToString(overallDetail.totalTime)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="shadow-4 p-3 text-center border-round-md flex-1">
                        ✅
                        <p className="text-green-500">Trả lời đúng</p>
                        <h1>{overallDetail.totalCorrectAnswer}</h1>
                        câu hỏi
                    </div>
                    <div className="shadow-4 p-3 text-center border-round-md flex-1">
                        ❌
                        <p className="text-red-500">Trả lời đúng</p>
                        <h1>{overallDetail.totalIncorrectAnswer}</h1>
                        câu hỏi
                    </div>
                    <div className="shadow-4 p-3 text-center border-round-md flex-1">
                        😵
                        <p className="text-orange-300">Không trả lời</p>
                        <h1>{overallDetail.totalSkipAnswer}</h1>
                        câu hỏi
                    </div>
                </section>
                <section>
                    <h1>Đáp án</h1>
                    <div className="flex flex-wrap gap-5 justify-content-center">

                        {
                            overallDetail.userAnswers.map((userAnswer, index) => {

                                return (
                                    <div className="flex-1 align-center shadow-7 p-4" style={{minWidth:"33%"}} key={index}>
                                        <Badge className="mr-2" value={index + 1} />
                                        <div className="pt-2 pl-4">{ConcatLineFromUserAnswerAndIcon(userAnswer.answer, userAnswer.correct)}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </section>
            </Card>

        </main >

    )
}

//-----------------------helper function

function ConcatLineFromUserAnswerAndIcon(userAnswer: string, isCorrect: boolean) {
    let symbol = '✅';
    if (!isCorrect) {
        if (userAnswer) {
            symbol = '❌';
        }
        else {
            symbol = '😵';
            userAnswer = "chưa làm"
        }
    }
    const line = `${userAnswer} ${symbol}`;
    return line;
}

// function getColorButtonOnAnswerSheet(isCorrect: boolean, isOnPage: boolean): "success" | "danger" | "info" {
//     const returnString = isCorrect ? 'success' : 'danger';
//     return isOnPage ? 'info' : returnString;
// }

// async function fetchQuestionsData(defaultValue: TestResultSummary): Promise<TestResultSummary> {
//     try {
//         const response = await fetch("https://dummyjson.com/c/a600-c342-4b74-8f2d");

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         // Get the full response and cast it to ApiResponse<TestPaper>
//         const apiResponse: ApiResponse<TestResultSummary> = await response.json();

//         // Return the data part of the response
//         return apiResponse.data;
//     } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//         return defaultValue;
//     }
// }
