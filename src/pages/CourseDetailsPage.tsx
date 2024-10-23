import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiResponse, PracticeTitle, CourseOutLine, PracticeTest, PracticeQuestion } from '../utils/types/type';
import { Paginator } from 'primereact/paginator';
import { ConvertQuestionPageToHTML } from '../utils/convertToHTML';

const CourseDetailsPage: React.FC = () => {
    const { id = "" } = useParams<{ id: string }>(); // Access course ID from URL params

    const [activeLessonIndex, setActiveLessionIndex] = useState<number | number[]>([]);

    const [lectureTitles, setLectureTitles] = useState<string[]>([])
    const [practiceTitles, setPracticeTitles] = useState<PracticeTitle[]>([])
    const [currentLesson, setCurrentLesson] = useState<string>("");

    useEffect(() => {
        const fetchCourseOutLine = async () => {
            try {
                const { lectureTitles, practiceTitles: practiceTitles } = await fetchQuestionsData();
                setPracticeTitles([...practiceTitles]);
                setLectureTitles([...lectureTitles]);

            } catch (error) {
                console.error('Error fetching Course outline:', error);
            }
        };

        fetchCourseOutLine();
    }, []);





    return (
        <div>
            <h2>Course Details for ID: {id}</h2>
            <div className='flex flex-column md:flex-row'>
                <main className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '70%' }}>
                    {lectureTitles &&
                        <Card className='shadow-8'>
                            <h1>Lý thuyết</h1>
                            <Accordion activeIndex={activeLessonIndex}
                                onTabChange={(e) => {
                                    setActiveLessionIndex(e.index as number);
                                    LoadLessons(e.index as number, id, setCurrentLesson);
                                }}>
                                {
                                    lectureTitles.map((lectureTitle, index) => {
                                        return (
                                            <AccordionTab key={"lectureNo_" + index} header={lectureTitle}>
                                                {
                                                    (index === activeLessonIndex) &&
                                                    <div dangerouslySetInnerHTML={{ __html: currentLesson }} />
                                                }
                                            </AccordionTab>
                                        )
                                    })
                                }
                            </Accordion>
                        </Card>
                    }
                    <br></br>
                    <PracticeSection practiceTitles={practiceTitles} courseID={id} />
                </main>
                <aside className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '28%' }}>
                    <Card className='shadow-6'>
                        <h1 className='text-center'>Một số khóa học khác</h1>
                        {RelateCoursesTemplate()}
                    </Card>
                </aside>
            </div>
        </div >
    );
};

export default CourseDetailsPage;


function headerTemplate(title: string, iscompleted: boolean) {
    return (
        <React.Fragment>
            <h3 className='inline'>{title}</h3>
            <Tag value={iscompleted ? "hoàn thành" : "chưa xong"} className="absolute right-0 mr-3" severity={iscompleted ? "success" : 'warning'} />
        </React.Fragment>
    )


}

function RelateCoursesTemplate() {
    return (
        <React.Fragment>
            <Link className='hover:shadow-2' to={''}>
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


const PracticeSection: React.FC<{ practiceTitles: PracticeTitle[], courseID: string }> = React.memo(
    ({ practiceTitles, courseID }) => {

        const [activePracticeIndex, setActivePracticeIndex] = useState<number | number[]>([]);
        const [questionPage, setQuestionPage] = useState<PracticeQuestion[]>([]);
        const [first, setFirst] = useState<number>(0);
        const [userAnswerSheet, setUserAnswerSheet] = useState<string[]>([]);

        return (
            practiceTitles &&
            <Card className='shadow-7'>
                <h1>Bài tập</h1>
                <Accordion activeIndex={activePracticeIndex} onTabChange={(e) => {
                    setActivePracticeIndex(e.index as number);
                    LoadPractice(e.index as number, courseID, setQuestionPage, setFirst, setUserAnswerSheet);
                }}>
                    {
                        practiceTitles.map((practiceDetail, index) => {
                            return (
                                <AccordionTab key={"homeworkNo_" + index} header={headerTemplate(practiceDetail.title, practiceDetail.isCompleted)} >
                                    {
                                        (index === activePracticeIndex) && (questionPage.length) && (
                                            <React.Fragment>
                                                {ConvertQuestionPageToHTML(questionPage[first], userAnswerSheet)}
                                                < Paginator first={first} rows={1} totalRecords={questionPage.length} onPageChange={(event) => setFirst(event.first)} template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }} />
                                            </React.Fragment>
                                        )
                                    }
                                </AccordionTab>
                            )
                        })
                    }
                </Accordion>
            </Card>
        )
    }
)


