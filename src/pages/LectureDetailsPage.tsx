import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Paginator } from 'primereact/paginator';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { callGetLectureDoctrine, callGetLectureRow, callGetPracticePaper } from '../api/api';
import { ConvertThisPracticeQuestionToHTML } from '../utils/convertToHTML';
import SplitNameIDFromURL from '../utils/splitNameIDFromURL';
import { LectureID, Name_ID, PracticeAnswerSheet, PracticeQuestion, QuestionID } from '../utils/types/type';


// Component chi tiết khóa học
const CourseDetailsPage: React.FC = () => {
    // Lấy ID của khóa học từ tham số URL
    const { lecture_name_id = "" } = useParams<{ lecture_name_id: Name_ID<LectureID> }>();
    const [lectureName, lectureId] = SplitNameIDFromURL(lecture_name_id);
    // Hook useEffect chạy khi component mount
    useEffect(() => {

    }, [lecture_name_id]);

    // Phần giao diện của component
    return (
        <main className='pt-7'>
            {/* Hiển thị tiêu đề khóa học */}
            <h2 className='pb-3 text-center'>Bài giảng: <q>{lectureName}</q></h2>
            <div className='flex-1 flex-column md:flex-row'>
                {/* Nội dung chính của khóa học */}
                <main className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '70%' }}>
                    <div className='flex flex-row flex-wrap pb-5'>
                        <DoctrineSection lectureId={lectureId} />
                        {/* Phần hiển thị các khóa học liên quan */}
                        <aside className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '28%' }}>
                            <Card className='shadow-6'>
                                <h1 className='text-center'>Một số bài học khác</h1>
                                {RelateCoursesTemplate()}
                            </Card>
                        </aside>
                    </div>


                    <br />
                    {/* Phần hiển thị các bài tập */}
                    <PracticeSection lectureID={lectureId} />
                </main>

            </div>
        </main>
    );
};

export default CourseDetailsPage;



// function headerTemplate(title: string, iscompleted: boolean) {
//     return (
//         <React.Fragment>
//             <h3 className='inline'>{title}</h3>
//             <Tag value={iscompleted ? "hoàn thành" : "chưa xong"} className="absolute right-0 mr-3" severity={iscompleted ? "success" : 'warning'} />
//         </React.Fragment>
//     )
// }

function RelateCoursesTemplate() {

    useEffect(() => {
        callGetLectureRow
    })

    return (
        <React.Fragment>
            <Link to={'/lectures/Câu%20hỏi%20đuôi___67461cba477a82561b5a8fb4'}>
                <p className='hover:shadow-2 py-2' >Câu hỏi đuôi</p>
            </Link>
            <Divider />
            <Link to={''}>
                <p className='hover:shadow-2 py-2' >Câu hỏi yes/ no</p>
            </Link>
            <Divider />
            <Link to={'/lectures/Loại%20tranh%20tả%20người%20và%20vật___67461b11477a82561b5a8fb3'}>
                <p className='hover:shadow-2 py-2' >Loại tranh tả người và vật</p>
            </Link>
            <Divider />
            <Link to={'/lectures/Cách%20phân%20biệt%20câu%20hỏi%20when%20liên%20quan%20tới%20thời%20gian___67489285fcdfa12b4133eecd'}>
                <p className='hover:shadow-2 py-2' >Cách phân biệt câu hỏi when liên quan tới thời gian</p>
            </Link>
        </React.Fragment>
    )

}

const DoctrineSection: React.FC<{ lectureId: LectureID }> = React.memo(
    ({ lectureId }) => {
        const divRef = useRef<HTMLDivElement | null>(null);
        useLayoutEffect(() => {
            callGetLectureDoctrine(lectureId).then((response) => {
                if (response instanceof Error) {
                    return;
                }
                divRef.current!.innerHTML = response;
            });
        }, [])
        return <Card title="Lý thuyết" className='shadow-8 flex-1' style={{ flexBasis: '900', minWidth: '700px' }}>

            {/* <div dangerouslySetInnerHTML={{ __html: currentLesson }} /> */}
            <div ref={divRef} >
                <section style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
                    Không có nội dung
                </section>
            </div>
        </Card>

    }
)

