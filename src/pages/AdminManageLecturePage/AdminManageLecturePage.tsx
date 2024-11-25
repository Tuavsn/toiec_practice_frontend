import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { memo } from "react";
import { statusBodyTemplate, timeStampBodyTemplate } from "../../components/Common/Table/CommonColumn";
import useLecture from "../../hooks/LectureHook";
import { Lecture } from "../../utils/types/type";
import { ActionBodyTemplate } from "./ColumnManageLecturePage";
import { DialogLectureActionButton } from "./DialogLectureRelate";

function AdminManageLecturePage() {

    const { state, dispatch } = useLecture();



    const columns: JSX.Element[] = [

        <Column key={"col-name"} field="name" header="Bài giảng" filter sortable />,
        <Column key={"col-topic"} field="topic" header="Chủ đề" sortable filter body={topicTemplate} />,
        <Column key="col-timestamp" header="Thời gian" style={{ width: "9rem" }} headerClassName="justify-content-center" body={timeStampBodyTemplate} />,
        <Column key={"col-active"} field="isActive" header="Hoạt động" bodyClassName="text-center" style={{ width: "5rem" }} sortable body={(data) => statusBodyTemplate({ active: data.isActive })} />,

        /* Cột hiển thị nút sửa và xóa */
        <Column key="col-action" headerClassName='text-center' header="" style={{ width: "7rem" }} body={(data) => <ActionBodyTemplate dispatch={dispatch} currentSelectedLecture={data} />} />
    ];
    return (
        <div className="card">
            <DialogLectureActionButton dispatch={dispatch} state={state} />
            <DataTable value={state.lectures} size="small"
                loading={state.lectures.length <= 0}
                dataKey="id" >
                {columns}
            </DataTable>
        </div>

    )

}


export default memo(AdminManageLecturePage);

function topicTemplate(rowData: Lecture): JSX.Element {
    return (
        <React.Fragment>
            {
                rowData.topic.map((topic, index) => <Chip key={rowData.id + "_topic_" + index} label={topic} />)
            }
        </React.Fragment>
    )
}



// const rowExpansionTemplate = (data: Lecture) => {
//     return (
//         <main key={"expandrow" + data.id} className='align-items-center justify-content-center border-round m-2' style={{ width: '80%' }}>
//             <Card title={`Lý thuyết ${data.name}`} className="bg-purple-200">

//                 <EditCourseRichTextBox content={data.content} />

//             </Card>
//             <br></br>
//             <Card title={`Bài tập ${data.name}`} className="bg-yellow-200">

//             </Card>
//         </main>
//     );
// };
