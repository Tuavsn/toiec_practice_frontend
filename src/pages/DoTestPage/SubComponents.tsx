import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import React, { Dispatch, memo, MutableRefObject, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { LoadingSpinner } from "../../components/Common/Index"
import { MultipleChoiceQuestion, MultiQuestionAction, MultiQuestionRef, QuestionPage, SimpleTimeCountDownProps, TestAnswerSheet, TestID, TestToolBarProps } from "../../utils/types/type"

function SubmitLoading() {
    return (
        <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
            <LoadingSpinner text="Xin vui lòng chờ...." />
        </div>

    )
}
function LoadingGetQuestionFromServer(id: TestID) {
    return (
        <section>
            <Link to={`/test/${id}`}>
                <Button className="fixed" label="Quay về" />
            </Link>
            <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
                <LoadingSpinner text="Xin vui lòng chờ...." />
            </div>
        </section>

    )
}
interface RenderPressStartButtonProps {
    id: TestID,
    startTestFunc: () => void
}
const RenderPressStartButton: React.FC<RenderPressStartButtonProps> = (props) => {
    return (
        <section>
            {/* Nút bắt đầu bài thi */}
            <Link to={`/test/${props.id}`}>
                <Button className="fixed" label="Quay về" />
            </Link>
            <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
                <div className="text-center">

                    <Button label="Bắt đầu" onClick={() => {
                        // mở giao diện làm bài
                        props.startTestFunc();
                    }} />
                </div>
            </div>
        </section>
    )
}

const SimpleTimeCountDown: React.FC<SimpleTimeCountDownProps> = React.memo(
    ({ timeLeftInSecond, onTimeUp, isTutorial }) => {
        const [secondsLeft, setSecondsLeft] = useState(timeLeftInSecond);

        useEffect(() => {
            if (secondsLeft <= 0) { onTimeUp(); return; }
            const timer = setInterval(() => { if (!isTutorial) setSecondsLeft(prev => prev - 1); }, 1000);
            return () => clearInterval(timer);
        }, [secondsLeft]);

        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;

        // Determine background color class based on time left
        const bgColorClass = secondsLeft <= 30 ? 'bg-red-200' : 'bg-blue-200';

        return (
            <div className={` text-center align-items-center justify-content-center`}>
                <h5 className={`px-1 inline py-1 ${bgColorClass} border-dashed border-round-md`}>
                    {minutes} phút và {seconds < 10 ? `0${seconds}` : seconds} giây
                </h5>
            </div>
        );
    }
)


function currentStatusBodyTemplate(answeredCount: number, totalQuestions: number, dispatch: React.Dispatch<MultiQuestionAction>) {

    return (
        <Button severity="help" label={`Số câu đã trả lời: ${answeredCount} / ${totalQuestions}`} icon="pi pi-arrow-right" onClick={() => dispatch({ type: "SET_USER_ANSWER_SHEET_VISIBLE", payload: true })} />
    )
}

const RightSideToolbar: React.FC<{ flags: boolean[], pageIndex: number, dispatch: Dispatch<MultiQuestionAction> }> = React.memo(
    ({ flags, pageIndex, dispatch }) => {
        return (
            < div className=" flex gap-1" >
                <Button severity={flags[pageIndex] ? "info" : "secondary"} label="🚩" onClick={() => dispatch({ type: "TOGGLE_FLAGS", payload: pageIndex })} />
                <Button severity="success" label="Nộp bài" onClick={() => dispatch({ type: "SET_VISIBLE", payload: true })}
                />
            </div >
        )
    }
)

const TestToolbar: React.FC<TestToolBarProps> = (props) => {
    {/* Thanh công cụ chứa bộ đếm thời gian và nút nộp bài */ }
    return (
        <h1>toolbar</h1>
        // < Toolbar className="py-1"
        //     start={currentStatusBodyTemplate(answeredCount, props.MultiRef.current.totalQuestions, props.dispatch)}
        //     center={< SimpleTimeCountDown onTimeUp={() => props.onEndTest()} timeLeftInSecond={props.timeLimitRef.current} isTutorial={false} />}
        //     end={<RightSideToolbar dispatch={props.dispatch} flags={props.state.flags} pageIndex={props.state.currentPageIndex} />}
        // />

    )
}


interface ConfirmSubmitDialogProps {
    isDialogVisible: boolean,
    dispatch: Dispatch<MultiQuestionAction>;
    MultiRef: MutableRefObject<MultiQuestionRef>;
    answeredCount: number;
    onEndTest: () => Promise<void>;
}

const ConfirmSubmitDialog: React.FC<ConfirmSubmitDialogProps> = React.memo(
    (props) => {
        return (
            <Dialog visible={props.isDialogVisible} header={<b>Bạn có chắc muốn nộp bài</b>} onHide={() => props.dispatch({ type: "SET_VISIBLE", payload: true })}>
                <div className="flex flex-column gap-4">
                    {props.answeredCount < props.MultiRef.current.totalQuestions && <h1>Bạn có {props.MultiRef.current.totalQuestions - props.answeredCount} câu chưa làm !</h1>}
                    <div className="flex justify-content-end">
                        <Button severity="success" label="Chấp nhận nộp bài" onClick={props.onEndTest} />
                    </div>
                </div>
            </Dialog>
        )
    }
)
function checkIsAllowToChangePage(questionList: MultipleChoiceQuestion[], page: number, currentPageIndex: number): boolean {
    return (questionList[currentPageIndex].partNum <= 4 || questionList[page].partNum <= 4);
}

type ColorString = 'info' | 'secondary' | 'warning' | 'help';
function getColorButtonOnAnswerSheet(answer: string, isOnPage: boolean, isFlag: boolean): ColorString {
    let returnString: ColorString = 'secondary';
    if (answer) {
        returnString = 'info'
    }
    if (isFlag) {
        returnString = 'warning';
    }
    return isOnPage ? 'help' : returnString;
}

interface ButtonListProps {
    pageMapper: QuestionPage[],
    userAnswerSheet: TestAnswerSheet,
    currentPageIndex: number,
    questionList: MultipleChoiceQuestion[],
    flags: boolean[],
    dispatch: Dispatch<MultiQuestionAction>,
}

const ButtonList: React.FC<ButtonListProps> = memo(
    ({
        pageMapper,
        userAnswerSheet,
        currentPageIndex,
        questionList,
        flags,
        dispatch,
    }) => {
        if (userAnswerSheet.size <= 0) {
            return <h1 key={"error-button-list"}>Lỗi rồi</h1>;
        }

        let part = 0;
        return (
            <>
                {pageMapper.map((pq, index) => {
                    const isOnPage = currentPageIndex === pq.page;
                    const text = userAnswerSheet.get(pq.questionNum)?.userAnswer ?? "";
                    const isDisabled = checkIsAllowToChangePage(questionList, pq.page, currentPageIndex);
                    let newPart = false;

                    if (part !== pq.part) {
                        part = pq.part;
                        newPart = true;
                    }

                    return (
                        <React.Fragment key={`section_for_each_question_${index}`}>
                            {newPart && <h5 className="w-full text-blue-600">Part {pq.part}</h5>}
                            <Button
                                disabled={isDisabled}
                                style={{ width: "60px", aspectRatio: "1/1" }}
                                className="border-round-md border-solid text-center p-2"
                                label={pq.questionNum.toString()}
                                severity={getColorButtonOnAnswerSheet(text, isOnPage, flags[index])}
                                onClick={() => {
                                    if (!isOnPage) {
                                        dispatch({
                                            type: "SET_CURRENT_PAGE_INDEX",
                                            payload: pq.page,
                                        });
                                    }
                                }}
                            />
                        </React.Fragment>
                    );
                })}
            </>
        );
    }
);

export default {
    ButtonList,
    TestToolbar,
    SubmitLoading,
    RenderPressStartButton,
    ConfirmSubmitDialog,
    LoadingGetQuestionFromServer,
}