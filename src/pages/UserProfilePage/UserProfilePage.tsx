import { Chart as ChartJS, Plugin, registerables } from 'chart.js';
import 'chart.js/auto';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataScroller } from 'primereact/datascroller';
import { DataTable } from "primereact/datatable";
import { InputNumber } from 'primereact/inputnumber';
import { MenuItem } from 'primereact/menuitem';
import { ProgressBar } from 'primereact/progressbar';
import { Stepper, StepperRefAttributes } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Steps } from 'primereact/steps';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { callGetMyRecommend, callPutPercentLecture, callPutUserTarget } from '../../api/api';
import { CountAnswerTypeTemplate, detailUserResultRowBodyTemplate, typeUserResultRowBodyTemplate } from '../../components/Common/Column/CommonColumn';
import useLectureProfile from '../../hooks/LectureProfileHook';
import useProfile from '../../hooks/ProfileHook';
import { AmINotLoggedIn } from '../../utils/helperFunction/AuthCheck';
import convertSecondsToString from '../../utils/helperFunction/convertSecondsToString';
import formatDate from '../../utils/helperFunction/formatDateToString';
import GetColorBasedOnValue from '../../utils/helperFunction/GetColorHueValue';
import { ProfileHookAction } from '../../utils/types/action';
import { ActivityLogProps, SkillInsightsProps } from '../../utils/types/props';
import { LectureCard, LectureID, RecommendLecture, RecommendTest, SkillStat, TopicStat, UserDetailResultRow } from '../../utils/types/type';
// Đăng ký các phần tử Chart.js cần thiết
ChartJS.register(...registerables);
// Đăng ký plugin DataLabels
ChartJS.register(ChartDataLabels as Plugin<"pie">);

export default function UserProfilePage() {

    const {
        state: { overallStat, topicStats, results, skillStats, target },
        dispatch

    } = useProfile();
    const { onGoingLectures, completeLectures } = useLectureProfile();
    if (AmINotLoggedIn()) return <Navigate to={"/home?login=true"} />

    const { averageListeningScore, averageReadingScore } = overallStat!;

    return (
        <main className="pt-8 flex gap-3 flex-column">
            <div key="area-1">
                <Card key="user-goal" className='shadow-7' title="1. Mục tiêu bản thân"><UserGoal currentScore={averageListeningScore + averageReadingScore} target={target} dispatch={dispatch} /></Card>
                <Card key="current-lecture" className='shadow-7' title="2. Các bài học đã tham gia"><CurrentLecture completeLectures={completeLectures} onGoingLectures={onGoingLectures} /></Card>
            </div>
            <div key="area-2" className="flex gap-3 flex-wrap">
                <Card key="progress-overview" className='shadow-7 flex-1' style={{ minWidth: "400px" }} title="2. Tổng quan tiến độ ">{ProgressOverview(overallStat!.averageListeningScore, overallStat!.averageReadingScore)}</Card>
                <Card key="skill-insight" className='shadow-7 flex-1' style={{ minWidth: "400px" }} title="3. Thông tin chi tiết kỹ năng"><SkillInsights parts={topicStats} /></Card>
            </div>
            <Card key="activity-log" className='shadow-7' title="4. Nhật ký học tập"><ActivityLog userResultRows={results} /></Card>
            <div key="area-3" className="flex gap-3 flex-wrap">
                <Card key="time-spent" className="shadow-7 flex-1" style={{ minWidth: "590px" }} title="5. Thời gian học tập theo kỹ năng">{TimeSpent(skillStats)}</Card>
                <Card key="suggestion" className='shadow-7 flex-1' title="6. Đề xuất cải thiện"><Suggestions lectureCards={[...onGoingLectures, ...completeLectures]} /></Card>

            </div>
            {/* <Card key="stat" className='shadow-7' title="7. Thống kê"></Card> */}
        </main>
    );
}

//==================================================helper HTML ELEMENT =============================================================================================

