import { useEffect, useLayoutEffect, useReducer, useRef } from "react"
import { callGetLectureCard } from "../api/api"
import SetWebPageTitle from "../utils/helperFunction/setTitlePage"
import { LectureCardAction } from "../utils/types/action"
import { initialLectureCardState } from "../utils/types/emptyValue"
import { LectureCardState } from "../utils/types/state"

const reducer = (state: LectureCardState, action: LectureCardAction): LectureCardState => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...state, lectures: action.payload }
        case 'SET_PAGE':
            return { ...state, currentPageIndex: action.payload }
        case 'SET_KEYWORD':
            return { ...state, keyword: action.payload }
        case 'RESET_ROWS':
            return { ...state, lectures: [] }
        default:
            return state;
    }
}
export default function useLectureCard() {
    const [state, dispatch] = useReducer(reducer, initialLectureCardState);
    const totalItemsRef = useRef<number>(-1);
    useLayoutEffect(() => SetWebPageTitle("Xem bài học"), [])
    useEffect(() => {
        const fetchLectures = async (pageIndex: number) => {
            dispatch({ type: "RESET_ROWS" });
            const response = await callGetLectureCard(pageIndex, state.keyword);
            if (response === null) {
                return;
            }
            totalItemsRef.current = response.meta.totalItems;
            dispatch({ type: "FETCH_SUCCESS", payload: response.result });
        }
        fetchLectures(state.currentPageIndex);
    }, [state.currentPageIndex, state.keyword])
    return {
        state,
        dispatch,
        totalItemsRef,
    }
}

