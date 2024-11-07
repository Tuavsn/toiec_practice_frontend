import { useNavigate, useParams } from "react-router-dom";
import React, { memo, useEffect, useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import '../App.css'
import { SimpleTimeCountDownProps, TestAnswerSheet, TestID, TestType } from "../utils/types/type";
import { LoadingSpinner, TestArea, UserAnswerSheet } from "../components/Common/Index";
import useTestPage from "../hooks/TestHook";

function DoTestPage() {
    // Sử dụng hook điều hướng
    const navigate = useNavigate();

    // Lấy tham số từ URL (id của bài thi và các phần của bài thi)
    const { id = "", parts = "", type = "fulltest" } = useParams<{ id: TestID, parts: string, type: TestType }>();

    // State để kiểm soát việc hiển thị phiếu trả lời của người dùng
    const [isUserAnswerSheetVisible, setIsUserAnswerSheetVisible] = useState(false);

    // State để kiểm soát trạng thái bắt đầu bài thi
    const [start, setStart] = useState<boolean>(false);


    // Gọi hook tùy chỉnh để lấy danh sách câu hỏi, ánh xạ trang, tổng số câu hỏi và các hàm điều khiển trạng thái
    const {
        questionList,
        pageMapper,
        totalQuestions,
        setIsOnTest,
        userAnswerSheet,
        setTestAnswerSheet,
        setCurrentPageIndex,
        currentPageIndex,
        changePage,
        timeDoTest,
        sendFinalResultToServer
    } = useTestPage(id, parts, type);

    // Hàm kết thúc bài thi và điều hướng đến trang xem lại
    const onEndTest = () => {
        setIsOnTest(false);
        sendFinalResultToServer();
        navigate(`/test/${~~(Math.random() * 1_000_000)}/review`);
    };

    // Tạo danh sách nút điều hướng dựa trên pageMapper
    const ButtonListElement = userAnswerSheet.size > 0 ? pageMapper.map((pq, index) => {
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
        : [<h1 key={"error-button-list"}>Lỗi rồi</h1>]

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
                        ButtonListElement={ButtonListElement}
                    />

                    {/* Thanh công cụ chứa bộ đếm thời gian và nút nộp bài */}
                    <Toolbar
                        className="py-1"
                        start={currentStatusBodyTemplate(userAnswerSheet, totalQuestions, setIsUserAnswerSheetVisible)}
                        center={
                            <SimpleTimeCountDown
                                onTimeUp={() => onEndTest()}
                                timeLeftInSecond={900}
                            />
                        }
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
                            parts={parts}
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





export default memo(DoTestPage);
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
const SimpleTimeCountDown: React.FC<SimpleTimeCountDownProps> = React.memo(
    ({ timeLeftInSecond, onTimeUp }) => {
        const [secondsLeft, setSecondsLeft] = useState(timeLeftInSecond);

        useEffect(() => {
            if (secondsLeft <= 0) {
                onTimeUp();
                return;
            }

            const timer = setInterval(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }, [secondsLeft]);

        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;

        // Determine background color class based on time left
        const bgColorClass = secondsLeft <= 30 ? 'bg-red-200' : 'bg-blue-200';

        return (
            <div className={` text-center
    align-items-center justify-content-center`}>
                <h5 className={`px-1 inline py-1 ${bgColorClass} border-dashed border-round-md`}>
                    {minutes} phút và {seconds < 10 ? `0${seconds}` : seconds} giây
                </h5>
            </div>
        );
    }
)
