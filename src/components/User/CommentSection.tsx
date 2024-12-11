import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useReducer } from 'react';
import { callGetComments } from '../../api/api';
import { UserCommentAction, UserCommentID, UserCommentState } from '../../utils/types/type';







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

const userId = "12345"; // Simulated logged-in user ID

const CommentSection: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);


  useEffect(() => {
    dispatch({ type: 'SET_COMMENTS', payload: null });
    fetchComments(state.page);
  }, [state.page]);

  const fetchComments = (page: number) => {
    callGetComments(page).then(result => { if (result) dispatch({ type: 'FETCH_COMMENTS', payload: [result.result, result.meta.totalItems] }) })
  };

  const addComment = () => {
   
  };

  const deleteComment = (commentId: UserCommentID) => {
   
  };
  if(!state.comments){
    return <>không có</>
  }
  return (
    <div className="p-m-4">
      <h2>Comments</h2>

      <div className="p-grid p-mb-3">
        {state.comments.map((comment) => (
          <div key={comment.id} className="p-col-12 p-mb-2">
            <Card
              title={comment.email}
              footer={
                comment.userId === userId ? (
                  <Button
                    label="Delete"
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={() => deleteComment(comment.id)}
                  />
                ) : null
              }
            >
              <p>{comment.text}</p>
            </Card>
          </div>
        ))}
      </div>

      <div className="p-d-flex p-flex-column p-mt-3">
        <InputTextarea
          value={""}
          onChange={(e) => dispatch({ type: 'SET_NEW_COMMENT', payload: e.target.value })}
          rows={4} maxLength={2000}
          placeholder="Write a comment..."
        />
        <Button
          label="Submit"
          icon="pi pi-send"
          className="p-mt-2"
          onClick={addComment}
        />
      </div>
    </div>
  );
};

export default CommentSection;
