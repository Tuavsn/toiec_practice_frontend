import { Tag } from "primereact/tag";
import React from "react";
import { Link } from "react-router-dom";
import formatDate from "../../../utils/formatDateToString";
import { UserResultRow } from "../../../utils/types/type";

export function timeStampBodyTemplate<Model extends { createdAt: Date, updatedAt: Date }>(rowData: Model) {
    return (
        <div className="p-0">
            <div className="flex align-items-center justify-content-center text-center">
                <i className="pi pi-calendar-plus mr-2" style={{ color: 'slateblue' }}></i>
                {formatDate(rowData.createdAt)}
            </div>
            <div className="flex align-items-center justify-content-center text-center">
                <i className="pi pi-pencil mr-2" style={{ color: 'red' }}></i>
                {formatDate(rowData.updatedAt)}
            </div>
        </div>


    );
};


export function getSeverity<Model extends { active: boolean }>(category: Model) {
    switch (category.active) {
        case true:
            return 'success';

        case false:
            return 'warning';
        default:
            return null;
    }
};

export function statusBodyTemplate<Model extends { active: boolean }>(rowData: Model) {
    return <Tag value={(rowData.active) + ""} severity={getSeverity(rowData)}></Tag>;
};

export function detailUserResultRowBodyTemplate(row: UserResultRow) {
    return (
        <Link className="text-blue-500" to={"/" + row.id}>Xem chi tiết</Link>
    )
}

export function getUserResultRowSeverity(row: UserResultRow) {
    switch (row.type) {
        case "fulltest":
            return 'success';

        case "practice":
            return 'warning';
        default:
            return null;
    }
};

export function typeUserResultRowBodyTemplate(rowData: UserResultRow) {
    return (
        <React.Fragment>
            {rowData.type === "fulltest" &&
                <Tag value={"Thi thử"} severity={getUserResultRowSeverity(rowData)}></Tag>
            }
            {rowData.type === "practice" &&
                rowData.parts.map((part, index) => {
                    return (
                        <Tag key={"tag" + index} value={(part) + ""} severity={getUserResultRowSeverity(rowData)}></Tag>
                    )
                })

            }
        </React.Fragment>
    );
};
