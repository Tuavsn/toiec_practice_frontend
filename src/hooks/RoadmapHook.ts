"use client"

import { useEffect, useReducer } from "react"
import { fetchRoadmapData, fetchWordOfTheDay } from "../api/api"
import { distributeRoadmapItems } from "../utils/helperFunction/roadmapService"
import { RoadmapAction } from "../utils/types/action"
import { RoadmapState } from "../utils/types/state"

const initialState: RoadmapState = {
    wordOfTheDay: {
        word: "",
        phonetic: "",
        definition: "",
        example: "",
        audioUrl: ""
    },
    milestoneItems: [],
    loading: true,
    error: null,
}

const roadmapReducer = (state: RoadmapState, action: RoadmapAction): RoadmapState => {
    switch (action.type) {
        case "FETCH_START":
            return {
                ...state,
                loading: true,
                error: null,
            }
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                wordOfTheDay: action.payload.wordOfTheDay,
                milestoneItems: action.payload.milestoneItems,
                error: null,
            }
        case "FETCH_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        default:
            return state
    }
}

/**
 * Kết hợp lectures và tests thành một mảng milestoneItems có thứ tự.
 * Quy tắc: 4-5 bài giảng theo sau bởi 1 bài test, lặp lại.
 */


export const useRoadmap = () => {
    const [state, dispatch] = useReducer(roadmapReducer, initialState)

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_START" })

            try {
                // Fetch dữ liệu đồng thời
                const [roadmapData, wordData] = await Promise.all([fetchRoadmapData(), fetchWordOfTheDay()])

                if (!roadmapData) {
                    dispatch({
                        type: "FETCH_ERROR",
                        payload: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
                    })
                    return
                }

                const milestoneItems = distributeRoadmapItems(roadmapData.tests, roadmapData.lectures)

                dispatch({
                    type: "FETCH_SUCCESS",
                    payload: {
                        wordOfTheDay: wordData,
                        milestoneItems,
                    },
                })
            } catch (error) {
                dispatch({
                    type: "FETCH_ERROR",
                    payload: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
                })
            }
        }

        fetchData()
    }, [])

    return state
}
