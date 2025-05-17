import { UserID } from "../types/type";

export function AmINotLoggedIn(): boolean {
    return localStorage.getItem("access_token") === null
}

export function GetMyIDUser(): UserID {
    return localStorage.getItem("iduser") || "";
}

// Filename: src/utils/currentUser.ts

//------------------------------------------------------
// Các hàm tiện ích để lấy thông tin người dùng hiện tại từ localStorage
//------------------------------------------------------

/**
 * Lấy ID của người dùng hiện tại từ localStorage.
 * @returns ID người dùng hoặc null nếu không tìm thấy.
 */
export const getCurrentUserId = (): string | null => {
  return localStorage.getItem("idUser");
};

/**
 * Lấy tên hiển thị của người dùng hiện tại từ localStorage.
 * @returns Tên hiển thị người dùng hoặc null nếu không tìm thấy.
 */
export const getCurrentUserDisplayName = (): string | null => {
  // Theo yêu cầu, trường 'name' được sử dụng cho tên hiển thị
  return localStorage.getItem("name");
};

/**
 * Lấy URL avatar của người dùng hiện tại từ localStorage.
 * @returns URL avatar hoặc null nếu không tìm thấy.
 */
export const getCurrentUserAvatar = (): string | null => {
  return localStorage.getItem("avatar");
};

/**
 * Lấy vai trò của người dùng hiện tại từ localStorage.
 * @returns Vai trò người dùng (ví dụ: 'ADMIN', 'USER') hoặc null nếu không tìm thấy.
 */
export const getCurrentUserRole = (): string | null => {
  // Giả sử vai trò được lưu dưới key 'role'
  return localStorage.getItem("role");
};

/**
 * Kiểm tra xem người dùng hiện tại có phải là Admin không.
 * @returns true nếu là Admin, ngược lại false.
 */
export const isCurrentUserAdmin = (): boolean => {
  return getCurrentUserRole() === "ADMIN"; // Dựa trên UserRole enum đã cung cấp
};