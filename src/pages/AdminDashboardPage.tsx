import AdminLayout from "../components/Layout/AdminLayout";
import { CustomBreadCrumb, GenericTable } from "../components/Common/Index";
import { Card } from "primereact/card";
import { DataTableValue } from "primereact/datatable";

interface Test {
    id: string;
    name: string;
    code: string;
    total_question: string;
    category: string;
    time: string;
}

const data: DataTableValue[] = [
    {
        name: "Toiec 2024 test 1",
        code: "toeic2024test1",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
    {
        name: "Toiec 2024 test 2",
        code: "toeic2024test2",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
    {
        name: "Toiec 2024 test 3",
        code: "toeic2024test3",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
    {
        name: "Toiec 2024 test 4",
        code: "toeic2024test4",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
    {
        name: "Toiec 2024 test 5",
        code: "toeic2024test5",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
    {
        name: "Toiec 2024 test 6",
        code: "toeic2024test6",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
    {
        name: "Toiec 2024 test 7",
        code: "toeic2024test7",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
    {
        name: "Toiec 2024 test 8",
        code: "toeic2024test8",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
    {
        name: "Toiec 2024 test 9",
        code: "toeic2024test9",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
    {
        name: "Toiec 2024 test 10",
        code: "toeic2024test10",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
    {
        name: "Toiec 2024 test 11",
        code: "toeic2024test11",
        total_question: "200",
        category: "Toiec 2024",
        time: "120 minute"
    },
];

const columns = [
    { field: 'name', header: 'Test Name', sortable: true, selectionMode: undefined },
    { field: 'code', header: 'Code', sortable: true, selectionMode: undefined },
    { field: 'total_question', header: 'Total Questions', sortable: true, selectionMode: undefined },
    { field: 'category', header: 'Category', sortable: true, selectionMode: undefined },
    { field: 'time', header: 'Time Limit', sortable: true, selectionMode: undefined },
];

export default function AdminDashboardPage() {

    return (
        <AdminLayout>
            <div>
                <CustomBreadCrumb />
                <Card className="my-2">
                    <GenericTable 
                        data={data}
                        columns={columns}
                        toolbar={true}
                    />
                </Card>
            </div>
        </AdminLayout>
    )
}