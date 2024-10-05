import AdminLayout from "../components/Layout/AdminLayout";
import { CustomBreadCrumb, GenericTable } from "../components/Common/Index";
import { Card } from "primereact/card";

const breadCrumbItems = [
    { label: 'Trang chủ', icon: 'pi pi-home', url: '/' },
    { label: 'Dashboard', icon: 'pi pi-cog', url: '/dashboard' },
];

export default function AdminDashboardPage() {

    return (
        <AdminLayout>
            <div>
                <CustomBreadCrumb items={breadCrumbItems} />
                <Card className="my-2">
                </Card>
            </div>
        </AdminLayout>
    )
}