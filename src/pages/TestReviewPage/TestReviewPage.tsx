import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import { Sidebar } from "primereact/sidebar";
import { Toolbar } from "primereact/toolbar";
import React, { Dispatch, memo, useCallback, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { ColorString } from "../../utils/types/type";
import { LoadingSpinner } from "../components/Common/Index";
import useTestReview from "../hooks/TestReviewHook";
import { AmINotLoggedIn } from "../utils/helperFunction/AuthCheck";
import { ConvertSolutionToHTML, ConvertTopicToHTML, ConvertUserAnswerRecordToHTML } from "../utils/helperFunction/convertToHTML";
import { TestReviewHookAction } from "../utils/types/action";
import { TestReviewAreaProps, UserAnswerSheetReviewProps } from "../utils/types/props";
import { QuestionPage, UserAnswerRecord, } from "../utils/types/type";

//-------------- Main Component: TestReviewPage -------------- -------------- -------------- -------------- -------------- -------------- -------------- 

function TestReviewPage() {
    const { state, dispatch } = useTestReview();

    if(AmINotLoggedIn()) return <Navigate to={"/home?login=true"} />

    const question = state.testReviewAnswerSheet[state.currentPageIndex];

    // Giao diện chính của trang làm bài thi
    return state.testReviewAnswerSheet.length ? (
        <main id="do-test-page" className="w-full h-full pt-8">
            {/* Giao diện làm bài thi */}
            <section className="flex flex-column justify-content-center">
                {/* Phiếu trả lời của người dùng */}
                <UserAnswerSheet state={state} dispatch={dispatch} />
                {/* Thanh công cụ chứa nút bảng trả lời */}
                <Toolbar className="py-1" start={currentStatusBodyTemplate(dispatch)} />
                {/* Khu vực hiển thị câu hỏi */}
                <div id="test-area-container" className="max-w-screen p-0">
                    <TextReviewArea question={question} dispatch={dispatch} />
                </div>
                <TopicAndSolution question={question} />
            </section>
        </main>
    ) : (
        <LoadingSpinner text="Đang tìm hỏi đã lưu...." />
    );
}

export default memo(TestReviewPage);














//-------------- Helper Functions -------------- -------------- -------------- -------------- -------------- -------------- -------------- 



// Hàm xác định màu sắc nút dựa vào câu trả lời
function getColorButtonOnAnswerSheet(
    questionDetailRecord: UserAnswerRecord,
    isOnPage: boolean
): ColorString {
    let returnString: ColorString = "secondary";
    if (questionDetailRecord.userAnswer) {
        returnString = questionDetailRecord.correct ? "success" : "danger";
    }
    return isOnPage ? "info" : returnString;
}

// Hàm tạo nút "Bảng trả lời"
function currentStatusBodyTemplate(dispatch: Dispatch<TestReviewHookAction>): JSX.Element {
    return <Button severity="help" label="Bảng trả lời" icon="pi pi-arrow-right" onClick={() => dispatch({ type: "SET_ANSWER_SHEET_VISIBLE", payload: true })} />
}















//-------------- Subcomponents: TextReviewArea -------------- -------------- -------------- -------------- -------------- -------------- -------------- 

const TextReviewArea: React.FC<TestReviewAreaProps> = React.memo(({ question, dispatch }) => {
    const [resourcesElement, questionsElement] = ConvertUserAnswerRecordToHTML(question);

    return (
        <div className="flex xl:flex-row lg:flex-row flex-wrap md:flex-column sm:flex-column justify-content-between gap-1 custom-scrollpanel px-0 py-0">
            {/* Khu vực tài liệu tham khảo */}
            <ScrollPanel className="flex-1 custombar1 border-round m-2 shadow-2 test-resource" >
                {resourcesElement}
            </ScrollPanel>

            {/* Khu vực hiển thị câu hỏi */}
            <div className="flex-1" style={{ minWidth: "600px" }}>
                <div className="flex justify-content-end px-3 pt-2">
                    <b className="py-0 m-auto text-blue-300">Phần {question.partNum}</b>
                    <span>
                        <Button className="py-0 mr-1" icon="pi pi-angle-double-left" onClick={() => dispatch({ type: "MOVE_PAGE", payload: -1 })} />
                        <Button className="py-0" icon="pi pi-angle-double-right" onClick={() => dispatch({ type: "MOVE_PAGE", payload: 1 })}
                        />
                    </span>
                </div>
                <ScrollPanel className="custombar1 border-round m-2 shadow-2 pl-2 test-quest" >
                    {questionsElement}
                </ScrollPanel>
            </div>
        </div>
    );
});












//-------------- Subcomponents: UserAnswerSheet -------------- -------------- -------------- -------------- -------------- -------------- -------------- 

const UserAnswerSheet: React.FC<UserAnswerSheetReviewProps> = React.memo(({ state, dispatch }) => {
    // Hàm chuyển đổi trang
    const handlePageChange = useCallback(
        (page: number) => {
            if (state.currentPageIndex !== page) {
                dispatch({ type: "SET_PAGE", payload: page });
            }
        },
        [state.currentPageIndex]
    );

    // Danh sách nút điều hướng
    const createButtonListElement = useMemo(() => {
        if (state.testReviewAnswerSheet.length <= 0) {
            return [<h1 key="error-button-list">Lỗi rồi</h1>];
        }
        let part = 0;
        return state.pageMapper.map((pq:QuestionPage, index:number) => {
            const isOnPage = state.currentPageIndex === pq.page;
            let newPart = false;
            if (part != pq.part) {
                part = pq.part;
                newPart = true
            }
            return (
                <React.Fragment key={`section for each question ${index}`}>
                    {newPart && <><h5 className="w-full text-blue-600">Part {pq.part}</h5></>}
                    <Button
                        key={`answer_${index}`}
                        style={{ width: "60px", aspectRatio: "1/1" }}
                        className="border-round-md border-solid text-center p-2"
                        label={pq.questionNum.toString()}
                        severity={getColorButtonOnAnswerSheet(
                            state.testReviewAnswerSheet[pq.page],
                            isOnPage
                        )}
                        onClick={() => handlePageChange(pq.page)}
                    />
                </React.Fragment>
            );
        });
    }, [state.pageMapper, state.currentPageIndex, state.testReviewAnswerSheet, handlePageChange]);

    return (
        <Sidebar
            header={<h2 className="text-center">Câu trả lời</h2>}
            visible={state.isUserAnswerSheetVisible}
            onHide={() => dispatch({ type: "SET_ANSWER_SHEET_VISIBLE", payload: false })}
        >
            <div className="flex flex-wrap gap-2 justify-content-center">
                {createButtonListElement}
            </div>
        </Sidebar>
    );
});






//-------------- Subcomponents: Topic and solution -------------- -------------- -------------- -------------- -------------- -------------- -------------- 







const TopicAndSolution: React.FC<{ question: UserAnswerRecord }> = React.memo(
    ({ question }) => {
        return (
            <React.Fragment>
                <Card title="Chủ đề trong câu hỏi">
                    {ConvertTopicToHTML(question)}

                </Card>
                <Card title="Gợi ý giúp bạn cải thiện tốt hơn">
                    {ConvertSolutionToHTML(question)}
                </Card>
            </React.Fragment>
        )
    }
) 