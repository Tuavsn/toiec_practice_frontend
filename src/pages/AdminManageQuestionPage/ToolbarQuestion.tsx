import { Button } from "primereact/button"
import { Toolbar } from "primereact/toolbar"
import React from "react"
import { Link } from "react-router-dom"

export const ToolbarQuestion: React.FC = React.memo(
    () => {
        return (
            <div className="card pb-5">
                {/* Thanh công cụ hiển thị tiêu đề */}
                <Toolbar start={<Link to="upload" ><Button icon="pi pi-upload" label="Thêm từ máy tính" /></Link>} />
            </div>
        )
    }
)

// const ImportExcel: React.FC<{}> = React.memo(
//     (props) => {
//         const { toast } = useToast();
//         const onUpload = () => {
//             toast.current?.show({ severity: 'info', summary: 'Thành công', detail: 'Tải lên thành công' });
//         };

//         return (
//             <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} temp emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
            

//         )
//     }
// )