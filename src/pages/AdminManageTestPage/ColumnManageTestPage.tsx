import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { Dispatch } from "react";
import { statusBodyTemplate, timeStampBodyTemplate } from "../../components/Common/Table/CommonColumn";
import { RowActionButtonProps, RowHookAction, TestRow } from "../../utils/types/type";
import { useNavigate } from "react-router-dom";
import { emptyTestRow } from "../../utils/types/emptyValue";

export function RenderAdminTestColumns(dispatch: Dispatch<RowHookAction<TestRow>>): JSX.Element[] {
    return [

        <Column key="col-name" field="name" header="Name" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-totalTestAttempt" field="totalUserAttempt" header="Total Attempt" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-totalQuestion" field="totalQuestion" header="Total Question" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-totalScore" field="totalScore" header="Total Score" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-limitTime" field="limitTime" header="Limit Time" sortable filter style={{ minWidth: '12rem' }} />,
        <Column key="col-questions" header="questions" body={questionsBodyTemplate} />,
        <Column key="col-timestamp" header="Time stamp" body={timeStampBodyTemplate} sortable style={{ minWidth: '10rem' }} />,
        <Column key="col-isActive" field="isActive" header="Active" sortable body={statusBodyTemplate} />,
        <Column key="col-action"/*                        */ header={() => AddNew(dispatch)}/*     */ headerClassName='flex justify-content-center'/*   */ body={(data) => <ActionBodyTemplate dispatch={dispatch} currentSelectedRow={data} />} />
    ];
}
// Thành phần ActionBodyTemplate sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const ActionBodyTemplate: React.FC<RowActionButtonProps<TestRow>> = React.memo(
    ({ currentSelectedRow, dispatch }) => {
        return (
            // Chia các nút hành động ra thành hàng, sử dụng flexbox để căn chỉnh
            <div className='flex justify-content-around'>

                {/* Nút chỉnh sửa: Khi nhấn, dispatch hành động để mở hộp thoại cập nhật bài giảng */}
                <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_UPDATE_DIALOG", payload: currentSelectedRow }); }} />

                {/* Nút xóa: Khi nhấn, dispatch hành động để mở hộp thoại xóa bài giảng */}
                <Button icon="pi pi-trash" rounded outlined severity="danger" style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_DELETE_DIALOG", payload: currentSelectedRow }); }} />

            </div>
        )
    }
);

function AddNew(dispatch: Dispatch<RowHookAction<TestRow>>) {
    return (
        <Button icon="pi pi-plus" rounded outlined severity="success" style={{ width: "50px", height: "50px" }} onClick={() => dispatch({ type: "OPEN_CREATE_DIALOG", payload: emptyTestRow })} />
    )
}

function questionsBodyTemplate(rowData: TestRow) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`${rowData.name}___${rowData.id}/questions`)
    };

    return (
        <Button severity="info" label='Chi Tiết' className="w-full text-center" onClick={handleClick}></Button>
    )
}