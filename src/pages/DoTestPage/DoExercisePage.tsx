import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { memo, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { LoadingSpinner, TestArea, UserAnswerSheet } from "../../components/Common/Index";
import useExercisePage from "../../hooks/ExerciseHook";
import { AmINotLoggedIn } from "../../utils/helperFunction/AuthCheck";
import { DoExercisePageProps } from "../../utils/types/props";
import { TestAnswerSheet } from "../../utils/types/type";

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
        startTest,
        onEndTest,
        isSumit,
        start,
    } = useExercisePage();

    if (AmINotLoggedIn()) return <Navigate to={"/home?login=true"} />

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
    }, [userAnswerSheet, currentPageIndex, pageMapper, setCurrentPageIndex])


    // Render giao diện chính của trang thi
    return (
        <main id="do-test-page" className="w-full">
           <RenderMainPage changePage={changePage}  onEndTest={onEndTest}
                isUserAnswerSheetVisible={isUserAnswerSheetVisible} 
                setIsUserAnswerSheetVisible={setIsUserAnswerSheetVisible} startTest={startTest}
                setTestAnswerSheet={setTestAnswerSheet} timeDoTest={timeDoTest} start={start} isSumit={isSumit}
                totalQuestions={totalQuestions}  
                createButtonListElement={createButtonListElement} userAnswerSheet={userAnswerSheet}
                currentPageIndex={currentPageIndex}  questionList={questionList} 
            />

        </main>
    )


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

const RenderMainPage: React.FC<DoExercisePageProps> = (props) => {
    if (props.isSumit) {
        return (
            <section>
                <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
                    <LoadingSpinner text="Xin vui lòng chờ...." />
                </div>
            </section>

        )
    }
    if (props.totalQuestions <= 0) {
        return (
            <section>
                <Link to={`/exercise`}>
                    <Button className="fixed" label="Quay về" />
                </Link>
                <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
                    <LoadingSpinner text="Xin vui lòng chờ...." />
                </div>
            </section>

        )
    }
    if (!props.start) {
        return (
            <section>
                {/* Nút bắt đầu bài thi */}
                <Link to={`/exercise`}>
                    <Button className="fixed" label="Quay về" />
                </Link>
                <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
                    <div className="text-center">

                        <Button label="Bắt đầu" onClick={() => {
                            // bắt đầu tính giờ đếm số giây đã trôi qua
                            props.timeDoTest.current = Date.now();
                            // mở giao diện làm bài
                            props.startTest();
                        }} />
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section>
            {/* Giao diện làm bài thi */}

            <section className="flex flex-column justify-content-center">
                {/* Phiếu trả lời của người dùng */}
                <UserAnswerSheet
                    visible={props.isUserAnswerSheetVisible}
                    setVisible={props.setIsUserAnswerSheetVisible}
                    ButtonListElement={props.createButtonListElement()}
                />

                {/* Thanh công cụ chứa bộ đếm thời gian và nút nộp bài */}
                <Toolbar
                    className="py-1"
                    start={currentStatusBodyTemplate(props.userAnswerSheet, props.totalQuestions, props.setIsUserAnswerSheetVisible)}
                    end={
                        <Button
                            severity="success"
                            label="Nộp bài"
                            onClick={() => props.onEndTest()}
                        />
                    }
                />

                {/* Khu vực chính để hiển thị câu hỏi và các nút điều hướng */}
                <div id="test-area-container" className="max-w-screen p-0">
                    <TestArea
                        changePage={props.changePage}
                        testType={"practice"}
                        question={props.questionList[props.currentPageIndex]}
                        setTestAnswerSheet={props.setTestAnswerSheet}
                        userAnswerSheet={props.userAnswerSheet}
                    />
                </div>
            </section>
        </section>
    )
}