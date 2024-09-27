import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import React from "react";

export default function ToolBar() {

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" />
            <Button icon="pi pi-upload" className="mr-2" />
            <Button icon="pi pi-print" />
        </React.Fragment>
    );

    const endContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText placeholder="Search" />
        </IconField>
    );

    return (
        <Toolbar start={startContent} end={endContent} className="border-none p-0"/>
    );
}