//---[1]-------------------------------------------------------------------------------------------------------------------------------------------
const UserGoal: React.FC<{ target: number; currentScore: number, dispatch: React.Dispatch<ProfileHookAction> }> = React.memo(({ target, currentScore, dispatch }) => {

    const GoalLabel = Array.from(new Set([0, 10, 255, 405, 605, 785, 905, 990, target, currentScore])).sort((a, b) => a - b);
    const currentScoreIndex = GoalLabel.indexOf(currentScore);


    // Generate unique and sorted GoalLabel dynamically
    const steps = GetSteps({ GoalLabel, currentScore, dispatch, target, currentScoreIndex });
    return (
        <div className="card">
            <h3>
                Cần cố gắng <i className="text-red-500">{target - currentScore}</i> điểm nữa để đạt được mục tiêu :{getCurrentTitle(target)}
            </h3>
            <Steps model={steps} activeIndex={currentScoreIndex} readOnly={false} className="m-2 pt-4" />
            <section className="flex justify-content-center gap-5 mt-7">
                <div className="p-inputgroup w-fit">
                    <Button severity="success" label="Đặt mục tiêu mới" onClick={() => callPutUserTarget(target)} />
                    <InputNumber
                        inputStyle={{ maxWidth: '7rem', backgroundColor: 'aliceblue' }}
                        value={target} suffix="  điểm" showButtons
                        onChange={(e) => {
                            dispatch({ type: "SET_TARGET", payload: (Number(e.value) || currentScore) });
                        }}
                        max={990} min={10} step={10}

                    />
                </div>
            </section>
        </div>
    );
});

//--- [2]-------------------------------------------------------------------------------------------------------------------------------------------
const CurrentLecture: React.FC<{ onGoingLectures: LectureCard[], completeLectures: LectureCard[] }> = React.memo(
    ({ completeLectures,
        onGoingLectures
    }) => {

        const totalOnGoing = onGoingLectures.length;
        const totalComplete = completeLectures.length;

        return (
            <TabView>
                <TabPanel header="Đang tiếp diễn" leftIcon="pi pi-calendar mr-2">
                    <DataScroller value={onGoingLectures} itemTemplate={itemLectureTemplate} rows={5} inline scrollHeight="700px" footer={`Tổng có ${totalOnGoing} bài học`} header={totalOnGoing >= 2 ? "Kéo xuống để hiển thị thêm" : ""} />

                </TabPanel>
                <TabPanel header="Đã hoàn thành" rightIcon="pi pi-check ml-2">
                    <DataScroller value={completeLectures} itemTemplate={itemLectureTemplate} rows={5} inline scrollHeight="700px" footer={`Tổng có ${totalComplete} bài học`} header={totalComplete >= 2 ? "Kéo xuống để hiển thị thêm" : ""} />
                </TabPanel>
            </TabView>
        )
    }
)

function itemLectureTemplate({ id, name, topic, percent: completePercent }: LectureCard) {
    const hueValue = GetColorBasedOnValue(completePercent);
    return (
        <Card
            key={id}
            title={name}
            className="border-round m-2 shadow-2 min-h-full bg-yellow-50 hover:shadow-4"
            data-testid={`lecture-card-${id}`}
        >
            <div>
                <p className="pb-5" data-testid={`lecture-content-${id}`}>
                    <strong>Nội dung:</strong> {topic.join(", ")}
                </p>
                <Link to={`/lecture/${name}___${id}`} data-testid={`lecture-link-${id}`}>
                    <Button severity="help" label="Học ngay" data-testid={`lecture-button-${id}`} />
                </Link>
                <ProgressBar className="mt-3" color={hueValue} value={completePercent}></ProgressBar>
            </div>
        </Card>
    )
}

