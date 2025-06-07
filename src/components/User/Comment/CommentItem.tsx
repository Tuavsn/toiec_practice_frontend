// Filename: src/features/comments/components/CommentItem.tsx
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog'; // For delete confirmation
import { Tag } from 'primereact/tag'; // Optional for other indicators
import React from 'react';

import { getReportReasonText } from '../../../utils/helperFunction/DeleteReasonEnumToLabel';
import formatDate from '../../../utils/helperFunction/formatDateToString';
import { CommentItemProps } from '../../../utils/types/props';
import { DeleteReason } from '../../../utils/types/type';
import UserAvatar from '../Avatar/UserAvatar';
import CommentContentRenderer from './CommentContentRenderer';
import CommentForm from './CommentForm'; // The form for replying

//------------------------------------------------------
// Định nghĩa Types cho Props
//------------------------------------------------------



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
  onOpenReportDialog,
  amINotLoggedIn,
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
    <div className={`comment-item pt-3 ${comment.level > 0 ? 'ml-5 pl-4 border-left-2 surface-border' : ''}`}>
      {/* Global ConfirmDialog needed for confirmDialog() to work */}


      <div className="flex align-items-start mb-2">
        <UserAvatar comment={comment} />
        <div className="flex-grow-1">
          <div className="flex align-items-center justify-content-between">
            <span className="font-semibold text-sm"
              style={{ fontFamily: `'Segoe UI', Roboto, 'Helvetica Neue', sans-serif` }}
            >{comment.userDisplayName || 'Người dùng ẩn danh'}</span>
            {comment.deleted && <Tag severity="warning" value="Đã xóa" className="ml-2 text-xs"></Tag>}
          </div>
          <div className={`text-sm surface-content ${comment.deleted ? 'italic text-color-secondary' : ''} mt-1 break-word`}
            style={{ fontFamily: `'Segoe UI', Roboto, 'Helvetica Neue', sans-serif` }}
          >
            {comment.deleted
              ? (getReportReasonText(comment.deleteReason) || 'Bình luận này đã bị xóa.')
              : <CommentContentRenderer content={comment.content} potentialMentionedUsers={potentialMentionedUsers} />
            }
          </div>
          <div className="comment-actions text-xs text-color-secondary mt-2 flex align-items-center">
            <Button
              disabled={amINotLoggedIn}
              icon={likeButtonIcon}
              className={`${likeButtonClass} p-button-rounded p-button-sm mr-1`}
              onClick={() => onToggleLike(comment.id)}
              tooltip={likeButtonTooltip}
              tooltipOptions={{ position: 'top' }}
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
            {!isOwner && !comment.deleted && !amINotLoggedIn && (
              <Button
                icon="pi pi-flag"
                className="p-button-text p-button-sm p-button-secondary ml-2 text-xs"
                tooltip="Báo cáo bình luận này"
                tooltipOptions={{ position: 'top' }}
                onClick={() => onOpenReportDialog(comment)} // onOpenReportDialog sẽ được truyền từ CommentSection
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
            amINotLoggedIn={amINotLoggedIn}
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

