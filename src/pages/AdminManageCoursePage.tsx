import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows, DataTableValueArray } from "primereact/datatable";
import { Toast } from "primereact/toast";
import React, { memo, useEffect, useRef, useState } from "react";
import { statusBodyTemplate, timeStampBodyTemplate } from "../components/Common/Table/CommonColumn";
import { Course } from "../utils/types/type";
import { Chip } from "primereact/chip";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Card } from "primereact/card";
import EditCourseRichTextBox from "../components/Common/richTextBox/richTextBox";

export function AdminManageCoursePage() {

    const [courses, setCourses] = useState<Course[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('https://dummyjson.com/c/41e4-b615-4556-a191');
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                console.error("không tải được khóa");

            }
        };

        fetchCourses();
    }, []);

    const allowExpansion = (rowData: Course) => {
        return rowData.lecture.length > 0 || rowData.assignment.questionIds.length > 0;
    };

    const columns: JSX.Element[] = [

        <Column key={"col-expand"} expander={allowExpansion} style={{ width: '5rem' }} />,
        <Column key={"col-id"} field="id" header="ID" filter sortable />,
        <Column key={"col-name"} field="name" header="Tên khóa" filter sortable />,
        <Column key={"col-topic"} field="topic" header="Chủ đề" sortable filter body={topicTemplate} />,
        <Column key={"col-format"} field="format" header="Định dạng" sortable filter />,
        <Column key={"col-dificulty"} field="difficulty" header="Độ khó" sortable filter />,
        <Column key="col-timestamp" header="Time stamp" body={timeStampBodyTemplate} sortable style={{ minWidth: '10rem' }} />,
        <Column key={"col-active"} field="isActive" header="Status" filter sortable body={statusBodyTemplate} />
    ];
    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable value={courses} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id" tableStyle={{ minWidth: '60rem' }}>

                {columns}
            </DataTable>
        </div>

    )

}


export default memo(AdminManageCoursePage);

function topicTemplate(rowData: Course): JSX.Element {
    return (
        <React.Fragment>
            {
                rowData.topic.map((topic, index) => <Chip key={rowData.id + "_topic_" + index} label={topic} />)
            }
        </React.Fragment>
    )
}


const rowExpansionTemplate = (data: Course) => {
    return (
        <main key={"expandrow" + data.id} className='align-items-center justify-content-center border-round m-2' style={{ width: '80%' }}>
            <Card className="bg-purple-200">
                <h1>Lý thuyết {data.name}</h1>
                <Accordion activeIndex={0} >
                    {data.lecture.map((lecture, index) => {
                        return (
                            <AccordionTab key={"lecture title" + index} header={lecture.title}>
                                <EditCourseRichTextBox content={lecture.content} />
                            </AccordionTab>
                        )
                    })}

                </Accordion>

            </Card>
            <br></br>
            <Card className="bg-yellow-200">
                <h1>Bài tập  {data.name}</h1>
                <Accordion activeIndex={0}>
                    <AccordionTab header="Header I">
                        <p className="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                            quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </p>

                    </AccordionTab>
                    <AccordionTab header="Header II">
                        <p className="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                            quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </p>
                    </AccordionTab>
                    <AccordionTab header="Header III">
                        <p className="m-0">
                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                            mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                        </p>
                    </AccordionTab>
                </Accordion>

            </Card>
        </main>
    );
};