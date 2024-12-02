import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useRef, useState } from "react";
import { callCreateCateogry, callPostDeleteCategoryRow, callPostUpdateCategoryRow } from "../../api/api";
import { useToast } from "../../context/ToastProvider";
import { DialogDeleteRowBodyProps, DialogRowProps, handeDeleteRowParams, RenderRowDialogParams, CategoryRow, DialogUpdateCategoryBodyProps, handeSaveRowParams } from "../../utils/types/type";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";


// Thành phần DialogCategoryActionButton sử dụng React.memo để tối ưu hiệu suất (chỉ render lại khi props thay đổi)
export const DialogCategoryActionButton: React.FC<DialogRowProps<CategoryRow>> = React.memo(
    ({ currentSelectedRow, dispatch, job }) => {

        // Render nội dung của Dialog, bao gồm header và body, từ hàm RenderDialog
        const [header, body] = RenderDialog({ job, currentSelectedRow, dispatch });

        return (
            <Dialog
                // Đóng Dialog khi sự kiện onHide xảy ra, dispatch hành động để thay đổi trạng thái
                onHide={() => dispatch({ type: "TOGGLE_DIALOG", payload: "" })}
                header={header}                                                         // Tiêu đề của Dialog lấy từ prop header
                visible={header != ""}                                                  // Nếu header không trống, Dialog sẽ hiển thị
                style={{ width: "80vw" }}                                               // Thiết lập chiều rộng của Dialog (80% của viewport)
                maximizable                                                             // Cho phép bộ đề tối đa hóa Dialog

            >
                {body                                                                   /* Nội dung của Dialog */}
            </Dialog>
        );
    }
);



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// Hàm RenderDialog nhận đối số là params và trả về một mảng gồm một chuỗi tiêu đề và một phần tử JSX (nội dung của Dialog)
function RenderDialog(params: RenderRowDialogParams<CategoryRow>): [string, JSX.Element] {

    // Dựa trên giá trị của params.job, hàm sẽ trả về tiêu đề và nội dung phù hợp
    switch (params.job) {

        case "DELETE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa bộ đề" cùng với tên của bộ đề hiện tại và một thông báo xác nhận xóa

            return [`Xóa bộ đề ${params.currentSelectedRow.format}`,
            <RenderDeleteCategoryBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
            ];
        case "CREATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa bộ đề" cùng với tên của bộ đề hiện tại và một thông báo xác nhận xóa

            return [`Tạo bộ đề mới`,
                <RenderUpsertCateogoryBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
            ];
        case "UPDATE"://------------------------------------- Khi job là DELETE, hiển thị tiêu đề "Xóa bộ đề" cùng với tên của bộ đề hiện tại và một thông báo xác nhận xóa

            return [`Cập nhật bộ đề ${params.currentSelectedRow.format}`,
            <RenderUpsertCateogoryBody currentSelectedRow={params.currentSelectedRow} dispatch={params.dispatch} />
            ];
    }

    // Trả về giá trị mặc định nếu không có case nào phù hợp (đây là trường hợp lỗi)
    return ["", <>Lỗi</>]
};



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const RenderUpsertCateogoryBody: React.FC<DialogUpdateCategoryBodyProps> = React.memo(
    (props) => {
        const [formatValue, setFormat] = useState<string>(props.currentSelectedRow.format);
        const [yearValue, setYear] = useState<number>(props.currentSelectedRow.year);
        const { toast } = useToast();
        const title = useRef<string>(props.currentSelectedRow.id ? "Sửa bộ đề" : "Thêm bộ đề");
        return (
            <Fieldset legend={title.current} >
                <section className='flex flex-column gap-4 justify-content-space'>
                    {
                        /* -----------------------------------------------------Định dạng bộ đề ----------------------------------------------------------------------------------------------------------*/
                        <div className="field flex-1">
                            <label className='block' htmlFor="row">format</label>
                            <InputText id="row" name="row" value={formatValue} required autoComplete="additional-name" onChange={(e) => setFormat(e.target.value || "")} />
                        </div>
                        /* -----------------------------------------------------================= ----------------------------------------------------------------------------------------------------------*/

                    }

                    {
                        <Calendar
                            value={props.currentSelectedRow.year ? new Date(props.currentSelectedRow.year, 0, 1) : null}  // Convert year number to Date object (Jan 1st)
                            onChange={(e) => {
                                const selectedYear = e.value?.getFullYear() ?? null;
                                if (selectedYear !== null) {
                                    setYear(selectedYear);
                                }
                            }}
                            view="year"
                            dateFormat="yy"
                            placeholder="Select Year"
                        />
                    }
                </section>
                {/* Save Button */}
                <div className="field flex justify-content-end">
                    <Button label="Lưu" icon="pi pi-save" onClick={() => handleSave({ row: { ...props.currentSelectedRow, format: formatValue, year: yearValue }, dispatch: props.dispatch, toast })} />
                </div>

            </Fieldset>
        );
    }
)


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// khi nhấn nút Lưu
async function handleSave(params: handeSaveRowParams<CategoryRow>) {
    let success = false;
    if (params.row.id) {
        success = await callPostUpdateCategoryRow(params.row);
    } else {
        success = await callCreateCateogry(params.row);
    }

    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Thao tác thành công" });
        params.dispatch({ type: "REFRESH_DATA" });
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Sửa thất bại" });
    }
};


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const RenderDeleteCategoryBody: React.FC<DialogDeleteRowBodyProps<CategoryRow>> = React.memo(
    (props) => {
        const { toast } = useToast();
        return (
            <React.Fragment>

                <h1 className='text-center'>Bạn có chắc muốn xóa <q>{props.currentSelectedRow.name}</q> ?</h1>
                <div className="flex justify-content-end">
                    <Button label="Xóa" icon="pi pi-save" onClick={() => handleDelete({ rowID: props.currentSelectedRow.id, dispatch: props.dispatch, toast })} />
                </div>
            </React.Fragment>
        )
    }
)



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// khi nhấn nút Xóa
async function handleDelete(params: handeDeleteRowParams<CategoryRow>) {
    const success = await callPostDeleteCategoryRow({ id: params.rowID } as CategoryRow);


    if (success) {
        params.toast.current?.show({ severity: 'success', summary: "Thành công", detail: "Xóa thành công" });
        params.dispatch({ type: "REFRESH_DATA" });
    } else {
        params.toast.current?.show({ severity: 'error', summary: "Lỗi", detail: "Xóa thất bại" });
    }
};
