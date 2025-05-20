import { Card } from "primereact/card";
import { Ripple } from "primereact/ripple";
import { GlassCardProps } from "../../../utils/types/props";


export const GlassCard = ({
    title,
    onClick,
    bgColorClass,
    textColorClass = 'text-gray-100', // Màu chữ mặc định như bạn đang dùng
    icon,
    className = '',
}: GlassCardProps) => {
    // Bình luận: Đây là component Card tùy chỉnh với hiệu ứng glassmorphism.
    // Nó sử dụng Card của PrimeReact để có cấu trúc tốt và khả năng truy cập.
    // Lớp 'glassmorphism' cần được bạn định nghĩa trong CSS.

    const cardContent = (
        <div className={`flex flex-column align-items-center justify-content-center h-full ${textColorClass}`}>
            {icon && <i className={`${icon} text-4xl md:text-5xl mb-3`}></i>}
            <h1 className="text-2xl md:text-3xl font-bold m-0 text-center">{title}</h1>
        </div>
    );

    return (
        <div
            className={`p-3 flex-grow-1 ${className}`} // flex-grow-1 để các card trong cùng cột cố gắng chiếm không gian bằng nhau
            onClick={onClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
            role="button"
            tabIndex={0}
            aria-label={title}
        >
            <Card
                className={`w-full h-full shadow-5 border-round-lg glassmorphism ${bgColorClass} p-ripple flex align-items-center justify-content-center`}
                style={{ cursor: 'pointer' }} // Đảm bảo cursor là pointer
            >
                {cardContent}
                <Ripple />
            </Card>
        </div>
    );
};