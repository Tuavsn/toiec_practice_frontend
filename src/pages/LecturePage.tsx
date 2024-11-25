import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LectureCard } from "../utils/types/type";
import { callGetLectureCards } from "../api/api";
import { LoadingSpinner } from "../components/Common/Index";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";

export default function CoursePage() {

    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const searchTermRef = useRef<HTMLInputElement | null>(null);
    const totalItemsRef = useRef<number>(-1);

    useEffect(() => {
        const fetchLectures = async (pageIndex: number) => {
            try {
                const response = await callGetLectureCards(pageIndex);
                totalItemsRef.current = response.data.meta.totalItems;
                dispatch({ type: "FETCH_SUCCESS", payload: response.data.result });
            } catch (error) {
                console.error("lỗi " + error)
            }
        }
        fetchLectures(state.currentPageIndex);
    }, [state.currentPageIndex])
    if (state.lectures.length === 0) {
        return <LoadingSpinner text="Các bài giảng đang được tải lên" />
    }
    return (
        <div className="p-p-4">
            <h1 className="text-center text-4xl mt-4 pt-5">CÁC BÀI GIẢNG NÊN THỬ</h1>
            <div className="flex justify-content-end flex-wrap ">
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
                                <strong>Nội dung:</strong> {lecture.topic.join(', ')}
                            </p>
                            <Button severity="help" label="Học ngay" onClick={() => navigate(`/lectures/${lecture.id}`)} />
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
    lectures: LectureCard[],
    currentPageIndex: number,

}

type Action =
    | { type: 'FETCH_SUCCESS'; payload: LectureCard[] }
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
