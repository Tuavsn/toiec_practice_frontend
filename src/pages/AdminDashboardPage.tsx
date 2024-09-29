import AdminLayout from "../components/Layout/AdminLayout";
import { CustomBreadCrumb, Table, ToolBar } from "../components/Common/Index";
import { Card } from "primereact/card";
import { memo } from "react";

export function AdminDashboardPage() {
    return (
        <AdminLayout>
            <div>
                <CustomBreadCrumb />
                <Card className="my-2">
                    <ToolBar />
                    <Table />
                </Card>
            </div>
        </AdminLayout>
    )
}

export default memo(AdminDashboardPage);