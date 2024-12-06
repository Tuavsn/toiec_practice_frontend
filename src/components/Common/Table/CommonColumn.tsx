import { Tag } from "primereact/tag";
import { Link } from "react-router-dom";
import formatDate from "../../../utils/formatDateToString";
import { TestType } from "../../../utils/types/type";

export function timeStampBodyTemplate<Model extends { createdAt: Date, updatedAt: Date }>(rowData: Model) {
    return (
        <div className="p-0">
            <div className="flex align-items-center justify-content-center text-center">
                <i className="pi pi-calendar-plus mr-2" style={{ color: 'slateblue' }}></i>
                {formatDate(rowData.createdAt)}
            </div>
            <div className="flex align-items-center justify-content-center text-center">
                <i className="pi pi-pencil mr-2" style={{ color: 'red' }}></i>
                {formatDate(rowData.updatedAt)}
            </div>
        </div>


    );
};


export function getSeverity<Model extends { active: boolean }>(category: Model) {
    switch (category.active) {
        case true:
            return 'success';

        case false:
            return 'warning';
        default:
            return null;
    }
};

export function statusBodyTemplate<Model extends { active: boolean }>(rowData: Model) {
    return <Tag className="text-center" value={(rowData.active) ? "Hoạt động" : "Đã ẩn"} severity={getSeverity(rowData)}></Tag>;
};

export function detailUserResultRowBodyTemplate(row: { id: string }) {
    return (
        <Link className="text-blue-500" to={`/test/${row.id}/review`}>Xem chi tiết</Link>
    )
}

export function getUserResultRowSeverity(row: { type: TestType }) {
    switch (row.type) {
        case "fulltest":
            return 'success';

        case "practice":
            return 'warning';
        default:
            return null;
    }
};

export function typeUserResultRowBodyTemplate(rowData: { type: TestType, parts: string }) {
    const TagElements: JSX.Element[] = Array(rowData.parts.length);
    for (const c of rowData.parts) {
        TagElements.push(<Tag key={"tag" + c} value={c} severity={getUserResultRowSeverity(rowData)}></Tag>
        )
    }
    return (

        <div className="flex justify-content-around">
            {rowData.type === "fulltest" &&
                <Tag value={"Thi thử"} severity={getUserResultRowSeverity(rowData)}></Tag>
            }
            {rowData.type === "practice" &&
                TagElements

            }
        </div>
    );
};
// Hàm CountAnswerTypeTemplate nhận rowData và hiển thị thống kê số lượng câu trả lời đúng, sai và bỏ qua
export function CountAnswerTypeTemplate(rowData: { totalCorrectAnswer: number, totalIncorrectAnswer: number, totalSkipAnswer: number }) {
    return (
        <div className="flex flex-wrap justify-content-around sm:flex-column md:flex-row">
            <p>✅ {rowData.totalCorrectAnswer}</p> {/* Số lượng đúng */}
            <p>❌ {rowData.totalIncorrectAnswer}</p> {/* Số lượng sai */}
            <p>😵 {rowData.totalSkipAnswer}</p> {/* Số lượng bỏ qua */}
        </div>

    )
}
