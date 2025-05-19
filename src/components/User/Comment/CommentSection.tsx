// Filename: src/features/comments/components/CommentSection.tsx
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import React, { Fragment, useEffect } from 'react';
import { useCommentSection } from '../../../hooks/useCommentSection';
import { TargetType } from '../../../utils/types/type';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import ReportCommentDialog from './ReportCommentDialog';

//------------------------------------------------------
// Props cho CommentSection
//------------------------------------------------------
export interface CommentSectionComponentProps {
    targetType: TargetType;
    targetId: string;
    // toastRef?: React.RefObject<Toast>; // Optional: if you pass toast ref manually
}

//------------------------------------------------------
// Component chính cho khu vực bình luận
//------------------------------------------------------
const CommentSection: React.FC<CommentSectionComponentProps> = ({
    targetType,
    targetId,
    // toastRef
}) => {
    const {
        state,
        fetchRootComments,
        fetchReplies,
        addComment,
        deleteComment, // This is the one from the hook
        toggleLike,
        setActiveReplyForm,
        toggleRepliesVisibility,

        currentUserId,
        closeReportDialog,
        openReportDialog,
        handleSubmitReportWithToast,
    } = useCommentSection({ targetType, targetId });

    //------------------------------------------------------
    // Tải bình luận gốc khi component mount hoặc target thay đổi
    //------------------------------------------------------
    useEffect(() => {
        fetchRootComments(1); // Tải trang đầu tiên
    }, [fetchRootComments, targetType, targetId]); // fetchRootComments is memoized by hook

    //------------------------------------------------------
    // Xử lý phân trang cho bình luận gốc
    //------------------------------------------------------
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        fetchRootComments(event.page + 1, event.rows); // API thường dùng page 1-based
    };

    //------------------------------------------------------
    // Xử lý gửi bình luận gốc mới
    //------------------------------------------------------
    const handlePostRootComment = async (text: string, mentionedUserIds: string[]) => {
        await addComment(text, mentionedUserIds); // parentId is undefined for root comments
        // Toast for success could be here or handled by the hook/reducer success action
    };

    //------------------------------------------------------
    // Xử lý gửi phản hồi cho một bình luận
    //------------------------------------------------------
    const handlePostReplyToComment = async (
        text: string,
        mentionedUserIds: string[],
        parentId: string
    ) => {
        await addComment(text, mentionedUserIds, parentId);
    };

    //------------------------------------------------------
    // Các hàm render phụ trợ
    //------------------------------------------------------
    const renderSkeletons = (count: number = 3) => (
        Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-mb-3">
                <div className="flex mb-2">
                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                    <div style={{ flex: '1' }}>
                        <Skeleton width="100%" className="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                    </div>
                </div>
                <Skeleton height="20px" className="mb-2"></Skeleton>
                <Skeleton height="50px"></Skeleton>
            </div>
        ))
    );
    const renderRepliesForComment = (parentId: string) => {
        const replies = state.repliesByParentId[parentId] || [];
        const isLoading = state.isLoadingReplies[parentId];
        const meta = state.replyMetaByParentId[parentId];

        if (isLoading && !replies.length) { // Loading first page of replies
            return <div className="ml-5 pl-4 mt-2">{renderSkeletons(1)}</div>;
        }

        return (
            <div className="comment-replies-list ml-5 pl-4 border-left-2 surface-border mt-1">
                {replies.map(reply => (
                    <CommentItem
                        key={reply.id}
                        comment={reply}
                        currentUserId={currentUserId}
                        potentialMentionedUsers={state.mentionSuggestions}
                        onToggleLike={toggleLike}
                        onDeleteComment={(commentId, reason) => deleteComment(commentId, reply.parentId, reason)}
                        onOpenReportDialog={openReportDialog}

                    // Replies (level 1) cannot be replied to, nor can they show replies.
                    // So, no onShowReplyForm, onPostReply, onShowReplies for level 1 items.
                    // isReplyFormVisible, isPostingReply etc. are not relevant here.
                    />
                ))}
                {isLoading && replies.length > 0 && ( // Loading more replies
                    <div className="ml-5 pl-4 mt-2">{renderSkeletons(1)}</div>
                )}
                {meta && meta.totalPages > meta.current && !isLoading && (
                    <Button
                        label={`Xem thêm ${meta.totalItems - replies.length} phản hồi`}
                        icon="pi pi-plus"
                        className="p-button-text p-button-sm ml-5 mt-2"
                        onClick={() => fetchReplies(parentId, meta.current + 1)}
                    />
                )}
            </div>
        );
    };

    //------------------------------------------------------
    // Render chính của CommentSection
    //------------------------------------------------------
    if (state.isLoadingRootComments && !state.rootComments.length) {
        return <div className="comment-section p-3">{renderSkeletons(3)}</div>;
    }

    if (state.error && !state.rootComments.length) {
        return (
            <div className="comment-section p-3">
                <Message severity="error" text={state.error} className="mb-3" />
                <Button label="Thử lại" icon="pi pi-refresh" onClick={() => fetchRootComments(1)} />
            </div>
        );
    }

    return (
        <div className="comment-section p-card p-4 shadow-1">
            {/* Ensure Toast and ConfirmDialog are globally available or add them here if controlled locally */}
            <ReportCommentDialog
                commentContextType= {targetType}
                visible={state.isReportDialogVisible}
                onHide={closeReportDialog}
                commentToReport={state.commentForReporting}
                onSubmitReport={handleSubmitReportWithToast}
            />

            <h3 className="mt-0 mb-4 text-xl font-semibold">
                Bình luận ({state.meta?.totalItems || 0})
            </h3>

            {state.error && <Message severity="error" text={state.error} className="mb-3" />}

            {state.rootComments.length === 0 && !state.isLoadingRootComments && (
                <p className="text-center text-color-secondary py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            )}

            {state.rootComments.map(comment => (
                <Fragment key={comment.id}>
                    <CommentItem
                        comment={comment}
                        currentUserId={currentUserId}
                        potentialMentionedUsers={state.mentionSuggestions}
                        onToggleLike={toggleLike}
                        onDeleteComment={(commentId, reason) => deleteComment(commentId, comment.parentId, reason)}
                        // Reply handling for this root comment
                        onShowReplyForm={setActiveReplyForm}
                        isReplyFormVisible={state.activeReplyParentId === comment.id}
                        onPostReply={handlePostReplyToComment}
                        isPostingReply={state.isCreatingComment && state.activeReplyParentId === comment.id}
                        // Show replies handling for this root comment
                        onShowReplies={toggleRepliesVisibility} // The hook's toggle function
                        areRepliesVisible={state.visibleRepliesParentId === comment.id}
                        isLoadingReplies={state.isLoadingReplies[comment.id]}
                        replyMeta={state.replyMetaByParentId[comment.id]}
                        onOpenReportDialog={openReportDialog}
                    />
                    {state.visibleRepliesParentId === comment.id && renderRepliesForComment(comment.id)}
                    <Divider className="my-0 py-0" />
                </Fragment>
            ))}

            {state.meta && state.meta.totalPages > 1 && (
                <Paginator
                    first={state.meta.current * state.meta.pageSize - state.meta.pageSize} // 0-indexed first item
                    rows={state.meta.pageSize}
                    totalRecords={state.meta.totalItems}
                    onPageChange={onPageChange}
                    className="mt-4"
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    rowsPerPageOptions={[5, 10, 20]}
                />
            )}

            <Divider className="my-4" />
            <div className="new-root-comment-form mt-4">
                <h4 className="text-lg font-semibold mb-2">Để lại bình luận của bạn</h4>
                <CommentForm
                    onSubmit={handlePostRootComment}
                    placeholder="Viết bình luận của bạn ở đây..."
                    isLoading={state.isCreatingComment && state.activeReplyParentId === null} // Loading if creating root comment
                    mentionSuggestions={state.mentionSuggestions}
                />
            </div>
        </div>
    );
};

export default CommentSection;