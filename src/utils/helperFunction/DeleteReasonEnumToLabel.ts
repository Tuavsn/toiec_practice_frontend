import { DeleteReason } from "../types/type";

export function getReportReasonText(reason: DeleteReason|string): string {
  switch (reason) {
    case DeleteReason.VIOLATE_COMMUNITY_STANDARDS:
      return "Vi phạm tiêu chuẩn cộng đồng";
    case DeleteReason.USER_DELETE:
      return "Người dùng đã xóa";
    case DeleteReason.ADMIN_DELETE:
      return "Quản trị viên đã xóa";
    default:
      return "";
  }
}