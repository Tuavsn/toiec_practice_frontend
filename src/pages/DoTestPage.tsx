import { useNavigate, useParams } from "react-router-dom";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import '../App.css'
import { Card } from "primereact/card";
import { AnswerPair, SimpleTimeCountDownProps, TestAnswerSheet } from "../utils/types/type";
import { TestArea, UserAnswerSheet } from "../components/Common/Index";
import useTestPage from "../hooks/TestHook";

function DoTestPage() {
    // Sử dụng hook điều hướng
    const navigate = useNavigate();

    // Lấy tham số từ URL (id và parts)
    const { id = "", parts = "" } = useParams<{ id: string, parts: string }>();

    // Khai báo state để lưu phiếu trả lời của người dùng (Map câu hỏi và câu trả lời)
    const [userAnswerSheet, setUserAnswerSheet] = useState<TestAnswerSheet>(new Map<number, AnswerPair>());

    // Khai báo state để theo dõi trang hiện tại
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

    // State để kiểm soát việc hiển thị phiếu trả lời của người dùng
    const [isUserAnswerSheetVisible, setIsUserAnswerSheetVisible] = useState(false);

    // State để bắt đầu bài thi
    const [start, setStart] = useState<boolean>(false);

    // Gọi hook tùy chỉnh để lấy danh sách câu hỏi, bộ ánh xạ trang, và tổng số câu hỏi
    const { questionList, pageMapper, totalQuestions, setIsOnTest } = useTestPage(id, parts);

    // Hàm cập nhật phiếu trả lời của người dùng
    const setTestAnswerSheet = (qNum: number, qID: string, answer: string) => {
        const newMap = new Map(userAnswerSheet);
        newMap.set(qNum, { questionId: qID, userAnswer: answer });
        setUserAnswerSheet(newMap);
    }

    // Hàm kết thúc bài thi và điều hướng tới trang xem lại
    const onEndTest = () => {
        setIsOnTest(false);
        localStorage.setItem("userAnswer", JSON.stringify([...userAnswerSheet.values()]))
        navigate(`/test/${~~(Math.random() * 1_000_000)}/review`);
    }

    // Hàm chuyển trang khi người dùng nhấn nút điều hướng
    const changePage = useCallback((offset: number) => {
        const newPageIndex = currentPageIndex + offset;
        if (newPageIndex >= 0 && newPageIndex < questionList.length) {
            setCurrentPageIndex(newPageIndex);
        }
    }, [currentPageIndex, questionList.length]);

    // Tạo danh sách nút để điều hướng câu hỏi dựa trên pageMapper
    const ButtonListElement =
        pageMapper.map((pq, index) => {
            const isOnPage = currentPageIndex === pq.page;
            return (
                <Button
                    key={"answer_" + index}
                    style={{ width: '60px', aspectRatio: '1/1' }}
                    className={"border-round-md border-solid text-center p-2"}
                    label={(pq.questionNum).toString()}
                    severity={getColorButtonOnAnswerSheet(userAnswerSheet.get(pq.questionNum)?.userAnswer ?? "", isOnPage)} // Màu sắc cập nhật dựa trên giá trị "isOnPage"
                    onClick={() => {
                        if (!isOnPage) {
                            setCurrentPageIndex(pq.page);
                        }
                    }}
                />
            );
        })

    // Render giao diện bài thi
    return (totalQuestions &&
        <main className="pt-8 w-full">
            <h1 className="text-center"> Đề {id} với các phần {parts}</h1>
            {!start &&
                <div className="flex justify-content-center">
                    <Button label="bắt đầu" onClick={() => setStart(true)}></Button>

                </div>
            }
            {start &&
                <React.Fragment>
                    <UserAnswerSheet
                        visible={isUserAnswerSheetVisible}
                        setVisible={setIsUserAnswerSheetVisible}
                        ButtonListElement={ButtonListElement} />
                    <Toolbar
                        start={currentStatusBodyTemplate(userAnswerSheet, totalQuestions, setIsUserAnswerSheetVisible)}
                        center={
                            <SimpleTimeCountDown
                                onTimeUp={() => onEndTest()}
                                timeLeftInSecond={900} />
                        }
                        end={<Button severity="success" label="Nộp bài" onClick={() => onEndTest()} />}
                    />
                    <Card className="max-w-screen">

                        <TestArea changePage={changePage}
                            parts={parts}
                            question={questionList[currentPageIndex]}
                            setTestAnswerSheet={setTestAnswerSheet}
                            userAnswerSheet={userAnswerSheet} />

                    </Card>
                </React.Fragment>
            }
        </main >
    );
}





export default memo(DoTestPage);
//--------------------------------- helpper function for main component



function getColorButtonOnAnswerSheet(answer: string, isOnPage: boolean): 'info' | 'secondary' | 'warning' {
    const returnString = answer ? 'info' : 'secondary';
    return isOnPage ? 'warning' : returnString;
}

function currentStatusBodyTemplate(userAnswers: TestAnswerSheet, totalQuestions: number, setVisible: React.Dispatch<React.SetStateAction<boolean>>) {

    return (


        <Button severity="help" label={`Số câu đã trả lời: ${userAnswers.size} / ${totalQuestions}`} icon="pi pi-arrow-right" onClick={() => setVisible(true)} />

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
            <div className={` text-center  flex-1 
    align-items-center justify-content-center`}>
                <h5 className={`px-3 inline py-3 ${bgColorClass} border-dashed border-round-md`}>
                    {minutes} phút và {seconds < 10 ? `0${seconds}` : seconds} giây
                </h5>
            </div>
        );
    }
)
