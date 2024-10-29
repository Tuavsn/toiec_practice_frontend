import { Card } from "primereact/card";
import { Chart as PrimeChart } from "primereact/chart";
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables, Plugin } from 'chart.js';
import { useActiveLog, useProfilePage } from "../hooks/ProfileHook";
import React from "react";
import { Column } from "primereact/column";
import { UserDetailResultRow } from "../utils/types/type";
import formatDate from "../utils/formatDateToString";
import { UserResultTemplate } from "../components/Common/Table/CommonColumn";
import { DataTable } from "primereact/datatable";

// Đăng ký các phần tử Chart.js cần thiết
ChartJS.register(...registerables);
// Đăng ký plugin DataLabels
ChartJS.register(ChartDataLabels as Plugin<"pie">);

export default function UserProfilePage() {

    const {
        averageListeningScore,
        averageReadingScore,
        toeicPartsInsightView
    } = useProfilePage();

    return (
        <main className="pt-8 flex gap-3 flex-column">
            <div className="flex gap-3 flex-wrap">
                <Card className='shadow-7 flex-1' style={{ minWidth: "400px" }} title="1. Tổng quan tiến độ ">{ProgressOverview(averageListeningScore, averageReadingScore)}</Card>
                <Card className='shadow-7 flex-1' style={{ minWidth: "400px" }} title="2. Thông tin chi tiết kỹ năng">{SkillInsights(toeicPartsInsightView)}</Card>
            </div>
            <Card className='shadow-7' title="3. Nhật ký học tập"><ActivityLog /></Card>
            <Card className='shadow-7' title="4. Đề xuất cải thiện"></Card>
            <Card className='shadow-7' title="5. Thống kê"></Card>
        </main>
    );
}

//==================================================helper HTML ELEMENT =============================================================================================




//---[1]-------------------------------------------------------------------------------------------------------------------------------------------
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

//---[2]-------------------------------------------------------------------------------------------------------------------------------------------
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

//---[3]-------------------------------------------------------------------------------------------------------------------------------------------
const ActivityLog: React.FC = React.memo(
    () => {
        const { dataForTable } = useActiveLog();
        const columns = [
            <Column key="col-createdAt" field="createdAt" header="Ngày làm" body={(rowData: UserDetailResultRow) => formatDate(rowData.createdAt)} sortable filter />,
            <Column key="col-testName" field="testFormatAndYear" header="Đề" sortable filter />,
            <Column key="col-skill_count" header="Kết quả" body={CountSkillScoreTemplate} sortable filter />,
            <Column key="col-answer_count" header="thống kê" body={CountAnswerTypeTemplate} sortable filter />,
            <Column key="col-time" field="totalTime" header="Thời gian làm" sortable filter />,
            <Column key="col-type" header="Loại" body={UserResultTemplate.typeUserResultRowBodyTemplate} />,
            <Column key="col-detail" body={UserResultTemplate.detailUserResultRowBodyTemplate} />,
        ];

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

function CountSkillScoreTemplate(rowData: { totalReadingScore: number, totalListeningScore: number }) {
    return (
        <React.Fragment>
            <p>👂 {rowData.totalListeningScore}</p>
            <p>📖 {rowData.totalReadingScore}</p>
        </React.Fragment>
    )
}

function CountAnswerTypeTemplate(rowData: { totalCorrectAnswer: number, totalIncorrectAnswer: number, totalSkipAnswer: number }) {
    return (
        <React.Fragment>
            <p>✅ {rowData.totalCorrectAnswer}</p>
            <p>❌ {rowData.totalIncorrectAnswer}</p>
            <p>😵 {rowData.totalSkipAnswer}</p>

        </React.Fragment>
    )
}
