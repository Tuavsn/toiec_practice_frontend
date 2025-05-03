import { Button } from "primereact/button"
import { Toolbar } from "primereact/toolbar"
import React from "react"
import { Link } from "react-router-dom"

export const ToolbarQuestion: React.FC<{disabled:boolean}> = React.memo(
    ({disabled}) => {
        let link = "upload"
        if(disabled){
            link = "#"
        }
        return (
            <div className="card pb-5">
                {/* Thanh công cụ hiển thị tiêu đề */}
                <Toolbar start={<Link to={link} ><Button disabled={disabled} icon="pi pi-upload" label="Thêm từ máy tính" /></Link>} />
            </div>
        )
    }
)