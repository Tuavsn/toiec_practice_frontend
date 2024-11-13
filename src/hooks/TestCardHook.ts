import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callGetCategoryLabel, callGetTestCard } from "../api/api";
import { CategoryLabel, TestCard } from "../utils/types/type";

export function useTestCard() {
    const navigate = useNavigate();
    const [currentFormatIndex, setCurrentFormatIndex] = useState<number>(0);
    const [currentYear, setCurrentYear] = useState<number>(0);
    const [testCards, setTestCards] = useState<TestCard[]>(GetFakeData());
    const [categoryLabels, setCategoryLabels] = useState<CategoryLabel[]>(GetLabel());
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
        const fetchCategoryLabels = async () => {
            try {
                const responseData = await callGetCategoryLabel();
                setCategoryLabels(responseData.data);

                // Lấy dữ liệu câu hỏi cho nhãn và năm mặc định
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
        if (categoryLabels.length > 0) {
            // Gọi API khi format, năm hoặc trang thay đổi, nhưng không thay đổi pageIndex
            fetchTestCardByPage(categoryLabels[currentFormatIndex].format, currentYear, pageIndex);
        }
    }, [currentFormatIndex, currentYear, pageIndex, categoryLabels, fetchTestCardByPage]);

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



function GetLabel(): CategoryLabel[] {
    return [
        {
            format: "Video",
            year: [2020, 2021, 2022, 2023],
        },
        {
            format: "Audio",
            year: [2018, 2019, 2021, 2023],
        },
        {
            format: "PDF",
            year: [2019, 2020, 2023],
        },
        {
            format: "E-book",
            year: [2021, 2022],
        },
        {
            format: "Webinar",
            year: [2020, 2023, 2024],
        },
        {
            format: "Interactive Course",
            year: [2021, 2022, 2023],
        },
        {
            format: "Article",
            year: [2018, 2019, 2020, 2021],
        },
        {
            format: "Tutorial",
            year: [2017, 2019, 2021, 2023],
        },
        {
            format: "Podcast",
            year: [2020, 2022, 2023],
        },
        {
            format: "Workshop",
            year: [2021, 2022, 2023, 2024],
        },
    ];

}

function GetFakeData(): TestCard[] {
    return [
        {
            id: "671a25094dbe5f4c165c31dc",
            format: "Video",
            year: 2023,
            name: 'đề',
        },
        {
            id: "671a25094dbe5f4c165c31dc",
            format: "Audio",
            year: 2022,
            name: 'đề',
        },
        {
            id: "671a25094dbe5f4c165c31dc",
            format: "PDF",
            year: 2024,
            name: 'đề',
        },
        {
            id: "671a25094dbe5f4c165c31dc",
            format: "E-book",
            year: 2021,
            name: 'đề',
        },
        {
            id: "671a25094dbe5f4c165c31dc",
            format: "Webinar",
            year: 2023,
            name: 'đề',
        },
        {
            id: "671a25094dbe5f4c165c31dc",
            format: "Interactive Course",
            year: 2024,
            name: 'đề',
        },
        {
            id: "671a25094dbe5f4c165c31dc",
            format: "Article",
            year: 2020,
            name: 'đề',
        },
        {
            id: "671a25094dbe5f4c165c31dc",
            format: "Tutorial",
            year: 2023,
            name: 'đề',
        },
        {
            id: "671a25094dbe5f4c165c31dc",
            format: "Podcast",
            year: 2022,
            name: 'đề',
        },
        {
            id: "671a25094dbe5f4c165c31dc",
            format: "Workshop",
            year: 2024,
            name: 'đề',
        },
    ];
}