async function fetchQuestionsData(): Promise<CourseOutLine> {
    try {
        const response = await fetch("https://dummyjson.com/c/2cd9-9ec9-42c8-a1e7");

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Get the full response and cast it to ApiResponse<TestPaper>
        const apiResponse: ApiResponse<CourseOutLine> = await response.json();

        // Return the data part of the response
        return apiResponse.data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return { practiceTitles: [], lectureTitles: [] }; // Return empty arrays in case of an error
    }
}

async function LoadPractice(practicePosition: number | null,
    courseID: string,
    setQuestionPage: React.Dispatch<React.SetStateAction<PracticeQuestion[]>>,
    setFirst: React.Dispatch<React.SetStateAction<number>>,
    setUserAnswerSheet: React.Dispatch<React.SetStateAction<string[]>>,
): Promise<void> {
    if (!practicePosition && typeof practicePosition != 'number' || !courseID) {
        return;
    }
    const apiPath: string[] = [
        "https://dummyjson.com/c/82d4-66d0-4dea-9e64",
        "https://dummyjson.com/c/4275-12d6-4591-8afb",
        "https://dummyjson.com/c/8a4e-90e2-4124-937d"
    ]




    try {
        const response = await fetch(apiPath.at(practicePosition) ?? apiPath[0]);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Assuming the response structure matches your LessonDetail type
        const apiResponse: ApiResponse<PracticeTest> = await response.json();
        setUserAnswerSheet(Array<string>(apiResponse.data.totalQuestions).fill(''));
        setQuestionPage(apiResponse.data.practiceQuestion);
        setFirst(0);



    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


async function LoadLessons(lessonIndex: number | null, courseId: string, setCurrentLesson: (value: React.SetStateAction<string>) => void): Promise<void> {
    if (!lessonIndex && typeof lessonIndex != 'number' || !courseId) {
        return;
    }
    const apiPath: string[] = [
        "https://dummyjson.com/c/cc09-2da5-45eb-886d",
        "https://dummyjson.com/c/36ee-c249-4efc-af5a",
        "https://dummyjson.com/c/07dc-f441-4ce1-af6e"
    ]
    try {
        const response = await fetch(apiPath.at(lessonIndex) ?? apiPath[0]);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Assuming the response structure matches your LessonDetail type
        const apiResponse: ApiResponse<string> = await response.json();
        setCurrentLesson(apiResponse.data)
        console.log("ok");


    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setCurrentLesson("lỗi rồi");
    }
}

// function GetFakeData(): MultipleChoiceQuestion[] {
//     return [
//         {
//             type: 'single',
//             subQuestions: [],
//             content: 'What is the main purpose of the passage?',
//             resources: [{ type: 'paragraph', content: 'The company is offering a new promotion...' }],
//             answers: ['To advertise a new product', 'To announce a promotion', 'To explain company policies', 'To request feedback'],
//         },
//         {
//             type: 'single',
//             subQuestions: [],
//             content: 'What does the speaker suggest?',
//             resources: [{ type: 'audio', content: 'https://tuine09.blob.core.windows.net/resources/TOEIC%20Inter_001.mp3' }]
//             answers: ['Bring ID to the meeting', 'Prepare presentation', 'Book a conference room', 'Submit a report'],
//             correctAnswer: 'Bring ID to the meeting',
//             explanation: ''
//         },
//         {
//             questionNum: 3,
//             type: 'group',
//             subQuestions: [
//                 {
//                     questionNum: 3.1,
//                     type: 'subquestion',
//                     subQuestions: [],
//                     content: 'Where is the company located?',
//                     resources: [{ type: 'paragraph', content: 'The company headquarters is located in Tokyo, Japan.' }],
//                     answers: ['New York', 'London', 'Tokyo', 'Seoul'],
//                     correctAnswer: 'Tokyo',
//                     transcript: '',
//                     explanation: ''
//                 },
//                 {
//                     questionNum: 3.2,
//                     type: 'subquestion',
//                     subQuestions: [],
//                     content: 'What is the main product sold?',
//                     resources: [{ type: 'paragraph', content: 'The company specializes in electronic devices, such as smartphones and laptops.' }],
//                     answers: ['Automobiles', 'Clothing', 'Electronic devices', 'Furniture'],
//                     correctAnswer: 'Electronic devices',
//                     transcript: '',
//                     explanation: ''
//                 },
//             ],
//             content: 'Read the following passage and answer the questions.',
//             resources: [{
//                 type: 'paragraph', content: ' At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti \
//                                     quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt \
//                                     mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. \
//                                     Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.' }],
//             answers: [],
//             correctAnswer: '',
//             transcript: '',
//             explanation: ''
//         },
//         {
//             questionNum: 4,
//             type: 'single',
//             subQuestions: [],
//             content: 'What does the chart suggest about the sales performance?',
//             resources: [{ type: 'image', content: 'https://img.freepik.com/free-vector/hand-drawn-game-pad-logo_23-2148236558.jpg' }],
//             answers: ['Sales increased steadily', 'Sales decreased sharply', 'Sales remained constant', 'Sales fluctuated'],
//             correctAnswer: 'Sales increased steadily',
//             transcript: '',
//             explanation: ''
//         },
//         {
//             questionNum: 5,
//             type: 'single',
//             subQuestions: [],
//             content: 'When will the meeting take place?',
//             resources: [{ type: 'paragraph', content: 'The meeting is scheduled for Friday at 2:00 PM.' }],
//             answers: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
//             correctAnswer: 'Friday',
//             transcript: '',
//             explanation: ''
//         },
//         {
//             questionNum: 6,
//             type: 'single',
//             subQuestions: [],
//             content: 'What does the speaker ask the team to do?',
//             resources: [{ type: 'audio', content: 'https://tuine09.blob.core.windows.net/resources/TOEIC%20Inter_001.mp3' }],
//             transcript: 'Please ensure that all reports are submitted by the end of the day.',
//             answers: ['Submit reports', 'Prepare presentations', 'Review financial statements', 'Schedule meetings'],
//             correctAnswer: 'Submit reports',
//             explanation: ''
//         },
//         {
//             questionNum: 7,
//             type: 'single',
//             subQuestions: [],
//             content: 'Which of the following is true about the new policy?',
//             resources: [{ type: 'paragraph', content: 'The new policy requires all employees to clock in using the company app.' }],
//             answers: ['Employees must clock in by phone', 'The policy applies to managers only', 'Employees use the company app to clock in', 'The policy was implemented last year'],
//             correctAnswer: 'Employees use the company app to clock in',
//             transcript: '',
//             explanation: ''
//         },
//         {
//             questionNum: 8,
//             type: 'group',
//             subQuestions: [
//                 {
//                     questionNum: 8.1,
//                     type: 'subquestion',
//                     subQuestions: [],
//                     content: 'Who is the email from?',
//                     resources: [{ type: 'paragraph', content: 'From: John Smith <john.smith@company.com>' }],
//                     answers: ['John Smith', 'Jane Doe', 'Richard Lee', 'Anna Kim'],
//                     correctAnswer: 'John Smith',
//                     transcript: '',
//                     explanation: ''
//                 },
//                 {
//                     questionNum: 8.2,
//                     type: 'subquestion',
//                     subQuestions: [],
//                     content: 'What is the purpose of the email?',
//                     resources: [{ type: 'paragraph', content: 'Subject: Quarterly Financial Report' }],
//                     answers: ['To request a meeting', 'To send the financial report', 'To provide feedback', 'To ask for a project update'],
//                     correctAnswer: 'To send the financial report',
//                     transcript: '',
//                     explanation: ''
//                 },
//             ],
//             content: 'Read the email and answer the following questions.',
//             resources: [{ type: 'paragraph', content: 'From: John Smith...' }],
//             answers: [],
//             correctAnswer: '',
//             transcript: '',
//             explanation: ''
//         },
//         {
//             questionNum: 9,
//             type: 'single',
//             subQuestions: [],
//             content: 'What is the main topic of the presentation?',
//             resources: [{ type: 'audio', content: 'https://tuine09.blob.core.windows.net/resources/TOEIC%20Inter_001.mp3' }],
//             transcript: 'Today we will be discussing the company\'s new marketing strategy...',
//             answers: ['Sales performance', 'New marketing strategy', 'Employee benefits', 'Annual report'],
//             correctAnswer: 'New marketing strategy',
//             explanation: ''
//         },
//         {
//             questionNum: 10,
//             type: 'single',
//             subQuestions: [],
//             content: 'What is the speaker\'s opinion about the new product?',
//             resources: [{ type: 'paragraph', content: 'The speaker mentioned that the product is innovative and easy to use.' }],
//             answers: ['It is difficult to use', 'It is outdated', 'It is innovative and easy to use', 'It is too expensive'],
//             correctAnswer: 'It is innovative and easy to use',
//             transcript: '',
//             explanation: ''
//         }
//     ];

// }