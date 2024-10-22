import { Card } from "primereact/card";
import { MultipleChoiceQuestion, PracticeQuestion, QuestionDetailRecord, Resource } from "./types/type";
import { Image } from 'primereact/image';
import { Accordion, AccordionTab } from "primereact/accordion";
import React, { useState } from "react";
export function ConvertTestQuestionsToHTML(cheatSheet: MultipleChoiceQuestion[], chooseAnswer: (index: number, answer: string) => void): [JSX.Element[], JSX.Element[], number[]] {
    const resoursesSection: JSX.Element[] = [];
    const questionsSection: JSX.Element[] = [];
    const mappingQuestionsWithPage: number[] = []
    let questionNum: number = 0;
    var page = 0;
    for (const cheatEntry of cheatSheet) {
        const resoursesElement: JSX.Element[] = [];
        const questionsElement: JSX.Element[] = [];
        resoursesElement.push(...ResourcesToHTML(cheatEntry.resources, questionNum));
        if (cheatEntry.type !== 'group') {
            questionNum += 1;
            mappingQuestionsWithPage.push(page);
            questionsElement.push(
                <h5 key={"h5" + questionNum} > {questionNum}.{cheatEntry.content} </h5>
            );
            questionsElement.push(AnswerToHTML(cheatEntry.answers, questionNum, chooseAnswer));
        }
        else {
            questionsElement.push(<h3 key={"group" + questionNum} > {cheatEntry.content} </h3>);
            for (const subCheatEntry of cheatEntry.subQuestions) {
                questionNum += 1;
                mappingQuestionsWithPage.push(page);
                questionsElement.push(<h5 key={"h5" + questionNum} > {questionNum}.{subCheatEntry.content} </h5>);
                resoursesElement.push(...ResourcesToHTML(subCheatEntry.resources, questionNum));
                questionsElement.push(AnswerToHTML(subCheatEntry.answers, questionNum, chooseAnswer))
            }
        }
        questionsSection.push(
            <section className="p-3" key={"questionsSection" + questionNum} >
                {questionsElement}
            </section>
        );
        resoursesSection.push(
            <section key={"resouresSection" + questionNum} >
                {resoursesElement}
            </section>
        );
        page += 1;
    }
    return [resoursesSection, questionsSection, mappingQuestionsWithPage];
}

export function ConvertTestRecordToHTML(questionRecords: QuestionDetailRecord[]): [JSX.Element[], JSX.Element[], number[], boolean[]] {
    const resoursesSection: JSX.Element[] = [];
    const questionsSection: JSX.Element[] = [];
    const mappingQuestionsWithPage: number[] = []
    const isCorrect: boolean[] = [];
    let questionNum: number = 0;
    var page = 0;
    for (const quest of questionRecords) {
        const resoursesElement: JSX.Element[] = [];
        const questionsElement: JSX.Element[] = [];
        resoursesElement.push(...ResourcesToHTML(quest.resources, questionNum));
        if (quest.type !== 'group') {

            questionNum += 1;
            isCorrect.push(quest.correctAnswer === quest.userAnswer);
            mappingQuestionsWithPage.push(page);

            questionsElement.push(
                <h5 key={"h5" + questionNum} > {questionNum}.{quest.content} </h5>
            );
            questionsElement.push(UserAnswerToHTML(quest, questionNum));
        }
        else {
            questionsElement.push(<h3 key={"group" + questionNum} > {quest.content} </h3>);
            for (const subQuest of quest.subQuestions) {

                questionNum += 1;
                isCorrect.push(subQuest.correctAnswer === subQuest.userAnswer);
                mappingQuestionsWithPage.push(page);

                questionsElement.push(<h5 key={"h5" + questionNum} > {questionNum}.{subQuest.content} </h5>);
                resoursesElement.push(...ResourcesToHTML(subQuest.resources, questionNum));
                questionsElement.push(UserAnswerToHTML(subQuest, questionNum));
            }
        }
        questionsSection.push(
            <section className="px-3 pt-3 pb-8" key={"questionsSection" + questionNum} >
                {questionsElement}
            </section>
        );
        resoursesSection.push(
            <section key={"resouresSection" + questionNum} className="pt-3 pb-8" >
                {resoursesElement}
            </section>
        );
        page += 1;
    }
    return [resoursesSection, questionsSection, mappingQuestionsWithPage, isCorrect];
}

