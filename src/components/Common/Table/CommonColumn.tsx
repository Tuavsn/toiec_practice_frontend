import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import formatDate from "../../../utils/formatDateToString";

export function timeStampBodyTemplate<Model extends { createdAt: Date, updatedAt: Date }>(rowData: Model) {
    return (
        <Card className="flex align-items-center justify-content-start p-0">
            <div className="flex align-items-center">
                <i className="pi pi-calendar-plus mr-2" style={{ color: 'slateblue' }}></i>
                {formatDate(rowData.createdAt)}
            </div>
            <div className="flex align-items-center">
                <i className="pi pi-pencil mr-2" style={{ color: 'red' }}></i>
                {formatDate(rowData.updatedAt)}
            </div>
        </Card>


    );
};


export function getSeverity<Model extends { isActive: boolean }>(category: Model) {
    switch (category.isActive) {
        case true:
            return 'success';

        case false:
            return 'warning';
        default:
            return null;
    }
};

export function statusBodyTemplate<Model extends { isActive: boolean }>(rowData: Model) {
    return <Tag value={(rowData.isActive) + ""} severity={getSeverity(rowData)}></Tag>;
};