// Component PracticeSection dùng để hiển thị các bài tập của khóa học
const PracticeSection: React.FC<{ lectureID: LectureID }> = React.memo(
    ({ lectureID }) => {
        // Trạng thái lưu câu trả lời của người dùng
        const [userAnswerSheet, setUserAnswerSheet] = useState<PracticeAnswerSheet>(new Map<QuestionID, string>());

        // Trạng thái lưu danh sách các câu hỏi hiển thị
        const [questionPage, setQuestionPage] = useState<PracticeQuestion[]>([]);

        // Trạng thái lưu vị trí câu hỏi đầu tiên được hiển thị trong paginator
        const [first, setFirst] = useState<number>(0);

        // tổng số câu hỏi cần phải trả lời để tính hoàn thành bài tập
        const totalQuestions = useRef<number>(-1);

        // cập nhật vào danh sách các câu trả lời của người dùng. nếu trả lời đủ số câu thì coi như kết thúc 
        const updateUserAnswerSheet = (qID: QuestionID, answer: string) => {
            const newAnswerSheet = new Map(userAnswerSheet);
            newAnswerSheet.set(qID, answer);
            setUserAnswerSheet(newAnswerSheet);
            if (newAnswerSheet.size >= totalQuestions.current) {
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
        useEffect(() => {
            const fetchPraticeQuestion = async () => {
                const response = await callGetPracticePaper(lectureID);
                console.log(response);
                totalQuestions.current = response.data.totalQuestions;
                setQuestionPage(response.data.practiceQuestions);
            }
            fetchPraticeQuestion();
        }, [])
        // Trả về phần giao diện của component
        return <Card title="Bài tập" className='shadow-7'>
            {
                (questionPage.length) ?
                    ConvertThisPracticeQuestionToHTML(questionPage[first], userAnswerSheet, updateUserAnswerSheet, paginator) /* Hiển thị câu hỏi hiện tại */
                    :
                    <div className='flex justify-content-center align-item-center p-8'>Không có bài tập</div>
            }
        </Card>

    })


// async function LoadPractice(practicePosition: number | null,
//     courseID: string,
//     setCurrentQuestionList: React.Dispatch<React.SetStateAction<PracticeQuestion[]>>,
//     setFirst: React.Dispatch<React.SetStateAction<number>>,
//     setUserAnswerSheet: React.Dispatch<React.SetStateAction<PracticeAnswerSheet>>,
//     setToTalQuestions: React.Dispatch<React.SetStateAction<number>>
// ): Promise<void> {
//     if (!practicePosition && typeof practicePosition != 'number' || !courseID) {
//         return;
//     }
//     const apiPath: string[] = [
//         "https://dummyjson.com/c/e6c2-181c-4ceb-86b1",
//         "https://dummyjson.com/c/f192-bdf5-4f29-b409",
//         "https://dummyjson.com/c/66ae-8554-4737-b4f7",

//     ]

//     try {
//         const response = await fetch(apiPath.at(practicePosition) ?? apiPath[0]);

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         // Assuming the response structure matches your LessonDetail type
//         const apiResponse: ApiResponse<PracticePaper> = await response.json();
//         setUserAnswerSheet(new Map<QuestionID, string>());
//         setToTalQuestions(apiResponse.data.totalQuestions)
//         setCurrentQuestionList(apiResponse.data.practiceQuestions);
//         setFirst(0);

//     } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//     }
// }


// async function LoadLessons(lessonIndex: number | null, courseId: string, setCurrentLesson: (value: React.SetStateAction<string>) => void): Promise<void> {
//     if (!lessonIndex && typeof lessonIndex != 'number' || !courseId) {
//         return;
//     }
//     const apiPath: string[] = [
//         "https://dummyjson.com/c/cc09-2da5-45eb-886d",
//         "https://dummyjson.com/c/36ee-c249-4efc-af5a",
//         "https://dummyjson.com/c/07dc-f441-4ce1-af6e"
//     ]
//     try {
//         const response = await fetch(apiPath.at(lessonIndex) ?? apiPath[0]);

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         // Assuming the response structure matches your LessonDetail type
//         const apiResponse: ApiResponse<string> = await response.json();
//         setCurrentLesson(apiResponse.data)
//         console.log("ok");


//     } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//         setCurrentLesson("lỗi rồi");
//     }
// }
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