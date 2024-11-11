import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { memo, useCallback } from "react";
import { LoadingSpinner, TestArea, UserAnswerSheet } from "../components/Common/Index";
import useExercisePage from "../hooks/ExerciseHook";
import { TestAnswerSheet } from "../utils/types/type";

function DoExercisePage() {
    // Gọi hook tùy chỉnh để lấy danh sách câu hỏi, ánh xạ trang, tổng số câu hỏi và các hàm điều khiển trạng thái
    const {
        setIsUserAnswerSheetVisible,
        isUserAnswerSheetVisible,
        setCurrentPageIndex,
        setTestAnswerSheet,
        currentPageIndex,
        userAnswerSheet,
        totalQuestions,
        questionList,
        pageMapper,
        changePage,
        timeDoTest,
        onEndTest,
        setStart,
        start,
    } = useExercisePage();
    // Tạo danh sách nút điều hướng dựa trên pageMapper
    const createButtonListElement = useCallback((): JSX.Element[] => {
        if (userAnswerSheet.size <= 0) {
            return [<h1 key={"error-button-list"}>Lỗi rồi</h1>];
        }
        return pageMapper.map((pq, index) => {
            const isOnPage = currentPageIndex === pq.page;
            const text = userAnswerSheet.get(pq.questionNum)?.userAnswer ?? "";
           
            return (
                <Button
                    key={"answer_" + index}
                    style={{ width: '60px', aspectRatio: '1/1' }}
                    className={"border-round-md border-solid text-center p-2"}
                    label={pq.questionNum.toString()}
                    severity={getColorButtonOnAnswerSheet(text, isOnPage)} // Cập nhật màu sắc nút theo câu trả lời
                    onClick={() => {
                        if (!isOnPage) {
                            setCurrentPageIndex(pq.page);
                        }
                    }}
                />

            );
        })
    }, [userAnswerSheet.size])


    // Render giao diện chính của trang thi
    return totalQuestions > 0 ? (
        <main id="do-test-page" className="w-full">
            {/* Nút bắt đầu bài thi */}
            {!start && (
                <div className="flex justify-content-center h-full align-content-center">
                    <Button label="Bắt đầu" onClick={() => {
                        // bắt đầu tính giờ đếm số giây đã trôi qua
                        timeDoTest.current = Date.now();
                        // mở giao diện làm bài
                        setStart(true)
                    }} />
                </div>
            )}

            {/* Giao diện làm bài thi */}
            {start && (
                <section className="flex flex-column justify-content-center">
                    {/* Phiếu trả lời của người dùng */}
                    <UserAnswerSheet
                        visible={isUserAnswerSheetVisible}
                        setVisible={setIsUserAnswerSheetVisible}
                        ButtonListElement={createButtonListElement()}
                    />

                    {/* Thanh công cụ chứa bộ đếm thời gian và nút nộp bài */}
                    <Toolbar
                        className="py-1"
                        start={currentStatusBodyTemplate(userAnswerSheet, totalQuestions, setIsUserAnswerSheetVisible)}
                        end={
                            <Button
                                severity="success"
                                label="Nộp bài"
                                onClick={() => onEndTest()}
                            />
                        }
                    />

                    {/* Khu vực chính để hiển thị câu hỏi và các nút điều hướng */}
                    <div id="test-area-container" className="max-w-screen p-0">
                        <TestArea
                            changePage={changePage}
                            parts={practiceType}
                            question={questionList[currentPageIndex]}
                            setTestAnswerSheet={setTestAnswerSheet}
                            userAnswerSheet={userAnswerSheet}
                        />
                    </div>
                </section>
            )}
        </main>
    ) : <LoadingSpinner text="Bài kiểm tra đang được khởi tạo...." />


}





export default memo(DoExercisePage);
//--------------------------------- helpper function for main component



function getColorButtonOnAnswerSheet(answer: string, isOnPage: boolean): 'info' | 'secondary' | 'warning' {
    const returnString = answer ? 'info' : 'secondary';
    return isOnPage ? 'warning' : returnString;
}

function currentStatusBodyTemplate(userAnswers: TestAnswerSheet, totalQuestions: number, setVisible: React.Dispatch<React.SetStateAction<boolean>>) {
    const answeredCount = Array.from(userAnswers.values()).filter(
        (answerPair) => answerPair.userAnswer !== ""
    ).length;
    return (
        <Button severity="help" label={`Số câu đã trả lời: ${answeredCount} / ${totalQuestions}`} icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
    )
}

//----------------------------------------------- sub componet

