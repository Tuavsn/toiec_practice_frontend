"use client"

import { ProgressSpinner } from "primereact/progressspinner"
import type React from "react"
import { useEffect } from "react"
import { useReplies } from "../../../hooks/RepliesHook"
import { Comment_t, TargetType } from "../../../utils/types/type"
import { CommentItem } from "./CommentItem"

interface CommentRepliesProps {
  parentComment: Comment_t
  targetType: TargetType
  targetId: string
  currentUserId?: string
}

export const CommentReplies: React.FC<CommentRepliesProps> = ({
  parentComment,
  targetType,
  targetId,
  currentUserId = "",
}) => {
  const { replies, loading, error, meta, loadReplies, removeReply, updateReply } = useReplies(targetType, targetId)

  useEffect(() => {
    loadReplies(parentComment.id)
  }, [loadReplies, parentComment.id])

  const handleDelete = (id: string) => {
    removeReply(parentComment.id, id)
  }

  const handleUpdate = (comment: Comment_t) => {
    updateReply(parentComment.id, comment)
  }

  if (loading[parentComment.id]) {
    return (
      <div className="flex justify-content-center align-items-center my-3">
        <ProgressSpinner style={{ width: "30px", height: "30px" }} />
      </div>
    )
  }

  if (error[parentComment.id]) {
    return <div className="text-danger my-3">Error loading replies: {error[parentComment.id]}</div>
  }

  const commentReplies = replies[parentComment.id] || []

  if (commentReplies.length === 0) {
    return <div className="text-500 my-3">No replies yet</div>
  }

  return (
    <div className="pl-4 ml-2 border-left-1 border-300">
      {commentReplies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onAnswer={() => {}} // Not needed for replies
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          isCurrentUser={reply.userId === currentUserId}
        />
      ))}
    </div>
  )
}