export function ConvertPracticeQuestionToHTML(
    practiceQuestions: PracticeQuestion[],
    setUserAnswerSheet: React.Dispatch<React.SetStateAction<string[]>>
): [JSX.Element[], JSX.Element[], number] {

    const resoursesSection: JSX.Element[] = [];
    const questionsSection: JSX.Element[] = [];
    let questionNum: number = 0;

    for (const pQuestion of practiceQuestions) {
        const resoursesElement: JSX.Element[] = [];
        const questionsElement: JSX.Element[] = [];
        resoursesElement.push(...ResourcesToHTML(pQuestion.resources, questionNum));
        if (pQuestion.type !== 'group') {
            questionNum += 1;

            questionsElement.push(
                <h5 key={"h5" + questionNum} > {questionNum}.{pQuestion.content} </h5>
            );
            questionsElement.push(
                <PracticeAnswerToHTML key={"pracAns" + questionNum} question={pQuestion} questionNum={questionNum} setUserAnswerSheet={setUserAnswerSheet} />
            )

        }
        else {
            questionsElement.push(<h3 key={"group" + questionNum} > {pQuestion.content} </h3>);
            for (const subPQuestion of pQuestion.subQuestions) {
                questionNum += 1;

                questionsElement.push(<h5 key={"h5" + questionNum} > {questionNum}.{subPQuestion.content} </h5>);
                resoursesElement.push(...ResourcesToHTML(subPQuestion.resources, questionNum));
                questionsElement.push(
                    <PracticeAnswerToHTML key={"pracAns" + questionNum} question={subPQuestion} questionNum={questionNum} setUserAnswerSheet={setUserAnswerSheet} />
                )
            }
        }


        questionsSection.push(
            <section className="p-3" key={"qSection" + questionNum} >
                {questionsElement}
            </section>
        );
        resoursesSection.push(
            <section key={"resouresSection" + questionNum} >
                {resoursesElement}
            </section>
        );

    }

    return [resoursesSection, questionsSection, questionNum]
}

function ResourcesToHTML(resources: Resource[], qNum: number): JSX.Element[] {
    if (!resources) {
        return [<h1 key={"res_" + qNum}>Cố lên</h1>]
    }
    const resourcesElement: JSX.Element[] = [];
    resources.forEach(
        (r, index) => {
            switch (r.type) {
                case 'paragraph':
                    resourcesElement.push(<Card key={"para" + qNum.toString() + index} style={{ borderStyle: 'dotted', borderColor: 'lavender' }} ><p >{r.content}</p></Card>)
                    break;
                case 'image':
                    resourcesElement.push(
                        <div key={"img" + qNum.toString() + index} className="p-3 text-center"> <Image src={r.content} indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview loading='lazy' /> </div>
                    )
                    break;
                case 'audio':
                    resourcesElement.unshift(
                        <audio key={"audio" + qNum + index.toString()} className='w-full' controls autoPlay={true}>
                            <source src={r.content} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    )
                    break;
                default:
                    console.error("not have that: ", r.type);
                    break;
            }
        }
    )

    return resourcesElement;
}


