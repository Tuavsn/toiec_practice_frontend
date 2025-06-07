// Filename: src/features/notifications/components/NotificationPanel.tsx
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ScrollPanel } from 'primereact/scrollpanel';
import React from 'react';
import { NotificationPanelProps } from '../../../utils/types/props';
import { Notification_t } from '../../../utils/types/type';
import NotificationItem from './NotificationItem';

//------------------------------------------------------
// NotificationPanel Component
//------------------------------------------------------
const NotificationPanel: React.FC<NotificationPanelProps> = (
    {
        onClosePanel,
        deleteNotificationItem,
        error,
        handleNotificationClick,
        isLoading,
        isLoadingMore,
        loadMoreNotifications,
        markAllAsRead,
        meta,
        notifications,
        unreadCount
    }
) => {


    // Wrapper for handleNotificationClick to also close the panel
    const onItemClick = (notification: Notification_t) => {
        handleNotificationClick(notification); // Call the hook's logic first
        if (onClosePanel) {
            onClosePanel(); // Then close the panel
        }
    };

    //------------------------------------------------------
    // Render Loading State
    //------------------------------------------------------
    if (isLoading && notifications.length === 0) { // Chỉ hiển thị spinner toàn cục khi tải lần đầu
        return (
            <div className="p-4 flex justify-content-center align-items-center" style={{ minHeight: '200px', width: '350px' }}>
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
            </div>
        );
    }

    //------------------------------------------------------
    // Render Error State
    //------------------------------------------------------
    if (error && notifications.length === 0) { // Chỉ hiển thị lỗi toàn cục khi không có thông báo nào
        return (
            <div className="p-4" style={{ width: '350px' }}>
                <Message severity="error" text={error || 'Đã có lỗi xảy ra.'} className="w-full" />
            </div>
        );
    }

    //------------------------------------------------------
    // Render Empty State
    //------------------------------------------------------
    if (!isLoading && notifications.length === 0) {
        return (
            <div className="p-4 text-center text-color-secondary" style={{ width: '350px', minHeight: '100px' }}>
                <i className="pi pi-inbox" style={{ fontSize: '2rem' }}></i>
                <p className="mt-2">Bạn không có thông báo mới.</p>
            </div>
        );
    }

    //------------------------------------------------------
    // Render Notification List
    //------------------------------------------------------
    return (
        <div className="notification-panel p-0" style={{ width: '380px', maxWidth: '90vw' }}>
            {/* Header: Mark all as read */}
            <div className="flex justify-content-between align-items-center border-bottom-1 surface-border">
                <h5 className="m-0">Thông báo</h5>
                {notifications.length > 0 && (
                    <Button
                        label="Đánh dấu tất cả đã đọc"
                        icon="pi pi-check-square"
                        className="p-button-sm p-button-text"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0 || isLoading || isLoadingMore}
                        tooltip={unreadCount === 0 ? "Không có thông báo chưa đọc" : "Đánh dấu tất cả là đã đọc"}
                        tooltipOptions={{ position: 'top' }}
                    />
                )}
            </div>

            {/* Notification List */}
            <ScrollPanel style={{ width: '100%', height: '350px' }} className="notifications-scroll-panel">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClick={() => onItemClick(notification)} // Sử dụng hàm onItemClick đã được bọc
                        onDelete={deleteNotificationItem}
                    />
                ))}
                {!isLoading && notifications.length === 0 && !error && (
                    <div className="p-4 text-center text-color-secondary" style={{ width: '100%', minHeight: '100px' }}>
                        <i className="pi pi-inbox" style={{ fontSize: '2rem' }}></i>
                        <p className="mt-2">Bạn không có thông báo mới.</p>
                    </div>
                )}
                {isLoading && notifications.length > 0 && ( // Spinner nhỏ khi tải tiếp trong lúc đã có notif
                    <div className="p-2 flex justify-content-center">
                        <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="5" />
                    </div>
                )}
            </ScrollPanel>

            {/* Footer: Load more & Error during load more */}
            {(meta && meta.current < meta.totalPages - 1) || isLoadingMore || (error && notifications.length > 0) ? (
                <>
                    <Divider />
                    <div className="p-3 text-center">
                        {error && notifications.length > 0 && !isLoadingMore && (
                            <Message severity="error" text={error} className="w-full mb-2" />
                        )}
                        {meta && meta.current < meta.totalPages - 1 && (
                            <Button
                                label="Tải thêm"
                                icon="pi pi-arrow-down"
                                className="p-button-sm p-button-outlined w-full"
                                onClick={loadMoreNotifications}
                                loading={isLoadingMore}
                                disabled={isLoadingMore}
                            />
                        )}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default NotificationPanel;