import React, { memo } from "react";
import { Navigate } from "react-router-dom";
import { FullTestArea } from "../../components/Common/MultipleChoiceQuestion/FullTestArea";
import SubmitLoading from "../../components/User/TestComponent/SubmitLoading";
import TestToolbar from "../../components/User/TestComponent/TestToolBar";
import { useFullTestScreen, useRenderTest, useTestScreen } from "../../hooks/TestHook";
import { AmINotLoggedIn } from "../../utils/AuthCheck";
import { RenderTestProps, RennderTutorialProps } from "../../utils/types/props";
import { MultipleChoiceQuestion } from "../../utils/types/type";
//--------------------------------------------------------------------------
// Hàm chính `DoTestPage` để hiển thị giao diện trang làm bài thi
function DoTestPage() {

    // Kiểm tra nếu người dùng chưa đăng nhập, chuyển hướng về trang đăng nhập
    if (AmINotLoggedIn()) return <Navigate to={"/home?login=true"} />

    //--------------------------------------------------------------------------
    // Render giao diện chính của trang thi
    return (
        <main id="do-test-page" className="w-full h-full flex flex-column">
            <RenderMainPage />
        </main>
    )
}

//--------------------------------------------------------------------------
// Xuất component chính `DoTestPage` với tính năng ghi nhớ (memoization) để tối ưu hiệu năng
export default memo(DoTestPage);

//--------------------------------------------------------------------------
// Component `RenderMainPage` dùng để hiển thị nội dung cụ thể của trang
const RenderMainPage: React.FC = () => {
    const { id, testScreenState } = useTestScreen()

    switch (testScreenState) {
        case "DOING_TEST":
            return <FullTestScreen />;
        case "SUBMITING":
            return <SubmitLoading />;
        default:
            return <Navigate to={`/test/${id}`}></Navigate>
    }

    //--------------------------------------------------------------------------
    // Tính số lượng câu hỏi đã được trả lời (memoized để tối ưu hiệu năng)
    // const answeredCount = React.useMemo(() => {
    //     return Array.from(props.state.userAnswerSheet.values())
    //         .filter((answerPair) => answerPair.userAnswer !== "").length;
    // }, [props.state.userAnswerSheet]);

    //--------------------------------------------------------------------------
    // Render giao diện chính của phần làm bài thi


}




const FullTestScreen: React.FC = React.memo(
    () => {
        const { fullTestScreenDispatch, fullTestScreenState, testPaperRef, changePage } = useFullTestScreen();
        const thisQuestion = testPaperRef.current.listMultipleChoiceQuestions[fullTestScreenState.currentPageIndex];
        if (NotShowThisPartTutorialYet(thisQuestion, fullTestScreenState.tutorials)) {
            return (
                <RennderTutorial partNeedToShow={thisQuestion.partNum} dispatchTutorialIsDone={fullTestScreenDispatch} />
            )
        }

        return (
            <RenderTest changePage={changePage}
                testPaperRef={testPaperRef}
                thisQuestion={thisQuestion}
                fullTestScreenDispatch={fullTestScreenDispatch}
            />
        )
    }
)

const RennderTutorial: React.FC<RennderTutorialProps> = React.memo(
    (props) => {
        return (
            <h1>tutorials {props.partNeedToShow}</h1>
        )
    }
)

const RenderTest: React.FC<RenderTestProps> = React.memo(
    (props) => {
        const { renderTestRef,
            renderTestState,
            renderTestDispatch, } = useRenderTest(props.testPaperRef.current);
        return (
            <section>
                {/* Giao diện làm bài thi */}
                <section className="flex flex-column justify-content-center">

                    {/* Thanh công cụ khi làm bài thi */}
                    <TestToolbar
                        renderTestRef={renderTestRef}
                        renderTestState={renderTestState}
                        renderTestDispatch={renderTestDispatch}
                    />

                    {/* Khu vực chính hiển thị câu hỏi và các nút điều hướng */}
                    <div id="test-area-container" className="max-w-screen p-0">
                        <FullTestArea
                            dispatch={renderTestDispatch}
                            changePage={props.changePage}
                            userAnswerSheet={renderTestState.userAnswerSheet}
                            question={props.thisQuestion}
                        />
                    </div>
                </section>
            </section>
        )
    }
)

function NotShowThisPartTutorialYet(question: MultipleChoiceQuestion, tutorials: boolean[]): boolean {
    return !tutorials[question.partNum - 1]

}