function AnswerToHTML(answers: string[], qNum: number, chooseAnswer: (index: number, answer: string) => void): JSX.Element {
    return (
        <div key={"answer" + qNum} className="flex flex-column gap-3 my-3">
            {answers.map((answer, index) => {
                return (
                    <div key={"answerbox" + index} className="flex align-items-center">
                        <input
                            style={{ accentColor: '#00BFFF', width: '24px', height: '24px', position: 'relative', top: '6px' }}
                            type="radio"
                            id={"id" + qNum + index} // Unique ID for each radio button
                            name={`answer-${qNum}`}   // Use a unique name for grouping per question
                            value={answer}            // Value of the radio button
                            onChange={() => chooseAnswer(qNum - 1, answer)}
                        />
                        <label htmlFor={"id" + qNum + index} style={{ marginLeft: '8px' }}>
                            {answer}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

function UserAnswerToHTML(question: QuestionDetailRecord, questionNum: number): JSX.Element {


    return (
        <div key={"answer" + questionNum} className="flex flex-column gap-3 my-3">
            {question.answers.map((answer, index) => {
                let colorBackground = '';
                if (answer === question.correctAnswer) {
                    colorBackground = 'bg-green-500';

                } else if (answer === question.userAnswer) {
                    colorBackground = 'bg-red-500';
                }
                return (
                    <div key={"answerbox" + index} className={"flex align-items-center py-3 " + colorBackground}>
                        <input
                            style={{ accentColor: '#00BFFF', width: '24px', height: '24px', position: 'relative', top: '6px' }}
                            type="radio"
                            id={"id" + questionNum + index} // Unique ID for each radio button
                            name={`answer-${questionNum}`}   // Use a unique name for grouping per question
                            value={answer}            // Value of the radio button
                            readOnly
                            checked={question.userAnswer === answer}
                        />
                        <label htmlFor={"id" + questionNum + index} style={{ marginLeft: '8px' }}>
                            {answer}
                        </label>
                    </div>
                );

            })
            }
            <Accordion>
                <AccordionTab header="Dịch nghĩa">
                    <div className="card">
                        {question.transcript}
                    </div>
                </AccordionTab>
            </Accordion>

            <Accordion>
                <AccordionTab header="Giải thích đáp án">
                    <div className="card">
                        {question.explanation}
                    </div>
                </AccordionTab>
            </Accordion>

        </div>
    );
}

const PracticeAnswerToHTML: React.FC<{ question: PracticeQuestion, questionNum: number, setUserAnswerSheet: React.Dispatch<React.SetStateAction<string[]>> }> = React.memo(
    ({ question, questionNum, setUserAnswerSheet }) => {
        const pos = questionNum - 1;
        const [userAnswer, setUserAnswer] = useState<string>("");
        return (
            <div key={"panswer" + questionNum} className={"flex flex-column gap-3 my-3"}>
                {question.answers.map((answer, index) => {
                    let colorBackground = '';
                    if (userAnswer && answer === question.correctAnswer) {
                        colorBackground = 'bg-green-500';
                    } else if (answer === userAnswer) {
                        colorBackground = 'bg-red-500';
                    }

                    return (
                        <div key={"answerbox" + index} className={"flex align-items-center py-3 " + colorBackground}>
                            <input
                                key={index + "radio" + questionNum}
                                style={{ accentColor: '#00BFFF', width: '24px', height: '24px', position: 'relative', top: '6px' }}
                                type="radio"
                                id={"id" + questionNum + index}
                                name={`answer-${questionNum}`}
                                value={answer}
                                checked={userAnswer === answer}
                                onChange={() => {
                                    setUserAnswer(answer)

                                    setUserAnswerSheet((prevUserAnswerSheet) => {
                                        const newUserAnswerSheet = [...prevUserAnswerSheet];
                                        newUserAnswerSheet[pos] = answer;
                                        console.log(answer);
                                        return newUserAnswerSheet;
                                    });
                                }}
                            />
                            <label key={index + "label" + questionNum} htmlFor={"id" + questionNum + index} style={{ marginLeft: '8px' }}>
                                {answer}
                            </label>
                        </div>
                    );
                })}
                {userAnswer &&
                    <React.Fragment>
                        <Accordion>
                            <AccordionTab header="Dịch nghĩa">
                                <div className="card">
                                    {question.transcript}
                                </div>
                            </AccordionTab>
                        </Accordion>

                        <Accordion>
                            <AccordionTab header="Giải thích đáp án">
                                <div className="card">
                                    {question.explanation}
                                </div>
                            </AccordionTab>
                        </Accordion>
                    </React.Fragment>
                }
            </div>
        );
    }
);