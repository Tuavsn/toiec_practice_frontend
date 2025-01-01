import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useState } from "react";
import { TestToolBarProps, TimerClockProps, ToolBarFrameProps, UserAnswerSideBarProps, UserAnswerSideTabProps } from "../../../utils/types/props";
import { ColorString, QuestionAnswerRecord, QuestionID, TestSheet } from "../../../utils/types/type";

const TestToolbar: React.FC<TestToolBarProps> =
    ({ doTestDataRef, currentPageIndex, moveToPage, onEndTest }) => {
        {/* Thanh công cụ chứa bộ đếm thời gian và nút nộp bài */ }
        const buttonElementList = CreateButtonList(currentPageIndex, doTestDataRef.current, moveToPage);

        return (
            <ToolbarFrame
                buttonElementList={buttonElementList}
                doTestDataRef={doTestDataRef}
                onEndTest={onEndTest}
            />

        )
    }

const ToolbarFrame: React.FC<ToolBarFrameProps> =
    ({ buttonElementList, doTestDataRef, onEndTest }) => {

        return (
            < Toolbar className="py-1"
                start={<UserAnswerSideTab buttonElementList={buttonElementList} dotestDataRef={doTestDataRef} />}
                center={< TimerClock doTestDataRef={doTestDataRef} onEndTest={onEndTest} />}
                end={<RightSideToolbar onEndTest={onEndTest} doTestDataRef={doTestDataRef} />}
            />

        )
    }

const RightSideToolbar: React.FC<{ onEndTest: () => void, doTestDataRef: React.MutableRefObject<TestSheet> }> = React.memo(
    ({ doTestDataRef, onEndTest }) => {
        const [isShowed, setIsShowed] = useState(false);
        const { answeredCount, totalQuestions } = doTestDataRef.current;
        return (
            <div className=" flex gap-1" >
                <Button severity="success" label="Nộp bài" onClick={() => setIsShowed(true)} />
                <Dialog visible={isShowed} header={<b>Bạn có chắc muốn nộp bài</b>} onHide={() => setIsShowed(false)}>
                    <div className="flex flex-column gap-4">
                        {answeredCount < totalQuestions && <h1>Bạn có {totalQuestions - answeredCount} câu chưa làm !</h1>}
                        <div className="flex justify-content-end">
                            <Button severity="success" label="Chấp nhận nộp bài" onClick={onEndTest} />
                        </div>
                    </div>
                </Dialog>
            </div >
        )
    }
)


const TimerClock: React.FC<TimerClockProps> = React.memo(
    ({ doTestDataRef, onEndTest }) => {
        const [, setTick] = useState(false);
        useEffect(() => {
            const timer = setInterval(() => {
                doTestDataRef.current.secondsLeft -= 0.5;
                if (doTestDataRef.current.secondsLeft <= 0) {
                    clearInterval(timer);
                    onEndTest();
                }
                setTick(prev => prev = !prev)
            }, 500);
            return () => clearInterval(timer);
        }, []);
        const secondsLeft = doTestDataRef.current.secondsLeft;
        const minutes = ~~(secondsLeft / 60);
        const seconds = ~~(secondsLeft % 60);

        // Determine background color class based on time left
        const bgColorClass = secondsLeft <= 60 ? 'bg-red-200' : 'bg-blue-200';

        return (
            <div className={` text-center align-items-center justify-content-center`}>
                <h5 className={`px-1 inline py-1 ${bgColorClass} border-dashed border-round-md`}>
                    {minutes} phút và {seconds < 10 ? `0${seconds}` : seconds} giây
                </h5>
            </div>
        );

    }
)

