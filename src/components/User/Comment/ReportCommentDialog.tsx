// Filename: src/features/comments/components/ReportCommentDialog.tsx
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { useToast } from '../../../context/ToastProvider'; // Assuming ToastProvider and useToast hook from your project setup
import { reportReasonToLabel } from '../../../utils/helperFunction/ReportEnumToLabel';
import { Comment_t, CommentReportReasonCategory, CreateCommentReportPayload, TargetType, } from '../../../utils/types/type';

interface ReportCommentDialogProps {
  commentContextType: TargetType;
  visible: boolean;
  onHide: () => void;
  commentToReport: Pick<Comment_t, 'id' | 'content' | 'userDisplayName'> | null; // Only essential info needed
  // onSubmitReport will be called with the commentId and the payload for the API
  onSubmitReport: (payload: CreateCommentReportPayload) => Promise<boolean>; // Returns true on success, false on failure
}

const ReportCommentDialog: React.FC<ReportCommentDialogProps> = ({
  visible,
  onHide,
  commentToReport,
  onSubmitReport,
  commentContextType,
}) => {
  const [selectedReason, setSelectedReason] = useState<CommentReportReasonCategory | null>(null);
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast(); // From your ToastProvider

  // Reset form state when the dialog is hidden or the comment to report changes
  useEffect(() => {
    if (!visible) {
      setSelectedReason(null);
      setDetails('');
      setIsSubmitting(false); // Reset submitting state as well
    }
  }, [visible]);

  // Memoize options to prevent re-computation on every render unless ReportReasonCategory changes (which it won't)
  const reasonOptions = React.useMemo(() =>
    Object.values(CommentReportReasonCategory).map(value => ({
      label: reportReasonToLabel(value),
      value,
    })), []);

  const handleSubmit = async () => {
    if (!commentToReport || !selectedReason) {
      // This should ideally not be hit if submit button is disabled correctly
      toast?.current?.show({ severity: 'warn', summary: 'Thông tin chưa đủ', detail: 'Vui lòng chọn lý do báo cáo.' });
      return;
    }

    if (selectedReason === CommentReportReasonCategory.OTHER && !details.trim()) {
      toast?.current?.show({ severity: 'warn', summary: 'Thiếu thông tin', detail: 'Vui lòng cung cấp chi tiết cho lý do "Khác".' });
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmitReport({
      reportedCommentId: commentToReport.id,
      commentContextType: commentContextType,
      reasonCategory: selectedReason,
      reasonDetails: details.trim() || undefined, // Send undefined if details are empty
    } as CreateCommentReportPayload);
    setIsSubmitting(false);

    if (success) {
      onHide(); // Close dialog only if submission was successful (toast handled by caller)
    }
    // If !success, error toast is handled by the caller (CommentSection)
  };

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 pt-3"> {/* Added gap and padding top */}
      <Button
        label="Hủy"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
        disabled={isSubmitting}
      />
      <Button
        label="Gửi báo cáo"
        icon="pi pi-send" // Changed from pi-check for better semantics
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={!selectedReason || isSubmitting} // Disable if no reason or submitting
      />
    </div>
  );

  // Conditional rendering if no comment data (should ideally not happen if `visible` is true)
  if (!commentToReport && visible) {
    console.warn("ReportCommentDialog visible but no commentToReport data!");
    return null;
  }


  return (
    <Dialog
      header={`Báo cáo bình luận của "${commentToReport?.userDisplayName || 'người dùng này'}"`}
      visible={visible}
      style={{ width: 'min(90vw, 500px)' }} // Responsive width, max 500px
      modal
      footer={dialogFooter}
      onHide={onHide}
      blockScroll // Prevents background scrolling when dialog is open
      dismissableMask // Allows closing by clicking outside
    >
      <div className="p-fluid pt-2"> {/* p-fluid for PrimeReact form styling, added padding top */}
        {commentToReport && (
          <div className="mb-4">
            <p className="text-sm text-color-secondary mb-1">
              {/* Nội dung bình luận bạn đang báo cáo: */}
              Bình luận bởi <strong>{commentToReport.userDisplayName}</strong>:
            </p>
            <div
              className="p-3 surface-100 border-round text-sm"
              style={{ maxHeight: '100px', overflowY: 'auto', wordBreak: 'break-word' }}
            >
              <q>{commentToReport.content}</q>
            </div>
          </div>
        )}

        <div className="field mb-4"> {/* 'field' class for standard PrimeReact form spacing */}
          <label htmlFor="reportReasonCategory" className="block text-sm font-medium mb-2 text-color">
            Lý do báo cáo <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="reportReasonCategory"
            value={selectedReason}
            options={reasonOptions}
            onChange={(e: DropdownChangeEvent) => setSelectedReason(e.value)}
            placeholder="Chọn một lý do"
            className="w-full"
            filter // Optional: adds a filter input to the dropdown
          />
        </div>

        {/* Show details field only if a reason is selected, more emphasis if "OTHER" */}
        {selectedReason && (
          <div className="field">
            <label htmlFor="reportReasonDetails" className="block text-sm font-medium mb-2 text-color">
              Mô tả chi tiết {selectedReason === CommentReportReasonCategory.OTHER ? <span className="text-red-500">*</span> : '(không bắt buộc)'}
            </label>
            <InputTextarea
              id="reportReasonDetails"
              value={details}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDetails(e.target.value)}
              rows={4}
              className="w-full text-sm" // Ensure text size consistency
              autoResize
              placeholder={
                selectedReason === CommentReportReasonCategory.OTHER
                  ? "Vui lòng mô tả rõ hơn về vấn đề bạn gặp phải..."
                  : "Cung cấp thêm thông tin (nếu có)..."
              }
            />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default ReportCommentDialog;