//---[3]-------------------------------------------------------------------------------------------------------------------------------------------
function ProgressOverview(averageListeningScore: number, averageReadingScore: number) {
    // Khởi tạo dữ liệu cho biểu đồ
    const data = {
        labels: ['Nghe', 'Đọc', 'Còn Lại'], // Nhãn cho các phần của biểu đồ
        datasets: [
            {
                data: [
                    averageListeningScore, // Điểm nghe trung bình
                    averageReadingScore,   // Điểm đọc trung bình
                    990 - averageListeningScore - averageReadingScore // Phần còn lại đến tổng điểm tối đa 990
                ],
                backgroundColor: ['#00FF7F', '#FA8072', '#bebebe'], // Màu nền cho từng phần của biểu đồ
                hoverBackgroundColor: ['#9ACD32', '#DC143C', '#4e4e4e'], // Màu khi di chuột qua các phần
            }
        ]
    }

    // --Tùy chọn cho biểu đồ-------------------------------------------------------------------------------------
    const options = {
        plugins: {
            legend: {
                position: 'bottom' as const, // Vị trí của legend ở phía dưới biểu đồ
            },
            datalabels: {
                formatter: (_value: number, context: Context) => context.chart.data.labels?.at(context.dataIndex) || '', // Định dạng nhãn dữ liệu
                font: {
                    size: 16, // Kích thước chữ cho nhãn
                },
                color: '#fff', // Màu chữ cho nhãn
            },
        },
    }

    // --Trả về cấu trúc HTML cho giao diện------------------------------------------------------------------------
    return (
        <main>
            <div className="flex flex-wrap justify-content-around">
                <section className="shadow-4 p-3 border-round-xs">
                    <h1>Điểm phân bổ theo kỹ năng</h1>
                    <table style={{ borderSpacing: '30px' }}>
                        <tbody>
                            <tr>
                                <td>Điểm nghe trung bình</td>
                                <td>{averageListeningScore}</td>
                            </tr>
                            <tr>
                                <td>Điểm đọc trung bình</td>
                                <td>{averageReadingScore}</td>
                            </tr>
                            <tr>
                                <td colSpan={2}><hr /></td>
                            </tr>
                            <tr>
                                <td><b>Tổng điểm trung bình</b></td>
                                <td><b>{averageListeningScore + averageReadingScore} / 990</b></td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 className="inline pr-1"> Trình độ hiện tại:</h1>
                    <h5 className="inline m-auto">{getCurrentTitle(averageListeningScore + averageReadingScore)}</h5> {/* Hiển thị trình độ hiện tại */}
                </section>
                <section className="pt-4" style={{ width: '300px', height: '300px' }}>
                    <Pie data={data} options={options} /> {/* Hiển thị biểu đồ hình tròn */}
                </section>
            </div>
        </main>
    );
}

//---[4]-------------------------------------------------------------------------------------------------------------------------------------------
const SkillInsights: React.FC<SkillInsightsProps> = React.memo(
    ({ parts }) => {
        // --Trả về cấu trúc HTML cho giao diện-------------------------------------------------------------------------------------
        return (
            <div className="card">

                <div className="shadow-7">
                    <DataTable value={parts} paginator rows={5} totalRecords={parts.length} emptyMessage="Không có dữ liệu">
                        <Column key="col-topic" field="topic.name" filter filterMatchMode="startsWith" header="Phân loại câu hỏi" />
                        <Column key="col-correctCount" field="totalCorrect" header="Số câu đúng" />
                        <Column key="col-wrongCount" field="totalIncorrect" header="Số câu sai" />
                        <Column key="col-correctPercent" field="correctPercent" header="Độ chính xác" body={correctPercentTemplate} />
                    </DataTable>
                </div>
            </div>
        )
    }
);

//---[5]-------------------------------------------------------------------------------------------------------------------------------------------
// Component ActivityLog sử dụng React.memo để chỉ render lại khi props thay đổi, giúp tối ưu hiệu suất
const ActivityLog: React.FC<ActivityLogProps> = React.memo(
    ({ userResultRows }) => {

        // Trả về giao diện chính với tiêu đề và bảng dữ liệu lịch sử hoạt động-------------------------------------------------------------------------------------
        return (
            <main>
                <h1>Lịch sử hoạt động</h1>
                <DataTable dataKey="resultId" showGridlines paginator totalRecords={userResultRows.length} rows={5} size="small" value={userResultRows} emptyMessage="Không có lịch sử">
                    {/* // Cột ngày làm việc, hiển thị ngày từ trường createdAt và cho phép lọc, sắp xếp */}
                    <Column key="col-createdAt" alignHeader='center' field="createdAt" header="Ngày làm" body={(rowData: UserDetailResultRow) => formatDate(rowData.createdAt)} sortable filter />

                    {/* // Cột tên đề thi, hiển thị theo trường testFormatAndYear, có thể lọc, sắp xếp */}
                    <Column key="col-testName" alignHeader='center' field="testName" header="Đề" sortable filter />

                    {/* // Cột kết quả, sử dụng template CountSkillScoreTemplate để hiển thị điểm đọc và nghe */}
                    <Column key="col-skill_count" alignHeader='center' header="Kết quả" body={CountSkillScoreTemplate} />

                    {/* // Cột thống kê trả lời, hiển thị số lượng đúng, sai, bỏ qua bằng template CountAnswerTypeTemplate */}
                    <Column key="col-answer_count" alignHeader='center' header="Thống kê" body={CountAnswerTypeTemplate} />

                    {/* // Cột thời gian làm bài, lấy dữ liệu từ trường totalTime và cho phép sắp xếp */}
                    <Column key="col-time" alignHeader='center' field="totalTime" header="Thời gian làm" body={(data) => convertSecondsToString(data.totalTime)} sortable filter />

                    {/* // Cột loại bài kiểm tra, dùng template UserResultTemplate để hiển thị thông tin loại */}
                    <Column key="col-type" header="Phần thi" body={typeUserResultRowBodyTemplate} alignHeader='center' />

                    {/* // Cột chi tiết, hiển thị chi tiết kết quả người dùng qua template UserResultTemplate */}
                    <Column key="col-detail" body={(data) => detailUserResultRowBodyTemplate({ id: data.resultId })} />

                </DataTable>

            </main>
        )
    }
)

