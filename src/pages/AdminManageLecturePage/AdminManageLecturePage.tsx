import { memo } from "react";
import useLecture from "../../hooks/LectureHook";
import AdminLectureTable from "./AdminLectureTable";
import { DialogLectureActionButton } from "./DialogLectureRelate";
import { Paginator } from "primereact/paginator";

// Hàm AdminManageLecturePage là một thành phần React hiển thị giao diện quản lý bài học
function AdminManageLecturePage() {

    // Sử dụng hook useLecture để lấy state và dispatch (cơ chế quản lý state)
    const {
        state,                  // Chứa trạng thái hiện tại của bài học
        dispatch,               // Hàm để gửi hành động cập nhật state
        totalItems,             // tổng số bài học hiện có trong hệ thống
        onPageChange            // nhảy tới trang khác
    } = useLecture();

    return (
        <div className="card">                                          {/* Thẻ div được áp dụng class CSS "card" */}
            {/* Thành phần DialogLectureActionButton quản lý hành động liên quan đến bài học hiện tại */}
            <DialogLectureActionButton
                currentSelectedLecture={state.currentSelectedLecture}   // Bài học hiện được chọn
                job={state.job}                                         // Công việc hiện tại (job)
                dispatch={dispatch}                                     // Hàm dispatch để cập nhật trạng thái
            />

            {/* Thành phần AdminLectureTable hiển thị danh sách các bài học */}
            <AdminLectureTable
                dispatch={dispatch}                                     // Hàm dispatch để quản lý các hành động trong bảng
                lectures={state.lectures}                               // Dữ liệu các bài học để hiển thị
            />

            <Paginator first={state.currentPageIndex * 5} rows={5} totalRecords={totalItems.current} onPageChange={onPageChange} />
        </div>
    );
}


export default memo(AdminManageLecturePage);
