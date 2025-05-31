import { NotificationAction } from "../utils/types/action";
import { initialNotificationState } from "../utils/types/emptyValue";
import { NotificationState } from "../utils/types/state";
import { Notification_t, NotificationActionType } from "../utils/types/type";

/**
 * Tính toán lại số lượng thông báo chưa đọc từ danh sách thông báo.
 * @param notifications - Danh sách các thông báo.
 * @returns {number} Số lượng thông báo chưa đọc.
 */
const calculateUnreadCount = (notifications: Notification_t[]): number => {
    return notifications.filter(n => !n.read).length;
};

/**
 * @function notificationReducer
 * @description Reducer để quản lý state của tính năng thông báo.
 * @param {NotificationState} state - State hiện tại.
 * @param {NotificationAction} action - Hành động được dispatch.
 * @returns {NotificationState} State mới.
 */
export const notificationReducer = (
    state: NotificationState = initialNotificationState,
    action: NotificationAction
): NotificationState => {
    switch (action.type) {
        //------------------------------------------------------
        // Fetch Notifications
        //------------------------------------------------------
        case NotificationActionType.FETCH_NOTIFICATIONS_START:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case NotificationActionType.FETCH_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                notifications: action.payload.notifications,
                meta: action.payload.meta,
                unreadCount: action.payload.unreadCount, // Sử dụng unreadCount đã tính toán
                error: null,
            };
        case NotificationActionType.FETCH_NOTIFICATIONS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                notifications: [], // Xóa thông báo cũ khi có lỗi fetch ban đầu
                meta: null,
                unreadCount: 0,
            };

        //------------------------------------------------------
        // Load More Notifications
        //------------------------------------------------------
        case NotificationActionType.LOAD_MORE_NOTIFICATIONS_START:
            return {
                ...state,
                isLoadingMore: true,
                error: null, // Xóa lỗi trước đó nếu có
            };
        case NotificationActionType.LOAD_MORE_NOTIFICATIONS_SUCCESS:
            // Nối danh sách thông báo mới vào danh sách hiện tại
            // và đảm bảo không có thông báo trùng lặp (dựa trên id)
            const existingNotificationIds = new Set(state.notifications.map(n => n.id));
            const newUniqueNotifications = action.payload.notifications.filter(
                n => !existingNotificationIds.has(n.id)
            );
            const allNotifications = [...state.notifications, ...newUniqueNotifications];
            return {
                ...state,
                isLoadingMore: false,
                notifications: allNotifications,
                meta: action.payload.meta,
                unreadCount: calculateUnreadCount(allNotifications), // Tính lại unread count
                error: null,
            };
        case NotificationActionType.LOAD_MORE_NOTIFICATIONS_FAILURE:
            return {
                ...state,
                isLoadingMore: false,
                error: action.payload,
            };

        //------------------------------------------------------
        // Mark a Notification_t as Read
        //------------------------------------------------------
        case NotificationActionType.MARK_AS_READ_SUCCESS:
            const updatedNotificationsRead = state.notifications.map(notification =>
                notification.id === action.payload.notificationId
                    ? { ...action.payload.updatedNotification, read: true } // Đảm bảo 'read' là true
                    : notification
            );
            return {
                ...state,
                notifications: updatedNotificationsRead,
                unreadCount: calculateUnreadCount(updatedNotificationsRead), // Cập nhật lại unreadCount
            };
        case NotificationActionType.MARK_AS_READ_FAILURE:
            // Có thể muốn hiển thị lỗi cho một thông báo cụ thể nếu cần
            // Hiện tại chỉ log lỗi trong hook, state error chung có thể được set nếu muốn
            console.error(`Lỗi khi đánh dấu thông báo ${action.payload.notificationId} đã đọc: ${action.payload.error}`);
            return state; // Không thay đổi state nếu chỉ là lỗi của một item cụ thể và đã xử lý qua toast

        //------------------------------------------------------
        // Mark All Notifications as Read
        //------------------------------------------------------
        case NotificationActionType.MARK_ALL_AS_READ_SUCCESS:
            const allReadNotifications = state.notifications.map(notification => ({
                ...notification,
                read: true,
            }));
            return {
                ...state,
                notifications: allReadNotifications,
                unreadCount: 0,
            };
        case NotificationActionType.MARK_ALL_AS_READ_FAILURE:
            console.error(`Lỗi khi đánh dấu tất cả thông báo đã đọc: ${action.payload}`);
            return {
                ...state,
                error: action.payload, // Set lỗi chung nếu thao tác thất bại
            };

        //------------------------------------------------------
        // Delete a Notification_t
        //------------------------------------------------------
        case NotificationActionType.DELETE_NOTIFICATION_SUCCESS:
            const remainingNotifications = state.notifications.filter(
                notification => notification.id !== action.payload.notificationId
            );
            return {
                ...state,
                notifications: remainingNotifications,
                unreadCount: calculateUnreadCount(remainingNotifications), // Cập nhật unreadCount
            };
        case NotificationActionType.DELETE_NOTIFICATION_FAILURE:
            console.error(`Lỗi khi xóa thông báo ${action.payload.notificationId}: ${action.payload.error}`);
            return state; // Không thay đổi state nếu chỉ là lỗi của một item cụ thể

        //------------------------------------------------------
        // Update Unread Count (Nếu có action riêng)
        //------------------------------------------------------
        case NotificationActionType.UPDATE_UNREAD_COUNT:
            return {
                ...state,
                unreadCount: action.payload,
            };

        //------------------------------------------------------
        // Reset Notifications
        //------------------------------------------------------
        case NotificationActionType.RESET_NOTIFICATIONS:
            return initialNotificationState;

        default:
            // TypeScript sẽ cảnh báo nếu có action nào chưa được xử lý (nếu 'action' không phải là 'never')
            // const _exhaustiveCheck: never = action;
            return state;
    }
};