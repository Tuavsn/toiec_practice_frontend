"use client"

import { useCallback, useReducer, useRef } from "react"
import { fetchRepliesList } from "../api/api"
import { Comment_t, Meta, TargetType } from "../utils/types/type"

type RepliesState = {
    replies: Record<string, Comment_t[]>
    loading: Record<string, boolean>
    error: Record<string, string | null>
    meta: Record<string, Meta | null>
}

type RepliesAction =
    | { type: "FETCH_START"; payload: string }
    | { type: "FETCH_SUCCESS"; payload: { parentId: string; replies: Comment_t[]; meta: Meta } }
    | { type: "FETCH_ERROR"; payload: { parentId: string; error: string } }
    | { type: "REMOVE_REPLY"; payload: { parentId: string; replyId: string } }
    | { type: "UPDATE_REPLY"; payload: { parentId: string; reply: Comment_t } }
    | { type: "ADD_REPLY"; payload: { parentId: string; reply: Comment_t } }

const initialState: RepliesState = {
    replies: {},
    loading: {},
    error: {},
    meta: {},
}

const repliesReducer = (state: RepliesState, action: RepliesAction): RepliesState => {
    switch (action.type) {
        case "FETCH_START":
            return {
                ...state,
                loading: { ...state.loading, [action.payload]: true },
                error: { ...state.error, [action.payload]: null },
            }
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: { ...state.loading, [action.payload.parentId]: false },
                replies: {
                    ...state.replies,
                    [action.payload.parentId]: action.payload.replies,
                },
                meta: {
                    ...state.meta,
                    [action.payload.parentId]: action.payload.meta,
                },
                error: { ...state.error, [action.payload.parentId]: null },
            }
        case "FETCH_ERROR":
            return {
                ...state,
                loading: { ...state.loading, [action.payload.parentId]: false },
                error: { ...state.error, [action.payload.parentId]: action.payload.error },
            }
        case "REMOVE_REPLY": {
            const parentReplies = state.replies[action.payload.parentId] || []
            return {
                ...state,
                replies: {
                    ...state.replies,
                    [action.payload.parentId]: parentReplies.filter((reply) => reply.id !== action.payload.replyId),
                },
            }
        }
        case "UPDATE_REPLY": {
            const parentReplies = state.replies[action.payload.parentId] || []
            return {
                ...state,
                replies: {
                    ...state.replies,
                    [action.payload.parentId]: parentReplies.map((reply) =>
                        reply.id === action.payload.reply.id ? action.payload.reply : reply,
                    ),
                },
            }
        }
        case "ADD_REPLY": {
            const parentReplies = state.replies[action.payload.parentId] || []
            return {
                ...state,
                replies: {
                    ...state.replies,
                    [action.payload.parentId]: [action.payload.reply, ...parentReplies],
                },
            }
        }
        default:
            return state
    }
}

export const useReplies = (targetType: TargetType, targetId: string) => {
    const [state, dispatch] = useReducer(repliesReducer, initialState)
    const abortControllerRef = useRef<AbortController | null>(null);
    const loadReplies = useCallback(
        async (
            parentId: string,
            page = 1,
            pageSize = 10,
            term?: string,
            sortBy?: string[],
            sortDirection?: string[],
            active?: boolean,
        ) => {
            dispatch({ type: "FETCH_START", payload: parentId })
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();
            const result = await fetchRepliesList(
                targetType,
                targetId,
                parentId,
                abortControllerRef.current.signal,
                page,
                pageSize,
                term,
                sortBy,
                sortDirection,
                active,
            )

            if (result) {
                dispatch({
                    type: "FETCH_SUCCESS",
                    payload: {
                        parentId,
                        replies: result.result,
                        meta: result.meta,
                    },
                })
            } else {
                dispatch({
                    type: "FETCH_ERROR",
                    payload: {
                        parentId,
                        error: "Failed to fetch replies",
                    },
                })
            }
        },
        [targetType, targetId],
    )

    const removeReply = useCallback((parentId: string, replyId: string) => {
        dispatch({ type: "REMOVE_REPLY", payload: { parentId, replyId } })
    }, [])

    const updateReply = useCallback((parentId: string, reply: Comment_t) => {
        dispatch({ type: "UPDATE_REPLY", payload: { parentId, reply } })
    }, [])

    const addReply = useCallback((parentId: string, reply: Comment_t) => {
        dispatch({ type: "ADD_REPLY", payload: { parentId, reply } })
    }, [])

    return {
        ...state,
        loadReplies,
        removeReply,
        updateReply,
        addReply,
    }
}
