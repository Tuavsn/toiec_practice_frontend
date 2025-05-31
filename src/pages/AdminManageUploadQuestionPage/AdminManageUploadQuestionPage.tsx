import { Button } from "primereact/button";
import { FileUpload, FileUploadHandlerEvent, FileUploadHeaderTemplateOptions } from "primereact/fileupload";
import { memo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { callPostImportExcel, callPostImportResource } from "../../api/api";
import { CustomBreadCrumb } from "../../components/Common/Index";
import { useToast } from "../../context/ToastProvider";
import SplitNameIDFromURL from "../../utils/helperFunction/splitNameIDFromURL";
import { Name_ID } from "../../utils/types/type";

export function AdminManageUploadQuestionPage() {
    //------------------------------------------------------
    // Lấy test_id từ URL
    //------------------------------------------------------
    const { test_name_id = 'no_idTest_found' } = useParams<{ test_name_id: Name_ID<string> }>();
    const [, test_id] = SplitNameIDFromURL(test_name_id);

    const { toast } = useToast();
    const fileUploadRef = useRef<FileUpload>(null);
    const [isDisabled, setIsDisabled] = useState(false);

    //------------------------------------------------------
    // Xử lý tải lên file
    //------------------------------------------------------
    const handleFileUpload = async (event: FileUploadHandlerEvent) => {
        setIsDisabled(true);
        toast.current?.show({
            severity: 'warn',
            summary: 'Đang tải câu hỏi',
            detail: 'Xin đừng tắt máy trong suốt quá trình',
            life: 600000,
        });

        const files: File[] = event.files;
        const excelFiles: File[] = [];
        const resourceFiles: File[] = [];

        // Phân loại file
        files.forEach((file) => {
            if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
                excelFiles.push(file);
            } else {
                resourceFiles.push(file);
            }
        });

        const [excelError = '', resourceError = ''] = await Promise.all([
            callPostImportExcel(test_id, excelFiles),
            callPostImportResource(resourceFiles),
        ]);

        toast.current?.clear();
        if (excelError || resourceError) {
            toast.current?.show({ severity: 'error', summary: 'Tải câu hỏi', detail: 'Lỗi tải lên thất bại!' });
            return;
        }

        toast.current?.show({
            severity: 'success',
            summary: 'Tải câu hỏi',
            detail: 'Câu hỏi được tải lên thành công!',
            life: 3000,
        });
        setIsDisabled(false);
    };

    //------------------------------------------------------
    // Template header với custom button
    //------------------------------------------------------
    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;

        return (
            <div className={className} style={{ display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {/* nút custom: tải mẫu Excel */}
                <a
                    href="https://tuine09.blob.core.windows.net/resources/base-excel.xlsx"
                    download="Test-upload-template.xlsx"
                    style={{ textDecoration: 'none' }}
                >

                    <Button
                        label="Tải tệp excel mẫu"
                        icon="pi pi-download"
                        className="p-button-text p-button-plain ml-2"

                    />
                </a>
                {uploadButton}
                {cancelButton}
            </div>
        );
    };

    //------------------------------------------------------
    // Props cho các button
    //------------------------------------------------------
    const chooseOptions = { label: 'Từ máy tính', icon: 'pi pi-fw pi-folder-open', className: 'p-button-outlined' };
    const uploadOptions = { label: 'Xác nhận', icon: 'pi pi-fw pi-cloud-upload', className: 'p-button-success p-button-outlined ml-2' };
    const cancelOptions = { label: 'Xóa', icon: 'pi pi-fw pi-times', className: 'p-button-danger p-button-outlined ml-2' };

    return (
        <>
            <CustomBreadCrumb />

            <FileUpload
                ref={fileUploadRef}
                disabled={isDisabled}
                multiple
                customUpload
                uploadHandler={handleFileUpload}
                accept="image/*,audio/*,.csv,.xlsx"
                maxFileSize={60000000} // 60MB
                headerTemplate={headerTemplate}           // thêm template header
                chooseOptions={chooseOptions}             // cấu hình nút chọn
                uploadOptions={uploadOptions}             // cấu hình nút xác nhận
                cancelOptions={cancelOptions}             // cấu hình nút xóa
            />
        </>
    );
}


export default memo(AdminManageUploadQuestionPage);
