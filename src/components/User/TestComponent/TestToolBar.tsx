import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useState } from "react";
import CountNotEmptyAnswers from "../../../utils/helperFunction/CountAnswered";
import { TestToolBarProps, ToolBarFrameProps, UserAnswerSideBarProps, UserAnswerSideTabProps } from "../../../utils/types/props";

const TestToolbar: React.FC<TestToolBarProps> =
    ({ doTestDataRef, currentPageIndex }) => {
        {/* Thanh công cụ chứa bộ đếm thời gian và nút nộp bài */ }

        // Tính số lượng câu hỏi đã được trả lời (memoized để tối ưu hiệu năng)

        const answeredCount = CountNotEmptyAnswers(doTestDataRef);


        return (
            <ToolbarFrame answeredCount={answeredCount}
                currentPageIndex={currentPageIndex}
                doTestDataRef={doTestDataRef}

            />

        )
    }

const ToolbarFrame: React.FC<ToolBarFrameProps> =
    ({ answeredCount, doTestDataRef: dotestDataRef }) => {
        const [, setReload] = useState(false);
        useEffect(() => {
            setReload(pre => !pre);
        }, [answeredCount]);
        return (
            < Toolbar className="py-1"
                start={<UserAnswerSideTab answeredCount={answeredCount} dotestDataRef={dotestDataRef} />}
            // center={< SimpleTimeCountDown onTimeUp={() => props.onEndTest()} isTutorial={false} />}
            // end={<RightSideToolbar dispatch={props.dispatch} flags={props.state.flags} pageIndex={props.state.currentPageIndex} />}
            />

        )
    }


const UserAnswerSideTab: React.FC<UserAnswerSideTabProps> = React.memo(
    ({ answeredCount, dotestDataRef }) => {
        const [isShowed, setIsShowed] = useState(false);
        return (
            <>
                <UserAnswerSideBar isShowed={isShowed} setIsShowed={setIsShowed} />
                <Button severity="help" label={`Số câu đã trả lời: ${answeredCount} / ${dotestDataRef.current.totalQuestions}`} icon="pi pi-arrow-right" onClick={() => setIsShowed(true)} />
            </>
        )
    }
)

const UserAnswerSideBar: React.FC<UserAnswerSideBarProps> = React.memo(
    ({ isShowed, setIsShowed }) => {
        return (
            <Sidebar header={< h2 className="text-center" > Câu trả lời</h2>} visible={isShowed} onHide={() => setIsShowed(false)}>
                <div className="flex flex-wrap gap-2 justify-content-left">
                    hé lô
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