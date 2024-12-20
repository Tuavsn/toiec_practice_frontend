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