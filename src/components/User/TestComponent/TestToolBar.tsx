import { TestToolBarProps } from "../../../utils/types/props";

const TestToolbar: React.FC<TestToolBarProps> = () => {
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

// function currentStatusBodyTemplate(answeredCount: number, totalQuestions: number, dispatch: React.Dispatch<MultiQuestionAction>) {

//     return (
//         <Button severity="help" label={`Số câu đã trả lời: ${answeredCount} / ${totalQuestions}`} icon="pi pi-arrow-right" onClick={() => dispatch({ type: "SET_USER_ANSWER_SHEET_VISIBLE", payload: true })} />
//     )
// }

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