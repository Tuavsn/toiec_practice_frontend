import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import React, { memo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { callPostImportExcel, callPostImportResource } from "../../api/api";
import { CustomBreadCrumb } from "../../components/Common/Index";
import { useToast } from "../../context/ToastProvider";
import SplitNameIDFromURL from "../../utils/splitNameIDFromURL";
import { Name_ID, TestID } from "../../utils/types/type";
import { Toast } from "primereact/toast";

export function AdminManageUploadQuestionPage() {
    // Lấy test_id từ URL thông qua hook useParams, nếu không có thì mặc định là "no_idTest_found"
    const { test_name_id = "no_idTest_found" } = useParams<{ test_name_id: Name_ID<TestID> }>();
    const [, test_id] = SplitNameIDFromURL(test_name_id);
    const { toast } = useToast();
    const [isDisabled, setIsDisabled] = useState(false);
    const uploadToast = useRef<Toast | null>(null);
    const handleFileUpload = async (event: FileUploadHandlerEvent) => {
        setIsDisabled(true);
        uploadToast.current?.show({ severity: "warn", summary: "Đang tải câu hỏi", detail: "Xin đừng tắt máy trong suốt quá trình", life: 600000, });
        const files: File[] = event.files; // Get all selected files
        const excelFiles: File[] = [];
        const resourceFiles: File[] = [];

        // Categorize files
        files.forEach((file) => {
            if (file.name.endsWith(".csv") || file.name.endsWith(".xlsx")) {
                excelFiles.push(file);
            } else {
                resourceFiles.push(file);
            }
        });
        const [excelError = "", resourceError = ""] = await Promise.all([
            callPostImportExcel(test_id, excelFiles),
            callPostImportResource(resourceFiles),
        ])
        uploadToast.current?.clear();
        if (excelError || resourceError) {
            toast.current?.show({ severity: "error", summary: "Tải câu hỏi", detail: "Lỗi tải lên thất bại!" });
            return;
        }
        toast.current?.show({ severity: "success", summary: "Tải câu hỏi", detail: "Câu hỏi được tải lên thành công!", life: 3000, });
        setIsDisabled(false);
    };
    return (
        <React.Fragment>
            <Toast ref={uploadToast} />
            <div key={'b'}>
                <CustomBreadCrumb />

                <FileUpload disabled={isDisabled} multiple cancelLabel="Xóa" name="file" mode="advanced" auto={false} customUpload uploadHandler={handleFileUpload}
                    uploadLabel="Xác nhận"
                    accept="image/*,audio/*,.csv,.xlsx" chooseLabel="Từ máy tính" maxFileSize={60000000} // 60MB size limit
                />




            </div>
        </React.Fragment >
    )
}

export default memo(AdminManageUploadQuestionPage);
