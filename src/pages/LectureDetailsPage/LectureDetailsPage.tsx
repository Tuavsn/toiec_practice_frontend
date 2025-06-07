import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Paginator } from 'primereact/paginator';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { callGetAssignmentRows, callGetLectureDoctrine, callGetRelateLectures, callPutPercentLecture } from '../../api/api';
import CommentSection from '../../components/User/Comment/CommentSection';
import { useToast } from '../../context/ToastProvider';
import { AmINotLoggedIn } from '../../utils/helperFunction/AuthCheck';
import { ConvertThisAssignmentQuestionToHTML } from '../../utils/helperFunction/convertToHTML';
import SplitNameIDFromURL from '../../utils/helperFunction/splitNameIDFromURL';
import { AssignmentQuestion, LectureID, Name_ID, PracticeAnswerSheet, QuestionID, RelateLectureTitle, TargetType } from '../../utils/types/type';


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
                    <br />
                    <section className='mt-7 shadow-7'>
                        <CommentSection targetType={TargetType.LESSON} targetId={lectureId} />
                    </section>
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
                for (let i = 0; i < newAnswerSheet.size; ++i) {
                    if (questionPage[i].correctAnswer !== newAnswerSheet.get((i + 1).toString())) {
                        return;
                    }
                }
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

