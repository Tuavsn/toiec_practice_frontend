import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { Dispatch } from "react";
import { useNavigate } from "react-router-dom";
import { statusBodyTemplate } from "../../components/Common/Table/CommonColumn";
import { emptyTestRow } from "../../utils/types/emptyValue";
import { RowActionButtonProps, RowHookAction, TestRow } from "../../utils/types/type";

export function RenderAdminTestColumns(dispatch: Dispatch<RowHookAction<TestRow>>): JSX.Element[] {
    return [

        <Column key="col-name" field="name" header="Tên" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-totalTestAttempt" field="totalUserAttempt" header="Tổng lượt người" sortable filter/>,
        <Column key="col-testDetail" header="Thông tin" sortable filter body={InfoBodyTemplate} />,
        <Column key="col-isActive" field="isActive" header="Trạng thái" sortable body={statusBodyTemplate} />,
        <Column key="col-questions" header="Câu hỏi" alignHeader="center" body={(data) => <QuestionsBodyTemplate rowData={data} />} />,
        <Column key="col-action"/*                        */ header={() => AddNew(dispatch)}/*     */ headerClassName='flex justify-content-center'/*   */ body={(data) => <ActionBodyTemplate dispatch={dispatch} currentSelectedRow={data} />} />
    ];
}
// Thành phần ActionBodyTemplate sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const ActionBodyTemplate: React.FC<RowActionButtonProps<TestRow>> = React.memo(
    ({ currentSelectedRow, dispatch }) => {
        return (
            // Chia các nút hành động ra thành hàng, sử dụng flexbox để căn chỉnh
            <div className='flex justify-content-around'>

                {/* Nút chỉnh sửa: Khi nhấn, dispatch hành động để mở hộp thoại cập nhật đề thi */}
                <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_UPDATE_DIALOG", payload: currentSelectedRow }); }} />

                {/* Nút xóa: Khi nhấn, dispatch hành động để mở hộp thoại xóa đề thi */}
                <Button icon={`pi ${currentSelectedRow.active ? "pi-trash" : "pi-sync"}`} rounded outlined severity="danger" style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_DELETE_DIALOG", payload: currentSelectedRow }); }} />

            </div>
        )
    }
);

function AddNew(dispatch: Dispatch<RowHookAction<TestRow>>) {
    return (
        <Button icon="pi pi-plus" rounded outlined severity="success" style={{ width: "50px", height: "50px" }} onClick={() => dispatch({ type: "OPEN_CREATE_DIALOG", payload: emptyTestRow })} />
    )
}

const QuestionsBodyTemplate: React.FC<{ rowData: TestRow }> = ({ rowData }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`${rowData.name}___${rowData.id}/questions`)
    };

    return (
        <Button severity="info" label='Chi Tiết' className="w-full text-center" onClick={handleClick}></Button>
    )
}

function InfoBodyTemplate(testRow: TestRow) {
    return (
        <div>
            <p><b>Số câu: </b>{testRow.totalQuestion}</p>
            <p><b>Điểm tối đa: </b>{testRow.totalScore}</p>
            <p><b>Thời gian làm: </b>{testRow.limitTime}</p>
        </div>
    )
}