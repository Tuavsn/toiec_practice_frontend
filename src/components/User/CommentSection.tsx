import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useRef } from 'react';
import useComments from '../../hooks/CommentSectionHook';
import { Avatar } from 'primereact/avatar';
import { UserComment } from '../../utils/types/type';









const userId = "64dbf3817a6c9b1a1d9b0f33"; // Simulated logged-in user ID

const CommentSection: React.FC = () => {

  const { state, dispatch } = useComments();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  if (state.comments === null) {
    return <>không có</>
  }
  return (
    <div className="p-m-4">
      <h2>Bình luận</h2>

      <section className="flex flex-column gap-3 w-8 pl-3">
        {state.comments.map((comment) => (

          <div key={comment.id} className='shadow-5 hover:shadow-8'>
            <CommentHeader email={comment.email} id={comment.id} text={comment.text} userId={comment.userId} />
            <p className='pl-3 white-space-normal family-font'>{comment.text}</p>

          </div>

        ))}
      </section>

      <div className="w-8 flex flex-column mt-3">
        <InputTextarea ref={textareaRef}
          className=' block pb-5'
          rows={4} maxLength={1000}
          placeholder="Write a comment..."
          style={{resize: "none"}}
        />
        <Button
          icon="pi pi-send"
          className="mt-2 align-self-end"

        />
      </div>
    </div>
  );
};

export default CommentSection;


const CommentHeader: React.FC<UserComment> = React.memo(
  (comment) => {
    return (
      <header className='p-2 flex flex-row column-gap-4'>
        <div key={`avatar ${comment.id}`} className='align-self-center'>
          <Avatar label="P" size="large" shape="circle" className=' bg-blue-500' />
        </div>
        <span>
          <p className='family-font mb-1'><b>{comment.email}</b></p>
          <p className='text-gray-400 family-font text-sm mt-0 pl-3'>{"12-02-2032"}</p>
        </span>
      </header>
    )
  }
)