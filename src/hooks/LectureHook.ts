import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { callGetLectureRow } from "../api/api";
import { useToast } from "../context/ToastProvider";
import { initialLectureState } from "../utils/types/emptyValue";
import { LectureHookAction, LectureHookState } from "../utils/types/type";
import SetWebPageTitle from "../utils/setTitlePage";


const reducer = (state: LectureHookState, action: LectureHookAction): LectureHookState => {
    switch (action.type) {
        case 'FETCH_LECTURE_SUCCESS':
            return { ...state, lectures: action.payload.lectures, currentPageIndex: action.payload.pageIndex }
        case 'SET_PAGE':
            return { ...state, currentPageIndex: action.payload }
        case 'REFRESH_DATA':
            return { ...state, isRefresh: !state.isRefresh }
        case 'TOGGLE_DIALOG':
            return { ...state, job: action.payload }
        case 'OPEN_UPDATE_DIALOG':
            return { ...state, job: "UPDATE", currentSelectedLecture: action.payload }
        case 'OPEN_CREATE_DIALOG':
            return { ...state, job: "CREATE", currentSelectedLecture: action.payload }
        case 'OPEN_DELETE_DIALOG':
            return { ...state, job: "DELETE", currentSelectedLecture: action.payload }
        case 'OPEN_PAGE_DESIGNER_DIALOG':
            return { ...state, job: "PAGE_DESIGNER", currentSelectedLecture: action.payload }
        case 'OPEN_QUESTION_EDITOR_DIALOG':
            return { ...state, job: "QUESTION_EDITOR", currentSelectedLecture: action.payload }
        default:
            return state;
    }
}

export default function useLecture() {
    const [state, dispatch] = useReducer(reducer, initialLectureState);
    const totalItems = useRef(0);
    const { toast } = useToast();
    const fetchLectures = useCallback(async (pageNumber: number) => {

        const response = await callGetLectureRow(pageNumber);
        if (response instanceof Error) {
            toast.current?.show({ severity: "error", summary: "Lỗi tải dữ liệu", detail: response.message });
            return;
        }
        dispatch({ type: "FETCH_LECTURE_SUCCESS", payload: { lectures: response.result, pageIndex: pageNumber } });
        totalItems.current = response.meta.totalItems;

    }, [])
    useLayoutEffect(() => SetWebPageTitle("Quản lý bài giảng"), []);
    useEffect(() => {

        fetchLectures(state.currentPageIndex);

    }, [state.isRefresh]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchLectures(e.page)
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,
    }
}