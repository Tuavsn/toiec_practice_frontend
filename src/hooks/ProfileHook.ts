import { useCallback, useEffect, useRef, useState } from "react";
import { SuggestionsForUser, TestResultSummary, TopicRecord, UserDetailResultRow } from "../utils/types/type";
import { callGetUserDetailResultList } from "../api/api";
import { PaginatorPageChangeEvent } from "primereact/paginator";

export const useProfilePage = () => {
    const averageListeningScore = 280;
    const averageReadingScore = 430;
    const toeicPartsInsightView = GetFakePartsInsightView();
    const timeSpentOnParts = [600, 543, 685, 136, 30]; // đơn vị giây
    // tính giá trị nhỏ nhất mà có thể được vẽ lên biểu đồ
    const smallestAmount = timeSpentOnParts.reduce((p, c) => c = c + p) / 100;
    const suggestionsForCurrentUser = GetFakeSuggestionData();
    return {
        averageListeningScore,
        averageReadingScore,
        toeicPartsInsightView,
        timeSpentOnParts,
        smallestAmount,
        suggestionsForCurrentUser
    }
}

export const useActiveLog = () => {
    const [dataForTable, setDataForTable] = useState<UserDetailResultRow[]>([]);
    const totalItems = useRef<number>(0);
    const [currentPageIndex, setCurrentPageIndex] = useState(-1);
    // === Hàm xử lý thay đổi trang ===
    const onPageChange = async (event: PaginatorPageChangeEvent) => {
        // Gọi fetchQuestionByPage với trang mới
        await fetchData(event.page);
        console.log(currentPageIndex, "-", event.page);

    }
    const fetchData = async (pageNumber: number) => {
        try {
            const userResultData = await callGetUserDetailResultList(pageNumber);
            const result: UserDetailResultRow[] = tempConvertToActiveLog(userResultData.data.result);
            setDataForTable(result);
            totalItems.current = userResultData.data.meta.totalItems;
            setCurrentPageIndex(pageNumber);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData(0);
    }, [])
    return { dataForTable, totalItems, currentPageIndex, onPageChange };
}

function GetFakeSuggestionData(): SuggestionsForUser[] {
    return [
        {
            title: "Khóa học luyện tập Nghe cơ bản",
            content: "Dành cho người mới bắt đầu, giúp bạn cải thiện khả năng nghe với các bài tập dễ và trung cấp, tăng cường vốn từ vựng cơ bản và nắm vững cấu trúc câu."
        },
        {
            title: "Bài kiểm tra mẫu - Đọc hiểu",
            content: "Luyện tập với các dạng câu hỏi thường gặp trong phần Đọc hiểu TOEIC như tìm từ đồng nghĩa, đọc đoạn văn ngắn và phân tích thông tin chính xác."
        },
        {
            title: "Từ vựng chủ đề Kinh doanh",
            content: "Học từ vựng về kinh doanh và thương mại – các chủ đề phổ biến trong kỳ thi TOEIC. Cải thiện từ vựng giúp bạn dễ dàng hiểu các đoạn hội thoại trong bối cảnh công việc."
        },
        {
            title: "Khóa học: Cải thiện kỹ năng Đọc",
            content: "Dành cho người cần cải thiện khả năng đọc hiểu, khóa học cung cấp các bài tập nâng cao kỹ năng phân tích câu và hiểu ngữ cảnh của đoạn văn."
        },
        {
            title: "Bài kiểm tra mẫu - Nghe hiểu",
            content: "Luyện tập với các câu hỏi nghe hiểu TOEIC thực tế, bao gồm nghe và phân tích thông tin trong đoạn hội thoại, tăng khả năng nghe và hiểu trong bối cảnh công việc."
        }
    ];
}

