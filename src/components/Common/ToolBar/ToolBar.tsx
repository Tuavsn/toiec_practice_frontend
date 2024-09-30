import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import React from "react";

export default function ToolBar() {

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" tooltip="Thêm mới" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-pencil" className="mr-2" tooltip="Chỉnh sửa" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-trash" className="mr-2" tooltip="Xóa" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-upload" className="mr-2" tooltip="Upload" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-download" className="mr-2" tooltip="Download" tooltipOptions={{ position: 'top' }} />
        </React.Fragment>
    );

    const endContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search"/>
            <InputText placeholder="Search" />
        </IconField>
    );

    return (
        <Toolbar start={startContent} end={endContent} className="border-none p-0" style={{backgroundColor: 'transparent'}}/>
    );
}