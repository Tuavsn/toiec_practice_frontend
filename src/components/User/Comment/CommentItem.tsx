// Filename: src/features/comments/components/CommentItem.tsx
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog'; // For delete confirmation
import { Tag } from 'primereact/tag'; // Optional for other indicators
import React from 'react';

import formatDate from '../../../utils/helperFunction/formatDateToString';
import { Comment_t, DeleteReason, Meta } from '../../../utils/types/type';
import CommentContentRenderer from './CommentContentRenderer';
import CommentForm from './CommentForm'; // The form for replying

//------------------------------------------------------
// Định nghĩa Types cho Props
//------------------------------------------------------
export interface CommentItemProps {
  comment: Comment_t;
  currentUserId: string | null;
  potentialMentionedUsers: Array<{ id: string; name: string; avatar?: string }>; // For CommentContentRenderer & reply form

  // Actions
  onToggleLike: (commentId: string) => void;
  onDeleteComment: (commentId: string, reason: DeleteReason, parentId?: string | null) => void;

  // Reply handling for this specific comment (if it's a root comment)
  onShowReplyForm?: (parentId: string) => void; // Tells hook to set this comment.id as activeReplyParentId
  isReplyFormVisible?: boolean; // True if form to reply TO THIS comment is visible
  onPostReply?: (text: string, mentionedUserIds: string[], parentId: string) => Promise<void | unknown>;
  isPostingReply?: boolean; // Loading state for the reply form

  // Handling display of replies TO THIS comment
  onShowReplies?: (parentId: string, currentReplyPage?: number) => void; // To load/show replies
  // Replies to this comment are passed down and rendered by CommentSection directly after this item.
  // This item only needs to trigger loading/showing them.
  // We can show a "hide replies" button if they are visible for this parent.
  areRepliesVisible?: boolean; // True if replies for THIS comment are currently shown by parent
  isLoadingReplies?: boolean; // True if replies for THIS comment are being loaded
  replyMeta?: Meta | null; // Pagination for this comment's replies
}

interface MentionUser {
  id: string;
  name: string;
  avatar?: string;
}


