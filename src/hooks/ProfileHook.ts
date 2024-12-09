import { useEffect, useReducer, useRef } from "react";
import { callGetProfile } from "../api/api";
import SetWebPageTitle from "../utils/setTitlePage";
import { initProfile } from "../utils/types/emptyValue";
import { ProfileHookState, SuggestionsForUser } from "../utils/types/type";





type ProfileHookAction =
    | { type: 'FETCH_SUCCESS', payload: ProfileHookState }
    | { type: 'SET_PAGE', payload: number }

const reducer = (state: ProfileHookState, action: ProfileHookAction): ProfileHookState => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...action.payload }
        case 'SET_PAGE':
            return { ...state }
        default:
            return state;
    }
};

export default function useProfile() {
    const [state, dispatch] = useReducer(reducer, initProfile);
    const targetRef = useRef<number>(-1);
    useEffect(() => {
        SetWebPageTitle("Trang cá nhân")
        callGetProfile().then(result => {
            if (!result) {
                return;
            }
            targetRef.current = result.target;
            dispatch({ type: "FETCH_SUCCESS", payload: result })
        }
        );
    }, [])
    return {
        state,
        targetRef,
    }
}

export function GetFakeSuggestionData(): SuggestionsForUser[] {
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