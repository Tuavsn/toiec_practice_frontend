import React, { memo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FullTestArea } from "../../components/Common/MultipleChoiceQuestion/FullTestArea";
import RennderTutorial from "../../components/Common/MultipleChoiceQuestion/TutorialSection";
import SubmitLoading from "../../components/User/TestComponent/SubmitLoading";
import TestToolbar from "../../components/User/TestComponent/TestToolBar";
import { TestScreenState, useTestFrame, useTestScreen } from "../../hooks/TestHook";
import { AmINotLoggedIn } from "../../utils/helperFunction/AuthCheck";
import { RenderTestProps } from "../../utils/types/props";
import { QuestionAnswerRecord } from "../../utils/types/type";
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
    const { testScreenState, setTestScreenState } = useTestScreen()
    const navigate = useNavigate();

    // Kiểm tra trạng thái màn hình thi để quyết định nội dung cần hiển thị
    switch (testScreenState.state) {
        case "DOING_TEST": // Khi đang làm bài thi
            return <TestFrame setTestScreenState={setTestScreenState} />;
        case "SUBMITING": // Khi đang gửi bài
            return <SubmitLoading />;
        case "NAVIGATE_TO_RESULT": // Khi đang gửi bài
            return <Navigate to={`/test/${testScreenState.resultID}/review`} />;
        default: // Nếu trạng thái không xác định, điều hướng lại
            if (window.history.length > 1) {
                navigate(-1);
            } else {
                navigate("/test")
            }
            return <></>;
    }
}

//--------------------------------------------------------------------------
// Component `TestFrame` dùng để quản lý và hiển thị giao diện làm bài thi chính
const TestFrame: React.FC<{ setTestScreenState: React.Dispatch<React.SetStateAction<TestScreenState>> }> = React.memo(
    ({ setTestScreenState }) => {
        const {
            fullTestScreenDispatch,
            fullTestScreenState,
            doTestDataRef,
            thisQuestion,
            changePage,
            moveToPage,
            onEndTest,
            autoSaveDraftTest
        } = useTestFrame(setTestScreenState);
        if (fullTestScreenState.isLoading) return <SubmitLoading />
        // Nếu chưa hiển thị phần hướng dẫn của bài thi hiện tại, hiển thị hướng dẫn
        if (NotShowThisPartTutorialYet(thisQuestion, fullTestScreenState.tutorials)) {
            return <RennderTutorial partNeedToShow={thisQuestion.partNum} dispatchTutorialIsDone={fullTestScreenDispatch} />
        }
        doTestDataRef.current.timeCountStart = Date.now();
        // Khi đã tải xong, hiển thị giao diện làm bài thi
        return (
            <RenderTest
                currentPageIndex={fullTestScreenState.currentPageIndex}
                changePageOffset={changePage}
                autoSaveDraftTest={autoSaveDraftTest}
                doTestDataRef={doTestDataRef}
                thisQuestion={thisQuestion}
                moveToPage={moveToPage}
                onEndTest={onEndTest}
            />
        )
    }
)

//--------------------------------------------------------------------------
// Component `RenderTest` hiển thị giao diện chính khi làm bài thi
const RenderTest: React.FC<RenderTestProps> = React.memo(
    ({ changePageOffset, moveToPage, currentPageIndex, doTestDataRef, thisQuestion, onEndTest ,autoSaveDraftTest}) => {
        const [, setReloadToolbar] = useState<boolean>(false);
        return (

            < section className="flex flex-column justify-content-center" >
                {/* Thanh công cụ khi làm bài thi */}
                < TestToolbar
                    currentPageIndex={currentPageIndex}
                    doTestDataRef={doTestDataRef}
                    thisQuestion={thisQuestion}
                    moveToPage={moveToPage}
                    onEndTest={onEndTest}
                />

                {/* Khu vực chính hiển thị câu hỏi và các nút điều hướng */}
                < div id="test-area-container" className="max-w-screen p-0" >
                    <FullTestArea
                        autoSaveDraftTest={autoSaveDraftTest}
                        thisQuestion={thisQuestion}
                        doTestDataRef={doTestDataRef}
                        setReloadToolbar={setReloadToolbar}
                        changePageOffset={changePageOffset}
                    />
                </div >
            </section >
        )
    }
)

//--------------------------------------------------------------------------
// Hàm kiểm tra nếu phần hướng dẫn cho câu hỏi hiện tại chưa được hiển thị
function NotShowThisPartTutorialYet(question: QuestionAnswerRecord, tutorials: boolean[]): boolean {
    return question && !tutorials[question.partNum - 1]
}
