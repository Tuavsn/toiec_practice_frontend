import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import React from "react";
import { DataTableValue } from "primereact/datatable";

type ToolbarProps = {
    onCreate?: () => void;
    onEdit?: (rowData: any) => void;
    onDelete?: (rowData: any) => void;
    onImport?: () => void;
    onExport?: () => void;
    // searchValue?: string;
    // setSearchValue?: (value: string) => void;
};


export default function ToolBar({ onCreate, onEdit, onDelete, onImport, onExport }: ToolbarProps) {

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" tooltip="Thêm mới" tooltipOptions={{ position: 'top' }} onClick={onCreate} />
            <Button icon="pi pi-pencil" className="mr-2" tooltip="Chỉnh sửa" tooltipOptions={{ position: 'top' }} onClick={onEdit} />
            <Button icon="pi pi-trash" className="mr-2" tooltip="Xóa" tooltipOptions={{ position: 'top' }} onClick={onDelete} />
            <Button icon="pi pi-upload" className="mr-2" tooltip="Upload" tooltipOptions={{ position: 'top' }} onClick={onImport} />
            <Button icon="pi pi-download" className="mr-2" tooltip="Download" tooltipOptions={{ position: 'top' }} onClick={onExport} />
        </React.Fragment>
    );

    const endContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText placeholder="Search" />
        </IconField>
    );

    return (
        <Toolbar start={startContent} end={endContent} className="border-none p-0" style={{ backgroundColor: 'transparent' }} />
    );
}


function leftToolbarTemplate<Model extends DataTableValue>(
    openNew: () => void,
    confirmDeleteSelected: () => void,
    selectedRows: Model[]) {

    return (
        <div className="flex flex-wrap gap-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRows || !selectedRows.length} />
        </div>
    );
}

function rightToolbarTemplate(exportCSV: () => void) {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
}

interface SimpleToolBarProps<Model extends DataTableValue> {
    openNew: () => void;
    confirmDeleteSelected: () => void;
    selectedRows: Model[];
    exportCSV: () => void;
}

// Define the functional component
function _SimpleToolBar<Model extends DataTableValue>({
    openNew,
    confirmDeleteSelected,
    selectedRows,
    exportCSV,
}: SimpleToolBarProps<Model>) {
    return (
        <Toolbar
            className="mb-4"
            start={leftToolbarTemplate(openNew, confirmDeleteSelected, selectedRows)}
            end={rightToolbarTemplate(exportCSV)}
        />
    );
}

// Wrap the component with React.memo
export const SimpleToolBar = React.memo(_SimpleToolBar);