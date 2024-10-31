import { Card } from "primereact/card";
import { Chart as PrimeChart } from "primereact/chart";
import { Doughnut, Pie } from "react-chartjs-2";
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables, Plugin } from 'chart.js';
import { useActiveLog, useProfilePage } from "../hooks/ProfileHook";
import React, { useRef } from "react";
import { Column } from "primereact/column";
import { SuggestionsForUser, UserDetailResultRow } from "../utils/types/type";
import formatDate from "../utils/formatDateToString";
import { UserResultTemplate } from "../components/Common/Table/CommonColumn";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Stepper, StepperRefAttributes } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
// Đăng ký các phần tử Chart.js cần thiết
ChartJS.register(...registerables);
// Đăng ký plugin DataLabels
ChartJS.register(ChartDataLabels as Plugin<"pie">);

export default function UserProfilePage() {

    const {
        averageListeningScore,
        averageReadingScore,
        toeicPartsInsightView,
        timeSpentOnParts,
        smallestAmount,
        suggestionsForCurrentUser,
    } = useProfilePage();

    return (
        <main className="pt-8 flex gap-3 flex-column">
            <div>
            <Card className='shadow-7' title="1. Mục tiêu bản thân"><UserGoal /></Card>
            <Card className='shadow-7' title="2. Đang diễn ra"><CurrentCourse/></Card>
            </div>
            <div className="flex gap-3 flex-wrap">
                <Card className='shadow-7 flex-1' style={{ minWidth: "400px" }} title="3. Tổng quan tiến độ ">{ProgressOverview(averageListeningScore, averageReadingScore)}</Card>
                <Card className='shadow-7 flex-1' style={{ minWidth: "400px" }} title="4. Thông tin chi tiết kỹ năng">{SkillInsights(toeicPartsInsightView)}</Card>
            </div>
            <Card className='shadow-7' title="5. Nhật ký học tập"><ActivityLog /></Card>
            <div className="flex gap-3 flex-wrap">
                <Card className="shadow-7 flex-1" style={{ minWidth: "590px" }} title="6. Thời gian học tập theo kỹ năng">{TimeSpent(timeSpentOnParts, smallestAmount)}</Card>
                <Card className='shadow-7 flex-1' title="7. Đề xuất cải thiện">{Suggestions(suggestionsForCurrentUser)}</Card>

            </div>
            <Card className='shadow-7' title="7. Thống kê"></Card>
        </main>
    );
}

//==================================================helper HTML ELEMENT =============================================================================================

//---[1]-------------------------------------------------------------------------------------------------------------------------------------------
const UserGoal: React.FC = React.memo(
    () => {
        // Lấy dữ liệu cho bảng từ hook useActiveLog
        const { dataForTable } = useActiveLog();

        return (
            <main>
            </main>
        )
    }
)

//---[2]-------------------------------------------------------------------------------------------------------------------------------------------
const CurrentCourse: React.FC = React.memo(
    () => {
        // Lấy dữ liệu cho bảng từ hook useActiveLog
        const { dataForTable } = useActiveLog();

        return (
            <main>
            </main>
        )
    }
)

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
                formatter: (_value: number, context: any) => context.chart.data.labels[context.dataIndex], // Định dạng nhãn dữ liệu
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
                    <h1>Điểm phân bổ theo kỹ năng</h1> {/* Tiêu đề cho phần thông tin */}
                    <table style={{ borderSpacing: '30px' }}>
                        <tbody>
                            <tr>
                                <td>Điểm nghe trung bình</td>
                                <td>{averageListeningScore}</td> {/* Hiển thị điểm nghe trung bình */}
                            </tr>
                            <tr>
                                <td>Điểm đọc trung bình</td>
                                <td>{averageReadingScore}</td> {/* Hiển thị điểm đọc trung bình */}
                            </tr>
                            <tr>
                                <td><hr></hr></td>
                            </tr>
                            <tr>
                                <td><b>Tổng điểm trung bình</b></td>
                                <td><b>{averageListeningScore + averageReadingScore} / 990</b></td> {/* Tổng điểm trung bình */}
                            </tr>
                        </tbody>
                    </table>
                    <h1 className="inline pr-1"> Trình độ hiện tại:</h1>
                    <h5 className="inline m-auto">Trung cấp (B1-B2)</h5> {/* Hiển thị trình độ hiện tại */}
                </section>
                <section className="pt-4" style={{ width: '300px', height: '300px' }}>
                    <Pie data={data} options={options} /> {/* Hiển thị biểu đồ hình tròn */}
                </section>
            </div>
        </main>
    );
}

