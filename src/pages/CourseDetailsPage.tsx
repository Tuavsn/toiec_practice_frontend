import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiResponse, PracticeTitle, CourseOutLine, CourseID, PracticeQuestion, PracticeAnswerSheet, QuestionID, PracticePaper } from '../utils/types/type';
import { Paginator } from 'primereact/paginator';
import { ConvertThisPracticeQuestionToHTML } from '../utils/convertToHTML';


// Component chi tiết khóa học
const CourseDetailsPage: React.FC = () => {
    // Lấy ID của khóa học từ tham số URL
    const { id = "" } = useParams<{ id: CourseID }>();

    // Trạng thái lưu danh sách tiêu đề bài giảng
    const [lectureTitles, setLectureTitles] = useState<string[]>([]);

    // Trạng thái lưu danh sách tiêu đề bài tập
    const [practiceTitles, setPracticeTitles] = useState<PracticeTitle[]>([]);

    // Hook useEffect chạy khi component mount
    useEffect(() => {
        // Hàm lấy dữ liệu outline của khóa học
        const fetchCourseOutline = async () => {
            try {
                // Gọi API lấy tiêu đề bài giảng và bài tập
                const { lectureTitles, practiceTitles: practiceTitles } = await fetchCourseOutLine();
                // Lưu tiêu đề bài tập vào state
                setPracticeTitles([...practiceTitles]);
                // Lưu tiêu đề bài giảng vào state
                setLectureTitles([...lectureTitles]);
            } catch (error) {
                // Bắt lỗi khi không lấy được dữ liệu
                console.error('Error fetching course outline:', error);
            }
        };

        // Gọi hàm fetchCourseOutline
        fetchCourseOutline();
    }, []);

    // Phần giao diện của component
    return (
        <div>
            {/* Hiển thị tiêu đề khóa học */}
            <h2>Course Details for ID: {id}</h2>
            <div className='flex-1 flex-column md:flex-row'>
                {/* Nội dung chính của khóa học */}
                <main className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '70%' }}>
                    <div className='flex flex-row flex-wrap pb-5'>
                        <LectureSection lectureTitles={lectureTitles} courseId={id} />
                        {/* Phần hiển thị các khóa học liên quan */}
                        <aside className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '28%' }}>
                            <Card className='shadow-6'>
                                <h1 className='text-center'>Một số khóa học khác</h1>
                                {RelateCoursesTemplate()}
                            </Card>
                        </aside>
                    </div>


                    <br />
                    {/* Phần hiển thị các bài tập */}
                    <PracticeSection practiceTitles={practiceTitles} courseID={id} />
                </main>

            </div>
        </div>
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

const LectureSection: React.FC<{ lectureTitles: string[], courseId: CourseID }> = React.memo(
    ({ lectureTitles, courseId }) => {
        // Trạng thái lưu vị trí bài học hiện tại
        const [activeLessonIndex, setActiveLessonIndex] = useState<number | number[]>([]);
        // Trạng thái lưu nội dung bài học hiện tại
        const [currentLesson, setCurrentLesson] = useState<string>("");

        return lectureTitles && (
            <Card className='shadow-8 flex-1' style={{flexBasis:'900', minWidth:'700px'}}>
                <h1>Lý thuyết</h1>
                {/* Accordion hiển thị các bài giảng */}
                <Accordion
                    activeIndex={activeLessonIndex}
                    onTabChange={(e) => {
                        // Cập nhật bài giảng đang chọn và tải nội dung bài học
                        setActiveLessonIndex(e.index as number);
                        LoadLessons(e.index as number, courseId, setCurrentLesson);
                    }}>
                    {lectureTitles.map((lectureTitle, index) => (
                        // Tab cho từng bài giảng
                        <AccordionTab key={"lectureNo_" + index} header={lectureTitle}>
                            {(index === activeLessonIndex) && (
                                // Nội dung bài giảng hiện tại
                                <div dangerouslySetInnerHTML={{ __html: currentLesson }} />
                            )}
                        </AccordionTab>
                    ))}
                </Accordion>
            </Card>
        )
    }
)

