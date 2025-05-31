// Filename: src/features/notifications/components/NotificationItem.tsx
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import React from 'react';
import { NotificationItemProps } from '../../../utils/types/props';
import { NotificationType_t } from '../../../utils/types/type';
// Helper function to format date (simple version)
// Trong ứng dụng thực tế, bạn có thể dùng date-fns hoặc dayjs
/**
 * Chuyển đổi timestamp số (giây.milliseconds) thành chuỗi thời gian tương đối.
 * @param numericTimestamp - Timestamp dạng số, ví dụ: 1748702144.586 (giây.milliseconds)
 * @returns Chuỗi biểu thị thời gian đã trôi qua (ví dụ: "5 phút trước")
 */
const formatTimeAgo = (numericTimestamp: number): string => {
    // Kiểm tra đầu vào hợp lệ
    if (typeof numericTimestamp !== 'number' || isNaN(numericTimestamp)) {
        return ''; // Hoặc một giá trị mặc định như "Không rõ thời gian"
    }

    // Chuyển đổi timestamp (giây.milliseconds) thành milliseconds
    const date = new Date(numericTimestamp * 1000); // highlight
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

    // Ngăn chặn hiển thị thời gian âm nếu có sự không đồng bộ nhỏ về đồng hồ
    if (seconds < 0) return 'vài giây trước';

    if (seconds < 5) return 'vài giây trước'; // "just now"
    if (seconds < 60) return `${seconds} giây trước`; // "seconds ago"

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`; // "minutes ago"

    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`; // "hours ago"

    const days = Math.round(hours / 24);
    // Với khoảng thời gian dài hơn, bạn có thể muốn hiển thị ngày cụ thể
    // Ví dụ: if (days > 7) return date.toLocaleDateString('vi-VN');
    return `${days} ngày trước`; // "days ago"
};

//------------------------------------------------------
// NotificationItem Component
//------------------------------------------------------
const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onClick,
    onDelete,
}) => {
    const handleItemClick = (_e: React.MouseEvent<HTMLDivElement>) => {
        onClick(notification);
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onDelete(notification.id);
    };

    const getNotificationIcon = () => {
        switch (notification.type) {
            case NotificationType_t.COMMENT_REPLY_TEST:
                return 'pi pi-file-edit';
            case NotificationType_t.COMMENT_REPLY_LECTURE:
                return 'pi pi-book';
            default:
                return 'pi pi-info-circle';
        }
    };
    const unreadItemStyle = !notification.read ? 'surface-100' : '';

    return (
        <div
            className={classNames(
                'notification-item p-3 flex align-items-start justify-content-between w-full hover:surface-200 cursor-pointer border-bottom-1 surface-border last:border-bottom-none',
                unreadItemStyle // Áp dụng style cho item chưa đọc
            )}
            onClick={handleItemClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(e as any); }}
            aria-label={`Thông báo: ${notification.message}`}
        >
            {/* Container chính cho nội dung (icon và khối văn bản) */}
            {/* Quan trọng: flex-grow-1 để chiếm không gian và min-width: 0 để cho phép co lại và cắt bớt văn bản */}
            <div className="flex align-items-start gap-3 flex-grow-1" style={{ minWidth: 0 }}>
                {/* Icon: không co lại */}
                <i className={classNames(getNotificationIcon(), 'text-xl text-primary mt-1 flex-shrink-0')} aria-hidden="true" />

                {/* Khối văn bản (tin nhắn và dấu thời gian) */}
                {/* Quan trọng: flex-grow-1 và min-width: 0 ở đây cũng giúp kiểm soát tràn văn bản */}
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <p
                        className={classNames(
                            "m-0 text-sm line-height-3"
                            // unreadTextStyle // Áp dụng style chữ đậm nếu cần cho tin nhắn chưa đọc
                        )}
                        style={{
                            whiteSpace: 'normal', // Cho phép văn bản xuống dòng
                            wordBreak: 'break-word', // Ngắt các từ dài để tránh tràn container
                            overflowWrap: 'break-word', // Tương tự như word-break cho các trình duyệt khác nhau
                        }}
                    >
                        {notification.message}
                    </p>
                    <small className="text-xs text-color-secondary mt-1 block"> {/* 'block' để margin-top có hiệu lực */}
                        {formatTimeAgo(notification.createdAt)}
                    </small>
                </div>
            </div>

            {/* Container cho nút xóa: không co lại, căn giữa theo chiều dọc nếu cần */}
            <div className="flex-shrink-0 ml-2 flex align-items-center">
                <Button
                    icon="pi pi-times"
                    className="p-button-text p-button-rounded p-button-danger p-button-sm"
                    onClick={handleDeleteClick}
                    tooltip="Xóa thông báo"
                    tooltipOptions={{ position: 'top' }}
                    aria-label="Xóa thông báo này"
                />
            </div>
        </div>
    );
};

export default NotificationItem;