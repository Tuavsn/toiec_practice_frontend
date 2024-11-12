import { Card } from "primereact/card";
import React from "react";
import { CustomBreadCrumb } from "../components/Common/Index";

export default function AdminDashboardPage() {

    return (
        <React.Fragment>
            <CustomBreadCrumb />
            <Card className="my-2">
                <h1>Đây là trang chính admin page</h1>
            </Card>
        </React.Fragment>

    )
}