//------------------------------------------------------
// Component hiển thị một mục bình luận
//------------------------------------------------------
const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  potentialMentionedUsers,
  onToggleLike,
  onDeleteComment,
  onShowReplyForm,
  isReplyFormVisible,
  onPostReply,
  isPostingReply,
  onShowReplies,
  areRepliesVisible,
  isLoadingReplies,
  replyMeta,
}) => {
  const isOwner = comment.userId === currentUserId;
  const canReplyToThisComment = comment.level === 0; // Only root comments can be replied to

  //------------------------------------------------------
  // Xử lý xóa bình luận với xác nhận
  //------------------------------------------------------
  const handleDelete = () => {
    confirmDialog({
      message: 'Bạn có chắc chắn muốn xóa bình luận này không?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptClassName: 'p-button-danger',
      accept: () => onDeleteComment(comment.id, DeleteReason.USER_DELETE, comment.parentId),
    });
  };

  //------------------------------------------------------
  // Xử lý nhấn nút "Phản hồi"
  //------------------------------------------------------
  const handleReplyClick = () => {
    if (onShowReplyForm) {
      onShowReplyForm(comment.id); // This will set activeReplyParentId to comment.id
    }
  };

  //------------------------------------------------------
  // Xử lý khi form phản hồi được submit
  //------------------------------------------------------
  const handleReplySubmit = async (text: string, mentionedUserIds: string[]) => {
    if (onPostReply) {
      await onPostReply(text, mentionedUserIds, comment.id);
      // The form itself might be hidden by the hook resetting activeReplyParentId
    }
  };

  //------------------------------------------------------
  // Xử lý nhấn nút "Xem phản hồi" / "Ẩn phản hồi"
  //------------------------------------------------------
  const handleToggleRepliesVisibility = () => {
    if (onShowReplies) {
      // If replies are visible, calling with parentId might mean "hide" or "refresh page 1"
      // If not visible, it means "show/load page 1"
      // The hook's toggleRepliesVisibility handles this logic.
      // We pass current reply page if we want to load next page. For initial toggle, it's page 1.
      onShowReplies(comment.id, areRepliesVisible ? undefined : 1);
    }
  };

  const renderViewRepliesButton = () => {
    if (!onShowReplies || comment.directReplyCount === 0) return null;

    const buttonLabel = areRepliesVisible
      ? `Ẩn phản hồi`
      : `Xem ${comment.directReplyCount} phản hồi`;

    return (
      <Button
        label={buttonLabel}
        icon={isLoadingReplies ? "pi pi-spin pi-spinner" : (areRepliesVisible ? "pi pi-chevron-up" : "pi pi-chevron-down")}
        className="p-button-text p-button-sm text-xs ml-auto" /* Align to right of actions */
        onClick={handleToggleRepliesVisibility}
        disabled={isLoadingReplies}
      />
    );
  }

  const likeButtonTooltip = comment.likedByCurrentUser ? "Bỏ thích" : "Thích";
  const likeButtonIcon = comment.likedByCurrentUser ? "pi pi-heart-fill" : "pi pi-heart";
  const likeButtonClass = comment.likedByCurrentUser ? "p-button-danger p-button-text" : "p-button-secondary p-button-text";


  return (
    <div className={`comment-item py-3 ${comment.level > 0 ? 'ml-5 pl-4 border-left-2 surface-border' : ''}`}>
      {/* Global ConfirmDialog needed for confirmDialog() to work */}
      {/* <ConfirmDialog /> */} {/* Add this if you want local control, or ensure global one exists */}

      <div className="flex align-items-start mb-2">
        <Avatar
          image={comment.userAvatarUrl || undefined}
          label={comment.userDisplayName ? comment.userDisplayName[0].toUpperCase() : 'U'}
          shape="circle"
          size="large"
          className="mr-3 flex-shrink-0"
          style={{ backgroundColor: '#007bff', color: '#ffffff' }} // Default avatar style
        />
        <div className="flex-grow-1">
          <div className="flex align-items-center justify-content-between">
            <span className="font-semibold text-sm">{comment.userDisplayName || 'Người dùng ẩn danh'}</span>
            {comment.deleted && <Tag severity="warning" value="Đã xóa" className="ml-2 text-xs"></Tag>}
          </div>
          <div className={`text-sm surface-content ${comment.deleted ? 'italic text-color-secondary' : ''} mt-1 break-word`}>
            {comment.deleted
              ? (comment.deleteReason || 'Bình luận này đã bị xóa.')
              : <CommentContentRenderer content={comment.content} potentialMentionedUsers={potentialMentionedUsers} />
            }
          </div>
          <div className="comment-actions text-xs text-color-secondary mt-2 flex align-items-center">
            <Button
              icon={likeButtonIcon}
              className={`${likeButtonClass} p-button-rounded p-button-sm mr-1`}
              onClick={() => onToggleLike(comment.id)}
              tooltip={likeButtonTooltip}
              tooltipOptions={{position: 'top'}}
            />
            <span className="mr-3">{comment.likeCounts > 0 ? comment.likeCounts : ''}</span>

            {canReplyToThisComment && onShowReplyForm && (
              <Button
                label="Phản hồi"
                icon="pi pi-reply"
                className="p-button-text p-button-sm mr-3 text-xs"
                onClick={handleReplyClick}
              />
            )}
            {isOwner && !comment.deleted && (
              <Button
                label="Xóa"
                icon="pi pi-trash"
                className="p-button-text p-button-danger p-button-sm mr-3 text-xs"
                onClick={handleDelete}
              />
            )}
            <span className="ml-auto text-xs">{formatDate(comment.createdAt)}</span>
          </div>
            {/* Button to show/hide replies for this comment (if it's a root comment) */}
            {canReplyToThisComment && comment.directReplyCount > 0 && renderViewRepliesButton()}
        </div>
      </div>


      {/* Form để trả lời bình luận này */}
      {canReplyToThisComment && isReplyFormVisible && onPostReply && (
        <div className="ml-5 pl-4 mt-2"> {/* Indent reply form */}
          <CommentForm
            onSubmit={handleReplySubmit}
            placeholder={`Trả lời ${comment.userDisplayName || 'người dùng'}...`}
            isLoading={isPostingReply || false}
            mentionSuggestions={potentialMentionedUsers}
            onCancel={() => onShowReplyForm && onShowReplyForm(comment.id)} // Click reply again to close
            autoFocus={true}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;