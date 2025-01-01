import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { callGetTopicRow } from "../api/api";
import { useToast } from "../context/ToastProvider";
import SetWebPageTitle from "../utils/helperFunction/setTitlePage";
import { TopicHookAction } from "../utils/types/action";
import { initialTopicState } from "../utils/types/emptyValue";
import { TopicHookState } from "../utils/types/state";

const reducer = (state: TopicHookState, action: TopicHookAction): TopicHookState => {
    switch (action.type) {
        case 'FETCH_ROWS_SUCCESS': {
            const [newCateogories, newPageIndex] = action.payload;
            return { ...state, rows: newCateogories, currentPageIndex: newPageIndex }
        }
        case 'SET_PAGE':
            return { ...state, currentPageIndex: action.payload }
        case 'SET_SEARCH':
            return { ...state, searchText: action.payload }
        case 'REFRESH_DATA':
            return { ...state, isRefresh: !state.isRefresh }
        case 'TOGGLE_DIALOG':
            return { ...state, job: action.payload }
        case 'OPEN_UPDATE_DIALOG':
            return { ...state, job: "UPDATE", currentSelectedRow: action.payload }
        case 'OPEN_CREATE_DIALOG':
            return { ...state, job: "CREATE", currentSelectedRow: action.payload }
        case 'OPEN_DELETE_DIALOG':
            return { ...state, job: "DELETE", currentSelectedRow: action.payload }

        default:
            return state;
    }
};



export default function useTopic() {

    const [state, dispatch] = useReducer(reducer, initialTopicState);
    const totalItems = useRef(0);
    const { toast } = useToast();
    const abortControllerRef = useRef<AbortController | null>(null);
    const fetchTopics = useCallback(async (pageNumber: number, searchText: string) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // Create a new AbortController and save it in the ref
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const response = await callGetTopicRow(controller.signal, pageNumber, searchText);
        if (response === "abort") return;
        if (!response) {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách chủ đề" });
            return;
        }
        dispatch({ type: "FETCH_ROWS_SUCCESS", payload: [response.result, pageNumber] });
        totalItems.current = response.meta.totalItems;

    }, [])
    useLayoutEffect(() => SetWebPageTitle("Quản lý chủ đề"), []);
    useEffect(() => {

        fetchTopics(state.currentPageIndex, state.searchText);
        return () => abortControllerRef.current?.abort();
    }, [state.isRefresh, state.searchText]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchTopics(e.page, state.searchText)
    }

    return {
        state,
        dispatch,
        totalItems,
        onPageChange,
    }
}
