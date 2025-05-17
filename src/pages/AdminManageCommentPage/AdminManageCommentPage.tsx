"use client"

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { ConfirmDialog } from "primereact/confirmdialog"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { Tag } from "primereact/tag"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { deleteComment, fetchRootComments, toggleActive } from "../../api/api"
import { TOXIC_THRESHOLD } from "../../constant/Constant"
import { useToast } from "../../context/ToastProvider"
import formatDateToString from "../../utils/helperFunction/formatDateToString"
import { Comment_t, DeleteReasonTag, TargetType } from "../../utils/types/type"

export const AdminManagementPage: React.FC = () => {
  const [comments, setComments] = useState<Comment_t[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: "createdAt",
    sortOrder: -1 as -1 | 1,
    filters: {},
    active: undefined as boolean | undefined,
  })
  const [editDialog, setEditDialog] = useState<boolean>(false)
  const [editComment, setEditComment] = useState<Comment_t | null>(null)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState<boolean>(false)
  const [commentToDelete, setCommentToDelete] = useState<Comment_t | null>(null)
  const [deleteReason, setDeleteReason] = useState<string>("")
  const { toast } = useToast()
  const abortController = useRef<AbortController | null>(null)

  const deleteReasons = [
    { label: "Violates Community Standards", value: "VIOLATE_COMMUNITY_STANDARDS" },
    { label: "User Requested", value: "USER_DELETE" },
    { label: "Admin Decision", value: "ADMIN_DELETE" },
  ]

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
      const result = await fetchRootComments(
        "TEST" as TargetType, // You might want to make this configurable
        "all",
        lazyParams.page,
        lazyParams.rows,
        globalFilter || undefined,
        [lazyParams.sortField],
        [lazyParams.sortOrder === 1 ? "asc" : "desc"],
        lazyParams.active,
      )

      if (result) {
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
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
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
      filters: event.filters,
    })
  }

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value)
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

    // In a real app, you would update the comment here
    // For now, we'll just close the dialog and reload
    hideEditDialog()
    loadComments()
  }

  const confirmDelete = (comment: Comment_t) => {
    setCommentToDelete(comment)
    setDeleteConfirmVisible(true)
  }

  const handleDelete = async () => {
    if (!commentToDelete) return

    const result = await deleteComment(commentToDelete.id, {
      reasonTag: deleteReason as DeleteReasonTag,
      reason: "Admin deleted via management page",
    })

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

    setDeleteConfirmVisible(false)
    setCommentToDelete(null)
    setDeleteReason("")
  }

  const handleToggleActive = async (comment: Comment_t) => {
    const result = await toggleActive(comment.id)

    if (result !== null) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: `Comment ${result.active ? "activated" : "deactivated"} successfully`,
        life: 3000,
      })

      // Update the comment in the list
      setComments(comments.map((c) => (c.id === result.id ? result : c)))
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to toggle comment status",
        life: 3000,
      })
    }
  }

  const formatDate = (rowData: Comment_t) => {
    return formatDateToString(rowData.createdAt)
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
          icon={rowData.active ? "pi pi-eye-slash" : "pi pi-eye"}
          className={`p-button-rounded ${rowData.active ? "p-button-warning" : "p-button-info"}`}
          tooltip={rowData.active ? "Deactivate" : "Activate"}
          onClick={() => handleToggleActive(rowData)}
        />
      </div>
    )
  }

  const toxicityBodyTemplate = (rowData: Comment_t) => {
    const toxicFields = [
      { key: "probInsult", label: "Insult" },
      { key: "probThreat", label: "Threat" },
      { key: "probHateSpeech", label: "Hate Speech" },
      { key: "probSpam", label: "Spam" },
      { key: "probSevereToxicity", label: "Severe" },
      { key: "probObscene", label: "Obscene" },
    ]

    const toxicCount = toxicFields.filter(
      (field) => (rowData[field.key as keyof Comment_t] as number) > TOXIC_THRESHOLD,
    ).length

    if (toxicCount === 0) {
      return <Tag severity="success" value="Clean" />
    }

    return <Tag severity="danger" value={`${toxicCount} issues`} />
  }

  const activeBodyTemplate = (rowData: Comment_t) => {
    return rowData.active ? <Tag severity="success" value="Active" /> : <Tag severity="danger" value="Hidden" />
  }

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h3 className="m-0">Comment Management</h3>
      <div className="flex align-items-center">
        <Dropdown
          value={lazyParams.active}
          options={[
            { label: "All Comments", value: undefined },
            { label: "Active Only", value: true },
            { label: "Hidden Only", value: false },
          ]}
          onChange={(e) => setLazyParams({ ...lazyParams, active: e.value, page: 1, first: 0 })}
          placeholder="Filter by Status"
          className="mr-2"
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilter} onChange={onGlobalFilterChange} placeholder="Search..." />
        </span>
      </div>
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
          header={header}
          emptyMessage="No comments found"
          className="p-datatable-responsive"
          rowHover
          scrollable
          scrollHeight="calc(100vh - 200px)"
        >
          <Column field="id" header="ID" sortable style={{ width: "10%" }} />
          <Column field="targetId" header="Target ID" sortable style={{ width: "10%" }} />
          <Column field="userId" header="User ID" sortable style={{ width: "10%" }} />
          <Column field="userDisplayName" header="User" sortable style={{ width: "15%" }} />
          <Column field="content" header="Content" sortable style={{ width: "20%" }} />
          <Column field="createdAt" header="Created At" body={formatDate} sortable style={{ width: "10%" }} />
          <Column field="likeCounts" header="Likes" sortable style={{ width: "5%" }} />
          <Column field="directReplyCount" header="Replies" sortable style={{ width: "5%" }} />
          <Column header="Toxicity" body={toxicityBodyTemplate} style={{ width: "10%" }} />
          <Column field="active" header="Status" body={activeBodyTemplate} sortable style={{ width: "5%" }} />
          <Column body={actionBodyTemplate} header="Actions" style={{ width: "10%" }} />
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
                <label htmlFor="userDisplayName">User</label>
                <InputText id="userDisplayName" value={editComment.userDisplayName} disabled />
              </div>
            </div>

            <div className="col-12">
              <div className="field">
                <label htmlFor="content">Content</label>
                <InputText id="content" value={editComment.content} disabled />
              </div>
            </div>

            <div className="col-12 md:col-4">
              <div className="field">
                <label htmlFor="probInsult">Insult Score</label>
                <InputNumber
                  id="probInsult"
                  value={editComment.probInsult}
                  onValueChange={(e) => setEditComment({ ...editComment, probInsult: e.value || 0 })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>

            <div className="col-12 md:col-4">
              <div className="field">
                <label htmlFor="probThreat">Threat Score</label>
                <InputNumber
                  id="probThreat"
                  value={editComment.probThreat}
                  onValueChange={(e) => setEditComment({ ...editComment, probThreat: e.value || 0 })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>

            <div className="col-12 md:col-4">
              <div className="field">
                <label htmlFor="probHateSpeech">Hate Speech Score</label>
                <InputNumber
                  id="probHateSpeech"
                  value={editComment.probHateSpeech}
                  onValueChange={(e) => setEditComment({ ...editComment, probHateSpeech: e.value || 0 })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>

            <div className="col-12 md:col-4">
              <div className="field">
                <label htmlFor="probSpam">Spam Score</label>
                <InputNumber
                  id="probSpam"
                  value={editComment.probSpam}
                  onValueChange={(e) => setEditComment({ ...editComment, probSpam: e.value || 0 })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>

            <div className="col-12 md:col-4">
              <div className="field">
                <label htmlFor="probSevereToxicity">Severe Toxicity Score</label>
                <InputNumber
                  id="probSevereToxicity"
                  value={editComment.probSevereToxicity}
                  onValueChange={(e) => setEditComment({ ...editComment, probSevereToxicity: e.value || 0 })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>

            <div className="col-12 md:col-4">
              <div className="field">
                <label htmlFor="probObscene">Obscene Score</label>
                <InputNumber
                  id="probObscene"
                  value={editComment.probObscene}
                  onValueChange={(e) => setEditComment({ ...editComment, probObscene: e.value || 0 })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        visible={deleteConfirmVisible}
        onHide={() => {
          setDeleteConfirmVisible(false)
          setCommentToDelete(null)
          setDeleteReason("")
        }}
        message="Are you sure you want to delete this comment?"
        header="Confirm Delete"
        icon="pi pi-exclamation-triangle"
        accept={handleDelete}
        reject={() => {
          setDeleteConfirmVisible(false)
          setCommentToDelete(null)
          setDeleteReason("")
        }}
        footer={
          <div>
            <Dropdown
              value={deleteReason}
              options={deleteReasons}
              onChange={(e) => setDeleteReason(e.value)}
              placeholder="Select Reason"
              className="mr-2"
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => {
                setDeleteConfirmVisible(false)
                setCommentToDelete(null)
                setDeleteReason("")
              }}
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={handleDelete}
              disabled={!deleteReason}
            />
          </div>
        }
      />
    </div>
  )
}