function GetFakePartsInsightView(): TopicRecord[][] {
    return [
        // Part 1 - Hình ảnh
        [
            { topic: "#cauHoiHinhAnh", correctCount: 10, wrongCount: 2, correctPercent: 30 },
            { topic: "#moTaSuKien", correctCount: 8, wrongCount: 3, correctPercent: 43 },
            { topic: "#moTaNguoi", correctCount: 12, wrongCount: 4, correctPercent: 30 },
            { topic: "#moTaVatDung", correctCount: 15, wrongCount: 2, correctPercent: 34 },
            { topic: "#hinhAnhDoiTuong", correctCount: 9, wrongCount: 3, correctPercent: 87 },
        ],
        // Part 2 - Hỏi đáp
        [
            { topic: "#cauHoiLuaChon", correctCount: 14, wrongCount: 5, correctPercent: 55 },
            { topic: "#cauHoiYesNo", correctCount: 11, wrongCount: 4, correctPercent: 77 },
            { topic: "#cauHoiTrucTiep", correctCount: 17, wrongCount: 6, correctPercent: 99 },
            { topic: "#hoiLaiCauHoi", correctCount: 13, wrongCount: 3, correctPercent: 0 },
            { topic: "#traLoiGianTiep", correctCount: 10, wrongCount: 5, correctPercent: 54 },
            { topic: "#phucHoiCauTraLoi", correctCount: 8, wrongCount: 7, correctPercent: 30 },
        ],
        // Part 3 - Hội thoại
        [
            { topic: "#hoiThoaiHangNgay", correctCount: 16, wrongCount: 3, correctPercent: 30 },
            { topic: "#hoiThoaiCongViec", correctCount: 9, wrongCount: 4, correctPercent: 30 },
            { topic: "#hoiThoaiGiaDinh", correctCount: 12, wrongCount: 5, correctPercent: 30 },
            { topic: "#hoiThoaiGiaoDich", correctCount: 15, wrongCount: 6, correctPercent: 30 },
            { topic: "#hoiThoaiLichSu", correctCount: 8, wrongCount: 3, correctPercent: 30 },
            { topic: "#hoiThoaiVanPhong", correctCount: 10, wrongCount: 7, correctPercent: 30 },
        ],
        // Part 4 - Đoạn văn ngắn
        [
            { topic: "#docThongBao", correctCount: 14, wrongCount: 3, correctPercent: 30 },
            { topic: "#docQuangCao", correctCount: 11, wrongCount: 5, correctPercent: 30 },
            { topic: "#docTinTuc", correctCount: 13, wrongCount: 2, correctPercent: 30 },
            { topic: "#docHuongDan", correctCount: 10, wrongCount: 6, correctPercent: 30 },
            { topic: "#docBaoCao", correctCount: 9, wrongCount: 4, correctPercent: 30 },
            { topic: "#docBieuDo", correctCount: 12, wrongCount: 5, correctPercent: 30 },
        ],
        // Part 5 - Hoàn thành câu
        [
            { topic: "#dienNguPhap", correctCount: 13, wrongCount: 4, correctPercent: 30 },
            { topic: "#dienTuVung", correctCount: 17, wrongCount: 2, correctPercent: 30 },
            { topic: "#dienCumTu", correctCount: 15, wrongCount: 3, correctPercent: 30 },
            { topic: "#dienThanhNgu", correctCount: 8, wrongCount: 7, correctPercent: 30 },
            { topic: "#dienDongTuKhuyetThieu", correctCount: 12, wrongCount: 5, correctPercent: 30 },
        ],
        // Part 6 - Hoàn thành đoạn văn
        [
            { topic: "#dienDoanVan", correctCount: 11, wrongCount: 6, correctPercent: 30 },
            { topic: "#dienThieu", correctCount: 14, wrongCount: 3, correctPercent: 30 },
            { topic: "#dienCauHinh", correctCount: 9, wrongCount: 4, correctPercent: 30 },
            { topic: "#dienNguyenNhanKetQua", correctCount: 13, wrongCount: 5, correctPercent: 30 },
            { topic: "#dienTinhTu", correctCount: 15, wrongCount: 2, correctPercent: 30 },
        ],
        // Part 7 - Đọc hiểu đoạn văn
        [
            { topic: "#doanVanDonLe", correctCount: 18, wrongCount: 2, correctPercent: 30 },
            { topic: "#doanVanNhieuDoan", correctCount: 10, wrongCount: 6, correctPercent: 30 },
            { topic: "#cauHoiYChinh", correctCount: 11, wrongCount: 5, correctPercent: 30 },
            { topic: "#cauHoiChiTiet", correctCount: 13, wrongCount: 4, correctPercent: 30 },
            { topic: "#cauHoiThongTin", correctCount: 14, wrongCount: 3, correctPercent: 30 },
            { topic: "#cauHoiSuyLuan", correctCount: 9, wrongCount: 6, correctPercent: 30 },
            { topic: "#cauHoiNoiDung", correctCount: 12, wrongCount: 3, correctPercent: 30 },
        ],
    ]

}
function tempConvertToActiveLog(results: TestResultSummary[]): UserDetailResultRow[] {
    function convertTestResultSummaryToUserDetailResultRow(
        summary: TestResultSummary
    ): UserDetailResultRow {
        return {
            id: summary.id,
            createdAt: new Date(), // set to current date if missing
            totalCorrectAnswer: summary.totalCorrectAnswer ?? Math.floor(Math.random() * 100), // random if missing
            totalTime: summary.totalTime ?? Math.floor(Math.random() * 6000), // random if missing
            type: summary.type, // assumes TestType is defined
            parts: summary.parts ? JSON.parse(summary.parts) : Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)), // parse or random array
            testFormatAndYear: `${summary.type}-${new Date().getFullYear()}`, // example format based on type
            totalReadingScore: summary.totalReadingScore ?? Math.floor(Math.random() * 50),
            totalListeningScore: summary.totalListeningScore ?? Math.floor(Math.random() * 50),
            totalIncorrectAnswer: summary.totalIncorrectAnswer ?? Math.floor(Math.random() * 100),
            totalSkipAnswer: summary.totalSkipAnswer ?? Math.floor(Math.random() * 50),
        };
    }
    return results.map((result => {
        return convertTestResultSummaryToUserDetailResultRow(result)
    }))
}