//---[4]-------------------------------------------------------------------------------------------------------------------------------------------
function SkillInsights(toeicParts: number[]) {
    // Khởi tạo dữ liệu cho biểu đồ radar
    const data = {
        labels: [
            "", // Nhãn đầu tiên để lấp chỗ trống
            "Nghe hình ảnh", // Kỹ năng nghe hình ảnh
            "Nghe câu hỏi và trả lời", // Kỹ năng nghe câu hỏi và trả lời
            "Nghe hội thoại", // Kỹ năng nghe hội thoại
            "Nghe bài giảng", // Kỹ năng nghe bài giảng
            "Đọc câu", // Kỹ năng đọc câu
            "Đọc đoạn văn", // Kỹ năng đọc đoạn văn
            "Đọc hiểu" // Kỹ năng đọc hiểu
        ],
        datasets: [
            {
                label: 'Kỹ năng', // Nhãn cho bộ dữ liệu
                borderColor: "#ff0000", // Màu viền của đường biểu diễn
                pointBackgroundColor: "#aa0000", // Màu nền cho các điểm
                pointBorderColor: "#880000", // Màu viền cho các điểm
                pointHoverBackgroundColor: "#550000", // Màu nền khi di chuột qua điểm
                pointHoverBorderColor: "#990000", // Màu viền khi di chuột qua điểm
                pointRadius: 8, // Bán kính điểm
                pointHoverRadius: 10, // Bán kính điểm khi di chuột
                data: [0, ...toeicParts] // Dữ liệu điểm số của các kỹ năng
            }
        ]
    };

    // --Tùy chọn cho biểu đồ radar-------------------------------------------------------------------------------------
    const options = {
        plugins: {
            legend: {
                labels: {
                    color: "#000000", // Màu chữ cho legend
                    font: {
                        size: 17 // Kích thước chữ cho legend
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: { label: any; raw: any; }) {
                        const label = tooltipItem.label; // Lấy nhãn
                        const value = tooltipItem.raw; // Lấy giá trị
                        return `${label}: ${value}`; // Trả về chuỗi định dạng
                    }
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: "#343434" // Màu lưới
                },
                angleLines: {
                    color: '#000000' // Màu của các đường góc
                },
                ticks: {
                    display: true, // Hiện thị ticks nếu cần
                    suggestedMin: 0, // Giá trị tối thiểu gợi ý
                    suggestedMax: 100, // Giá trị tối đa gợi ý là 100
                },
                pointLabels: { // Thay đổi kích thước phông chữ cho nhãn
                    font: {
                        size: 14, // Kích thước phông chữ cho nhãn
                        family: "Arial", // Phông chữ nếu cần
                        weight: "bold" // Làm đậm chữ nếu cần
                    },
                    color: "#000000" // Màu chữ cho nhãn
                }
            }
        }
    };

    // --Trả về cấu trúc HTML cho giao diện-------------------------------------------------------------------------------------
    return (
        <div className="card flex justify-content-center">
            <PrimeChart type="radar" data={data} options={options} width="500px" height="500px" /> {/* Hiển thị biểu đồ radar */}
        </div>
    )
}

