import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PracticeQuest, Resource } from '../utils/types/type';
import { Image } from 'primereact/image';
import { Paginator } from 'primereact/paginator';
const CourseDetailsPage: React.FC = () => {
    const { id = "" } = useParams<{ id: string }>(); // Access course ID from URL params
    const [activeIndex, setActiveIndex] = useState<number | number[]>(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(1);
    const questionElement: JSX.Element[] = ConvertAllToHTML(GetFakeData());
    const onPageChange = (event: { first: React.SetStateAction<number>; rows: React.SetStateAction<number>; }) => {
        setFirst(event.first);
        setRows(event.rows);

    };


    return (
        <div>
            <h2>Course Details for ID: {id}</h2>
            <div className='flex flex-column md:flex-row'>
                <main className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '70%' }}>
                    <Card>
                        <h1>Lý thuyết</h1>
                        <Accordion activeIndex={activeIndex} onTabChange={(e) => {
                            setActiveIndex(e.index); LoadLessons(e.index as number, id);
                        }}>
                            <AccordionTab header="Header I">
                                <p className="m-0">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="Header II">
                                <p className="m-0">
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                    quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                                    sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                                    Consectetur, adipisci velit, sed quia non numquam eius modi.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="Header III">
                                <p className="m-0">
                                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                    quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                    mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                                </p>
                            </AccordionTab>
                        </Accordion>

                    </Card>
                    <br></br>
                    <Card>
                        <h1>Bài tập</h1>
                        <Accordion activeIndex={0}>
                            <AccordionTab header={headerTemplate}>
                                <span className='m-0'>
                                    {questionElement[first]}
                                </span>
                                <Paginator first={first} rows={rows} totalRecords={questionElement.length} onPageChange={onPageChange} />



                            </AccordionTab>
                            <AccordionTab header="Header II">
                                <p className="m-0">
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                    quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                                    sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                                    Consectetur, adipisci velit, sed quia non numquam eius modi.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="Header III">
                                <p className="m-0">
                                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                    quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                    mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                                </p>
                            </AccordionTab>
                        </Accordion>

                    </Card>
                </main>
                <aside className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '28%' }}>
                    <Card>
                        <h1 className='text-center'>Một số khóa học khác</h1>
                        {RelateCoursesTemplate()}
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default CourseDetailsPage;


// function practiceTemplate(): JSX.Element {

//     return (


//     );

// }

function headerTemplate() {
    return (
        <React.Fragment>
            <h3 className='inline'>Bài tập gì gì đó</h3>
            <Tag value="100%" className="absolute right-0 mr-3" severity={"success"} />
        </React.Fragment>
    )


}

function LoadLessons(lessonPosition: number | null, course: string): void {
    if (lessonPosition === null) {
        return;
    }
    alert(`đang tải bài học thứ ${lessonPosition} của khóa ${course}`)
}

function RelateCoursesTemplate() {
    return (
        <React.Fragment>
            <Link to={''}>
                Khóa làm chủ ★★★☆☆
            </Link>
            <Divider />
            <Link to={''}>
                Khóa làm giàu ★★★☆☆
            </Link>
            <Divider />
            <Link to={''}>
                khóa làm đẹp ★★★☆☆
            </Link>
            <Divider />
            <Link to={''}>
                khóa làm ăn ★★★☆☆
            </Link>
        </React.Fragment>
    )

}

