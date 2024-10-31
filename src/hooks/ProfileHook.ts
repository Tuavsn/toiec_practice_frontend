import { useEffect, useState } from "react";
import { SuggestionsForUser, UserDetailResultRow } from "../utils/types/type";
import { callGetUserDetailResultList } from "../api/api";

export const useProfilePage = () => {
    const averageListeningScore = 280;
    const averageReadingScore = 430;
    const toeicPartsInsightView = [75, 77, 61, 54, 60, 67, 89];
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResultData = await callGetUserDetailResultList();
                setDataForTable(userResultData.data.result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [])
    return { dataForTable };
}

function GetFakeSuggestionData(): SuggestionsForUser[]{
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