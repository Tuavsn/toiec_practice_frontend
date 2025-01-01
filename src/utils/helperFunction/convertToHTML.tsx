import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import { Divider } from "primereact/divider";
import { Image } from 'primereact/image';
import { ScrollPanel } from "primereact/scrollpanel";
import React from "react";
import { MultipleChoiceQuestion, PracticeAnswerSheet, PracticeQuestion, QuestionAnswerRecord, QuestionID, QuestionNumber, QuestionPage, QuestionRow, Resource, SelectedQuestionDialogTestOverallPage, SingleUserAnswerOverview, TestAnswerSheet, TestReviewAnswerSheet, TestSheet, TestType, UserAnswerRecord } from "../types/type";
export function MappingPageWithQuestionNum(questionList: MultipleChoiceQuestion[]): QuestionPage[] {
    let pageNum = 0;
    const questionPages = [];
    for (const q of questionList) {
        if (q.subQuestions.length) {
            for (const sq of q.subQuestions) {
                questionPages.push({ questionNum: sq.questionNum, page: pageNum, part: sq.partNum } as QuestionPage)
            }
        }
        else {
            questionPages.push({ questionNum: q.questionNum, page: pageNum, part: q.partNum } as QuestionPage)
        }
        pageNum += 1;
    }
    return questionPages;
}
export function MappingPageWithQuestionRowNum(questionList: QuestionRow[]): QuestionPage[] {
    let pageNum = 0;
    const questionPages = [];
    for (const q of questionList) {
        if (q.subQuestions.length) {
            for (const sq of q.subQuestions) {
                questionPages.push({ questionNum: sq.questionNum, page: pageNum, part: sq.partNum } as QuestionPage)
            }
        }
        else {
            questionPages.push({ questionNum: q.questionNum, page: pageNum, part: q.partNum } as QuestionPage)
        }
        pageNum += 1;
    }
    return questionPages;
}

