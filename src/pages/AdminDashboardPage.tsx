import { CustomBreadCrumb } from "../components/Common/Index";
import { Card } from "primereact/card";
import React from "react";

const breadCrumbItems = [
    { label: 'Trang chủ', icon: 'pi pi-home', url: '/' },
    { label: 'Dashboard', icon: 'pi pi-cog', url: '/dashboard' },
];

export default function AdminDashboardPage() {

    return (
        <React.Fragment>
            <CustomBreadCrumb items={breadCrumbItems} />
            <Card className="my-2">
                <h1>Đây là trang chính admin page</h1>
            </Card>
        </React.Fragment>

    )
}