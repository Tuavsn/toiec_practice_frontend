import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import useComments from '../../hooks/CommentSectionHook';









const userId = "12345"; // Simulated logged-in user ID

const CommentSection: React.FC = () => {

  const { state, dispatch } = useComments();
  if (!state.comments) {
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

        />
      </div>
    </div>
  );
};

export default CommentSection;
