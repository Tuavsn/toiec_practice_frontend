import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import React, { useRef } from 'react';
import useComments from '../../hooks/CommentSectionHook';
import { GetMyIDUser } from '../../utils/helperFunction/AuthCheck';
import { UserCommentAction } from '../../utils/types/action';
import { UserComment, UserID } from '../../utils/types/type';

const CommentSection: React.FC = () => {

  const {
    state,
    dispatch,
    onPageChange,
    totalItems
  } = useComments();


  return (
    <div className="p-4">
      <h1>Bình luận</h1>
      <CommentList comments={state.comments} dispatch={dispatch} />
      <Paginator first={state.currentPageIndex * 5} rows={5} totalRecords={totalItems.current} onPageChange={onPageChange} />
      <NewUserCommentTextArea dispatch={dispatch} />
    </div>
  );
};

export default CommentSection;


const CommentList: React.FC<{
  comments: UserComment[] | null, dispatch: React.Dispatch<UserCommentAction>
}> = React.memo(
  (props) => {
    const myUserID = useRef<UserID>(GetMyIDUser());
    //------------------------------------------------------------
    if (props.comments === null) {
      return (
        <section className='flex flex-column gap-3 pl-3'>
          <Skeleton width="75%" height="5rem"></Skeleton><Skeleton width="75%" height="5rem"></Skeleton><Skeleton width="75%" height="5rem"></Skeleton>
        </section>
      )
    }
    //------------------------------------------------------------
    if (props.comments.length === 0) {
      return <>không có bình luận nào</>
    }
    //------------------------------------------------------------
    return (
      <section className="flex flex-column gap-3  w-full md:w-8 pl-3">
        {props.comments.map((comment) => (
          <div key={comment.id} className='shadow-5 hover:shadow-8 border-solid border-blue-100'>
            <CommentHeader email={comment.email} id={comment.id} text={comment.text} userId={comment.userId} />
            <p className='pl-3 white-space-normal family-font'>{comment.text}</p>
            <CommentFooter isMyComment={comment.userId === myUserID.current} dispatch={props.dispatch} />
          </div>
        ))}
      </section>
    )
  }
)

const CommentFooter: React.FC<{
  isMyComment: boolean, dispatch: React.Dispatch<UserCommentAction>
}> = React.memo(
  (props) => {
    return (
      <footer>
        {
          props.isMyComment &&
          <Button severity='danger' className='ml-auto block py-0' text label='xóa' />
        }
      </footer>
    )
  }
)

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

const NewUserCommentTextArea: React.FC<{ dispatch: React.Dispatch<UserCommentAction> }> = React.memo((props) => {
  //----------------------------------------
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  //----------------------------------------
  return (
    <div className="flex flex-column mt-3 w-full md:w-8">
      <InputTextarea
        ref={textareaRef}
        className="block pb-5 w-full"
        rows={4}
        cols={10}
        maxLength={1000}
        placeholder="Để lại cảm nghĩ..."
        style={{ resize: "none" }}
      />
      <Button
        icon="pi pi-send"
        className="mt-2 align-self-end"
        onClick={() => {
          props.dispatch({type: "REFRESH_DATA"})
          console.log(textareaRef.current?.value);
          textareaRef.current!.value = "";
        }
        }
      />
    </div>
  );
});