//---[5]-------------------------------------------------------------------------------------------------------------------------------------------
// Component ActivityLog sử dụng React.memo để chỉ render lại khi props thay đổi, giúp tối ưu hiệu suất
const ActivityLog: React.FC = React.memo(
    () => {
        // Lấy dữ liệu cho bảng từ hook useActiveLog
        const { dataForTable } = useActiveLog();

        // Định nghĩa các cột cho bảng, mỗi cột sẽ hiển thị thông tin cụ thể-------------------------------------------------------------------------------------
        const columns = [
            // Cột ngày làm việc, hiển thị ngày từ trường createdAt và cho phép lọc, sắp xếp
            <Column key="col-createdAt" field="createdAt" header="Ngày làm" body={(rowData: UserDetailResultRow) => formatDate(rowData.createdAt)} sortable filter />,

            // Cột tên đề thi, hiển thị theo trường testFormatAndYear, có thể lọc, sắp xếp
            <Column key="col-testName" field="testFormatAndYear" header="Đề" sortable filter />,

            // Cột kết quả, sử dụng template CountSkillScoreTemplate để hiển thị điểm đọc và nghe
            <Column key="col-skill_count" header="Kết quả" body={CountSkillScoreTemplate} sortable filter />,

            // Cột thống kê trả lời, hiển thị số lượng đúng, sai, bỏ qua bằng template CountAnswerTypeTemplate
            <Column key="col-answer_count" header="thống kê" body={CountAnswerTypeTemplate} sortable filter />,

            // Cột thời gian làm bài, lấy dữ liệu từ trường totalTime và cho phép sắp xếp
            <Column key="col-time" field="totalTime" header="Thời gian làm" sortable filter />,

            // Cột loại bài kiểm tra, dùng template UserResultTemplate để hiển thị thông tin loại
            <Column key="col-type" header="Loại" body={UserResultTemplate.typeUserResultRowBodyTemplate} />,

            // Cột chi tiết, hiển thị chi tiết kết quả người dùng qua template UserResultTemplate
            <Column key="col-detail" body={UserResultTemplate.detailUserResultRowBodyTemplate} />,
        ];

        // Trả về giao diện chính với tiêu đề và bảng dữ liệu lịch sử hoạt động-------------------------------------------------------------------------------------
        return (
            <main>
                <h1>Lịch sử hoạt động</h1>
                <DataTable showGridlines size="small" value={dataForTable} dataKey={"id"}>
                    {columns}
                </DataTable>
            </main>
        )
    }
)

// Hàm CountSkillScoreTemplate nhận rowData và trả về hiển thị điểm nghe và đọc của người dùng
function CountSkillScoreTemplate(rowData: { totalReadingScore: number, totalListeningScore: number }) {
    return (
        <div className="flex flex-wrap justify-content-around">
            <p className="">👂 {rowData.totalListeningScore}</p> {/* Điểm nghe */}
            <p className="">📖 {rowData.totalReadingScore}</p> {/* Điểm đọc */}
        </div>
    )
}

// Hàm CountAnswerTypeTemplate nhận rowData và hiển thị thống kê số lượng câu trả lời đúng, sai và bỏ qua
function CountAnswerTypeTemplate(rowData: { totalCorrectAnswer: number, totalIncorrectAnswer: number, totalSkipAnswer: number }) {
    return (
        <div className="flex flex-wrap justify-content-around sm:flex-column md:flex-row">
            <p>✅ {rowData.totalCorrectAnswer}</p> {/* Số lượng đúng */}
            <p>❌ {rowData.totalIncorrectAnswer}</p> {/* Số lượng sai */}
            <p>😵 {rowData.totalSkipAnswer}</p> {/* Số lượng bỏ qua */}
        </div>

    )
}

//---[6]-------------------------------------------------------------------------------------------------------------------------------------------
function TimeSpent(timeSpentOnParts: number[], smallestAmount: number) {
    // Khởi tạo dữ liệu cho biểu đồ
    const data = {
        labels: ['Nghe', 'Đọc', 'Từ vựng', 'Ngữ Pháp', 'Luyện đề'], // Nhãn cho các phần của biểu đồ
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
                        const showValue = +(value / 3600).toFixed(2)
                        return `${label}: ${showValue} giờ`; // Trả về chuỗi định dạng
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
function Suggestions(suggestionOnParts: SuggestionsForUser[]) {
    // stepperRef dùng để lưu trữ tham chiếu đến Stepper và sử dụng các phương thức điều hướng.
    const stepperRef = useRef<StepperRefAttributes | null>(null);
    const lastIndex = suggestionOnParts.length - 1; // Xác định chỉ mục của gợi ý cuối cùng.

    return (
        <main>
            {/* Hiển thị Stepper với các gợi ý trong dạng dọc */}
            <Stepper ref={stepperRef} orientation="vertical">
                {
                    // Duyệt qua từng phần gợi ý trong suggestionOnParts
                    suggestionOnParts.map((suggestion, index) => {
                        return (
                            <StepperPanel header={suggestion.title}>
                                {/* Hiển thị nội dung gợi ý */}
                                <div className="flex flex-column h-12rem">
                                    <div className="custom-box">{suggestion.content}</div>
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
        </main>
    )
}
