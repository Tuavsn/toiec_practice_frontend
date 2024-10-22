import { useNavigate, useParams } from "react-router-dom";
import React, { memo, useEffect, useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import '../App.css'
import { Card } from "primereact/card";
import { ApiResponse, SimpleTimeCountDownProps, TestPaper } from "../utils/types/type";
import { useTest } from "../hooks/TestHook";
import { TestArea, UserAnswerSheet } from "../components/Common/Index";
import { ConvertTestQuestionsToHTML } from "../utils/convertToHTML";

function DoTestPage() {
    const navigate = useNavigate();
    const { id = "", parts = "" } = useParams<{ id: string, parts: string }>();
    const [userAnswerSheet, setUserAnswerSheet] = useState<string[]>([]);
    
    const {
        resourcesElement,
        questionsElement,
        currentPageIndex,
        setCurrentPageIndex,
        changePage,
        isUserAnswerSheetVisible,
        setIsUserAnswerSheetVisible,
        mappingQuestionsWithPage,
        setMappingQuestionsWithPage,
        setQuestionsElement,
        setResourcesElement
    } = useTest();

    useEffect(() => {
        const chooseAnswer = (index: number, answer: string) => {
            setUserAnswerSheet((prevUserAnswerSheet) => {
                const newUserAnswerSheet = [...prevUserAnswerSheet];
                newUserAnswerSheet[index] = answer;
                return newUserAnswerSheet;
            });
        }
        const fetchData = async () => {
            try {
                const { questionList, totalQuestions } = await fetchQuestionsData();
                setUserAnswerSheet(Array<string>(totalQuestions).fill(''));
                const [resources, questions, mappingQuestionsPage] = ConvertTestQuestionsToHTML(questionList, chooseAnswer);
                setResourcesElement(resources);
                setQuestionsElement(questions);
                setMappingQuestionsWithPage(mappingQuestionsPage);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const onEndTest = () => {

        navigate(`/test/${~~(Math.random() * 1_000_000)}/review`);
    }

    const ButtonListElement =
        userAnswerSheet.map((answer, index) => {
            const isOnPage = currentPageIndex === mappingQuestionsWithPage[index];
            return (
                <Button
                    key={"answer_" + index}
                    style={{ width: '60px', aspectRatio: '1/1' }}
                    className={"border-round-md border-solid text-center p-2"}
                    label={(index + 1).toString()}
                    severity={getColorButtonOnAnswerSheet(answer, isOnPage)} // The color is updated based on the "isOnPage" value
                    onClick={() => {
                        if (!isOnPage) {
                            setCurrentPageIndex(mappingQuestionsWithPage[index]);
                            // When the page changes, the component re-renders and updates the button color.
                        }
                    }}
                />
            );
        })


    return ( userAnswerSheet &&
        <main className="pt-8 w-full">
            <h1 className="text-center"> Đề {id} với các phần {parts}</h1>
            <UserAnswerSheet
                visible={isUserAnswerSheetVisible}
                setVisible={setIsUserAnswerSheetVisible}
                ButtonListElement={ButtonListElement} />

            <Toolbar
                start={currentStatusBodyTemplate(userAnswerSheet, setIsUserAnswerSheetVisible)}
                center={
                    <SimpleTimeCountDown
                        onTimeUp={() => onEndTest()}
                        timeLeftInSecond={40} />
                }
                end={<Button severity="success" label="Nộp bài" onClick={() => onEndTest()} />}
            />


            <Card>


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

async function fetchQuestionsData(): Promise<TestPaper> {
    try {
        const response = await fetch("https://dummyjson.com/c/37e5-04ab-47d5-b7ac");

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Get the full response and cast it to ApiResponse<TestPaper>
        const apiResponse: ApiResponse<TestPaper> = await response.json();

        // Return the data part of the response
        return apiResponse.data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return { questionList: [], totalQuestions: 0 }; // Return empty arrays in case of an error
    }
}


function getColorButtonOnAnswerSheet(answer: string, isOnPage: boolean): 'info' | 'secondary' | 'warning' {
    const returnString = answer ? 'info' : 'secondary';
    return isOnPage ? 'warning' : returnString;
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
