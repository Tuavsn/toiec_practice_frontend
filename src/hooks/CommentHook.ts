"use client"

import { useCallback, useReducer, useRef } from "react"
import { fetchRootCommentList } from "../api/api"
import { Comment_t, Meta, TargetType } from "../utils/types/type"

type CommentsState = {
  comments: Comment_t[]
  loading: boolean
  error: string | null
  meta: Meta | null
}

type CommentsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { comments: Comment_t[]; meta: Meta } }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "REMOVE_COMMENT"; payload: string }
  | { type: "UPDATE_COMMENT"; payload: Comment_t }
  | { type: "ADD_COMMENT"; payload: Comment_t }

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
  meta: null,
}

const commentsReducer = (state: CommentsState, action: CommentsAction): CommentsState => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null }
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        comments: action.payload.comments,
        meta: action.payload.meta,
        error: null,
      }
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload }
    case "REMOVE_COMMENT":
      return {
        ...state,
        comments: state.comments.filter((comment) => comment.id !== action.payload),
      }
    case "UPDATE_COMMENT":
      return {
        ...state,
        comments: state.comments.map((comment) => (comment.id === action.payload.id ? action.payload : comment)),
      }
    case "ADD_COMMENT":
      return {
        ...state,
        comments: [action.payload, ...state.comments],
      }
    default:
      return state
  }
}

export const useCommentList = (targetType: TargetType, targetId: string) => {
  const [state, dispatch] = useReducer(commentsReducer, initialState)
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadComments = useCallback(
    async (page = 1, pageSize = 10, term?: string, sortBy?: string[], sortDirection?: string[], active?: boolean) => {
      dispatch({ type: "FETCH_START" })
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const result = await fetchRootCommentList(targetType, targetId, abortControllerRef.current.signal, page, pageSize, term, sortBy, sortDirection, active)

      if (result) {
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            comments: result.result,
            meta: result.meta,
          },
        })
      } else {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Failed to fetch comments",
        })
      }
    },
    [targetType, targetId],
  )

  const removeComment = useCallback((id: string) => {
    dispatch({ type: "REMOVE_COMMENT", payload: id })
  }, [])

  const updateComment = useCallback((comment: Comment_t) => {
    dispatch({ type: "UPDATE_COMMENT", payload: comment })
  }, [])

  const addComment = useCallback((comment: Comment_t) => {
    dispatch({ type: "ADD_COMMENT", payload: comment })
  }, [])

  return {
    ...state,
    loadComments,
    removeComment,
    updateComment,
    addComment,
  }
}
