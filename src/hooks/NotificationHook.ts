// Filename: src/features/notifications/useNotification.ts
import { useCallback, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteNotification, fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../api/api';
import { useToast } from '../context/ToastProvider';
import { initialNotificationState } from '../utils/types/emptyValue';
import { Notification_t, NotificationActionType } from '../utils/types/type';
import { notificationReducer } from './NotificationReducer';



//------------------------------------------------------
// Constants
//------------------------------------------------------
const DEFAULT_PAGE_SIZE = 10; // Số lượng thông báo mặc định trên mỗi trang

/**
 * @hook useNotification
 * @description Hook tùy chỉnh để quản lý logic và state của thông báo.
 * Bao gồm fetch, đánh dấu đã đọc, xóa, và xử lý phân trang.
 */
export const useNotification = () => {
    const [state, dispatch] = useReducer(notificationReducer, initialNotificationState);
    const navigate = useNavigate();
    const { toast } = useToast(); // Sử dụng hook toast toàn cục của bạn

    //------------------------------------------------------
    // Helper to calculate unread count from a list
    //------------------------------------------------------
    const countUnread = (notifications: Notification_t[]): number => {
        return notifications.filter(n => !n.read).length;
    };

    //------------------------------------------------------
    // API Interaction Callbacks
    //------------------------------------------------------

    /**
     * Tải danh sách thông báo ban đầu.
     * Được gọi khi component mount hoặc khi cần refresh.
     */
    const loadInitialNotifications = useCallback(async (pageSize: number = DEFAULT_PAGE_SIZE) => {
        dispatch({ type: NotificationActionType.FETCH_NOTIFICATIONS_START });
        const response = await fetchNotifications(0, pageSize); // Trang đầu tiên là 0

        if (response && response.data) {
            const fetchedNotifications = response.data.result;
            const fetchedMeta = response.data.meta;
            const unread = countUnread(fetchedNotifications);

            dispatch({
                type: NotificationActionType.FETCH_NOTIFICATIONS_SUCCESS,
                payload: {
                    notifications: fetchedNotifications,
                    meta: fetchedMeta,
                    unreadCount: unread,
                },
            });
        } else {
            dispatch({
                type: NotificationActionType.FETCH_NOTIFICATIONS_FAILURE,
                payload: 'Không thể tải thông báo. Vui lòng thử lại.',
            });
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tải thông báo. Vui lòng thử lại.',
                life: 3000,
            });
        }
    }, [toast]); // Dependencies: toast (nếu nó thay đổi)

    /**
     * Tải thêm thông báo (phân trang).
     */
    const loadMoreNotifications = useCallback(async () => {
        if (!state.meta || state.meta.current >= state.meta.totalPages - 1 || state.isLoadingMore) {
            // Không tải thêm nếu đang ở trang cuối, không có meta, hoặc đang tải rồi
            return;
        }

        dispatch({ type: NotificationActionType.LOAD_MORE_NOTIFICATIONS_START });
        const nextPage = state.meta.current + 1;
        const response = await fetchNotifications(nextPage, state.meta.pageSize || DEFAULT_PAGE_SIZE);

        if (response && response.data) {
            const newNotifications = response.data.result;
            const newMeta = response.data.meta;
            // unreadCount sẽ được tính lại trong reducer từ tổng số notifications
            dispatch({
                type: NotificationActionType.LOAD_MORE_NOTIFICATIONS_SUCCESS,
                payload: {
                    notifications: newNotifications,
                    meta: newMeta,
                    // unreadCount sẽ được reducer tính toán lại
                    unreadCount: 0, // Placeholder, reducer sẽ tính lại
                },
            });
        } else {
            dispatch({
                type: NotificationActionType.LOAD_MORE_NOTIFICATIONS_FAILURE,
                payload: 'Không thể tải thêm thông báo.',
            });
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tải thêm thông báo.',
                life: 3000,
            });
        }
    }, [state.meta, state.isLoadingMore, toast]);

    /**
     * Đánh dấu một thông báo là đã đọc và điều hướng nếu cần.
     * @param {Notification_t} notification - Thông báo cần xử lý.
     */
    const handleNotificationClick = useCallback(async (notification: Notification_t) => {
        // Chỉ đánh dấu đã đọc nếu nó chưa đọc
        if (!notification.read) {
            const response = await markNotificationAsRead(notification.id);
            if (response && response.data) {
                const updatedNotificationFromServer = response.data; // API trả về data trong data
                dispatch({
                    type: NotificationActionType.MARK_AS_READ_SUCCESS,
                    payload: {
                        notificationId: notification.id,
                        updatedNotification: updatedNotificationFromServer,
                        // newUnreadCount sẽ được reducer tính toán lại
                        newUnreadCount: 0, // Placeholder
                    },
                });
                // Không cần toast thành công cho việc này, nó khá ngầm
            } else {
                dispatch({
                    type: NotificationActionType.MARK_AS_READ_FAILURE,
                    payload: {
                        notificationId: notification.id,
                        error: `Không thể đánh dấu thông báo ${notification.id} là đã đọc.`,
                    }
                });
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể cập nhật trạng thái thông báo.',
                    life: 3000,
                });
                // Không điều hướng nếu đánh dấu đã đọc thất bại
                return;
            }
        }

        if (notification.deepLink) {
            navigate(notification.deepLink);
        } else {
            console.warn(`Loại thông báo không xác định: ${notification.type}`);

        }
    }, [navigate, toast]);

    /**
     * Đánh dấu tất cả thông báo là đã đọc.
     */
    const markAllAsRead = useCallback(async () => {
        const response = await markAllNotificationsAsRead();
        if (response) { // Chỉ cần API trả về thành công, không nhất thiết phải có data cụ thể
            dispatch({ type: NotificationActionType.MARK_ALL_AS_READ_SUCCESS });
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Tất cả thông báo đã được đánh dấu là đã đọc.',
                life: 3000,
            });
        } else {
            dispatch({
                type: NotificationActionType.MARK_ALL_AS_READ_FAILURE,
                payload: 'Không thể đánh dấu tất cả thông báo là đã đọc.',
            });
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể đánh dấu tất cả thông báo là đã đọc.',
                life: 3000,
            });
        }
    }, [toast]);

    /**
     * Xóa một thông báo.
     * @param {string} notificationId - ID của thông báo cần xóa.
     */
    const deleteNotificationItem = useCallback(async (notificationId: string) => {
        const response = await deleteNotification(notificationId);
        if (response) { // API trả về thành công
            dispatch({
                type: NotificationActionType.DELETE_NOTIFICATION_SUCCESS,
                payload: {
                    notificationId,
                    // newUnreadCount sẽ được reducer tính toán lại
                    newUnreadCount: 0, // Placeholder
                },
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Thông báo đã được xóa.',
                life: 3000,
            });
        } else {
            dispatch({
                type: NotificationActionType.DELETE_NOTIFICATION_FAILURE,
                payload: {
                    notificationId,
                    error: `Không thể xóa thông báo ${notificationId}.`,
                }
            });
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể xóa thông báo. Vui lòng thử lại.',
                life: 3000,
            });
        }
    }, [toast]);

    /**
     * Reset state thông báo về giá trị ban đầu.
     * Có thể dùng khi người dùng logout.
     */
    const resetNotifications = useCallback(() => {
        dispatch({ type: NotificationActionType.RESET_NOTIFICATIONS });
    }, []);


    //------------------------------------------------------
    // Effects
    //------------------------------------------------------
    // Tải thông báo ban đầu khi hook được sử dụng lần đầu (component mount)
    useEffect(() => {
        loadInitialNotifications();
    }, [loadInitialNotifications]); // `loadInitialNotifications` là dependency

    //------------------------------------------------------
    // Return values
    //------------------------------------------------------
    return {
        // State
        notifications: state.notifications,
        meta: state.meta,
        unreadCount: state.unreadCount,
        isLoading: state.isLoading,
        isLoadingMore: state.isLoadingMore,
        error: state.error,

        // Actions / Handlers
        loadInitialNotifications, // Có thể muốn expose ra để refresh thủ công
        loadMoreNotifications,
        handleNotificationClick,
        markAllAsRead,
        deleteNotificationItem,
        resetNotifications, // Expose hàm reset
    };
};