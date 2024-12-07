import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";
import { useTestOverallResult } from "../hooks/TestOverallReviewHook";
import convertSecondsToString from "../utils/convertSecondsToString";
import { SelectedQuestionDialogTestOverallPage } from "../utils/types/type";
import { Navigate } from "react-router-dom";
import { IsNotLogIn } from "../utils/AuthCheck";

export default function TestOverallResultPage() {

    const {
        overallDetail,
        gotoReviewPage,
        onClickToView,
        currentSelectedQuestion,
        setCurrentSelectedQuestion,
    } = useTestOverallResult();

    if(IsNotLogIn()) return <Navigate to={"/home?login=true"} />

    let part = 0;
    return (
        <main className="pt-8 w-full family-font">
            <DetailQuestionDialog currentSelectedQuestion={currentSelectedQuestion} setCurrentSelectedQuestion={setCurrentSelectedQuestion} />
            <Card title=
                {<section className="bg-gray-300 shadow-5 p-1">
                    <h1>{`Kết quả thi: ${overallDetail.type} thuộc ${overallDetail.testName}`}</h1>
                </section>
                }>
                <section className="flex flex-wrap justify-content-around gap-3">
                <table className="bg-gray-300 p-2 border-round-md flex-1 shadow-4 glassmorphism">
                    <tbody>
                        <tr>
                            <td>Kết quả làm bài:</td>
                            <td>{overallDetail.totalCorrectAnswer} / {overallDetail.totalCorrectAnswer + overallDetail.totalIncorrectAnswer + overallDetail.totalSkipAnswer}</td>
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
                    <p className="text-red-500">Trả lời sai</p>
                    <h1>{overallDetail.totalIncorrectAnswer}</h1>
                    câu hỏi
                </div>
                <div className="shadow-4 p-3 text-center border-round-md flex-1">
                    😵
                    <p className="text-orange-300">Không trả lời</p>
                    <h1>{overallDetail.totalSkipAnswer}</h1>
                    câu hỏi
                </div>
                <div className="shadow-4 p-3 text-center border-round-md flex-1">
                    🏆
                    <p className="text-blue-300">Tổng điểm</p>
                    <h1>{overallDetail.totalListeningScore + overallDetail.totalReadingScore}</h1>
                    điểm
                </div>
            </section>
            <section className="flex gap-4 mt-4">
                <div className="flex-1 justify-content-center bg-orange-100 shadow-5 border-round-lg glassmorphism">
                    <h1 className="text-center text-blue-500">Listening</h1>
                    <h1 className="text-center">{overallDetail.totalListeningScore} / 495</h1>

                </div>
                <div className="flex-1 justify-content-center bg-orange-100 shadow-5 border-round-lg glassmorphism">
                    <h1 className="text-center text-blue-500">Reading</h1>
                    <h1 className="text-center">{overallDetail.totalReadingScore} / 495</h1>
                </div>
            </section>
            <section className="my-4 flex justify-content-end">
                <Button label="Xem chi tiết bài làm" onClick={gotoReviewPage} />
            </section>
            <section>
                <section className="mt-5 bg-gray-300 shadow-5 p-3">
                    <h1>Đáp án</h1>
                </section>
                <div className="flex flex-wrap gap-5 justify-content-center">

                    {
                        overallDetail.userAnswers.map((userAnswer, index) => {
                            let newPart = false;
                            if (part != userAnswer.partNum) {
                                part = userAnswer.partNum
                                newPart = true
                            }
                            return (
                                <React.Fragment key={`q_${index}`}>
                                    {newPart && <><h1 className="w-full text-blue-600">Part {userAnswer.partNum}</h1></>}
                                    <div className="flex-1 align-center shadow-7 p-4 cursor-pointer" style={{ minWidth: "33%", maxWidth: "50%" }} key={index} onClick={() => onClickToView(userAnswer)}>
                                        <Badge className="mr-2" value={userAnswer.questionNum} />
                                        <div className="pt-2 pl-4">{ConcatLineFromUserAnswerAndIcon(userAnswer.answer, userAnswer.correct)}</div>
                                    </div>
                                </React.Fragment>
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
export type DetailQuestionDialogProps = {
    currentSelectedQuestion: SelectedQuestionDialogTestOverallPage;
    setCurrentSelectedQuestion: Dispatch<SetStateAction<SelectedQuestionDialogTestOverallPage>>
}
const DetailQuestionDialog: React.FC<DetailQuestionDialogProps> = React.memo(
    ({ currentSelectedQuestion, setCurrentSelectedQuestion }) => {
        return (
            <Dialog style={{ width: "50vw" }} header={currentSelectedQuestion.title} visible={currentSelectedQuestion.body != null} onHide={() => setCurrentSelectedQuestion({ body: null, title: null })}>
                {currentSelectedQuestion.body}
            </Dialog>
        )
    }
)
