import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { callGetLectureRow } from "../api/api";
import { LoadingSpinner } from "../components/Common/Index";
import { LectureRow, Topic } from "../utils/types/type";

export default function LecturePage() {

    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const searchTermRef = useRef<HTMLInputElement | null>(null);
    const totalItemsRef = useRef<number>(-1);

    useEffect(() => {
        const fetchLectures = async (pageIndex: number) => {

            const response = await callGetLectureRow(pageIndex);
            if (response instanceof Error) {
                return;
            }
            totalItemsRef.current = response.meta.totalItems;
            dispatch({ type: "FETCH_SUCCESS", payload: response.result });
        }
        fetchLectures(state.currentPageIndex);
    }, [state.currentPageIndex])
    if (state.lectures.length === 0) {
        return <main className="flex justify-content-center h-screen"><LoadingSpinner text="Các bài giảng đang được tải lên" /></main>
    }
    return (
        <div className="p-4">
            <section className="mt-5 bg-gray-300 shadow-5 p-3 glassmorphism">
                <h1 className="pl-4">Các bài giảng nên thử</h1>
            </section>
            <div className="flex justify-content-end flex-wrap mt-4">
                <div className="flex align-items-center justify-content-center m-2">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"> </InputIcon>
                        <InputText
                            ref={searchTermRef}
                            placeholder="Tìm bài giảng..."
                            className="p-mb-2"
                        />
                    </IconField>
                </div>
            </div>
            <div className="flex flex-column mt-4">
                {state.lectures.map((lecture) => (

                    <Card key={lecture.id} title={lecture.name} className="border-round m-2 shadow-2 min-h-full bg-yellow-50 hover:shadow-4">
                        <div>
                            <p className="pb-5">
                                <strong>Nội dung:</strong> {getTopicName(lecture.topic)}
                            </p>
                            <Button severity="help" label="Học ngay" onClick={() => navigate(`/lectures/${lecture.name}___${lecture.id}`)} />
                        </div>
                    </Card>

                ))}
            </div>
            <Paginator
                first={state.currentPageIndex * 5}
                rows={5}
                totalRecords={totalItemsRef.current}
                onPageChange={(e) => dispatch({ type: "SET_PAGE", payload: e.page })}
            />
        </div>
    );
};

interface State {
    lectures: LectureRow[],
    currentPageIndex: number,

}

type Action =
    | { type: 'FETCH_SUCCESS'; payload: LectureRow[] }
    | { type: 'SET_PAGE'; payload: number }

const initialState: State = {
    lectures: [],
    currentPageIndex: 0
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...state, lectures: action.payload }
        case 'SET_PAGE':
            return { ...state, currentPageIndex: action.payload }
        default:
            return state;
    }
}

function getTopicName(topics: Topic[]): string {
    return topics.map(t => t.name).join(" ,")
}