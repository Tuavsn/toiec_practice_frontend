import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Paginator } from 'primereact/paginator';
import { Tag } from 'primereact/tag';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { callGetPracticePaper } from '../api/api';
import { ConvertThisPracticeQuestionToHTML } from '../utils/convertToHTML';
import { ApiResponse, LectureID, PracticeAnswerSheet, PracticePaper, PracticeQuestion, QuestionID } from '../utils/types/type';


// Component chi tiết khóa học
const CourseDetailsPage: React.FC = () => {
    // Lấy ID của khóa học từ tham số URL
    const { id = "" } = useParams<{ id: LectureID }>();

    // Hook useEffect chạy khi component mount
    useEffect(() => {

    }, []);

    // Phần giao diện của component
    return (
        <main className='pt-7'>
            {/* Hiển thị tiêu đề khóa học */}
            <h2 className='pb-3 text-center'>Bài giảng cho for ID: {id}</h2>
            <div className='flex-1 flex-column md:flex-row'>
                {/* Nội dung chính của khóa học */}
                <main className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '70%' }}>
                    <div className='flex flex-row flex-wrap pb-5'>
                        <DoctrineSection lectureId={id} />
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
                    <PracticeSection lectureID={id} />
                </main>

            </div>
        </main>
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

const DoctrineSection: React.FC<{ lectureId: LectureID }> = React.memo(
    ({ lectureId }) => {
        const divRef = useRef<HTMLDivElement | null>(null);
        useLayoutEffect(() => {
            divRef.current!.innerHTML = GetFakeDoctrineSection();
        }, [])
        return <Card title="Lý thuyết" className='shadow-8 flex-1' style={{ flexBasis: '900', minWidth: '700px' }}>

            {/* <div dangerouslySetInnerHTML={{ __html: currentLesson }} /> */}
            <div ref={divRef} />
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

function GetFakeDoctrineSection(): string {
    return `
    <section style="font-family: Arial, sans-serif; line-height: 1.6;">
  <h2 style="font-weight: bold; font-size: 24px;">Tìm hiểu về câu điều kiện loại 1 và loại 2</h2>
  <p style="font-size: 16px;">Để có thể nắm vững cách phân biệt câu điều kiện loại 1 và loại 2, trước tiên, bạn cần biết rõ câu điều kiện loại 1 là câu gì và câu điều kiện loại 2 là loại câu như thế nào. Cùng tìm hiểu trong phần nội dung dưới đây.</p>

  <h3 style="font-weight: bold; font-size: 20px;">Câu điều kiện loại 1</h3>
  <p style="font-size: 16px;">Câu điều kiện loại 1 là dạng câu được dùng để mô tả những tình huống, hành động, sự việc có khả năng xảy ra trong tương lai thông qua một điều kiện cụ thể. Câu điều kiện loại 1 bao gồm 2 mệnh đề đó là mệnh đề điều kiện và mệnh đề chính hay còn được biết đến với tên gọi mệnh đề kết quả.</p>

  <h4 style="font-weight: bold; font-size: 18px;">Cấu trúc</h4>
  
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>
      <tr>
        <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold; background-color: #f0f0f0;">Mệnh đề If (Nếu)</th>
        <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold; background-color: #f0f0f0;">Mệnh đề chính (Thì)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #000; padding: 8px;">If + S + V(s, es)…</td>
        <td style="border: 1px solid #000; padding: 8px;">S + will + V-inf</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 8px;">Thì hiện tại đơn</td>
        <td style="border: 1px solid #000; padding: 8px;">Thì tương lai đơn</td>
      </tr>
    </tbody>
  </table>

  <h4 style="font-weight: bold; font-size: 18px;">Ví dụ:</h4>
  <ul style="font-size: 16px; list-style-type: disc; margin-left: 20px;">
    <li>If you visit New York, you will see the Statue of Liberty. (Nếu bạn đến thăm New York, bạn sẽ thấy tượng Nữ thần Tự do)</li>
    <li>If he eats too much junk food, he will gain weight. (Nếu anh ấy ăn quá nhiều đồ ăn vặt, anh ấy sẽ tăng cân)</li>
    <li>If you study regularly, you will improve your English skills. (Nếu bạn học thường xuyên, bạn sẽ cải thiện được kỹ năng tiếng Anh của mình)</li>
  </ul>
  <p style="font-size: 16px;">Trong các ví dụ trên, mệnh đề “If” mô tả một điều kiện có khả năng có thể xảy ra trong tương lai và mệnh đề chính diễn đạt một kết quả sẽ xảy ra nếu điều kiện đã nêu được đáp ứng.</p>

  <h4 style="font-weight: bold; font-size: 18px;">Cách dùng</h4>
  <p style="font-size: 16px;">Câu điều kiện loại 1 thường được sử dụng để nêu các kế hoạch cho tương lai hoặc đưa ra các tình huống giả định. Ngoài ra, câu điều kiện dạng này cũng được dùng để đưa ra lời gợi ý hoặc lời khuyên.</p>

  <h4 style="font-weight: bold; font-size: 18px;">Ví dụ:</h4>
  <ul style="font-size: 16px; list-style-type: disc; margin-left: 20px;">
    <li>If the weather stays nice, we will have a barbecue in the garden. (Nếu thời tiết đẹp, chúng tôi sẽ tổ chức tiệc nướng ngoài vườn)</li>
    <li>If she finishes her work on time, she can go to the concert. (Nếu cô ấy hoàn thành công việc đúng giờ, cô ấy có thể đến buổi hòa nhạc)</li>
    <li>If she exercises regularly, she will improve her health. (Nếu cô ấy tập thể dục thường xuyên, cô ấy sẽ cải thiện sức khỏe của mình)</li>
  </ul>
</section>
`
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