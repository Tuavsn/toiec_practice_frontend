import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { detailUserResultRowBodyTemplate, typeUserResultRowBodyTemplate } from "../components/Common/Table/CommonColumn";
import { useCheckBox } from "../hooks/TestDetailPaperHook";
import formatDate from "../utils/formatDateToString";
import { TestID, UserResultRow } from "../utils/types/type";

function TestDetailPage() {

    const { id = "" } = useParams<{ id: string }>(); // Access course ID from URL params
    const data = GetFakeUserResult();
    const topics = GetFakeTopics();

    const columns = [
        <Column key="col-createdAt" field="createdAt" header="Ngày làm" body={(rowData: UserResultRow) => formatDate(rowData.createdAt)} sortable filter />,
        <Column key="col-correct_count" field="totalCorrectAnswer" header="Kết quả" sortable filter />,
        <Column key="col-time" field="totalTime" header="Thời gian làm bài" sortable filter />,
        <Column key="col-type" header="Loại" body={typeUserResultRowBodyTemplate} bodyClassName="flex justify-content-center gap-1" className="justify-content-center" />,
        <Column key="col-detail" body={detailUserResultRowBodyTemplate} />,
    ];



    const showDetailParts = Array.from({ length: 7 }, (_, index) => {
        const i = index + 1;
        return (
            <div key={"part detail " + i}>
                <h3>Phần {i}</h3>
                <span className="card flex flex-wrap gap-2">
                    {
                        topics.map((topicsForCurrentPart) => {

                            return (

                                topicsForCurrentPart.map((topic, index2) => {
                                    return (
                                        <Chip key={"topic_" + index2} label={topic} />
                                    )
                                })
                            )
                        }

                        )
                    }

                </span>
            </div>
        )
    })

    return (
        <main className="pt-8">
            <h1 className="text-center my-4">Thông tin đề {id}</h1>
            {TestInfoBox(90, 50)}
            <section>
                <h3>Kết quả làm bài của bạn:</h3>
                <DataTable size={'small'} value={data} showGridlines stripedRows scrollable scrollHeight="600px">
                    {columns}
                </DataTable>
            </section>
            <PartChooser testID={id} />
            <section>
                {showDetailParts}
            </section>
        </main>
    )
}

export default memo(TestDetailPage);



function DecodeCheckBoxesToUrl(parts: boolean[]): string {

    if (parts[0] === true) {
        return "fulltest/0";
    }
    let returnString = "";
    for (let i = 1; i <= 7; ++i) {
        if (parts[i] === true) {
            returnString += i;
        }
    }
    return "practice/" + returnString;
}

const PartChooser: React.FC<{ testID: TestID }> = memo(
    ({ testID }) => {
        const { parts, onPartSelectChange } = useCheckBox();
        const navigate = useNavigate();
        const checkboxes = Array.from({ length: 8 }, (_, index) => {
            const label = index === 0 ? "Thi thử" : "Phần " + index;
            return (
                <div className="flex align-items-center" key={"checkboxnum" + index}>
                    <Checkbox
                        inputId={"checkBoxPart" + index}
                        name={"part" + index}
                        value={index}
                        onChange={onPartSelectChange}
                        checked={parts[index] === true}
                    />
                    <label htmlFor={"checkBoxPart" + index} className="ml-2"> {label}</label>
                </div>
            );
        });
        return (
            <React.Fragment>
                <section>
                    <h1>Chọn phần thi bạn muốn làm</h1>
                    <span className="flex flex-wrap justify-content-center gap-3">
                        {checkboxes}
                    </span>
                </section>
                <div className="flex p-5 justify-content-center">
                    <Button onClick={() => {

                        navigate(`/dotest/${testID}/${DecodeCheckBoxesToUrl(parts)}`)
                    }} label="Bắt đầu"></Button>
                </div>
            </React.Fragment>
        )
    }
)

function TestInfoBox(limitTime: number, totalAttempt: number) {
    return (
        <section className="bg-gray-300 shadow-5 p-3">
            <table>
                <tbody>

                    <tr className="mb-3">
                        <td>
                            <h3 className="inline">Thời gian làm bài:   </h3>
                        </td>
                        <td>
                            <h4 className="inline  pl-4">{limitTime} phút ⏰</h4>
                        </td>
                    </tr>
                    <tr className="mb-3">
                        <td>
                            <h3 className="inline"> Số người đã luyện tập:  </h3>
                        </td>
                        <td>
                            <h4 className="inline pl-4">{totalAttempt} người 👤</h4>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    )
}


function GetFakeUserResult(): UserResultRow[] {
    return [
        {
            id: "1",
            createdAt: new Date('2024-10-10T10:00:00'),
            totalCorrectAnswer: 15,
            totalTime: 1200,
            type: 'practice',
            parts: [1, 2, 3]
        },
        {
            id: "2",
            createdAt: new Date('2024-09-15T15:30:00'),
            totalCorrectAnswer: 20,
            totalTime: 1800,
            type: 'fulltest',
            parts: [1, 2, 3, 4]
        },
        {
            id: "3",
            createdAt: new Date('2024-08-05T08:20:00'),
            totalCorrectAnswer: 10,
            totalTime: 900,
            type: 'practice',
            parts: [1]
        },
        {
            id: "4",
            createdAt: new Date('2024-07-22T12:15:00'),
            totalCorrectAnswer: 18,
            totalTime: 1500,
            type: 'fulltest',
            parts: [1, 2, 3, 4]
        },
        {
            id: "5",
            createdAt: new Date('2024-06-30T16:45:00'),
            totalCorrectAnswer: 22,
            totalTime: 2000,
            type: 'practice',
            parts: [1, 3, 4]
        },
        {
            id: "6",
            createdAt: new Date('2024-05-19T14:00:00'),
            totalCorrectAnswer: 25,
            totalTime: 2400,
            type: 'fulltest',
            parts: [1, 2, 3, 4]
        },
        {
            id: "7",
            createdAt: new Date('2024-04-08T11:35:00'),
            totalCorrectAnswer: 14,
            totalTime: 1100,
            type: 'practice',
            parts: [2, 3]
        },
        {
            id: "8",
            createdAt: new Date('2024-03-25T09:50:00'),
            totalCorrectAnswer: 30,
            totalTime: 3000,
            type: 'fulltest',
            parts: [1, 2, 3, 4]
        },
        {
            id: "9",
            createdAt: new Date('2024-02-10T07:25:00'),
            totalCorrectAnswer: 12,
            totalTime: 1300,
            type: 'practice',
            parts: [1, 2]
        },
        {
            id: "10",
            createdAt: new Date('2024-01-01T13:10:00'),
            totalCorrectAnswer: 28,
            totalTime: 2700,
            type: 'fulltest',
            parts: [1, 3, 4]
        }
    ];
}

function GetFakeTopics() {
    return [
        ["Describing a picture - Office environment", "travel scenes", "everyday life situations"],
        ["Question and response - Business conversations", "travel arrangements", "or customer inquiries"],
        ["Conversations - Workplace discussions", "meetings", "or service-related exchanges"],
        ["Talks - Presentations", "weather forecasts", "or public announcements"],
        ["Incomplete sentences - Grammar topics like verb tenses", "prepositions", "conditionals"],
        ["Text completion - Emails", "memos", "or notices with missing phrases or sentences"],
        ["Reading comprehension - Articles", "advertisements", "or correspondence in business contexts"]
    ];

}