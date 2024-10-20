import { useParams } from "react-router-dom";
import React, { memo, useEffect, useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { ScrollPanel } from "primereact/scrollpanel";
import '../App.css'
import { Card } from "primereact/card";
import { Sidebar } from "primereact/sidebar";
import { SimpleTimeCountDownProps, TestAreaProps, UserAnswerSheetProps } from "../utils/types/type";
import { useDoTest } from "../hooks/DoTestHook";

function DoTestPage() {
    const { id = "", parts = "" } = useParams<{ id: string, parts: string }>();

    const {
        resourcesElement,
        questionsElement,
        currentPageIndex,
        setCurrentPageIndex,
        changePage,
        isUserAnswerSheetVisible,
        setIsUserAnswerSheetVisible,
        mappingQuestionsWithPage
    } = useDoTest();
    const userAnswerSheet = Array<string>(mappingQuestionsWithPage.length).fill('');


    return (
        <main className="pt-8 w-full">

            <UserAnswerSheet
                currentPageIndex={currentPageIndex}
                userAnswerSheet={userAnswerSheet}
                visible={isUserAnswerSheetVisible}
                setVisible={setIsUserAnswerSheetVisible}
                GetButtonColor={getColorButtonOnAnswerSheet}
                mappingQuestionsWithPage={mappingQuestionsWithPage}
                setCurrentPageIndex={setCurrentPageIndex} />
            <h1 className="text-center"> Đề {id} với các phần {parts}</h1>
            <Toolbar
                start={currentStatusBodyTemplate(userAnswerSheet, setIsUserAnswerSheetVisible)}
                center={currentPartBodyTemplate}
                end={<Button severity="success" label="Nộp bài" />}
            />
            <Card>
                <SimpleTimeCountDown
                    onTimeUp={() => console.log("hết")}
                    timeLeftInSecond={40} />

                <div className="flex flex-column md:flex-row justify-content-between p-5 gap-4 custom-scrollpanel">
                    <TestArea changePage={changePage}
                        currentPageIndex={currentPageIndex}
                        parts={parts}
                        questionsElement={questionsElement}
                        resourcesElement={resourcesElement} />

                </div>



            </Card>



        </main >
    );

}




export default memo(DoTestPage);
//--------------------------------- helpper function for main component

function getColorButtonOnAnswerSheet(answer: string, isOnPage: boolean): 'info' | 'secondary' | 'warning' {
    const returnString = answer ? 'info' : 'secondary';
    return isOnPage ? 'warning' : returnString;
}



function currentPartBodyTemplate() {
    return (
        <h1 className="text-blue-300">PART 4</h1>
    );
}

function currentStatusBodyTemplate(userAnswers: string[], setVisible: React.Dispatch<React.SetStateAction<boolean>>) {
    var alreadyAnswer = 0;

    for (let ans of userAnswers) {
        if (ans)
            alreadyAnswer++;
    }
    return (


        <Button severity="help" label={`Số câu đã trả lời: ${alreadyAnswer} / ${userAnswers.length}`} icon="pi pi-arrow-right" onClick={() => setVisible(true)} />

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


const UserAnswerSheet: React.FC<UserAnswerSheetProps> = React.memo(
    ({ userAnswerSheet, visible, setVisible, GetButtonColor, setCurrentPageIndex, mappingQuestionsWithPage, currentPageIndex }) => {
        return (
            <Sidebar header={<h2 className="text-center">Câu trả lời</h2>} visible={visible} onHide={() => setVisible(false)}>
                <div className="flex flex-wrap gap-2 justify-content-center">
                    {userAnswerSheet.map((answer, index) => {
                        const isOnPage = currentPageIndex === mappingQuestionsWithPage[index];
                        return (
                            <Button
                                key={"answer_" + index}
                                style={{ width: '60px', aspectRatio: '1/1' }}
                                className={"border-round-md border-solid text-center p-2"}
                                label={(index + 1).toString()}
                                severity={GetButtonColor(answer, isOnPage)} // The color is updated based on the "isOnPage" value
                                onClick={() => {
                                    if (!isOnPage) {
                                        setCurrentPageIndex(mappingQuestionsWithPage[index]);
                                        // When the page changes, the component re-renders and updates the button color.
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </Sidebar>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.visible === nextProps.visible &&
            prevProps.userAnswerSheet.length === nextProps.userAnswerSheet.length &&
            prevProps.userAnswerSheet.every((answer, index) => answer === nextProps.userAnswerSheet[index]) &&
            prevProps.currentPageIndex === nextProps.currentPageIndex // Add this condition to allow re-renders when the page changes.
        );
    }
);



const TestArea: React.FC<TestAreaProps> = React.memo(
    ({ changePage, currentPageIndex, questionsElement, resourcesElement, parts }) => {
        return (
            <React.Fragment>
                <ScrollPanel
                    className="flex-1 custombar1  border-round m-2 shadow-2"
                    style={{ minHeight: '50px', overflowY: 'auto', maxHeight: '700px' }}
                >
                    {resourcesElement[currentPageIndex]}
                </ScrollPanel>

                <div className="flex-1 ">
                    {
                        parts != "0" &&
                        <div className="flex justify-content-end gap-3 pr-3">
                            <Button icon="pi pi-angle-double-left" onClick={() => changePage(-1)}></Button>
                            <Button icon="pi pi-angle-double-right" onClick={() => changePage(1)}></Button>
                        </div>
                    }
                    <ScrollPanel
                        className="custombar1  border-round m-2 shadow-2"
                        style={{ minHeight: '50px', overflowY: 'auto', maxHeight: '700px' }}
                    >
                        {questionsElement[currentPageIndex]}


                    </ScrollPanel>
                </div>
            </React.Fragment>
        )
    }
)
/* <Accordion>
                            <AccordionTab header="Dịch nghĩa">
                                <div className="card">
                               
                                </div>
                            </AccordionTab>
                        </Accordion>

                        <Accordion>
                            <AccordionTab header="Giải thích đáp án">
                                <div className="card">
                                   
                                </div>
                            </AccordionTab>
                        </Accordion> */