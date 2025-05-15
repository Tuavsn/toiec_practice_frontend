"use client"

import { useCallback, useReducer } from "react"
import { fetchComments } from "../api/api"
import { Comment_t, Meta } from "../utils/types/type"

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
    default:
      return state
  }
}

export const useCommentList = (testId: string) => {
  const [state, dispatch] = useReducer(commentsReducer, initialState)

  const loadComments = useCallback(
    async (page = 1) => {
      dispatch({ type: "FETCH_START" })

      const result = await fetchComments(testId, page)

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
          payload:  "Failed to fetch comments",
        })
      }
    },
    [testId],
  )

  const removeComment = useCallback((id: string) => {
    dispatch({ type: "REMOVE_COMMENT", payload: id })
  }, [])

  return {
    ...state,
    loadComments,
    removeComment,
  }
}
