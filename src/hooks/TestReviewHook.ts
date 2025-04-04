import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { callGetReviewTestPaper } from "../api/api";
import { MappingPageWithQuestionNumReview } from "../utils/helperFunction/convertToHTML";
import SetWebPageTitle from "../utils/helperFunction/setTitlePage";
import { TestReviewHookAction } from "../utils/types/action";
import { initialTestReviewState } from "../utils/types/emptyValue";
import { TestReviewHookState } from "../utils/types/state";
import { ResultID, TestReviewAnswerSheet } from "../utils/types/type";


// Reducer để quản lý trạng thái của TestReview
const reducer = (state: TestReviewHookState, action: TestReviewHookAction): TestReviewHookState => {
    switch (action.type) {
        case "FETCH_TEST_REVIEW_SUCCESS": {
            const [testReviewPaper, newPageMapper] = action.payload;
            return {
                ...state,
                testReviewAnswerSheet: testReviewPaper,
                pageMapper: newPageMapper
            };
        }
        case "SET_ANSWER_SHEET_VISIBLE":
            return { ...state, isUserAnswerSheetVisible: action.payload };

        case "SET_PAGE":
            return { ...state, currentPageIndex: action.payload };

        case "MOVE_PAGE":
            return { ...state, currentPageIndex: state.currentPageIndex + action.payload };

        default:
            return state;
    }
};

export default function useTestReview() {
    const [state, dispatch] = useReducer(reducer, initialTestReviewState);
    // Lấy ID từ URL
    const { id = "" } = useParams<{ id: ResultID }>();

    // Sử dụng useEffect để tải dữ liệu
    useEffect(() => {
        SetWebPageTitle("Chi tiết kết quả bài làm")
        // Thử tải dữ liệu từ sessionStorage
        const loadFromSessionStorage = () => {
            try {
                const testReviewPaper: TestReviewAnswerSheet = JSON.parse(sessionStorage.getItem('review') || "");
                const pageMapper = MappingPageWithQuestionNumReview(testReviewPaper);
                dispatch({
                    type: "FETCH_TEST_REVIEW_SUCCESS",
                    payload: [testReviewPaper, pageMapper]
                });
            } catch {
                return false; // Nếu thất bại, trả về false
            }
            return true; // Nếu thành công, trả về true
        };

        // Nếu không tìm thấy trong sessionStorage, gọi API để lấy dữ liệu
        const loadFromApi = async () => {
            try {
                const testReviewPaper = await callGetReviewTestPaper(id);
                if (testReviewPaper) {
                    const pageMapper = MappingPageWithQuestionNumReview(testReviewPaper);
                    dispatch({
                        type: "FETCH_TEST_REVIEW_SUCCESS",
                        payload: [testReviewPaper, pageMapper]
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu từ API:", error);
            }
        };

        // Gọi load dữ liệu từ sessionStorage hoặc API
        if (!loadFromSessionStorage()) {
            loadFromApi();
        }
    }, [id]); // Phụ thuộc vào ID từ URL

    return {
        state,
        dispatch,
    };
}

