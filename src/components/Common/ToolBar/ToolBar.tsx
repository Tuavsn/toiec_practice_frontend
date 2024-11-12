import { Button } from "primereact/button";
import { DataTableValue } from "primereact/datatable";
import { Toolbar } from 'primereact/toolbar';
import React from "react";







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