// Hàm CountSkillScoreTemplate nhận rowData và trả về hiển thị điểm nghe và đọc của người dùng
function CountSkillScoreTemplate(rowData: UserDetailResultRow) {
    return (
        <section>
            <div className='text-center bg-blue-200 p-2'>

                {rowData.result}
            </div>
            <div className="flex flex-wrap justify-content-around">
                <span className="text-center bg-green-200 flex-1 p-2">👂 {rowData.totalListeningScore}</span> {/* Điểm nghe */}
                <span className="text-center bg-orange-200 flex-1 p-2">📖 {rowData.totalReadingScore}</span> {/* Điểm đọc */}
            </div>
        </section>
    )
}



//---[6]-------------------------------------------------------------------------------------------------------------------------------------------
function TimeSpent(skillStats: SkillStat[]) {
    const timeSpentOnParts = skillStats.length ? skillStats.map(sk => sk.totalTime) : [1, 1];
    const smallestAmount = timeSpentOnParts.reduce((p, c) => c = c + p) / 100;
    // Khởi tạo dữ liệu cho biểu đồ
    const data = {
        labels: ['Nghe', 'Đọc'], // Nhãn cho các phần của biểu đồ
        datasets: [
            {
                data: timeSpentOnParts,
                backgroundColor: ['#1BE7FF', '#6EEB83', '#E4FF1A', '#FFB800', '#FF5714'], // Màu nền cho từng phần của biểu đồ
                hoverBackgroundColor: ['#18BFD1', '#61CC73', '#C0D616', '#C68E01', '#C2420F'], // Màu khi di chuột qua các phần
            }
        ]
    }

    // --Tùy chọn cho biểu đồ-------------------------------------------------------------------------------------
    const options = {
        plugins: {
            legend: {
                position: 'bottom' as const, // Vị trí của legend ở phía dưới biểu đồ
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: { label: any; raw: any; }) {
                        const label = tooltipItem.label; // Lấy nhãn
                        const value = tooltipItem.raw; // Lấy giá trị
                        return `${label}: ${convertSecondsToString(value)}`; // Trả về chuỗi định dạng
                    }
                }
            },
            datalabels: {
                formatter: (value: number, context: any) => {
                    // Nếu như thời gian dành ra quá ít. không chiếu lên biểu đồ nữa 
                    if (value <= smallestAmount)
                        return "";
                    return context.chart.data.labels[context.dataIndex]
                }, // Định dạng nhãn dữ liệu
                font: {
                    size: 16, // Kích thước chữ cho nhãn
                },
                color: '#000', // Màu chữ cho nhãn
            },
        },
    }
    return (
        <section className="pt-4" style={{ width: '570px', height: '570px' }}>
            <Doughnut data={data} options={options} /> {/* Hiển thị biểu đồ hình tròn */}
        </section>
    )
}



//---[7]-------------------------------------------------------------------------------------------------------------------------------------------
// Hàm Suggestions hiển thị danh sách các gợi ý học TOEIC dưới dạng các bước với Stepper.
const Suggestions: React.FC<{ lectureCards: LectureCard[] }> = React.memo(
    ({ lectureCards }) => {
        // stepperRef dùng để lưu trữ tham chiếu đến Stepper và sử dụng các phương thức điều hướng.
        const [recommendLectures, setRecommendLectures] = useState<RecommendLecture[] | null>([])
        const [recommendTests, setRecommendTests] = useState<RecommendTest[] | null>([])
        useEffect(() => {
            callGetMyRecommend().then(([lectureList, testList]) => {
                setRecommendLectures(lectureList);
                setRecommendTests(testList);
            });
        }, [])
        return (
            <TabView>
                <TabPanel header="Bài học phù hợp với bạn">
                    <RecommendLectureStepper recommendLectures={recommendLectures} lectureCards={lectureCards} />
                </TabPanel>
                <TabPanel header="Đề thi phù hợp với bạn">
                    <RecommendTestStepper recommendTests={recommendTests} />
                </TabPanel>
            </TabView>
        )
    }
)

