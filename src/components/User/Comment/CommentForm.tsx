"use client"

import { Button } from "primereact/button"
import { Mention, type MentionSearchEvent } from "primereact/mention"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useToast } from "../../../context/ToastProvider"
import { UserRole } from "../../../utils/types/type"

interface CommentFormProps {
    testId: string
    onCommentPosted: () => void
    mentionSuggestions: string[]
    initialMention?: string
}

interface MentionUser {
    email: string
}

export const CommentForm: React.FC<CommentFormProps> = ({
    testId,
    onCommentPosted,
    mentionSuggestions,
    initialMention,
}) => {
    const [comment, setComment] = useState<string>(initialMention || "")
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [suggestions, setSuggestions] = useState<MentionUser[]>([])
    const { toast } = useToast()
    const userRole = (localStorage.getItem("role") as UserRole) || UserRole.GUEST
    const inputRef = useRef<Mention>(null)
    const CURRENT_USER_EMAIL = localStorage.getItem("email");
    // Convert email strings to MentionUser objects
    useEffect(() => {
        const mentionUsers = mentionSuggestions.map((email) => ({
            nickname: email.split("@")[0],
            email,
        }))
        setSuggestions(mentionUsers)
    }, [mentionSuggestions])

    const handleSubmit = async () => {
        if (!comment.trim()) return

        setSubmitting(true)

        try {
            // API call would go here
            await new Promise((resolve) => setTimeout(resolve, 500))

            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Comment posted successfully",
                life: 3000,
            })

            setComment("")
            onCommentPosted()
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to post comment",
                life: 3000,
            })
        } finally {
            setSubmitting(false)
        }
    }

    const onSearch = (event: MentionSearchEvent) => {
        const query = event.query.toLowerCase()

        let filteredSuggestions
        if (!query.trim().length) {
            filteredSuggestions = [...suggestions]
        } else {
            filteredSuggestions = suggestions.filter(
                (user) => user.email !== CURRENT_USER_EMAIL && user.email.toLowerCase().startsWith(query),
            )
        }

        setSuggestions(filteredSuggestions)
    }

    const itemTemplate = (suggestion: MentionUser) => {
        return (
            <div className="flex align-items-center">
                <div className="flex flex-column ml-2">
                    <span>{suggestion.email}</span>
                </div>
            </div>
        )
    }

    const isDisabled = userRole === UserRole.GUEST || submitting

    return (
        <div className="card p-fluid" data-testid="comment-form">
            <div className="field">
                <Mention
                    ref={inputRef}
                    value={comment}
                    onChange={(e) => setComment(e.currentTarget.value)}
                    suggestions={suggestions}
                    onSearch={onSearch}
                    field="nickname"
                    placeholder="Write a comment... (Use @ to mention someone)"
                    disabled={isDisabled}
                    rows={3}
                    autoResize
                    itemTemplate={itemTemplate}
                    className="w-full"
                />
            </div>

            <div className="flex justify-content-end mt-2">
                <Button label="Post" icon="pi pi-send" disabled={isDisabled} loading={submitting} onClick={handleSubmit} />
            </div>

            {userRole === UserRole.GUEST && (
                <div className="mt-2 text-center font-italic text-500">Vui lòng đăng nhập để bình luận</div>
            )}
        </div>
    )
}
