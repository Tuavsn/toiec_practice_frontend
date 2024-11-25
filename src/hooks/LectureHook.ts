import { useCallback, useEffect, useReducer } from "react";
import { initialLectureState } from "../utils/types/emptyValue";
import { LectureHookAction, LectureHookState } from "../utils/types/type";


const reducer = (state: LectureHookState, action: LectureHookAction): LectureHookState => {
    switch (action.type) {
        case 'FETCH_LECTURE_SUCCESS':
            return { ...state, lectures: action.payload }
        case 'SET_PAGE':
            return { ...state, currentPageIndex: action.payload }
        case 'TOGGLE_DIALOG':
            return { ...state, job: action.payload }
        case 'OPEN_UPDATE_DIALOG':
            return { ...state, job: "UPDATE", currentSelectedLecture: action.payload }
        case 'OPEN_DELETE_DIALOG':
            return { ...state, job: "DELETE", currentSelectedLecture: action.payload }
        default:
            return state;
    }
}

export default function useLecture() {
    const [state, dispatch] = useReducer(reducer, initialLectureState);

    const fetchLectures = useCallback(async (pageNumber: number) => {
        try {
            const response = await fetch(`https://dummyjson.com/c/41e4-b615-4556-a191?page=${pageNumber}`);
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const data = await response.json();
            dispatch({ type: "FETCH_LECTURE_SUCCESS", payload: data });
        } catch (err) {
            console.error("không tải được khóa");

        }
    }, [])
    useEffect(() => {

        fetchLectures(state.currentPageIndex);

    }, [state.currentPageIndex]);



    return {
        state,
        dispatch,
    }
}