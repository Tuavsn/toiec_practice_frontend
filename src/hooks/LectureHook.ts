import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { callGetLectureRow } from "../api/api";
import { useToast } from "../context/ToastProvider";
import GetAbortController from "../utils/helperFunction/GetAbortController";
import SetWebPageTitle from "../utils/helperFunction/setTitlePage";
import { LectureHookAction } from "../utils/types/action";
import { initialLectureState } from "../utils/types/emptyValue";
import { LectureHookState } from "../utils/types/state";


const reducer = (state: LectureHookState, action: LectureHookAction): LectureHookState => {
    switch (action.type) {
        case 'FETCH_LECTURE_SUCCESS':
            return { ...state, lectures: action.payload.lectures, currentPageIndex: action.payload.pageIndex }
        case 'SET_PAGE':
            return { ...state, currentPageIndex: action.payload }
        case 'SET_SEARCH':
            return { ...state, searchText: action.payload }
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
    const abortControllerRef = useRef<AbortController | null>(null);
    const fetchLectures = useCallback(async (pageNumber: number, searchText: string) => {
        const controller = GetAbortController(abortControllerRef);
        const response = await callGetLectureRow(controller.signal, pageNumber, searchText);
        if (response === "abort") return;
        if (!response) {
            toast.current?.show({ severity: "error", summary: "Lỗi tải dữ liệu", detail: "Không thể tải dữ liệu bài học" });
            return;
        }
        dispatch({ type: "FETCH_LECTURE_SUCCESS", payload: { lectures: response.result, pageIndex: pageNumber } });
        totalItems.current = response.meta.totalItems;

    }, [])
    useLayoutEffect(() => SetWebPageTitle("Quản lý bài học"), []);
    useEffect(() => {

        fetchLectures(state.currentPageIndex, state.searchText);
        return () => abortControllerRef.current?.abort();
    }, [state.isRefresh, state.searchText]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchLectures(e.page, state.searchText)
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,
    }
}