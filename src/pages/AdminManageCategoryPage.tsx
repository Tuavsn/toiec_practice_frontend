import AdminLayout from "../components/Layout/AdminLayout";
import { CustomBreadCrumb } from "../components/Common/Index";
import { Card } from "primereact/card";
import { memo } from "react";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Calendar } from "primereact/calendar";
import { useDataTable } from "../hooks/useDataTable";


interface Category {
    id: string;
    name: string;
    year: number;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
    is_active: boolean
}


export function AdminManageCategoryPage() {
    let emptyCategory: Category = {
        id: "",
        name: "vô danh",
        year: -9999,
        created_at: new Date(),
        created_by: "vô danh",
        updated_at: new Date(),
        updated_by: "vô chủ",
        is_active: true
    };
    const renderColumns = [
        <Column key="col-selection" selectionMode="multiple" exportable={false} />,
        <Column key="col-id"            field="id"          header="ID"                                      sortable style={{ minWidth: '12rem' }} />,
        <Column key="col-name"          field="name"        header="Name"                                    sortable style={{ minWidth: '16rem' }} />,
        <Column key="col-created_at"    field="created_at"  header="Created At" body={createdAtBodyTemplate} sortable style={{ minWidth: '14rem' }} />,
        <Column key="col-updated_at"    field="updated_at"  header="Updated At" body={updatedAtBodyTemplate} sortable style={{ minWidth: '14rem' }} />,
        <Column key="col-created_by"    field="created_by"  header="Created by"                              sortable style={{ minWidth: '16rem' }} />,
        <Column key="col-updated_by"    field="updated_by"  header="Updated by"                              sortable style={{ minWidth: '16rem' }} />,
        <Column key="col-is_active"     field="is_active"   header="Status"     body={statusBodyTemplate}    sortable style={{ minWidth: '12rem' }} />,
    ];


   const {toast:ToastElement,
    toolbar: ToolBarElement,
    table: TableElement,
    dialogs: DialogElements

   } = useDataTable(GetFakeData(), emptyCategory,renderColumns, true/*có muốn thêm cột action button hay không*/);


    console.log("render ");

    return (
        <AdminLayout>
            <div key={'b'}>
                <CustomBreadCrumb />
                <Card className="my-2">
                    <div key={'a'}>
                        {ToastElement}
                        <div className="card">
                            {ToolBarElement}
                            {TableElement}
                        </div>
                        {DialogElements}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    )
}

export default memo(AdminManageCategoryPage);


// ------------------------------------- helper function---------------------------------------------------

function createdAtBodyTemplate(rowData: Category) {
    return (
        <Calendar
            value={new Date(rowData.created_at)}
            dateFormat="dd/mm/yy"
            showIcon
            disabled
        />
    );
};

function getSeverity(category: Category) {
    switch (category.is_active) {
        case true:
            return 'success';

        case false:
            return 'warning';
        default:
            return null;
    }
};

function statusBodyTemplate(rowData: Category) {
    return <Tag value={(rowData.is_active) + ""} severity={getSeverity(rowData)}></Tag>;
};

function updatedAtBodyTemplate(rowData: Category) {
    return (
        <Calendar
            value={new Date(rowData.updated_at)}
            dateFormat="dd/mm/yy"
            showIcon
            disabled
        />
    );
};





function GetFakeData(): Category[] {
    return [
        {
            id: "1",
            name: "Electronics",
            year: 2024,
            created_at: new Date("2024-01-15T10:00:00Z"),
            created_by: "admin",
            updated_at: new Date("2024-03-10T12:30:00Z"),
            updated_by: "admin",
            is_active: true
        },
        {
            id: "2",
            name: "Books",
            year: 2023,
            created_at: new Date("2023-06-22T09:15:00Z"),
            created_by: "user1",
            updated_at: new Date("2024-01-05T11:00:00Z"),
            updated_by: "user2",
            is_active: true
        },
        {
            id: "3",
            name: "Fashion",
            year: 2022,
            created_at: new Date("2022-05-10T14:45:00Z"),
            created_by: "user3",
            updated_at: new Date("2023-12-30T08:30:00Z"),
            updated_by: "admin",
            is_active: false
        },
        {
            id: "4",
            name: "Home & Kitchen",
            year: 2024,
            created_at: new Date("2024-02-01T07:20:00Z"),
            created_by: "admin",
            updated_at: new Date("2024-04-15T13:15:00Z"),
            updated_by: "user4",
            is_active: true
        },
        {
            id: "5",
            name: "Sports",
            year: 2023,
            created_at: new Date("2023-09-10T16:00:00Z"),
            created_by: "user5",
            updated_at: new Date("2023-11-25T10:00:00Z"),
            updated_by: "user1",
            is_active: true
        }
    ]
}


