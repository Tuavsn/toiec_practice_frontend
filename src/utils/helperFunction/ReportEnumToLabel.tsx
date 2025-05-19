// Filename: src/utils/enumToLabel.ts (New file or add to existing utils)

import { CommentReportReasonCategory } from "../types/type";

/**
 * Chuyển đổi giá trị enum CommentReportReasonCategory sang nhãn tiếng Việt để hiển thị trên UI.
 * (Converts CommentReportReasonCategory enum values to Vietnamese labels for UI display.)
 * @param reason The CommentReportReasonCategory enum value.
 * @returns Vietnamese string label for the reason.
 */
export const reportReasonToLabel = (reason: CommentReportReasonCategory): string => {
  switch (reason) {


    case CommentReportReasonCategory.SPAM: return "Tin rác; quảng cáo";
    case CommentReportReasonCategory.HATE_SPEECH: return "Ngôn từ gây thù ghét; phân biệt đối xử";
    case CommentReportReasonCategory.HARASSMENT: return "Quấy rối; bắt nạt cá nhân";
    case CommentReportReasonCategory.VIOLENCE_OR_THREATS: return "Nội dung bạo lực; đe dọa";
    case CommentReportReasonCategory.MISINFORMATION_HARMFUL: return "Thông tin sai lệch gây hại";
    case CommentReportReasonCategory.SELF_HARM_OR_SUICIDE: return "Nội dung liên quan đến tự hại; tự tử";
    case CommentReportReasonCategory.IMPERSONATION: return "Mạo danh người khác";
    case CommentReportReasonCategory.COPYRIGHT_INFRINGEMENT: return "Vi phạm bản quyền; sở hữu trí tuệ";
    case CommentReportReasonCategory.CHILD_SAFETY_ISSUES: return "Vấn đề an toàn trẻ em";
    case CommentReportReasonCategory.NON_CONSENSUAL_CONTENT: return "Nội dung riêng tư đăng không đồng thuận";
    case CommentReportReasonCategory.OTHER: return "Lý do khác (vui lòng ghi rõ)";
  }
  return reason.toString(); // Fallback to the enum key if no label is defined
};