function ConvertAllToHTML(questions: PracticeQuest[]): JSX.Element[] {

    const questionSections: JSX.Element[] = [];
    let questionNum: number = 1;
    for (const q of questions) {
        const elements: JSX.Element[] = [];
        elements.push(...ResourcesToHTML(q.resources, questionNum));
        if (q.type !== 'group') {
            elements.push(<h5 key={"h5" + questionNum}>{questionNum}.{q.content}</h5>);
            questionNum += 1;
            elements.push(AnswersToHTML(q.answers, questionNum));
        }
        else {
            elements.push(<h3 key={"group" + questionNum}>{q.content}</h3>);
            for (const sq of q.subQuestions) {
                elements.push(<h5 key={"h5" + questionNum}>{questionNum}.{sq.content}</h5>);
                questionNum += 1;
                elements.push(...ResourcesToHTML(sq.resources, questionNum));
                elements.push(AnswersToHTML(sq.answers, questionNum));
            }
        }
        questionSections.push(
            <section key={"question" + questionNum}>
                {elements}
            </section>
        )
    }

    // elements.forEach((element, index) => {
    //     console.log(`Element ${index} key:`, element.key ?? "is"+JSON.stringify(element.type));
    // });


    return questionSections;

}



function AnswersToHTML(answers: string[], qNum: number): JSX.Element {
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
                            onChange={() => alert("Chọn phương án: " + answer)} // Change event
                        />
                        <label htmlFor={"id" + qNum + index} style={{ marginLeft: '8px' }}>
                            {answer}
                        </label>
                    </div>
                );
            })}
            <div hidden key={"default"} className="flex align-items-center" style={{ display: 'none' }}>
                <input type="radio" id={"default" + qNum} name={`answer-${qNum}`} hidden />
            </div>
        </div>
    );
}


