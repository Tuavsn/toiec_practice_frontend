import { useState, useEffect } from 'react';
import { DataTable, DataTableSelectionCellChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';

interface Test {
    name: string;
    code: string;
    total_question: string;
    category: string;
    time: string;
}

export default function Table() {
    
    const [tests, setTests] = useState<Test[]>([]);
    const [selectedTests, setSelectedTests] = useState<Test[]>([]);
    const [rowClick, setRowClick] = useState(true);

    useEffect(() => {
        // Tạo dữ liệu mẫu
        const testsData = [
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
            {
                name: "Toiec 2024 test 12",
                code: "toeic2024test12",
                total_question: "200",
                category: "Toiec 2024",
                time: "120 minute"
            },
        ];

        setTests(testsData);
    }, []);


    return (
        <div className="card my-4">
            <DataTable
                value={tests} 
                paginator 
                rows={5} 
                rowsPerPageOptions={[10, 15, 25, 50]} 
                selectionMode={'checkbox'}
                selection={selectedTests} 
                onSelectionChange={(e:any) => setSelectedTests(e.value)} 
                dataKey="code"
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="name" header="Tên" sortable></Column>
                <Column field="code" header="Mã đề" sortable></Column>
                <Column field="total_question" header="Số câu hỏi" sortable></Column>
                <Column field="category" header="Danh mục" sortable></Column>
                <Column field="time" header="Thời gian" sortable></Column>
            </DataTable>
        </div>
    );
}