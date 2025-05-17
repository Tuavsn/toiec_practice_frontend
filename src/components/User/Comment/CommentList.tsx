// "use client"

// import { Paginator } from "primereact/paginator"
// import { ProgressSpinner } from "primereact/progressspinner"
// import type React from "react"
// import { useEffect, useState } from "react"
// import { Comment_t, TargetType } from "../../../utils/types/type"
// import CommentForm from "./CommentForm"
// import CommentItem from "./CommentItem"
// import { useCommentList } from "../../../hooks/CommentHook"

// interface CommentListProps {
//   testId: string
//   currentUserId?: string
// }

// export const CommentList: React.FC<CommentListProps> = ({ testId, currentUserId = "68158086bc7a712dfd485cfb" }) => {
//   const { comments, loading, error, meta, loadComments, removeComment } = useCommentList(TargetType.TEST,testId)
//   const [currentPage, setCurrentPage] = useState<number>(0)
//   const [mentionText, setMentionText] = useState<string>("")
 

//   useEffect(() => {
//     loadComments(currentPage + 1)
//   }, [loadComments, currentPage])

//   const handlePageChange = (e: { page: number; first: number; rows: number; pageCount: number }) => {
//     setCurrentPage(e.page)
//   }

//   const handleCommentPosted = () => {
//     loadComments(currentPage + 1)
//   }

//   const handleAnswer = (email: string) => {
//     setMentionText(`@${email} `)
//   }

//   const handleDelete = (id: string) => {
//     removeComment(id)
//   }

//   const handleUndo = () => {
//     loadComments(currentPage + 1)
//   }

//   const getMentionSuggestions = (): string[] => {
//     return comments.map((comment:Comment_t) => comment.userDisplayName)
//   }

//   const renderContent = () => {
//     if (loading && comments.length === 0) {
//       return (
//         <div className="flex justify-content-center align-items-center my-6">
//           <ProgressSpinner />
//         </div>
//       )
//     }

//     if (error) {
//       return <div className="flex justify-content-center align-items-center my-6 text-danger">{error}</div>
//     }

//     if (comments.length === 0) {
//       return (
//         <div className="flex justify-content-center align-items-center my-6 text-500">
//           No comments yet. Be the first to comment!
//         </div>
//       )
//     }

//     return (
//       <div>
//         {comments.map((comment: Comment_t) => (
//           <CommentItem
//             key={comment.id}
//             comment={comment}
//             onAnswer={handleAnswer}
//             onDelete={handleDelete}
//             onUndo={handleUndo}
//             isCurrentUser={comment.userId === currentUserId}
//           />
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div className="grid">
//       <div className="col-12">
//         <CommentForm
//           testId={testId}
//           onCommentPosted={handleCommentPosted}
//           mentionSuggestions={getMentionSuggestions()}
//           initialMention={mentionText}
//         />
//       </div>

//       <div className="col-12 mt-3">{renderContent()}</div>

//       {meta && meta.totalPages > 1 && (
//         <div className="col-12 mt-3 flex justify-content-center sticky" style={{ bottom: 0 }}>
//           <Paginator
//             first={currentPage * meta.pageSize}
//             rows={meta.pageSize}
//             totalRecords={meta.totalItems}
//             rowsPerPageOptions={[meta.pageSize]}
//             onPageChange={handlePageChange}
//             template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
//           />
//         </div>
//       )}
//     </div>
//   )
// }
