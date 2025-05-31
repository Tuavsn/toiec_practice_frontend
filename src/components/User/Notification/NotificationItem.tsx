// Filename: src/features/notifications/components/NotificationItem.tsx
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import React from 'react';
import { NotificationItemProps } from '../../../utils/types/props';
import { NotificationType_t } from '../../../utils/types/type';
// Helper function to format date (simple version)
// Trong ứng dụng thực tế, bạn có thể dùng date-fns hoặc dayjs
const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} giây trước`;
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
};

//------------------------------------------------------
// NotificationItem Component
//------------------------------------------------------
const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onClick,
    onDelete,
}) => {
    // Xử lý sự kiện click vào item
    const handleItemClick = (_e: React.MouseEvent<HTMLDivElement>) => {
        // Ngăn chặn sự kiện nổi bọt nếu nút xóa được click bên trong item
        // Tuy nhiên, với cấu trúc này, nút xóa nằm ngoài vùng click chính
        onClick(notification);
    };

    // Xử lý sự kiện click vào nút xóa
    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Ngăn không cho sự kiện click của item cha được kích hoạt
        onDelete(notification.id);
    };

    // Xác định icon dựa trên loại thông báo
    const getNotificationIcon = () => {
        switch (notification.type) {
            case NotificationType_t.COMMENT_REPLY_TEST:
                return 'pi pi-file-edit'; // Icon cho trả lời bình luận bài test
            case NotificationType_t.COMMENT_REPLY_LECTURE:
                return 'pi pi-book'; // Icon cho trả lời bình luận bài giảng
            default:
                return 'pi pi-info-circle'; // Icon mặc định
        }
    };

    return (
        <div
            className={classNames(
                'notification-item p-3 flex align-items-start justify-content-between gap-3 w-full hover:surface-100 cursor-pointer border-bottom-1 surface-border last:border-bottom-none',
                { 'font-bold bg-bluegray-50': !notification.read } // Kiểu khác cho thông báo chưa đọc
            )}
            onClick={handleItemClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(e as any); }}
            aria-label={`Thông báo: ${notification.message}`}
        >
            <div className="flex align-items-start gap-3">
                <i className={classNames(getNotificationIcon(), 'text-xl text-primary mt-1')} />
                <div className="flex-grow-1">
                    <p className="m-0 text-sm">{notification.message}</p>
                    <small className="text-xs text-color-secondary">
                        {formatTimeAgo(notification.createdAt)}
                    </small>
                </div>
            </div>
            <Button
                icon="pi pi-times"
                className="p-button-text p-button-rounded p-button-danger p-0 ml-2" // Adjusted for better spacing and look
                onClick={handleDeleteClick}
                tooltip="Xóa thông báo"
                tooltipOptions={{ position: 'top' }}
                aria-label="Xóa thông báo này"
            />
        </div>
    );
};

export default NotificationItem;