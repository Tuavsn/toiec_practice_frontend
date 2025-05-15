"use client"

import { Avatar } from "primereact/avatar"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { ConfirmDialog } from "primereact/confirmdialog"
import { Dialog } from "primereact/dialog"
import { Divider } from "primereact/divider"
import { InputTextarea } from "primereact/inputtextarea"
import { Tag } from "primereact/tag"
import type React from "react"
import { useState } from "react"
import { deleteComment, reportComment, undoDeleteComment } from "../../../api/api"
import { TOXIC_THRESHOLD } from "../../../constant/Constant"
import { useToast } from "../../../context/ToastProvider"
import formatDateToString from "../../../utils/helperFunction/formatDateToString"
import { Comment_t, UserRole } from "../../../utils/types/type"

interface CommentItemProps {
  comment: Comment_t
  onAnswer: (email: string) => void
  onDelete: (id: string) => void
  onUndo: (id: string) => void
  isCurrentUser?: boolean
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onAnswer,
  onDelete,
  onUndo,
  isCurrentUser = false,
}) => {
  const [reportDialogVisible, setReportDialogVisible] = useState<boolean>(false)
  const [reportReason, setReportReason] = useState<string>("")
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState<boolean>(false)
  const { toast } = useToast()
  const userRole = (localStorage.getItem("role") as UserRole) || UserRole.GUEST

  const handleReport = async () => {
    if (!reportReason.trim()) return

    setSubmitting(true)

    const result = await reportComment(comment.id, reportReason)

    if (result !== null) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Comment reported successfully",
        life: 3000,
      })
      setReportDialogVisible(false)
      setReportReason("")
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to report comment",
        life: 3000,
      })
    }

    setSubmitting(false)
  }

  const handleDelete = async () => {
    setDeleteConfirmVisible(false)

    const result = await deleteComment(comment.id)

    if (result !== null) {
      onDelete(comment.id)

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Comment deleted. Click Undo to restore.",
        life: 5000,
        sticky: false,
        content: (
          <div className="flex align-items-center justify-content-between">
            <span>Comment deleted</span>
            <Button label="Undo" className="p-button-text p-button-sm" onClick={() => handleUndo()} />
          </div>
        ),
      })
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete comment",
        life: 3000,
      })
    }
  }

  const handleUndo = async () => {
    const result = await undoDeleteComment(comment.id)

    if (result !== null) {
      onUndo(comment.id)

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Comment restored",
        life: 3000,
      })
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to restore comment",
        life: 3000,
      })
    }
  }

  const renderToxicityFlags = () => {
    if (userRole !== UserRole.ADMIN) return null

    const toxicFields = [
      { key: "prob_insult", label: "Insult" },
      { key: "prob_threat", label: "Threat" },
      { key: "prob_hate_speech", label: "Hate Speech" },
      { key: "prob_spam", label: "Spam" },
      { key: "prob_severe_toxicity", label: "Severe Toxicity" },
      { key: "prob_obscene", label: "Obscene" },
    ]

    return (
      <div className="mt-3">
        <Divider />
        <div className="flex flex-wrap gap-2">
          {toxicFields.map((field) => {
            const value = comment[field.key as keyof Comment_t] as number
            const isToxic = value > TOXIC_THRESHOLD

            return (
              <Tag
                key={field.key}
                severity={isToxic ? "danger" : "info"}
                value={`${field.label}: ${value.toFixed(2)}`}
              />
            )
          })}
        </div>
      </div>
    )
  }

  // Generate initials for avatar
  const getInitials = (email: string): string => {
    return email.split("@")[0].substring(0, 2).toUpperCase()
  }

  // Get a consistent color based on email
  const getAvatarColor = (email: string): string => {
    const colors = ["var(--blue-500)", "var(--green-500)", "var(--yellow-500)", "var(--cyan-500)", "var(--pink-500)"]
    const index = email.charCodeAt(0) % colors.length
    return colors[index]
  }

  const formatCommentText = (text: string): JSX.Element => {
    // Simple regex to highlight mentions
    const parts = text.split(/(@\w+(?:\.\w+)*)/g)

    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith("@")) {
            return (
              <span key={index} className="text-primary font-medium">
                {part}
              </span>
            )
          }
          return <span key={index}>{part}</span>
        })}
      </>
    )
  }

  return (
    <Card
      className={`mb-3 ${isCurrentUser ? "border-primary border-1" : ""}`}
      pt={{
        root: { className: "shadow-2" },
        content: { className: "p-0" },
      }}
    >
      <div className="p-3">
        <div className="flex justify-content-between align-items-start">
          <div className="flex align-items-center gap-2">
            <Avatar
              label={getInitials(comment.email)}
              shape="circle"
              style={{ backgroundColor: getAvatarColor(comment.email) }}
            />
            <div>
              <address className="m-0 font-medium">{comment.email}</address>
              <time dateTime={comment.created_at} className="text-sm text-500">
                {formatDateToString(comment.created_at)}
              </time>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              icon="pi pi-reply"
              className="p-button-rounded p-button-text p-button-sm"
              tooltip="Answer"
              onClick={() => onAnswer(comment.email)}
              data-testid={`btn-answer-${comment.id}`}
            />

            <Button
              icon="pi pi-flag"
              className="p-button-rounded p-button-text p-button-sm p-button-danger"
              tooltip="Report"
              onClick={() => setReportDialogVisible(true)}
              data-testid={`btn-report-${comment.id}`}
            />

            {userRole === UserRole.ADMIN && (
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-sm p-button-danger"
                tooltip="Delete"
                onClick={() => setDeleteConfirmVisible(true)}
                data-testid={`btn-delete-${comment.id}`}
              />
            )}
          </div>
        </div>

        <div className="mt-3 line-height-3">{formatCommentText(comment.text)}</div>

        {renderToxicityFlags()}
      </div>

      <Dialog
        header="Report Comment"
        visible={reportDialogVisible}
        onHide={() => setReportDialogVisible(false)}
        style={{ width: "450px" }}
        modal
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setReportDialogVisible(false)}
              disabled={submitting}
            />
            <Button
              label="Report"
              icon="pi pi-check"
              onClick={handleReport}
              loading={submitting}
              disabled={!reportReason.trim() || submitting}
            />
          </div>
        }
      >
        <div className="field">
          <label htmlFor="reason">Reason for reporting</label>
          <InputTextarea
            id="reason"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            rows={5}
            autoResize
            className="w-full mt-1"
          />
        </div>
      </Dialog>

      <ConfirmDialog
        visible={deleteConfirmVisible}
        onHide={() => setDeleteConfirmVisible(false)}
        message="Are you sure you want to delete this comment?"
        header="Confirm Delete"
        icon="pi pi-exclamation-triangle"
        accept={handleDelete}
        reject={() => setDeleteConfirmVisible(false)}
      />
    </Card>
  )
}