// Component PracticeSection dùng để hiển thị các bài tập của khóa học
const PracticeSection: React.FC<{ practiceTitles: PracticeTitle[], courseID: CourseID }> = React.memo(
    ({ practiceTitles, courseID }) => {
        // Trạng thái lưu câu trả lời của người dùng
        const [userAnswerSheet, setUserAnswerSheet] = useState<PracticeAnswerSheet>(new Map<QuestionID, string>());

        // Trạng thái lưu vị trí bài tập hiện tại
        const [activePracticeIndex, setActivePracticeIndex] = useState<number | number[]>([]);

        // Trạng thái lưu danh sách các câu hỏi hiển thị
        const [questionPage, setQuestionPage] = useState<PracticeQuestion[]>([]);

        // Trạng thái lưu vị trí câu hỏi đầu tiên được hiển thị trong paginator
        const [first, setFirst] = useState<number>(0);

        // tổng số câu hỏi cần phải trả lời để tính hoàn thành bài tập
        const [totalQuestions, setToTalQuestions] = useState<number>(0);

        // cập nhật vào danh sách các câu trả lời của người dùng. nếu trả lời đủ số câu thì coi như kết thúc 
        const updateUserAnswerSheet = (qID: QuestionID, answer: string) => {
            const newAnswerSheet = new Map(userAnswerSheet);
            newAnswerSheet.set(qID, answer);
            setUserAnswerSheet(newAnswerSheet);
            if (newAnswerSheet.size >= totalQuestions) {
                alert("làm xong");
                console.log(JSON.stringify(newAnswerSheet, null, 2));

            }
        }
        // điều hướng sang trang mới / cũ
        const paginator: JSX.Element =
            <Paginator
                className='inline mr-3'
                first={first}
                rows={1}
                totalRecords={questionPage.length}
                onPageChange={(event) => setFirst(event.first)}
                template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }} />

        // Trả về phần giao diện của component
        return (
            practiceTitles && (
                // Thẻ chứa danh sách bài tập
                <Card className='shadow-7'>
                    <h1>Bài tập</h1>
                    {/* Accordion hiển thị danh sách bài tập */}
                    <Accordion
                        activeIndex={activePracticeIndex}
                        onTabChange={(e) => {
                            // Cập nhật vị trí bài tập hiện tại và tải dữ liệu bài tập
                            setActivePracticeIndex(e.index as number);
                            LoadPractice(e.index as number, courseID, setQuestionPage, setFirst, setUserAnswerSheet, setToTalQuestions);
                        }}>
                        {practiceTitles.map((practiceDetail, index) => (
                            // Tab hiển thị thông tin từng bài tập
                            <AccordionTab
                                key={"homeworkNo_" + index}
                                header={headerTemplate(practiceDetail.title, practiceDetail.isCompleted)}>
                                {/* Hiển thị câu hỏi nếu đang ở bài tập hiện tại */}
                                {(index === activePracticeIndex) && questionPage.length > 0 && (
                                    <React.Fragment>

                                        {ConvertThisPracticeQuestionToHTML(questionPage[first], userAnswerSheet, updateUserAnswerSheet, paginator) /* Hiển thị câu hỏi hiện tại */}
                                        {/* Paginator cho phép chuyển câu hỏi */}

                                    </React.Fragment>
                                )}
                            </AccordionTab>
                        ))}
                    </Accordion>
                </Card>
            )
        );
    }
);


async function fetchCourseOutLine(): Promise<CourseOutLine> {
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
    setCurrentQuestionList: React.Dispatch<React.SetStateAction<PracticeQuestion[]>>,
    setFirst: React.Dispatch<React.SetStateAction<number>>,
    setUserAnswerSheet: React.Dispatch<React.SetStateAction<PracticeAnswerSheet>>,
    setToTalQuestions: React.Dispatch<React.SetStateAction<number>>
): Promise<void> {
    if (!practicePosition && typeof practicePosition != 'number' || !courseID) {
        return;
    }
    const apiPath: string[] = [
        "https://dummyjson.com/c/e6c2-181c-4ceb-86b1",
        "https://dummyjson.com/c/f192-bdf5-4f29-b409",
        "https://dummyjson.com/c/66ae-8554-4737-b4f7",

    ]

    try {
        const response = await fetch(apiPath.at(practicePosition) ?? apiPath[0]);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Assuming the response structure matches your LessonDetail type
        const apiResponse: ApiResponse<PracticePaper> = await response.json();
        setUserAnswerSheet(new Map<QuestionID, string>());
        setToTalQuestions(apiResponse.data.totalQuestions)
        setCurrentQuestionList(apiResponse.data.practiceQuestions);
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