const RecommendLectureStepper: React.FC<{ recommendLectures: RecommendLecture[] | null, lectureCards: LectureCard[] }> = React.memo(
    ({ recommendLectures, lectureCards }) => {
        const navigate = useNavigate();
        const stepperRef = useRef<StepperRefAttributes | null>(null);
        if (!recommendLectures) {
            recommendLectures = [{
                explanation: "không có gợi ý cải thiện nào",
                id: "",
                lectureId: "",
                name: ""
            }]
        }
        const lastIndex = recommendLectures.length - 1;

        const onClick = useCallback((url: string, lectureID: LectureID) => {
            const foundIndex = lectureCards.findIndex(l => l.id === lectureID);
            console.log(foundIndex);

            if (foundIndex === -1) {
                Promise.resolve().then(() => {

                    // Now, call your API function from inside the deferred task
                    callPutPercentLecture(lectureID, 10)
                        .catch(err => {
                            // It's still crucial to catch errors!
                            console.error("The deferred API call failed:", err);
                        });
                });
            }


            navigate(encodeURI(url));
        }, [lectureCards])
        return (
            <Stepper ref={stepperRef} orientation="vertical">
                {
                    // Duyệt qua từng phần gợi ý trong suggestionOnParts
                    recommendLectures.map((suggestion, index) => {
                        const header = suggestion.name
                            ? `${suggestion.name} (${index + 1})`
                            : `Step ${index + 1}`;
                        const url = suggestion.id === "" ? "#" : `/lecture/${suggestion.name}___${suggestion.lectureId}`
                        const key = `step_lec_${index}_${suggestion.id} ${Math.random()}`

                        return (
                            <StepperPanel key={key} header={header}>
                                {/* Hiển thị nội dung gợi ý */}
                                <div className="flex flex-column h-12rem">
                                    <div className="custom-box">
                                        <section>
                                            <p>{suggestion.explanation}</p>
                                            <Button link onClick={() => onClick(url, suggestion.lectureId)}>
                                                <p className='text-center text-blue-300 hover:text-blue-500'>{">> "}Xem thêm tại đây{" <<"}</p>
                                            </Button>
                                        </section>
                                    </div>

                                </div>
                                <div className="flex py-4 gap-2">

                                    {index !== 0 /* Nút "Trước" - chỉ hiển thị nếu không phải gợi ý đầu tiên */ &&
                                        <Button label="Trước" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback()} />
                                    }

                                    {index !== lastIndex /* Nút "Tiếp" - chỉ hiển thị nếu không phải gợi ý cuối cùng */ &&
                                        <Button label="Tiếp" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current?.nextCallback()} />
                                    }
                                </div>
                            </StepperPanel>
                        )
                    })
                }
            </Stepper>
        )
    }
)
const RecommendTestStepper: React.FC<{ recommendTests: RecommendTest[] | null }> = React.memo(
    ({ recommendTests }) => {
        const stepperRef = useRef<StepperRefAttributes | null>(null);
        if (!recommendTests) {
            recommendTests = [{
                explanation: "không có gợi ý cải thiện nào",
                id: "",
                testId: "",
                name: ""
            }]
        }
        const lastIndex = recommendTests.length - 1;
        return (
            <Stepper ref={stepperRef} orientation="vertical">
                {
                    // Duyệt qua từng phần gợi ý trong suggestionOnParts
                    recommendTests.map((suggestion, index) => {
                        const header = suggestion.name
                            ? `${suggestion.name} (${index + 1})`
                            : `Step ${index + 1}`;
                        const url = suggestion.id === "" ? "#" : `/test/${suggestion.testId}`
                        return (
                            <StepperPanel key={"step_test" + index} header={header}>
                                {/* Hiển thị nội dung gợi ý */}
                                <div className="flex flex-column h-12rem">
                                    <div className="custom-box">
                                        <section>
                                            <p>{suggestion.explanation}</p>
                                            <Link to={url}>
                                                <p className='text-center text-blue-300 hover:text-blue-500'>{">> "}Xem thêm tại đây{" <<"}</p>
                                            </Link>
                                        </section>
                                    </div>

                                </div>
                                <div className="flex py-4 gap-2">

                                    {index !== 0 /* Nút "Trước" - chỉ hiển thị nếu không phải gợi ý đầu tiên */ &&
                                        <Button label="Trước" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback()} />
                                    }

                                    {index !== lastIndex /* Nút "Tiếp" - chỉ hiển thị nếu không phải gợi ý cuối cùng */ &&
                                        <Button label="Tiếp" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current?.nextCallback()} />
                                    }
                                </div>
                            </StepperPanel>
                        )
                    })
                }
            </Stepper>
        )
    }
)





