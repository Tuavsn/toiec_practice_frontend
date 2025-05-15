"use client"

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { deleteComment, fetchComments, updateCommentScores } from "../../api/api"
import { useToast } from "../../context/ToastProvider"
import formatDateToString from "../../utils/helperFunction/formatDateToString"
import { Comment_t, ScoresPayload } from "../../utils/types/type"

export const AdminManagementPage: React.FC = () => {
    const [comments, setComments] = useState<Comment_t[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [totalRecords, setTotalRecords] = useState<number>(0)
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: "created_at",
        sortOrder: -1 as -1 | 1,
    })
    const [editDialog, setEditDialog] = useState<boolean>(false)
    const [editComment, setEditComment] = useState<Comment_t | null>(null)
    const [globalFilter, setGlobalFilter] = useState<string>("")
    const { toast } = useToast()
    const abortController = useRef<AbortController | null>(null)

    useEffect(() => {
        loadComments()
    }, [lazyParams])

    const loadComments = async () => {
        if (abortController.current) {
            abortController.current.abort()
        }

        abortController.current = new AbortController()
        setLoading(true)

        try {
            const result = await fetchComments("all", lazyParams.page)

            if (result && result) {
                setComments(result.result)
                setTotalRecords(result.meta.totalItems)
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to load comments",
                    life: 3000,
                })
            }
        } catch (error: unknown) {
            if (error instanceof Error && error.name !== "AbortError") {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to load comments",
                    life: 3000,
                })
            }
        } finally {
            setLoading(false)
        }
    }

    const onPage = (event: any) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,
            page: event.page + 1,
            rows: event.rows,
        })
    }

    const onSort = (event: any) => {
        setLazyParams({
            ...lazyParams,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        })
    }

    const onFilter = (event: any) => {
        setLazyParams({
            ...lazyParams,
            first: 0,
            page: 1,
        })
    }

    const openEditDialog = (comment: Comment_t) => {
        setEditComment({ ...comment })
        setEditDialog(true)
    }

    const hideEditDialog = () => {
        setEditDialog(false)
        setEditComment(null)
    }

    const saveComment = async () => {
        if (!editComment) return

        const scores: ScoresPayload = {
            prob_insult: editComment.prob_insult,
            prob_threat: editComment.prob_threat,
            prob_hate_speech: editComment.prob_hate_speech,
            prob_spam: editComment.prob_spam,
            prob_severe_toxicity: editComment.prob_severe_toxicity,
            prob_obscene: editComment.prob_obscene,
        }

        const result = await updateCommentScores(editComment.id, scores)

        if (result !== null) {
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Comment updated successfully",
                life: 3000,
            })

            hideEditDialog()
            loadComments()
        } else {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update comment",
                life: 3000,
            })
        }
    }

    const completeRequest = async (comment: Comment_t) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Request completed and email sent",
            life: 3000,
        })

        // Remove from list
        setComments(comments.filter((c) => c.id !== comment.id))
    }

    const confirmDelete = async (comment: Comment_t) => {
        const result = await deleteComment(comment.id)

        if (result !== null) {
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Comment deleted successfully",
                life: 3000,
            })

            loadComments()
        } else {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete comment",
                life: 3000,
            })
        }
    }

    const formatDate = (rowData: Comment_t) => {
        return formatDateToString(rowData.created_at)
    }

    const actionBodyTemplate = (rowData: Comment_t) => {
        return (
            <div className="flex justify-content-end">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => openEditDialog(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger mr-2"
                    onClick={() => confirmDelete(rowData)}
                />
                <Button
                    icon="pi pi-check"
                    className="p-button-rounded p-button-info"
                    onClick={() => completeRequest(rowData)}
                    tooltip="Complete request"
                />
            </div>
        )
    }

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h3 className="m-0">Comment Management</h3>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    )

    const editDialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideEditDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveComment} />
        </div>
    )

    return (
        <div className="grid p-fluid" data-testid="admin-table">
            <div className="col-12">
                <DataTable
                    value={comments}
                    lazy
                    paginator
                    first={lazyParams.first}
                    rows={lazyParams.rows}
                    totalRecords={totalRecords}
                    onPage={onPage}
                    onSort={onSort}
                    sortField={lazyParams.sortField}
                    sortOrder={lazyParams.sortOrder}
                    onFilter={onFilter}
                    loading={loading}
                    globalFilter={globalFilter}
                    header={header}
                    emptyMessage="No comments found"
                    className="p-datatable-responsive"
                    rowHover
                    scrollable
                    scrollHeight="calc(100vh - 200px)"
                >
                    <Column field="id" header="ID" sortable />
                    <Column field="test_id" header="Test ID" sortable />
                    <Column field="user_id" header="User ID" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column field="text" header="Text" sortable />
                    <Column field="created_at" header="Created At" body={formatDate} sortable />
                    <Column field="prob_insult" header="Insult" sortable />
                    <Column field="prob_threat" header="Threat" sortable />
                    <Column field="prob_hate_speech" header="Hate Speech" sortable />
                    <Column field="prob_spam" header="Spam" sortable />
                    <Column field="prob_severe_toxicity" header="Severe Toxicity" sortable />
                    <Column field="prob_obscene" header="Obscene" sortable />
                    <Column field="reporter_reason" header="Report Reason" sortable />
                    <Column body={actionBodyTemplate} header="Actions" />
                </DataTable>
            </div>

            <Dialog
                visible={editDialog}
                style={{ width: "50vw" }}
                header="Edit Comment"
                modal
                className="p-fluid"
                footer={editDialogFooter}
                onHide={hideEditDialog}
            >
                {editComment && (
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="id">ID</label>
                                <InputText id="id" value={editComment.id} disabled />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <InputText id="email" value={editComment.email} disabled />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="field">
                                <label htmlFor="text">Text</label>
                                <InputText id="text" value={editComment.text} disabled />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="prob_insult">Insult Score</label>
                                <InputNumber
                                    id="prob_insult"
                                    value={editComment.prob_insult}
                                    onValueChange={(e) => setEditComment({ ...editComment, prob_insult: e.value || 0 })}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="prob_threat">Threat Score</label>
                                <InputNumber
                                    id="prob_threat"
                                    value={editComment.prob_threat}
                                    onValueChange={(e) => setEditComment({ ...editComment, prob_threat: e.value || 0 })}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="prob_hate_speech">Hate Speech Score</label>
                                <InputNumber
                                    id="prob_hate_speech"
                                    value={editComment.prob_hate_speech}
                                    onValueChange={(e) => setEditComment({ ...editComment, prob_hate_speech: e.value || 0 })}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="prob_spam">Spam Score</label>
                                <InputNumber
                                    id="prob_spam"
                                    value={editComment.prob_spam}
                                    onValueChange={(e) => setEditComment({ ...editComment, prob_spam: e.value || 0 })}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="prob_severe_toxicity">Severe Toxicity Score</label>
                                <InputNumber
                                    id="prob_severe_toxicity"
                                    value={editComment.prob_severe_toxicity}
                                    onValueChange={(e) => setEditComment({ ...editComment, prob_severe_toxicity: e.value || 0 })}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="prob_obscene">Obscene Score</label>
                                <InputNumber
                                    id="prob_obscene"
                                    value={editComment.prob_obscene}
                                    onValueChange={(e) => setEditComment({ ...editComment, prob_obscene: e.value || 0 })}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    )
}
