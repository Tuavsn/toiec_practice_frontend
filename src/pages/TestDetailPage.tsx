import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import React, { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callGetTestDetailPageData } from "../api/api";
import { CountAnswerTypeTemplate, detailUserResultRowBodyTemplate, typeUserResultRowBodyTemplate } from "../components/Common/Column/CommonColumn";
import { useCheckBox } from "../hooks/TestDetailPaperHook";
import { IsNotLogIn } from "../utils/AuthCheck";
import convertSecondsToString from "../utils/convertSecondsToString";
import formatDate from "../utils/formatDateToString";
import { emptyTestDetailPageData } from "../utils/types/emptyValue";
import { TestDetailPageData } from "../utils/types/type";



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
        <Column key="col-answer_count" header="thống kê" body={CountAnswerTypeTemplate} sortable filter />,
        <Column key="col-time" field="totalTime" header="Thời gian làm bài" body={row => convertSecondsToString(row.totalTime)} sortable filter />,
        <Column key="col-type" header="Loại" body={typeUserResultRowBodyTemplate} headerClassName="w-max" />,
        <Column key="col-detail" bodyClassName="text-center" body={row => detailUserResultRowBodyTemplate({ id: row.resultId })} />,
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
        <main className="pt-5">
            <Card title={`Thông tin đề ${testInfo.name}`}>

                {TestInfoBox(testInfo.limitTime, testInfo.totalUserAttempt)}
                <section>
                    <h3>Kết quả làm bài của bạn:</h3>
                    <DataTable size={'small'} value={testInfo.resultsOverview} showGridlines stripedRows emptyMessage="Không có bài làm nào trước đây"
                        loading={!testInfo.id} paginator totalRecords={testInfo.resultsOverview.length} rows={5} scrollable scrollHeight="600px">
                        {columns}
                    </DataTable>
                </section>
                <PartChooser limitTime={testInfo.limitTime} />
                <section>
                    {showDetailParts}
                </section>
            </Card>
        </main >
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

const PartChooser: React.FC<{ limitTime: number }> = memo(
    ({ limitTime }) => {
        const { parts, onPartSelectChange } = useCheckBox();
        const [timeLimit, setTimeLimit] = useState<number>(limitTime);
        useEffect(() => setTimeLimit(limitTime), [limitTime])
        const navigate = useNavigate();
        const isNotLogIn = IsNotLogIn();
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
                <div className="flex p-5 justify-content-center gap-2">
                    <InputNumber disabled={parts[0]} inputStyle={{ width: "6rem" }} buttonLayout="horizontal" showButtons value={parts[0] ? limitTime : timeLimit} min={10} max={limitTime} onValueChange={(e) => setTimeLimit(e.value ?? limitTime)} suffix=" phút" />
                    <Button disabled={isNotLogIn} onClick={() => {

                        navigate(`dotest/${timeLimit}/${DecodeCheckBoxesToUrl(parts)}`)
                    }} label="Làm bài"></Button>
                </div>
                {isNotLogIn &&
                    <div className="flex text-red-500 justify-content-center align-items-center column-gap-3">
                        <i className="pi pi-exclamation-circle" style={{ fontSize: '2rem' }}></i>
                        <p className="inline"> Bạn cần phải đăng nhập để có thể làm bài </p>
                    </div>
                }

            </React.Fragment>
        )
    }
)

function TestInfoBox(limitTime: number, totalAttempt: number) {
    return (
        <section className="bg-gray-300 shadow-5 p-4">
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
                            <h4 className="inline pl-4">{totalAttempt || 39} người 👤</h4>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    )
}
