import { memo } from "react";
import useLecture from "../../hooks/LectureHook";
import AdminLectureTable from "./AdminLectureTable";
import { DialogLectureActionButton } from "./DialogLectureRelate";

function AdminManageLecturePage() {

    const {
        state,
        dispatch,
    } = useLecture();

    return (
        <div className="card">
            <DialogLectureActionButton currentSelectedLecture={state.currentSelectedLecture} job={state.job} dispatch={dispatch} />
            <AdminLectureTable dispatch={dispatch} lectures={state.lectures} />
            {/* <Paginator */}
        </div>
    )

}


export default memo(AdminManageLecturePage);





// const rowExpansionTemplate = (data: Lecture) => {
//     return (
//         <main key={"expandrow" + data.id} className='align-items-center justify-content-center border-round m-2' style={{ width: '80%' }}>
//             <Card title={`Lý thuyết ${data.name}`} className="bg-purple-200">

//

//             </Card>
//             <br></br>
//             <Card title={`Bài tập ${data.name}`} className="bg-yellow-200">

//             </Card>
//         </main>
//     );
// };
