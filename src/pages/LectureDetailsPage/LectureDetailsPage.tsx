import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Paginator } from 'primereact/paginator';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { callGetAssignmentRows, callGetLectureDoctrine, callGetRelateLectures, callPutPercentLecture } from '../../api/api';
import { useToast } from '../../context/ToastProvider';
import { AmINotLoggedIn } from '../../utils/helperFunction/AuthCheck';
import { ConvertThisAssignmentQuestionToHTML } from '../../utils/helperFunction/convertToHTML';
import SplitNameIDFromURL from '../../utils/helperFunction/splitNameIDFromURL';
import { AssignmentQuestion, LectureID, Name_ID, PracticeAnswerSheet, QuestionID, RelateLectureTitle } from '../../utils/types/type';


// Component chi tiết khóa học
const LectureDetailsPage: React.FC = () => {
    // Lấy ID của khóa học từ tham số URL
    const { lecture_name_id = "" } = useParams<{ lecture_name_id: Name_ID<LectureID> }>();
    if (AmINotLoggedIn()) return <Navigate to={"/home?login=true"} />
    const [lectureName, lectureId] = SplitNameIDFromURL(lecture_name_id);
    // Hook useEffect chạy khi component mount
    useEffect(() => {

    }, [lecture_name_id]);

    // Phần giao diện của component
    return (
        <main className='pt-7'>
            {/* Hiển thị tiêu đề khóa học */}
            <section className="bg-gray-300 mb-5 shadow-5 glassmorphism">
                <h2 className='text-center'>Bài học: <q>{lectureName}</q></h2>
            </section>
            <div className='flex-1 flex-column md:flex-row'>
                {/* Nội dung chính của khóa học */}
                <main className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '70%' }}>
                    <div className='flex flex-row flex-wrap pb-5'>
                        <DoctrineSection lectureId={lectureId} />
                        {/* Phần hiển thị các khóa học liên quan */}
                        <aside className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '28%' }}>
                            <Card className='shadow-6'>
                                <h1 className='text-center'>Một số bài học khác</h1>
                                <RelateLectures lectureId={lectureId} />
                            </Card>
                        </aside>
                    </div>


                    <br />
                    {/* Phần hiển thị các bài tập */}
                    <AssignmentSection lectureID={lectureId} />
                </main>

            </div>
        </main>
    );
};

export default LectureDetailsPage;


//----------------------------------------------------------------------------------------
// Thành phần RelateLectures hiển thị danh sách bài giảng liên quan
const RelateLectures: React.FC<{ lectureId: LectureID }> = React.memo(
    ({ lectureId }) => {
        const [relateLectures, setRelateLecture] = useState<RelateLectureTitle[]>([]);

        // Gọi API để lấy danh sách bài giảng liên quan mỗi khi lectureId thay đổi
        useEffect(() => {
            callGetRelateLectures(lectureId).then((result) => {
                if (!result) return;
                setRelateLecture(result); // Cập nhật danh sách bài giảng
            });
        }, [lectureId]);

        let last = relateLectures.length - 1;
        if (last < 0) {
            return <></>; // Không hiển thị nếu không có bài giảng liên quan
        }

        return (
            <React.Fragment>
                {
                    relateLectures.map(({ id, name }, index) => {
                        return (
                            <React.Fragment key={index}>
                                {/* Link tới bài giảng liên quan */}
                                <Link target="_blank" rel="noopener noreferrer" to={`/lecture/${name}___${id}`}>
                                    <p className='hover:shadow-2 py-2'>{name}</p>
                                </Link>
                                {
                                    index !== last && <Divider /> // Hiển thị dấu phân cách trừ bài cuối cùng
                                }
                            </React.Fragment>
                        );
                    })
                }
            </React.Fragment>
        );
    }
);

// Thành phần DoctrineSection hiển thị nội dung lý thuyết của bài giảng
const DoctrineSection: React.FC<{ lectureId: LectureID }> = React.memo(
    ({ lectureId }) => {
        const divRef = useRef<HTMLDivElement | null>(null);

        // Gọi API để lấy nội dung lý thuyết và chèn vào DOM
        useLayoutEffect(() => {
            callGetLectureDoctrine(lectureId).then((response) => {
                if (response instanceof Error) {
                    return; // Không làm gì nếu có lỗi
                }
                divRef.current!.innerHTML = response; // Chèn nội dung lý thuyết
            });
        }, [lectureId]);

        return (
            <Card title="Lý thuyết" className='shadow-8 flex-1' style={{ flexBasis: '900', minWidth: '700px' }}>
                <div ref={divRef}>
                    <section style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
                        Không có nội dung {/* Nội dung mặc định nếu không có dữ liệu */}
                    </section>
                </div>
            </Card>
        );
    }
);

// Component PracticeSection dùng để hiển thị các bài tập của khóa học
const AssignmentSection: React.FC<{ lectureID: LectureID }> = React.memo(
    ({ lectureID }) => {
        // Trạng thái lưu câu trả lời của người dùng
        const [userAnswerSheet, setUserAnswerSheet] = useState<PracticeAnswerSheet>(new Map<QuestionID, string>());

        // Trạng thái lưu danh sách các câu hỏi hiển thị
        const [questionPage, setQuestionPage] = useState<AssignmentQuestion[]>([]);

        // Trạng thái lưu vị trí câu hỏi đầu tiên được hiển thị trong paginator
        const [first, setFirst] = useState<number>(0);

        // tổng số câu hỏi cần phải trả lời để tính hoàn thành bài tập
        const totalQuestions = useRef<number>(-1);
        // Lưu trữ Toast để hiển thị thông báo
        const { toast } = useToast();
        // cập nhật vào danh sách các câu trả lời của người dùng. nếu trả lời đủ số câu thì coi như kết thúc 
        const updateUserAnswerSheet = (qID: QuestionID, answer: string) => {
            const newAnswerSheet = new Map(userAnswerSheet);
            newAnswerSheet.set(qID, answer);
            setUserAnswerSheet(newAnswerSheet);
            if (newAnswerSheet.size >= totalQuestions.current) {
                callPutPercentLecture(lectureID, 100).then(() => {
                    toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Hoàn thành bài tập' });
                });
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
            const fetchAssignmentQuestion = async () => {
                const response = await callGetAssignmentRows(lectureID);
                if (!response) {
                    return;
                }
                totalQuestions.current = response.length;
                setQuestionPage(response);
            }
            fetchAssignmentQuestion();
        }, [])
        // Trả về phần giao diện của component
        return <Card title="Bài tập" className='shadow-7'>
            {
                (questionPage.length) ?
                    ConvertThisAssignmentQuestionToHTML(questionPage[first], first + 1, userAnswerSheet, updateUserAnswerSheet, paginator) /* Hiển thị câu hỏi hiện tại */
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