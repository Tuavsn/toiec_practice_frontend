import { useEffect, useReducer, useRef } from 'react';
import { callGetComments } from '../api/api';
import { UserCommentAction, UserCommentState } from '../utils/types/type';
import { PaginatorPageChangeEvent } from 'primereact/paginator';



const initialState: UserCommentState = {
  comments: [],
  currentPageIndex: 0,
};

const reducer = (state: UserCommentState, action: UserCommentAction): UserCommentState => {
  switch (action.type) {
    case 'SET_COMMENTS':
      return {
        ...state, comments: action.payload
      };
    case 'FETCH_COMMENTS':
      const [newComments, newPageNumber] = action.payload;
      return {
        ...state, comments: newComments, currentPageIndex: newPageNumber
      };
    case 'SET_PAGE':
      return { ...state, currentPageIndex: action.payload };
    default:
      return state;
  }
};

export default function useComments() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const totalItems = useRef<number>(0);

  useEffect(() => {
    fetchComments(state.currentPageIndex);
  }, [state.currentPageIndex]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    dispatch({ type: 'SET_COMMENTS', payload: null })
    dispatch({ type: 'SET_PAGE', payload: event.page })

  }

  const fetchComments = (page: number) => {
    callGetComments(page).then(result => {
      if (result) {
        totalItems.current = result.meta.totalItems;
        dispatch({ type: 'FETCH_COMMENTS', payload: [result.result, page] })
      }
    })
  };


  return {
    state,
    dispatch,
    totalItems,
    onPageChange
  };
};
