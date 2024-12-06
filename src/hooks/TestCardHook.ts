import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callGetCategoryLabel, callGetTestCard } from "../api/api";
import { CategoryLabel, TestCard } from "../utils/types/type";
import SetWebPageTitle from "../utils/setTitlePage";

export function useTestCard() {
    const navigate = useNavigate();
    const [currentFormatIndex, setCurrentFormatIndex] = useState<number>(0);
    const [currentYear, setCurrentYear] = useState<number>(0);
    const [testCards, setTestCards] = useState<TestCard[]|null>(null);
    const [categoryLabels, setCategoryLabels] = useState<CategoryLabel[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const totalItemsRef = useRef<number>(-1);


    const setNewFormat = (index: number) => {
        setCurrentFormatIndex(index);
        setCurrentYear(0);
        setPageIndex(0);
    }
    // === Hàm lấy dữ liệu thẻ bài kiểm tra theo trang, không thay đổi pageIndex trong hàm này ===
    const fetchTestCardByPage = useCallback(async (selectedFormat: string, selectedYear: number, page: number) => {
        try {
            setTestCards(null);
            // Gọi API để lấy dữ liệu thẻ bài kiểm tra
            const responseData = await callGetTestCard(selectedFormat, selectedYear, page);

            // Lưu trữ tổng số mục
            totalItemsRef.current = responseData.data.meta.totalItems;

            // Cập nhật state dữ liệu thẻ kiểm tra
            setTestCards(responseData.data.result);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        }
    }, []);

    // === Hàm lấy dữ liệu nhãn danh mục ban đầu và thiết lập trang ===
    useLayoutEffect(() => {
        SetWebPageTitle("Thư viện đề thi")
        const fetchCategoryLabels = async () => {
            try {
                const responseData = await callGetCategoryLabel();
                setCategoryLabels(responseData.data);

                // Lấy dữ liệu  cho nhãn và năm mặc định
                await fetchTestCardByPage(responseData.data[0].format, 0, 0);
            } catch (error) {
                console.error('Failed to fetch category labels:', error);
            }
        };
        fetchCategoryLabels();
    }, []); // Chỉ chạy một lần khi component được mount

    // === Xử lý thay đổi chỉ số trang từ sự kiện phân trang ===
    const onPageChange = useCallback((event: PaginatorPageChangeEvent) => {

        const newPageIndex = event.page;
        // Cập nhật chỉ số trang và gọi lại dữ liệu
        setPageIndex(newPageIndex);
    }, []);

    // === Tự động gọi lại khi thay đổi format, năm hoặc chỉ số trang hiện tại ===
    useEffect(() => {

        if (categoryLabels.length !== 0) {
            // Gọi API khi format, năm hoặc trang thay đổi, nhưng không thay đổi pageIndex
            fetchTestCardByPage(categoryLabels[currentFormatIndex].format, currentYear, pageIndex);
        }
    }, [currentFormatIndex, currentYear, pageIndex]);

    return {
        currentFormatIndex,
        categoryLabels,
        setCurrentYear,
        totalItemsRef,
        setNewFormat,
        onPageChange,
        currentYear,
        testCards,
        pageIndex,
        navigate,
    };
}
