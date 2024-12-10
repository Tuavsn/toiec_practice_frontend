import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import React, { Dispatch } from "react";
import { statusBodyTemplate, timeStampBodyTemplate } from "../../components/Common/Table/CommonColumn";
import { emptyLectureRowValue } from "../../utils/types/emptyValue";
import { LectureActionButtonProps, LectureHookAction, LectureRow } from "../../utils/types/type";

export function RenderAdminLectureColumns(dispatch: Dispatch<LectureHookAction>): JSX.Element[] {
    return [

        <Column key="col-name"/*             */ field="name"/*         */ header="Bài học"/*   */ filter/*          */ sortable />,

        <Column key="col-topic"/*            */ field="topic"/*        */ header="Chủ đề"/*      */ filter/*          */ sortable/*                                                                                                                                 */ body={topicTemplate} />,

        <Column key="col-timestamp"/*                                  */ header="Thời gian"/*  */ filter/*           */ sortable/*         */ headerClassName="justify-content-center"/*     */ style={{ width: "9rem" }}/*                                        */ body={timeStampBodyTemplate} />,

        <Column key="col-active"/*           */ field="active"/*       */ header="Trạng thái"/*                       */ sortable/*         */ bodyClassName="text-center"/*   */ body={statusBodyTemplate}  alignHeader="center"/>,

        <Column key="col-action"/*                                    */ header={() => AddNew(dispatch)}/*                                  */ headerClassName='flex justify-content-end'/*       */ body={(data) => <ActionBodyTemplate dispatch={dispatch} currentSelectedLecture={data} />} />
    ];
}
// Thành phần ActionBodyTemplate sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const ActionBodyTemplate: React.FC<LectureActionButtonProps> = React.memo(
    ({ currentSelectedLecture, dispatch }) => {
        return (
            // Chia các nút hành động ra thành hàng, sử dụng flexbox để căn chỉnh
            <div className='flex justify-content-around'>

                {/* Nút chỉnh sửa: Khi nhấn, dispatch hành động để mở hộp thoại cập nhật bài học */}
                <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_UPDATE_DIALOG", payload: currentSelectedLecture }); }} />

                {/* Nút sửa thiết kế: Khi nhấn, dispatch hành động để mở hộp thoại sửa thiết kế trang bài học */}
                <Button icon="pi pi-code" rounded outlined severity="info" style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_PAGE_DESIGNER_DIALOG", payload: currentSelectedLecture }); }} />

                {/* Nút sửa câu hỏi: Dẫn đến trang câu hỏi của bài học hiện tại */}
                {/* <Link to={currentSelectedLecture.id}><Button icon="pi pi-question-circle" rounded outlined severity="help" style={{ width: "50px", height: "50px" }} link /></Link> */}

                {/* Nút xóa: Khi nhấn, dispatch hành động để mở hộp thoại xóa bài học */}
                <Button icon={`pi ${currentSelectedLecture.active ? "pi-trash" : "pi-sync"}`} rounded outlined severity="danger" style={{ width: "50px", height: "50px" }} onClick={() => { dispatch({ type: "OPEN_DELETE_DIALOG", payload: currentSelectedLecture }); }} />

            </div>
        )
    }
);

// Hàm topicTemplate hiển thị các chủ đề của bài học dưới dạng các Chip
function topicTemplate(rowData: LectureRow): JSX.Element {
    return (
        <React.Fragment>
            {
                // Lặp qua danh sách các chủ đề và hiển thị mỗi chủ đề dưới dạng một Chip
                rowData.topic.map((topic, index) =>
                    <Chip key={rowData.id + "_topic_" + index} label={topic.name} />
                )
            }
        </React.Fragment>
    )
}


function AddNew(dispatch: Dispatch<LectureHookAction>) {
    return (
        <Button icon="pi pi-plus" rounded outlined severity="success" style={{ width: "50px", height: "50px" }} onClick={() => dispatch({ type: "OPEN_CREATE_DIALOG", payload: emptyLectureRowValue })} />
    )
}