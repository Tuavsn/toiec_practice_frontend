import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { ProgressBar } from "primereact/progressbar";
import { Skeleton } from "primereact/skeleton";
import React from "react";
import { Link } from "react-router-dom";
import { callPutPercentLecture } from "../../api/api";
import useLectureCard from "../../hooks/LectureCardHook";
import GetColorBasedOnValue from "../../utils/helperFunction/GetColorHueValue";
import { LectureCard } from "../../utils/types/type";

export default function LecturePage() {

    const { state, dispatch, totalItemsRef } = useLectureCard();
    return (
        <div className="p-4" data-testid="lecture-page">
            <section className="mt-5 bg-gray-300 shadow-5 p-3 glassmorphism" data-testid="lecture-header">
                <h1 className="pl-4">Các bài học nên thử</h1>
            </section>
            <div className="flex justify-content-end flex-wrap mt-4" data-testid="lecture-search-container">
                <div className="flex align-items-center justify-content-center m-2">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"> </InputIcon>
                        <InputText
                            onChange={(e) => dispatch({ type: "SET_KEYWORD", payload: e.target.value || '' })}
                            placeholder="Tìm bài học..."
                            className="p-mb-2"
                            data-testid="lecture-search-input"
                        />
                    </IconField>
                </div>
            </div>
            <div className="flex flex-column mt-4" data-testid="lecture-list">
                {RenderLecture(state.lectures)}
            </div>
            <Paginator
                first={state.currentPageIndex * 5}
                rows={5}
                totalRecords={totalItemsRef.current}
                onPageChange={(e) => dispatch({ type: "SET_PAGE", payload: e.page })}
                data-testid="lecture-paginator"
            />
        </div>
    );
};



function RenderLecture(lectures: LectureCard[]): React.ReactNode {
    if (lectures.length === 0) {
        return (
            <div className="flex flex-column gap-3" data-testid="lecture-skeletons">
                {
                    Array.from({ length: 5 }, (_, index) => <Skeleton width="100%" height="12rem" borderRadius="10px" key={index} data-testid={`skeleton-${index}`} />)
                }
            </div>
        )
    }

    return (
        <React.Fragment>
            {
                lectures.map(({ id, name, percent, topic }) => {

                    return (
                        <Card
                            key={id}
                            title={name}
                            className="border-round m-2 shadow-2 min-h-full bg-yellow-50 hover:shadow-4"
                            data-testid={`lecture-card-${id}`}
                        >
                            <div>
                                <p className="pb-5" data-testid={`lecture-content-${id}`}>
                                    <strong>Nội dung:</strong> {topic.join(", ")}
                                </p>
                                <Link to={`${name}___${id}`} data-testid={`lecture-link-${id}`}>
                                    <Button severity="help" label="Học ngay" data-testid={`lecture-button-${id}`} onClick={() => {
                                        if (percent <= 0) callPutPercentLecture(id, 10)
                                    }} />
                                </Link>
                                <CustomProgressBar value={percent} />
                            </div>
                        </Card>
                    )
                })
            }
        </React.Fragment>
    )
}

const CustomProgressBar: React.FC<{ value: number }> = ({ value }) => {
    if (value <= 0) {
        return <></>
    }
    const hueValue = GetColorBasedOnValue(value);
    return <ProgressBar className="mt-3" color={hueValue} value={value}></ProgressBar>


}