function correctPercentTemplate(rowData: TopicStat) {
    const correctPercent = Math.round(rowData.totalCorrect / ((rowData.totalCorrect + rowData.totalIncorrect) || 1) * 10000) / 100;
    const colorString = GetColorBasedOnValue(correctPercent);
    return (
        <p className="text-center" style={{ backgroundColor: colorString }}>{correctPercent}%</p>
    )
}


function getCurrentTitle(score: number): string {
    if (score >= 905 && score <= 990) {
        return "Chuyên nghiệp quốc tế";
    } else if (score >= 785 && score <= 900) {
        return "Tiếng anh nâng cao";
    } else if (score >= 605 && score <= 780) {
        return "Tiếng anh trung cấp";
    } else if (score >= 405 && score <= 600) {
        return "Tiếng anh sơ cấp";
    } else if (score >= 255 && score <= 400) {
        return "Tiếng anh cơ bản";
    } else if (score >= 10 && score <= 250) {
        return "Mới bắt đầu";
    } else {
        return "Không có cơ sở";
    }

}
export type UserStepGoalParams = {
    GoalLabel: number[],
    currentScore: number,
    target: number,
    currentScoreIndex: number,
    dispatch: React.Dispatch<ProfileHookAction>
}
function GetSteps(params: UserStepGoalParams): MenuItem[] {

    // Find indexes for special icons

    const targetIndex = params.GoalLabel.indexOf(params.target);
    const endIndex = params.GoalLabel.length - 1;

    const getIcon = (itemIndex: number) => {
        if (itemIndex === params.currentScoreIndex) return 'pi pi-user';
        if (itemIndex === targetIndex) return 'pi pi-flag';
        if (itemIndex === endIndex) return 'pi pi-crown';
        return 'pi pi-star-fill'; // Default icon
    };

    const getColor = (itemIndex: number) => {
        if (itemIndex === targetIndex) return 'var(--yellow-500)';
        if (itemIndex === endIndex) return 'var(--green-500)';
        if (itemIndex === params.currentScoreIndex) return 'var(--blue-500)';
        return params.currentScoreIndex === itemIndex ? 'var(--primary-color)' : 'var(--surface-b)';
    };

    const getTextColor = (itemIndex: number) => {
        if (itemIndex === targetIndex || itemIndex === endIndex || itemIndex === params.currentScoreIndex) {
            return 'var(--surface-b)';
        }
        return params.currentScoreIndex === itemIndex ? 'var(--surface-b)' : 'var(--text-color-secondary)';
    };

    const getLabel = (itemIndex: number) => {
        if (itemIndex === params.currentScoreIndex) return 'Current Score';
        if (itemIndex === targetIndex) return 'Target';
        if (itemIndex === endIndex) return 'End';
        return `Step ${itemIndex + 1}`;
    };

    return params.GoalLabel.map((label, index) => ({
        label: getLabel(index), // Add labels dynamically
        template: () => (
            <span
                className="inline-flex align-items-center justify-content-center border-circle border-primary border-1 h-3rem w-3rem z-1 cursor-pointer"
                style={{
                    backgroundColor: getColor(index),
                    color: getTextColor(index),
                    marginTop: '-25px',
                }}
                onClick={() => {
                    params.dispatch({ type: "SET_TARGET", payload: params.GoalLabel[index] });
                }}
            >
                <div>
                    <div><i className={`${getIcon(index)} text-xl`} /></div>
                    <p className='absolute text-gray-500' >{label}</p>
                </div>

            </span>
        ),
    }));
}
