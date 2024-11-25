import { useCallback, useEffect, useReducer } from "react";
import { LectureHookAction, LectureHookState } from "../utils/types/type";



const initialState: LectureHookState = {
    lectures: [],
    currentPageIndex: 0,
    title: ""
}

const reducer = (state: LectureHookState, action: LectureHookAction): LectureHookState => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...state, lectures: action.payload }
        case 'SET_PAGE':
            return { ...state, currentPageIndex: action.payload }
        case 'TOGGLE_DIALOG':
            return { ...state, title: action.payload }
        default:
            return state;
    }
}

export default function useLecture() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const fetchCourses = useCallback(async (pageNumber: number) => {
        try {
            const response = await fetch(`https://dummyjson.com/c/41e4-b615-4556-a191?page=${pageNumber}`);
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const data = await response.json();
            dispatch({ type: "FETCH_SUCCESS", payload: data });
        } catch (err) {
            console.error("không tải được khóa");

        }
    }, [])
    useEffect(() => {
        fetchCourses(0);
    }, []);

    return {
        state,
        dispatch
    }
}