export function MappingPageWithQuestionNumReview(questionList: TestReviewAnswerSheet): QuestionPage[] {
    let pageNum = 0;
    const questionPages = [];
    for (const q of questionList) {
        if (q.subUserAnswer.length) {
            for (const sq of q.subUserAnswer) {
                questionPages.push({ questionNum: sq.questionNum, page: pageNum, part: sq.partNum } as QuestionPage)
            }
        }
        else {
            questionPages.push({ questionNum: q.questionNum, page: pageNum, part: q.partNum } as QuestionPage)
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
                style={{ minHeight: '50px', minWidth: '400px' }}
            >
                {resourcesElement}
            </ScrollPanel>

            <div className="flex-1" style={{ minWidth: '600px' }}>
                <div className="flex justify-content-around">
                    <p className="inline m-auto bg-blue-200 p-2">trang này có {qNum} câu</p>
                    {paginator}
                </div>
                <ScrollPanel
                    className="custombar1 border-round m-2 shadow-2 pl-2 text-xs"
                    style={{ minHeight: '50px', overflowY: 'auto', maxHeight: '800px', flex: '1 1 auto' }}
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


export function FullTestResourcesToHTML(resources: Resource[], questID: QuestionID, changePage: (offset: number) => void): JSX.Element[] {
    if (!resources) {
        return [<h1 key={"res_00"}>Cố lên</h1>]
    }
    const resourcesElement: JSX.Element[] = [];
    resources.forEach(
        (r, index) => {
            const keyPrefix = r.type + questID + index;
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
                    resourcesElement.unshift(
                        <div key={"div" + keyPrefix}>
                            <h5 className="text-center pt-1">Listen . . .🔊</h5>
                            <audio key={keyPrefix} className='w-full' autoPlay={true} onPause={(e) => e.currentTarget.play()} onEnded={() => changePage(1)} hidden>
                                <source src={r.content} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>

                        </div>
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

function TestResourcesToHTML(resources: Resource[], qNum: QuestionNumber, testType: TestType, changePage: (offset: number) => void): JSX.Element[] {
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
                    if (testType === 'fulltest') {
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

export function ConvertTopicToHTML(question: UserAnswerRecord): JSX.Element {
    const topicElement: JSX.Element[] =
        question.listTopics.map((topic, index) => {
            return (
                <React.Fragment key={"topicquest_" + index}>
                    <Chip key={"topicq_" + index} label={topic.name} />
                    <p className="pl-6">&#8627;{topic.solution}</p>
                </React.Fragment>
            )
        })
    if (question.subUserAnswer.length) {
        for (const subpq of question.subUserAnswer) {
            topicElement.push(...subpq.listTopics.map((topic, index) => {
                return (
                    <React.Fragment key={"topicsquest_" + index}>
                        <Chip key={"topicsq_" + index} label={topic.name} />
                        <p className="pl-6">⎣{topic.solution}</p>
                    </React.Fragment>
                )
            }))
        }
    }
    return <>{topicElement}</>
}

export function ConvertReviewTopicToHTML(question: SingleUserAnswerOverview): JSX.Element {
    return <>
        {
            question.listTopics.map((topic, index) => {
                return (
                    <React.Fragment key={"topicquest_" + index}>
                        <Chip key={"topicq_" + index} label={topic.name} />
                        <p className="pl-6">&#8627;{topic.solution}</p>
                    </React.Fragment>
                )
            })
        }
    </>

}

function ConvertToTopicTag(question: SingleUserAnswerOverview): JSX.Element {
    return <>
        {
            question.listTopics.map((topic, index) => {
                return (
                    <React.Fragment key={"topicquest_" + index}>
                        <Chip key={"topicq_" + index} label={topic.name} />
                    </React.Fragment>
                )
            })
        }
    </>
}
export function ConvertReviewSolutionToHTML(question: SingleUserAnswerOverview): JSX.Element {
    return <>
        {question.solution && question.solution.trim() && <li>{question.solution}</li>}
    </>
}

export function ConvertSolutionToHTML(question: UserAnswerRecord): JSX.Element {

    let start = question.questionNum;
    const solutionElement: JSX.Element[] = []
    if (question.solution && question.solution.trim()) {
        solutionElement.push(<li>{question.solution}</li>)
    }
    const subQuestion = question.subUserAnswer;
    if (subQuestion.length) {
        start = subQuestion[0].questionNum;
        for (const subpq of subQuestion) {
            if (subpq.solution && subpq.solution.trim()) {
                solutionElement.push(<li key={`sol${subpq.questionId}`}>{subpq.solution}</li>)
            }
        }
    }
    return <ol start={start}>{solutionElement}</ol>
}

export function UserAnswerToHTML(question: UserAnswerRecord): JSX.Element {
    return (
        <div key={"answer" + question.questionNum} className="flex flex-column gap-3 my-3">
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
                            id={"id" + question.questionNum + index} // Unique ID for each radio button
                            name={`answer-${question.questionNum}`}   // Use a unique name for grouping per question
                            value={answer}            // Value of the radio button
                            readOnly
                            checked={question.userAnswer === answer}
                        />
                        <label htmlFor={"id" + question.questionNum + index} style={{ marginLeft: '8px' }}>
                            {answer}
                        </label>
                    </div>
                );

            })
            }

            <TranscriptAndExplain transcript={question.transcript} explanation={question.explanation} />


        </div>
    );
}


export function UserReviewSingleAnswerToHTML(question: SingleUserAnswerOverview): SelectedQuestionDialogTestOverallPage {
    const title: JSX.Element = <h5>Phần {question.partNum} - Câu {question.questionNum}</h5>
    const body: JSX.Element =
        <section>
            <div className="mb-6">
                {ConvertToTopicTag(question)}

            </div>
            {ResourcesToHTML(question.resources, question.questionNum)}
            <br />
            <h5 key={"h5" + question.questionNum} > {question.questionNum}.{question.content}  ({question.timeSpent} giây)</h5>
            <div key={"answer" + question.questionNum} className="flex flex-column gap-3 my-3">
                {question.answers.map((answer, index) => {
                    let colorBackground = '';
                    if (answer === question.correctAnswer) {
                        colorBackground = 'bg-green-500';

                    } else if (answer === question.answer) {
                        colorBackground = 'bg-red-500';
                    }
                    return (
                        <div key={"answerbox" + index} className={"flex align-items-center py-3 " + colorBackground}>
                            <input
                                style={{ accentColor: '#00BFFF', width: '24px', height: '24px', position: 'relative', top: '6px' }}
                                type="radio"
                                id={"id" + question.questionNum + index} // Unique ID for each radio button
                                name={`answer-${question.questionNum}`}   // Use a unique name for grouping per question
                                value={answer}            // Value of the radio button
                                readOnly
                                checked={question.answer === answer}
                            />
                            <label htmlFor={"id" + question.questionNum + index} style={{ marginLeft: '8px' }}>
                                {answer}
                            </label>
                        </div>
                    );

                })
                }

                <TranscriptAndExplain transcript={question.transcript} explanation={question.explanation} />


            </div>
            <Card title="Chủ đề trong câu hỏi">
                {ConvertReviewTopicToHTML(question)}

            </Card>
            <Card title="Gợi ý giúp bạn cải thiện tốt hơn">
                {ConvertReviewSolutionToHTML(question)}
            </Card>
        </section>
    return { body: body, title: title }
}

function TranscriptAndExplain({ transcript, explanation }: { transcript: string, explanation: string }) {
    return (
        <Accordion>
            {transcript &&
                <AccordionTab header="Transcript">
                    <div className="card">
                        {transcript}
                    </div>
                </AccordionTab>
            }
            {explanation &&
                <AccordionTab header="Giải thích đáp án">
                    <div className="card">
                        {explanation}
                    </div>
                </AccordionTab>
            }
        </Accordion>
    )
}

function PracticeAnswerToHTML(question: PracticeQuestion, userAnswer: string, updateUserAnswerSheet: (qID: QuestionID, answer: string) => void) {
    const answerTexts: string[] = (question.type === 'ABCD') ? ['A', 'B', 'C', 'D'] : question.answers;
    return (
        <div key={"panswer" + question.id} className={"flex flex-column gap-3"}>
            {question.answers.map((answer, index) => {
                let colorBackground = '';
                if (userAnswer && answer === question.correctAnswer) {
                    colorBackground = 'bg-green-500';
                } else if (answer === userAnswer) {
                    colorBackground = 'bg-red-500';
                }

                return (
                    <div key={"answerbox" + index} className={"flex align-items-center " + colorBackground}>
                        <input
                            key={index + "radio" + question.id}
                            style={{ accentColor: '#00BFFF', width: '24px', height: '24px', position: 'relative' }}
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

export function ConvertUserAnswerRecordToHTML(question: UserAnswerRecord): [JSX.Element[], JSX.Element[]] {

    // Mảng để chứa các tài nguyên của câu hỏi
    const resoursesElement: JSX.Element[] = [];

    // Mảng để chứa các phần tử HTML của câu hỏi
    const questionsElement: JSX.Element[] = [];

    // Nếu câu hỏi có tài nguyên đi kèm (hình ảnh, audio,...)
    if (question.resources) {
        resoursesElement.push(...ResourcesToHTML(question.resources, question.questionNum));
    }

    // Nếu câu hỏi có các câu hỏi con (subQuestions)
    if (question.subUserAnswer.length) {
        // Thêm tiêu đề câu hỏi nhóm
        questionsElement.push(<h3 key={"group" + question.questionNum} > {question.content} </h3>);

        // Duyệt qua từng câu hỏi con
        for (const subq of question.subUserAnswer) {
            // Thêm nội dung từng câu hỏi con
            questionsElement.push(<h5 key={"h5" + subq.questionNum} > {subq.questionNum}.{subq.content} ({subq.timeSpent} giây)</h5>);

            // Nếu câu hỏi con có tài nguyên, thêm chúng vào
            resoursesElement.push(...ResourcesToHTML(subq.resources, subq.questionNum));

            // Xây dựng phần tử HTML cho từng câu hỏi con
            questionsElement.push(
                UserAnswerToHTML(subq)
            );
        }
        resoursesElement.push(<TranscriptAndExplain transcript={question.transcript} explanation={question.explanation} />)
    } else {
        // Nếu là câu hỏi đơn lẻ, thêm nội dung câu hỏi
        questionsElement.push(
            <h5 key={"h5" + question.questionNum} > {question.questionNum}.{question.content} ({question.timeSpent} giây)</h5>
        );

        // Xây dựng phần tử HTML cho câu hỏi
        questionsElement.push(
            UserAnswerToHTML(question)
        );
    }

    // Trả về hai mảng JSX: mảng tài nguyên và mảng câu hỏi
    return [
        resoursesElement,
        questionsElement
    ]
}

// Hàm chuyển đổi câu hỏi trắc nghiệm thành HTML
export function ConvertThisTestQuestionToHTML(
    question: MultipleChoiceQuestion,            // Đối tượng câu hỏi trắc nghiệm
    userAnswerSheet: TestAnswerSheet,            // Phiếu trả lời của người dùng (Map câu hỏi - câu trả lời)
    setTestAnswerSheet: (questionNumber: QuestionNumber, questionId: QuestionID, answer: string) => void,  // Hàm cập nhật phiếu trả lời
    testType: TestType,                               // Phần của bài thi (vd: listening, reading)
    changePage: (offset: number) => void         // Hàm thay đổi trang
): [JSX.Element[], JSX.Element[]] {              // Trả về hai mảng phần tử JSX: tài nguyên và câu hỏi

    // Mảng để chứa các tài nguyên của câu hỏi
    const resoursesElement: JSX.Element[] = [];

    // Mảng để chứa các phần tử HTML của câu hỏi
    const questionsElement: JSX.Element[] = [];

    // Nếu câu hỏi có tài nguyên đi kèm (hình ảnh, audio,...)
    if (question.resources) {
        resoursesElement.push(...TestResourcesToHTML(question.resources, question.questionNum, testType, changePage));
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
            resoursesElement.push(...TestResourcesToHTML(subq.resources, subq.questionNum, testType, changePage));

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
export function ConvertThisFullTestQuestionToHTML(
    question: QuestionAnswerRecord,
    changePage: (offset: number) => void,
    setReloadToolbar: React.Dispatch<React.SetStateAction<boolean>>,
    doTestDataRef: React.MutableRefObject<TestSheet>,
): [JSX.Element[], JSX.Element[]] {
    const { resources, subQuestions, content, questionId, questionNum } = question;

    // Hàm phụ để xây dựng phần tử tài nguyên
    const buildResources = (resources: Resource[], questionId: string) =>
        resources?.length
            ? FullTestResourcesToHTML(resources, questionId, changePage)
            : [];




    // Mảng chứa các tài nguyên (hình ảnh, âm thanh, ...)
    const resoursesElement: JSX.Element[] = buildResources(resources, questionId);
    // Mảng chứa các phần tử HTML của câu hỏi
    const questionsElement: JSX.Element[] = [];

    // Nếu câu hỏi có danh sách các câu hỏi con
    if (subQuestions.length > 0) {
        // Thêm nội dung tiêu đề cho nhóm câu hỏi
        questionsElement.push(<h3 key={`group-${questionNum}`}>{content}</h3>);

        // Duyệt qua từng câu hỏi con
        subQuestions.forEach(subq => {
            const { questionNum, resources, questionId } = subq;

            // Thêm số thứ tự và nội dung câu hỏi con
            questionsElement.push(<QuestionHeader key={`h5-${questionNum}`} question={subq} setReloadToolbar={setReloadToolbar} />);

            // Thêm tài nguyên đi kèm của câu hỏi con
            resoursesElement.push(...buildResources(resources, questionId));

            // Thêm phần tử HTML của câu hỏi con
            questionsElement.push(BuildFullTestQuestionHTML(subq, setReloadToolbar, doTestDataRef));
        });
    } else {
        // Nếu không có câu hỏi con, thêm câu hỏi chính
        questionsElement.push(<QuestionHeader key={`h5-${questionNum}`} question={question} setReloadToolbar={setReloadToolbar} />);
        // Thêm phần tử HTML của câu hỏi chính
        questionsElement.push(BuildFullTestQuestionHTML(question, setReloadToolbar, doTestDataRef));
    }

    // Trả về hai mảng JSX: tài nguyên và câu hỏi
    return [resoursesElement, questionsElement];
}
// Hàm phụ để xây dựng phần tử câu hỏi
const QuestionHeader: React.FC<{ question: QuestionAnswerRecord, setReloadToolbar: React.Dispatch<React.SetStateAction<boolean>> }> = ({ question, setReloadToolbar }) => {
    const { questionNum, content, flag, } = question;
    const [, setReload] = React.useState(false);

    return (
        <div>
            <h5 key={`h5-${questionNum}`}>{questionNum}. {content}</h5>
            <Button className={`p-0 m-0 ml-1 ${flag ? "text-red-500" : "text-gray-500"}`} icon="pi pi-flag-fill" text
                onClick={() => { question.flag = !flag; setReload(pre => pre = !pre); setReloadToolbar(pre => pre = !pre) }} />
        </div>
    )
}

// Hàm xây dựng HTML cho câu hỏi trắc nghiệm
function BuildFullTestQuestionHTML(
    question: QuestionAnswerRecord,             // Đối tượng câu hỏi trắc nghiệm
    setReloadToolbar: React.Dispatch<React.SetStateAction<boolean>>,
    doTestDataRef: React.MutableRefObject<TestSheet>
): JSX.Element {

    // Lấy số câu hỏi hiện tại
    const currentQuestionNumber = question.questionNum;

    // Xác định các đáp án hiển thị cho câu hỏi (tùy thuộc vào partNum)
    const answerTexts: string[] = (question.partNum === 1 || question.partNum === 2) ? ['A', 'B', 'C', 'D'] : question.answers;

    // Trả về phần tử HTML cho câu hỏi
    return (
        <div key={"answer" + currentQuestionNumber} className={"flex flex-column gap-3 my-3"}>
            <RadioButtonGroup currentQuestionNumber={currentQuestionNumber} question={question} answerTexts={answerTexts} setReloadToolbar={setReloadToolbar} doTestDataRef={doTestDataRef} />
        </div>
    )
}

const RadioButtonGroup: React.FC<{ currentQuestionNumber: number, question: QuestionAnswerRecord, answerTexts: string[], setReloadToolbar: React.Dispatch<React.SetStateAction<boolean>>, doTestDataRef: React.MutableRefObject<TestSheet> }> =
    ({ currentQuestionNumber, answerTexts, question, setReloadToolbar, doTestDataRef }) => {
        const [, setReload] = React.useState(false);
        return (
            <>
                {question.answers.map((thisAnswer, index) => {
                    return (
                        // Tạo radio button cho mỗi đáp án
                        <div key={"answerbox" + index} className={"flex align-items-center py-3 "}>
                            <input
                                key={index + "radio" + currentQuestionNumber}
                                style={{ accentColor: '#00BFFF', width: '24px', height: '24px', position: 'relative', top: '6px' }} // Tùy chỉnh kiểu radio button
                                type="radio"                          // Loại input là radio
                                id={"id" + currentQuestionNumber + index} // ID duy nhất cho mỗi radio
                                name={`answer-${currentQuestionNumber}`}   // Name chung cho các radio cùng câu hỏi
                                value={answerTexts[index]}             // Giá trị của mỗi đáp án
                                checked={question.userAnswer === thisAnswer}// Kiểm tra đáp án nào đang được chọn
                                onChange={() => {                     // Khi người dùng chọn, cập nhật phiếu trả lời

                                    setReload(pre => pre = !pre);
                                    if (question.userAnswer === "") {
                                        doTestDataRef.current.answeredCount += 1;
                                        setReloadToolbar(pre => pre = !pre);
                                    }
                                    question.userAnswer = thisAnswer;
                                }}
                            />
                            <label key={index + "label" + currentQuestionNumber} htmlFor={"id" + currentQuestionNumber + index} style={{ marginLeft: '8px' }}>
                                {answerTexts[index]}  {/* Hiển thị đáp án A, B, C, D hoặc đáp án text */}
                            </label>
                        </div>
                    )

                })}
            </>
        )
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