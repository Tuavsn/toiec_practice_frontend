import { useEffect, useReducer } from 'react';
import { callGetComments } from '../api/api';
import { UserCommentAction, UserCommentState } from '../utils/types/type';



const initialState: UserCommentState = {
  comments: [],
  page: 0,
  totalRecords: 0,
  newComment: '',
};

const reducer = (state: UserCommentState, action: UserCommentAction): UserCommentState => {
  switch (action.type) {
    case 'SET_COMMENTS':
      return {
        ...state, comments: action.payload
      };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_NEW_COMMENT':
      return { ...state, newComment: action.payload };
    case 'RESET_NEW_COMMENT':
      return { ...state, newComment: '' };
    default:
      return state;
  }
};

export default function useComments() {
  const [state, dispatch] = useReducer(reducer, initialState);


  useEffect(() => {
    dispatch({ type: 'SET_COMMENTS', payload: null });
    fetchComments(state.page);
  }, [state.page]);

  const fetchComments = (page: number) => {
    callGetComments(page).then(result => { if (result) dispatch({ type: 'FETCH_COMMENTS', payload: [result.result, result.meta.totalItems] }) })
  };


  return { state, dispatch };
};
