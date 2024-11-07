import { Card } from "primereact/card";
import { MultipleChoiceQuestion, PracticeAnswerSheet, PracticeQuestion, QuestionDetailRecord, QuestionID, QuestionNumber, QuestionPage, Resource, TestAnswerSheet } from "./types/type";
import { Image } from 'primereact/image';
import { Accordion, AccordionTab } from "primereact/accordion";
import React from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { Divider } from "primereact/divider";

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
export function MappingPageWithQuestionNum(questionList: MultipleChoiceQuestion[]): QuestionPage[] {
    var pageNum = 0;
    const questionPages = [];
    for (const q of questionList) {
        if (q.subQuestions.length) {
            for (const sq of q.subQuestions) {
                questionPages.push({ questionNum: sq.questionNum, page: pageNum } as QuestionPage)
            }
        }
        else {
            questionPages.push({ questionNum: q.questionNum, page: pageNum } as QuestionPage)
        }
        pageNum += 1;
    }
    return questionPages;
}

export function ConvertThisPracticeQuestionToHTML(
    practiceQuestion: PracticeQuestion,
    userAnswerSheet: PracticeAnswerSheet,
    updateUserAnswerSheet: (qID: QuestionID, answer: string) => void,
    paginator: JSX.Element
): JSX.Element {


    const resourcesElement: JSX.Element[] = [];
    const questionsElement: JSX.Element[] = [];
    let qNum: QuestionNumber = 0;
    if (practiceQuestion.resources) {
        resourcesElement.push(...ResourcesToHTML(practiceQuestion.resources, qNum));
    }
    if (practiceQuestion.subQuestions) {


        questionsElement.push(
            <h3 key={"group" + qNum} > {practiceQuestion.content} </h3>
        );
        for (const subpq of practiceQuestion.subQuestions) {
            qNum += 1;
            questionsElement.push(<h5 key={"h5" + qNum} > {qNum}.{subpq.content} </h5>)
            resourcesElement.push(...ResourcesToHTML(subpq.resources, qNum));
            questionsElement.push(
                PracticeAnswerToHTML(subpq, userAnswerSheet.get(subpq.id) ?? "", updateUserAnswerSheet),
                <Divider key={"divider" + subpq.id} />
            )

        }

    }
    else {
        qNum += 1;
        questionsElement.push(<h5 key={"group" + qNum} > {qNum}. {practiceQuestion.content} </h5>);
        questionsElement.push(
            PracticeAnswerToHTML(practiceQuestion, userAnswerSheet.get(practiceQuestion.id) ?? "", updateUserAnswerSheet),
            <Divider key={"divider" + practiceQuestion.id} />
        )

    }
    return (
        <div className="flex xl:flex-row lg:flex-row flex-wrap md:flex-row sm:flex-row justify-content-between p-5 gap-4 custom-scrollpanel w-full px-0 py-0 text-sm">
            <ScrollPanel
                className="flex-1 custombar1 border-round m-2 shadow-2"
                style={{ minHeight: '50px', overflowY: 'auto', minWidth: '400px', maxHeight: '100%' }}
            >
                {resourcesElement}
            </ScrollPanel>

            <div className="flex-1" style={{ minWidth: '600px' }}>
                <div className="flex justify-content-around">
                    <p className="inline m-auto bg-blue-200 p-2">trang này có {qNum} câu</p>
                    {paginator}
                </div>
                <ScrollPanel
                    className="custombar1 border-round m-2 shadow-2 pl-2"
                    style={{ minHeight: '50px', overflowY: 'auto', maxHeight: '400px', flex: '1 1 auto' }}
                >
                    {questionsElement}
                </ScrollPanel>
            </div>
        </div>
    )
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
                        <div key={"img" + qNum.toString() + index} className="p-3 text-center"> <Image src={r.content} width="300px" indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview loading='lazy' /> </div>
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

function TestResourcesToHTML(resources: Resource[], qNum: QuestionNumber, parts: string, changePage: (offset: number) => void): JSX.Element[] {
    if (!resources) {
        return [<h1 key={"res_" + qNum}>Cố lên</h1>]
    }
    const resourcesElement: JSX.Element[] = [];
    resources.forEach(
        (r, index) => {
            const keyPrefix = r.type + qNum.toString() + index;
            switch (r.type) {
                case 'paragraph':
                    resourcesElement.push(<Card key={keyPrefix} style={{ borderStyle: 'dotted', borderColor: 'lavender' }} ><p >{r.content}</p></Card>)
                    break;
                case 'image':
                    resourcesElement.push(
                        // nếu audio chạy hết mà người dùng vẫn đang trong chế độ phóng to ảnh. web sẽ không cuộn được nữa
                        <div key={keyPrefix} className="p-3 text-center"> <Image src={r.content} width="80%" height="auto" indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview loading='lazy' /> </div>
                    )

                    break;
                case 'audio':
                    if (parts === '0') {
                        resourcesElement.unshift(
                            <div key={"div" + keyPrefix}>
                                <h5 className="text-center pt-1">Listen . . .🔊</h5>
                                <audio key={keyPrefix} className='w-full' autoPlay={true} onPause={(e) => e.currentTarget.play()} onEnded={() => changePage(1)} hidden>
                                    <source src={r.content} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>

                            </div>
                        )
                    } else {
                        resourcesElement.unshift(
                            <audio key={keyPrefix} className='w-full' controls autoPlay={true} >
                                <source src={r.content} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        )
                    }
                    break;
                default:
                    console.error("not have that: ", r.type);
                    break;
            }
        }
    )

    return resourcesElement;
}

// async function fetchResourceAsBlob(url: string): Promise<void> {
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch resource: ${url}`);
//         }
//         // trình duyệt đưa tài nguyên vào bộ nhớ đệm
//     } catch (error) {
//         console.error("Error fetching resource:", error);
//     }
// }

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

function PracticeAnswerToHTML(question: PracticeQuestion, userAnswer: string, updateUserAnswerSheet: (qID: QuestionID, answer: string) => void) {
    const answerTexts: string[] = (question.type === 'ABCD') ? ['A', 'B', 'C', 'D'] : question.answers;
    return (
        <div key={"panswer" + question.id} className={"flex flex-column gap-3 mb-3 pb-7"}>
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
                            key={index + "radio" + question.id}
                            style={{ accentColor: '#00BFFF', width: '24px', height: '24px', position: 'relative', top: '6px' }}
                            type="radio"
                            id={"id" + question.id + index}
                            name={`answer-${question.id}`}
                            value={answer}
                            checked={userAnswer === answer}
                            onChange={() => {
                                updateUserAnswerSheet(question.id, answer);
                            }}
                        />
                        <label key={index + "label" + question.id} htmlFor={"id" + question.id + index} style={{ marginLeft: '8px' }}>
                            {answerTexts[index]}
                        </label>
                    </div>
                );
            })}
            {userAnswer &&
                <React.Fragment>
                    <Accordion>
                        {
                            question.transcript !== "" &&
                            <AccordionTab header="Dịch nghĩa">
                                <div className="card">
                                    {question.transcript}
                                </div>
                            </AccordionTab>

                        }

                    </Accordion>

                    <Accordion>
                        {
                            question.explanation !== "" &&
                            <AccordionTab header="Giải thích đáp án">
                                <div className="card">
                                    {question.explanation}
                                </div>
                            </AccordionTab>
                        }
                    </Accordion>
                </React.Fragment>
            }
        </div>
    );
}

// Hàm chuyển đổi câu hỏi trắc nghiệm thành HTML
export function ConvertThisTestQuestionToHTML(
    question: MultipleChoiceQuestion,            // Đối tượng câu hỏi trắc nghiệm
    userAnswerSheet: TestAnswerSheet,            // Phiếu trả lời của người dùng (Map câu hỏi - câu trả lời)
    setTestAnswerSheet: (questionNumber: QuestionNumber, questionId: QuestionID, answer: string) => void,  // Hàm cập nhật phiếu trả lời
    parts: string,                               // Phần của bài thi (vd: listening, reading)
    changePage: (offset: number) => void         // Hàm thay đổi trang
): [JSX.Element[], JSX.Element[]] {              // Trả về hai mảng phần tử JSX: tài nguyên và câu hỏi

    // Mảng để chứa các tài nguyên của câu hỏi
    const resoursesElement: JSX.Element[] = [];

    // Mảng để chứa các phần tử HTML của câu hỏi
    const questionsElement: JSX.Element[] = [];

    // Nếu câu hỏi có tài nguyên đi kèm (hình ảnh, audio,...)
    if (question.resources) {
        resoursesElement.push(...TestResourcesToHTML(question.resources, question.questionNum, parts, changePage));
    }

    // Nếu câu hỏi có các câu hỏi con (subQuestions)
    if (question.subQuestions.length) {
        // Thêm tiêu đề câu hỏi nhóm
        questionsElement.push(<h3 key={"group" + question.questionNum} > {question.content} </h3>);

        // Duyệt qua từng câu hỏi con
        for (const subq of question.subQuestions) {
            // Thêm nội dung từng câu hỏi con
            questionsElement.push(<h5 key={"h5" + subq.questionNum} > {subq.questionNum}.{subq.content} </h5>);

            // Nếu câu hỏi con có tài nguyên, thêm chúng vào
            resoursesElement.push(...TestResourcesToHTML(subq.resources, subq.questionNum, parts, changePage));

            // Xây dựng phần tử HTML cho từng câu hỏi con
            questionsElement.push(
                BuildTestQuestionHTML(subq, userAnswerSheet.get(subq.questionNum)?.userAnswer ?? "", setTestAnswerSheet)
            );
        }
    } else {
        // Nếu là câu hỏi đơn lẻ, thêm nội dung câu hỏi
        questionsElement.push(
            <h5 key={"h5" + question.questionNum} > {question.questionNum}.{question.content} </h5>
        );

        // Xây dựng phần tử HTML cho câu hỏi
        questionsElement.push(
            BuildTestQuestionHTML(question, userAnswerSheet.get(question.questionNum)?.userAnswer ?? "", setTestAnswerSheet)
        );
    }

    // Trả về hai mảng JSX: mảng tài nguyên và mảng câu hỏi
    return [
        resoursesElement,
        questionsElement
    ]
}

// Hàm xây dựng HTML cho câu hỏi trắc nghiệm
function BuildTestQuestionHTML(
    question: MultipleChoiceQuestion,             // Đối tượng câu hỏi trắc nghiệm
    userAnswer: string,                           // Câu trả lời hiện tại của người dùng
    setTestAnswerSheet: (questionNumber: number, questionId: string, answer: string) => void // Hàm cập nhật phiếu trả lời
): JSX.Element {

    // Lấy số câu hỏi hiện tại
    const currentQuestionNumber = question.questionNum;

    // Xác định các đáp án hiển thị cho câu hỏi (tùy thuộc vào partNum)
    const answerTexts: string[] = (question.partNum === 1 || question.partNum === 2) ? ['A', 'B', 'C', 'D'] : question.answers;

    // Trả về phần tử HTML cho câu hỏi
    return (
        <div key={"answer" + currentQuestionNumber} className={"flex flex-column gap-3 my-3"}>
            {question.answers.map((answer, index) => {

                // Tạo radio button cho mỗi đáp án
                return (
                    <div key={"answerbox" + index} className={"flex align-items-center py-3 "}>
                        <input
                            key={index + "radio" + currentQuestionNumber}
                            style={{ accentColor: '#00BFFF', width: '24px', height: '24px', position: 'relative', top: '6px' }} // Tùy chỉnh kiểu radio button
                            type="radio"                          // Loại input là radio
                            id={"id" + currentQuestionNumber + index} // ID duy nhất cho mỗi radio
                            name={`answer-${currentQuestionNumber}`}   // Name chung cho các radio cùng câu hỏi
                            value={answerTexts[index]}             // Giá trị của mỗi đáp án
                            checked={userAnswer === answer}        // Kiểm tra đáp án nào đang được chọn
                            onChange={() => {                     // Khi người dùng chọn, cập nhật phiếu trả lời
                                setTestAnswerSheet(currentQuestionNumber, question.id, answer);
                            }}
                        />
                        <label key={index + "label" + currentQuestionNumber} htmlFor={"id" + currentQuestionNumber + index} style={{ marginLeft: '8px' }}>
                            {answerTexts[index]}  {/* Hiển thị đáp án A, B, C, D hoặc đáp án text */}
                        </label>
                    </div>
                );
            })}
        </div>
    )
}