const UserAnswerSideTab: React.FC<UserAnswerSideTabProps> = React.memo(
    ({ dotestDataRef, buttonElementList }) => {
        const [isShowed, setIsShowed] = useState(false);
        const { answeredCount, totalQuestions } = dotestDataRef.current;
        return (
            <>
                <UserAnswerSideBar isShowed={isShowed} setIsShowed={setIsShowed} buttonElementList={buttonElementList} />
                <Button severity="help" label={`Số câu đã trả lời: ${answeredCount} / ${totalQuestions}`} icon="pi pi-arrow-right" onClick={() => setIsShowed(true)} />
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

export default TestToolbar;
// Hàm tạo danh sách các nút bấm cho các câu hỏi
function CreateButtonList(currentPageIndex: number, { questionList, testType }: TestSheet, moveToPage: (pageIndex: number) => void) {
    // Tạo mảng chứa các phần tử JSX cho các nút bấm
    const buttonElementList: JSX.Element[] = [];

    let part = 0; // Biến theo dõi phần của câu hỏi
    for (const { questionId, userAnswer, partNum, pageIndex, subQuestions, questionNum, flag } of questionList) {
        // Nếu phần câu hỏi thay đổi, thêm tiêu đề phần
        if (part !== partNum) {
            part = partNum;
            buttonElementList.push(<h5 key={`part_${part}`} className="w-full text-blue-600">Part {part}</h5>);
        }

        // Kiểm tra xem câu hỏi có nằm trên trang hiện tại không
        const isOnPage = currentPageIndex === pageIndex;
        // Kiểm tra xem câu hỏi có bị vô hiệu hóa hay không
        const isDisabled = testType === "fulltest" && (partNum <= 4 || questionList[currentPageIndex].partNum <= 4);

        // Nếu có các câu hỏi con, tạo nhóm nút bấm cho chúng
        if (subQuestions.length > 0) {
            buttonElementList.push(CreateGroupButtonElement(subQuestions, isOnPage, isDisabled, moveToPage));
        } else {
            // Nếu không có câu hỏi con, tạo nút bấm cho câu hỏi đơn
            buttonElementList.push(CreateButtonElement(questionId, userAnswer, questionNum, flag, isOnPage, isDisabled, pageIndex, moveToPage));
        }
    }

    return (
        <>
            {buttonElementList /* Hiển thị danh sách các nút bấm */}
        </>
    )
}

// Hàm tạo nhóm các nút bấm cho câu hỏi con
function CreateGroupButtonElement(subQuestions: QuestionAnswerRecord[], isOnPage: boolean, isDisabled: boolean, moveToPage: (pageIndex: number) => void): JSX.Element {
    return (
        <React.Fragment key={`group_${subQuestions[0].questionId}`}>
            {subQuestions.map(({ questionId, userAnswer, questionNum, flag, pageIndex }) => {
                return CreateButtonElement(questionId, userAnswer, questionNum, flag, isOnPage, isDisabled, pageIndex, moveToPage);
            })}
        </React.Fragment>
    );
}

// Hàm tạo nút bấm cho câu hỏi đơn
function CreateButtonElement(
    questionId: QuestionID,
    userAnswer: string,
    questionNum: number,
    flag: boolean,
    isOnPage: boolean,
    isDisabled: boolean,
    pageIndex: number,
    moveToPage: (pageIndex: number) => void
): JSX.Element {
    return (
        <Button
            severity={getColorButtonOnAnswerSheet(userAnswer, isOnPage)} // Xác định màu nút bấm dựa trên câu trả lời
            className="border-round-md border-solid text-center p-2"
            style={{ width: "60px", aspectRatio: "1/1" }}
            key={`question_${questionId}`}
            text={!isOnPage && userAnswer === ""} // Hiển thị ô trống nếu câu hỏi chưa trả lời và không ở trang hiện tại
            label={`${questionNum}`} // Hiển thị số câu hỏi
            disabled={isDisabled} // Vô hiệu hóa nút nếu câu hỏi bị vô hiệu hóa
            onClick={() => moveToPage(pageIndex)} // Chuyển trang khi nút bấm
        >
            {flag && <i className="absolute right-1 top-0 pi pi-flag-fill text-red-500" style={{ width: "15px" }}></i>}
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
