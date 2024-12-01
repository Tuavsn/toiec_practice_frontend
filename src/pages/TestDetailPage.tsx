import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callGetTestDetailPageData } from "../api/api";
import { CountAnswerTypeTemplate, detailUserResultRowBodyTemplate, typeUserResultRowBodyTemplate } from "../components/Common/Table/CommonColumn";
import { useCheckBox } from "../hooks/TestDetailPaperHook";
import convertSecondsToString from "../utils/convertSecondsToString";
import formatDate from "../utils/formatDateToString";
import { TestDetailPageData, TestID } from "../utils/types/type";

const emptyTestDetailPageData: TestDetailPageData = {
    id: "",
    name: "",
    totalUserAttempt: 0,
    totalQuestion: 0,
    totalScore: 0,
    limitTime: 0,
    resultsOverview: [],
    topicsOverview: []
}

function TestDetailPage() {

    const { id = "" } = useParams<{ id: string }>(); // Access course ID from URL params
    const [testInfo, setTestInfo] = useState<TestDetailPageData>(emptyTestDetailPageData)
    useEffect(() => {
        callGetTestDetailPageData(id).then(newTestInfo => {
            if (!newTestInfo) {
                return;
            }
            setTestInfo(newTestInfo);
        }
        )
    }, [])
    const columns = [
        <Column key="col-createdAt" field="createdAt" header="Ngày làm" bodyClassName="text-center" body={(rowData: { createdAt: Date }) => formatDate(rowData.createdAt)} />,
        <Column key="col-answer_count" header="thống kê" body={CountAnswerTypeTemplate} sortable filter />, <Column key="col-time" field="totalTime" header="Thời gian làm bài" body={row => convertSecondsToString(row.totalTime)} sortable filter />,
        <Column key="col-type" header="Loại" body={typeUserResultRowBodyTemplate} headerClassName="w-max" />,
        <Column key="col-detail" bodyClassName="text-center" body={row => detailUserResultRowBodyTemplate({ id: row.result })} />,
    ];



    const showDetailParts = testInfo.topicsOverview.map(topicsForCurrentPart => {
        return (
            <div key={"part detail " + topicsForCurrentPart.partNum}>
                <h3>Phần {topicsForCurrentPart.partNum}</h3>
                <span className="card flex flex-wrap gap-2">
                    {
                        topicsForCurrentPart.topicNames.map((topic, index2) => {
                            return (
                                <Chip key={"topic_" + index2} label={topic} />
                            )
                        })

                    }

                </span>
            </div>
        )
    })

    return (
        <main className="pt-8">
            <h1 className="text-center my-4">Thông tin đề <q>{testInfo.name}</q></h1>
            {TestInfoBox(testInfo.limitTime, testInfo.totalUserAttempt)}
            <section>
                <h3>Kết quả làm bài của bạn:</h3>
                <DataTable size={'small'} value={testInfo.resultsOverview} showGridlines stripedRows
                    loading={!testInfo.id} paginator totalRecords={testInfo.resultsOverview.length} rows={5} scrollable scrollHeight="600px">
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
