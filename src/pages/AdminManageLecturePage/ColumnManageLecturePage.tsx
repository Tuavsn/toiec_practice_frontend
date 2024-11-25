import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import React, { Dispatch } from "react";
import { statusBodyTemplate, timeStampBodyTemplate } from "../../components/Common/Table/CommonColumn";
import { LectureActionButtonProps, LectureHookAction, LectureRow } from "../../utils/types/type";

export function RenderAdminLectureColumns(dispatch: Dispatch<LectureHookAction>): JSX.Element[] {
    return [

        <Column key="col-name"/*             */ field="name"/*         */ header="Bài giảng"/*   */ filter/*          */ sortable />,

        <Column key="col-topic"/*            */ field="topic"/*        */ header="Chủ đề"/*      */ filter/*          */ sortable/*                                                                                                                                 */ body={topicTemplate} />,

        <Column key="col-timestamp"/*                                  */ header="Thời gian"/*  */ filter/*           */ sortable/*         */ headerClassName="justify-content-center"/*     */ style={{ width: "9rem" }}/*                                        */ body={timeStampBodyTemplate} />,

        <Column key="col-active"/*           */ field="isActive"/*    */ header="Hoạt động"/*    */ filter/*          */ sortable/*                                                           */ style={{ width: "5rem" }}/*     */ bodyClassName="text-center"/*   */ body={(data) => statusBodyTemplate({ active: data.isActive })} />,

        <Column key="col-action"/*                                                                                    */ sortable/*         */ headerClassName='text-center'/*                                                                                      */ body={(data) => <ActionBodyTemplate dispatch={dispatch} currentSelectedLecture={data} />} />
    ];
}
export const ActionBodyTemplate: React.FC<LectureActionButtonProps> = React.memo(
    ({ currentSelectedLecture, dispatch }) => {


        return ( // Kiểm tra key của questionNode có bắt đầu bằng "part" không. Nếu có, trả về rỗng.
            <div className='flex justify-content-around'>

                {/* Nút chỉnh sửa */}
                <Button icon="pi pi-pencil" rounded outlined style={{ width: "50px", height: "50px" }} onClick={() => {
                    dispatch({ type: "OPEN_UPDATE_DIALOG", payload: currentSelectedLecture });

                }} />

                {/* Sửa thiết kế */}
                <Button icon="pi pi-code" rounded outlined severity="success" style={{ width: "50px", height: "50px" }} onClick={() => {
                    dispatch({ type: "OPEN_PAGE_DESIGNER_DIALOG", payload: currentSelectedLecture });
                }} />

                {/* Sửa Câu hỏi */}
                <Button icon="pi pi-question-circle" rounded outlined severity="help" style={{ width: "50px", height: "50px" }} onClick={() => {
                    dispatch({ type: "OPEN_QUESTION_EDITOR_DIALOG", payload: currentSelectedLecture });
                }} />

                {/* Nút xóa */}
                <Button icon="pi pi-trash" rounded outlined severity="danger" style={{ width: "50px", height: "50px" }} onClick={() => {
                    dispatch({ type: "OPEN_DELETE_DIALOG", payload: currentSelectedLecture });
                }} />


            </div>
        )
    }
);

function topicTemplate(rowData: LectureRow): JSX.Element {
    return (
        <React.Fragment>
            {
                rowData.topic.map((topic, index) => <Chip key={rowData.id + "_topic_" + index} label={topic.name} />)
            }
        </React.Fragment>
    )
}