function ResourcesToHTML(resources: Resource[], qNum: number): JSX.Element[] {
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
                        <audio key={"audio" + qNum + index.toString()} className='w-full' controls autoPlay={false}>
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

function GetFakeData(): PracticeQuest[] {
    return [
        {
            questionNum: 1,
            type: 'single',
            subQuestions: [],
            content: 'What is the main purpose of the passage?',
            resources: [{ type: 'paragraph', content: 'The company is offering a new promotion...' }],
            answers: ['To advertise a new product', 'To announce a promotion', 'To explain company policies', 'To request feedback'],
            transcript: '...Please remember to bring your ID when attending the seminar.',
            correctAnswer: 'To announce a promotion',
            explanation: ''
        },
        {
            questionNum: 2,
            type: 'single',
            subQuestions: [],
            content: 'What does the speaker suggest?',
            resources: [{ type: 'audio', content: 'https://tuine09.blob.core.windows.net/resources/TOEIC%20Inter_001.mp3' }],
            transcript: '...Please remember to bring your ID when attending the seminar.',
            answers: ['Bring ID to the meeting', 'Prepare presentation', 'Book a conference room', 'Submit a report'],
            correctAnswer: 'Bring ID to the meeting',
            explanation: ''
        },
        {
            questionNum: 3,
            type: 'group',
            subQuestions: [
                {
                    questionNum: 3.1,
                    type: 'subquestion',
                    subQuestions: [],
                    content: 'Where is the company located?',
                    resources: [{ type: 'paragraph', content: 'The company headquarters is located in Tokyo, Japan.' }],
                    answers: ['New York', 'London', 'Tokyo', 'Seoul'],
                    correctAnswer: 'Tokyo',
                    transcript: '',
                    explanation: ''
                },
                {
                    questionNum: 3.2,
                    type: 'subquestion',
                    subQuestions: [],
                    content: 'What is the main product sold?',
                    resources: [{ type: 'paragraph', content: 'The company specializes in electronic devices, such as smartphones and laptops.' }],
                    answers: ['Automobiles', 'Clothing', 'Electronic devices', 'Furniture'],
                    correctAnswer: 'Electronic devices',
                    transcript: '',
                    explanation: ''
                },
            ],
            content: 'Read the following passage and answer the questions.',
            resources: [{
                type: 'paragraph', content: ' At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti \
                                    quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt \
                                    mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. \
                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.' }],
            answers: [],
            correctAnswer: '',
            transcript: '',
            explanation: ''
        },
        {
            questionNum: 4,
            type: 'single',
            subQuestions: [],
            content: 'What does the chart suggest about the sales performance?',
            resources: [{ type: 'image', content: 'https://img.freepik.com/free-vector/hand-drawn-game-pad-logo_23-2148236558.jpg' }],
            answers: ['Sales increased steadily', 'Sales decreased sharply', 'Sales remained constant', 'Sales fluctuated'],
            correctAnswer: 'Sales increased steadily',
            transcript: '',
            explanation: ''
        },
        {
            questionNum: 5,
            type: 'single',
            subQuestions: [],
            content: 'When will the meeting take place?',
            resources: [{ type: 'paragraph', content: 'The meeting is scheduled for Friday at 2:00 PM.' }],
            answers: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
            correctAnswer: 'Friday',
            transcript: '',
            explanation: ''
        },
        {
            questionNum: 6,
            type: 'single',
            subQuestions: [],
            content: 'What does the speaker ask the team to do?',
            resources: [{ type: 'audio', content: 'https://tuine09.blob.core.windows.net/resources/TOEIC%20Inter_001.mp3' }],
            transcript: 'Please ensure that all reports are submitted by the end of the day.',
            answers: ['Submit reports', 'Prepare presentations', 'Review financial statements', 'Schedule meetings'],
            correctAnswer: 'Submit reports',
            explanation: ''
        },
        {
            questionNum: 7,
            type: 'single',
            subQuestions: [],
            content: 'Which of the following is true about the new policy?',
            resources: [{ type: 'paragraph', content: 'The new policy requires all employees to clock in using the company app.' }],
            answers: ['Employees must clock in by phone', 'The policy applies to managers only', 'Employees use the company app to clock in', 'The policy was implemented last year'],
            correctAnswer: 'Employees use the company app to clock in',
            transcript: '',
            explanation: ''
        },
        {
            questionNum: 8,
            type: 'group',
            subQuestions: [
                {
                    questionNum: 8.1,
                    type: 'subquestion',
                    subQuestions: [],
                    content: 'Who is the email from?',
                    resources: [{ type: 'paragraph', content: 'From: John Smith <john.smith@company.com>' }],
                    answers: ['John Smith', 'Jane Doe', 'Richard Lee', 'Anna Kim'],
                    correctAnswer: 'John Smith',
                    transcript: '',
                    explanation: ''
                },
                {
                    questionNum: 8.2,
                    type: 'subquestion',
                    subQuestions: [],
                    content: 'What is the purpose of the email?',
                    resources: [{ type: 'paragraph', content: 'Subject: Quarterly Financial Report' }],
                    answers: ['To request a meeting', 'To send the financial report', 'To provide feedback', 'To ask for a project update'],
                    correctAnswer: 'To send the financial report',
                    transcript: '',
                    explanation: ''
                },
            ],
            content: 'Read the email and answer the following questions.',
            resources: [{ type: 'paragraph', content: 'From: John Smith...' }],
            answers: [],
            correctAnswer: '',
            transcript: '',
            explanation: ''
        },
        {
            questionNum: 9,
            type: 'single',
            subQuestions: [],
            content: 'What is the main topic of the presentation?',
            resources: [{ type: 'audio', content: 'https://tuine09.blob.core.windows.net/resources/TOEIC%20Inter_001.mp3' }],
            transcript: 'Today we will be discussing the company\'s new marketing strategy...',
            answers: ['Sales performance', 'New marketing strategy', 'Employee benefits', 'Annual report'],
            correctAnswer: 'New marketing strategy',
            explanation: ''
        },
        {
            questionNum: 10,
            type: 'single',
            subQuestions: [],
            content: 'What is the speaker\'s opinion about the new product?',
            resources: [{ type: 'paragraph', content: 'The speaker mentioned that the product is innovative and easy to use.' }],
            answers: ['It is difficult to use', 'It is outdated', 'It is innovative and easy to use', 'It is too expensive'],
            correctAnswer: 'It is innovative and easy to use',
            transcript: '',
            explanation: ''
        }
    ];

}