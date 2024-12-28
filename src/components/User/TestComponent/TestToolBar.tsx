import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useState } from "react";
import { TestToolBarProps, ToolBarFrameProps, UserAnswerSideBarProps, UserAnswerSideTabProps } from "../../../utils/types/props";
import { ColorString, QuestionAnswerRecord, QuestionID, TestSheet } from "../../../utils/types/type";

const TestToolbar: React.FC<TestToolBarProps> =
    ({ doTestDataRef, currentPageIndex, answeredCount }) => {
        {/* Thanh công cụ chứa bộ đếm thời gian và nút nộp bài */ }

        const buttonElementList = CreateButtonList(currentPageIndex, doTestDataRef.current);

        return (
            <ToolbarFrame answeredCount={answeredCount}
                buttonElementList={buttonElementList}
                doTestDataRef={doTestDataRef}

            />

        )
    }

const ToolbarFrame: React.FC<ToolBarFrameProps> =
    ({ answeredCount, buttonElementList, doTestDataRef }) => {
        const [, setReload] = useState(false);
        useEffect(() => {
            setReload(pre => pre = !pre);
        }, [answeredCount]);
        return (
            < Toolbar className="py-1"
                start={<UserAnswerSideTab answeredCount={answeredCount} buttonElementList={buttonElementList} dotestDataRef={doTestDataRef} />}
            // center={< SimpleTimeCountDown onTimeUp={() => props.onEndTest()} isTutorial={false} />}
            // end={<RightSideToolbar dispatch={props.dispatch} flags={props.state.flags} pageIndex={props.state.currentPageIndex} />}
            />

        )
    }


const UserAnswerSideTab: React.FC<UserAnswerSideTabProps> = React.memo(
    ({ answeredCount, dotestDataRef, buttonElementList }) => {
        const [isShowed, setIsShowed] = useState(false);
        return (
            <>
                <UserAnswerSideBar isShowed={isShowed} setIsShowed={setIsShowed} buttonElementList={buttonElementList} />
                <Button severity="help" label={`Số câu đã trả lời: ${~~answeredCount} / ${dotestDataRef.current.totalQuestions}`} icon="pi pi-arrow-right" onClick={() => setIsShowed(true)} />
            </>
        )
    }
)

const UserAnswerSideBar: React.FC<UserAnswerSideBarProps> = React.memo(
    ({ isShowed, setIsShowed, buttonElementList }) => {
        return (
            <Sidebar header={< h2 className="text-center" > Câu trả lời</h2>} visible={isShowed} onHide={() => setIsShowed(false)}>
                <div className="flex flex-wrap gap-2 justify-content-left">
                    {buttonElementList}
                </div>
            </Sidebar >
        );
    }
)

// const RightSideToolbar: React.FC<{ flags: boolean[], pageIndex: number, dispatch: Dispatch<MultiQuestionAction> }> = React.memo(
//     ({ flags, pageIndex, dispatch }) => {
//         return (
//             < div className=" flex gap-1" >
//                 <Button severity={flags[pageIndex] ? "info" : "secondary"} label="🚩" onClick={() => dispatch({ type: "TOGGLE_FLAGS", payload: pageIndex })} />
//                 <Button severity="success" label="Nộp bài" onClick={() => dispatch({ type: "SET_VISIBLE", payload: true })}
//                 />
//             </div >
//         )
//     }
// )

export default TestToolbar;
function CreateButtonList(currentPageIndex: number, { questionList, totalQuestions }: TestSheet) {
    const buttonElementList: JSX.Element[] = Array<JSX.Element>(totalQuestions);
    let part = 0;
    for (const { questionId, userAnswer, partNum, pageIndex, subQuestions, questionNum, flag } of questionList) {
        if (part !== partNum) {
            part = partNum;
            buttonElementList.push(<h5 key={`part_${part}`} className="w-full text-blue-600">Part {part}</h5>);
        }
        const isOnPage = currentPageIndex === pageIndex;
        const isDisabled = partNum <= 4 || questionList[currentPageIndex].partNum <= 4;
        if (subQuestions.length > 0) {
            buttonElementList.push(CreateGroupButtonElement(subQuestions, isOnPage, isDisabled));
        } else {
            buttonElementList.push(CreateButtonElement(questionId, userAnswer, questionNum, flag, isOnPage, isDisabled))
        }
    }

    return (
        <>
            {buttonElementList}
        </>
    )
}
function CreateGroupButtonElement(subQuestions: QuestionAnswerRecord[], isOnPage: boolean, isDisabled: boolean): JSX.Element {
    return (
        <React.Fragment key={`group_${subQuestions[0].questionId}`}>
            {subQuestions.map(({ questionId, userAnswer, questionNum, flag }) => { return CreateButtonElement(questionId, userAnswer, questionNum, flag, isOnPage, isDisabled) })}
        </React.Fragment>
    )
}
function CreateButtonElement(questionId: QuestionID, userAnswer: string, questionNum: number, flag: boolean, isOnPage: boolean, isDisabled: boolean): JSX.Element {


    return (
        <Button
            severity={getColorButtonOnAnswerSheet(userAnswer, isOnPage)}
            className="border-round-md border-solid text-center p-2"
            style={{ width: "60px", aspectRatio: "1/1" }}
            key={`question_${questionId}`}
            text={!isOnPage && userAnswer === ""}
            label={`${questionNum}`}
            disabled={isDisabled}
        >{flag && <i className="absolute right-1 top-0 pi pi-flag-fill text-red-500" style={{ width: "15px" }}></i>}
        </Button>
    );
}

function getColorButtonOnAnswerSheet(answer: string, isOnPage: boolean): ColorString {
    let returnString: ColorString = 'secondary';
    if (answer) {
        returnString = 'info'
    }

    return isOnPage ? 'help' : returnString;
}
