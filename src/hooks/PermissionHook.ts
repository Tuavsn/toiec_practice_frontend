import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { callGetPermission } from "../api/api";
import { useToast } from "../context/ToastProvider";
import GetAbortController from "../utils/helperFunction/GetAbortController";
import SetWebPageTitle from "../utils/helperFunction/setTitlePage";
import { PermissionHookAction } from "../utils/types/action";
import { initialPermissionState } from "../utils/types/emptyValue";
import { PermissionHookState } from "../utils/types/state";

const reducer = (state: PermissionHookState, action: PermissionHookAction): PermissionHookState => {
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



export default function usePermission() {

    // Sử dụng useReducer để quản lý state và dispatch cho quản lý chủ đề
    const [state, dispatch] = useReducer(reducer, initialPermissionState);
    // Biến tham chiếu lưu tổng số lượng mục
    const totalItems = useRef(0);
    // Hook toast dùng để hiển thị thông báo
    const { toast } = useToast();
    // Biến tham chiếu lưu AbortController
    const abortControllerRef = useRef<AbortController | null>(null);

    // Hàm lấy danh sách chủ đề
    const fetchPermissions = useCallback(async (pageNumber: number, searchText: string) => {
        // Lấy hoặc tạo AbortController mới
        const controller = GetAbortController(abortControllerRef);

        // Gọi API lấy dữ liệu chủ đề
        const response = await callGetPermission(controller.signal, pageNumber, searchText);

        // Kiểm tra nếu request bị hủy, kết thúc hàm
        if (response === "abort") return;

        // Hiển thị thông báo lỗi nếu không lấy được dữ liệu
        if (!response) {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách chủ đề" });
            return;
        }

        // Cập nhật state với dữ liệu nhận được
        dispatch({ type: "FETCH_ROWS_SUCCESS", payload: [response.result, pageNumber] });
        // Cập nhật tổng số lượng mục
        totalItems.current = response.meta.totalItems;

    }, []); // Hàm chỉ được tạo lại khi không có dependency nào thay đổi

    // Đặt tiêu đề trang
    useLayoutEffect(() => SetWebPageTitle("Quản lý chủ đề"), []);

    useEffect(() => {
        // Gọi hàm lấy danh sách chủ đề
        fetchPermissions(state.currentPageIndex, state.searchText);

        // Cleanup: Hủy request khi dependency thay đổi hoặc component unmount
        return () => abortControllerRef.current?.abort();
    }, [state.isRefresh, state.searchText]);

    // Hàm xử lý khi người dùng thay đổi trang
    const onPageChange = (e: PaginatorPageChangeEvent) => {
        fetchPermissions(e.page, state.searchText); // Lấy dữ liệu của trang mới
    };

    return {
        state, // Trạng thái hiện tại
        dispatch, // Hàm dispatch để cập nhật state
        totalItems, // Tổng số lượng mục
        onPageChange, // Hàm xử lý thay đổi trang
    };
}

