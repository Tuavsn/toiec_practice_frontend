import React, { useReducer, useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Paginator } from 'primereact/paginator';
import axios from 'axios';

interface Comment {
  id: number;
  text: string;
  email: string;
  userId: string;
}

interface State {
  comments: Comment[];
  loading: boolean;
  page: number;
  totalRecords: number;
  newComment: string;
}

type Action =
  | { type: 'SET_COMMENTS'; payload: { comments: Comment[]; totalRecords: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_NEW_COMMENT'; payload: string }
  | { type: 'RESET_NEW_COMMENT' };

const initialState: State = {
  comments: [],
  loading: false,
  page: 0,
  totalRecords: 0,
  newComment: '',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_COMMENTS':
      return {
        ...state,
        comments: action.payload.comments,
        totalRecords: action.payload.totalRecords,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
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

  const { comments, loading, page, totalRecords, newComment } = state;

  const pageSize = 5;

  useEffect(() => {
    fetchComments(page, pageSize);
  }, [page]);

  const fetchComments = (page: number, size: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    axios
      .get('/api/comments', { params: { page: page + 1, size } })
      .then((response) => {
        dispatch({
          type: 'SET_COMMENTS',
          payload: { comments: response.data.data, totalRecords: response.data.total },
        });
      })
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
  };

  const addComment = () => {
    if (newComment.trim() === '') return;
    dispatch({ type: 'SET_LOADING', payload: true });

    const commentData = {
      text: newComment,
      author: 'Anonymous',
      userId,
    };

    axios
      .post('/api/comments', commentData)
      .then(() => {
        fetchComments(page, pageSize); // Reload current page after adding
        dispatch({ type: 'RESET_NEW_COMMENT' });
      })
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
  };

  const deleteComment = (commentId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    axios
      .delete(`/api/comments/${commentId}`)
      .then(() => {
        fetchComments(page, pageSize); // Reload current page after deleting
      })
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
  };

  return (
    <div className="p-m-4">
      <h2>Comments</h2>

      <div className="p-grid p-mb-3">
        {comments.map((comment) => (
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

      <Paginator
        first={page * pageSize}
        rows={pageSize}
        totalRecords={totalRecords}
        onPageChange={(e) => dispatch({ type: 'SET_PAGE', payload: e.page })}
      />

      <div className="p-d-flex p-flex-column p-mt-3">
        <InputTextarea
          value={newComment}
          onChange={(e) => dispatch({ type: 'SET_NEW_COMMENT', payload: e.target.value })}
          rows={4}
          placeholder="Write a comment..."
        />
        <Button
          label="Submit"
          icon="pi pi-send"
          className="p-mt-2"
          onClick={addComment}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default CommentSection;
