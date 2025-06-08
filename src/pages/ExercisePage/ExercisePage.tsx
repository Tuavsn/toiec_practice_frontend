import { Panel } from "primereact/panel";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "../../components/Common/GlassCard/GlassCard";

const practiceSections = [
    {
        title: "Kiến thức Nền tảng", // Tiêu đề của Section (tùy chọn, không hiển thị trực tiếp)
        colorGroup: "orange", // Dùng để tạo màu tương ứng hoặc chỉ là nhóm logic
        items: [
            { title: "Từ vựng", path: "/doexercise/topic=Câu hỏi từ vựng", icon: "pi pi-book", bgColorClass: "bg-orange-500" },
            { title: "Ngữ pháp", path: "/doexercise/topic=Câu hỏi ngữ pháp", icon: "pi pi-compass", bgColorClass: "bg-yellow-500" },
        ]
    },
    {
        title: "Luyện Nghe",
        colorGroup: "green",
        items: [
            { title: "Nghe hình ảnh", path: "/doexercise/partNum=1", icon: "pi pi-image", bgColorClass: "bg-green-500" },
            { title: "Nghe hỏi và trả lời", path: "/doexercise/partNum=2", icon: "pi pi-question-circle", bgColorClass: "bg-green-500" },
            { title: "Nghe hội thoại", path: "/doexercise/partNum=3", icon: "pi pi-comments", bgColorClass: "bg-green-500" },
            { title: "Nghe bài học", path: "/doexercise/partNum=4", icon: "pi pi-headphones", bgColorClass: "bg-green-500" },
        ]
    },
    {
        title: "Luyện Đọc",
        colorGroup: "blue",
        items: [
            { title: "Đọc câu", path: "/doexercise/partNum=5", icon: "pi pi-align-left", bgColorClass: "bg-blue-500" },
            { title: "Đọc đoạn văn", path: "/doexercise/partNum=6", icon: "pi pi-list", bgColorClass: "bg-blue-500" },
            { title: "Đọc hiểu", path: "/doexercise/partNum=7", icon: "pi pi-directions", bgColorClass: "bg-blue-500" }, // Giả sử có icon này
        ]
    },
    {
        title: "Luyện Viết",
        colorGroup: "purple",
        items: [
            { title: "Viết mô tả", path: "/writing/p1", icon: "pi pi-palette", bgColorClass: "bg-purple-500" },
            { title: "Trả lời email", path: "/writing/p2", icon: "pi pi-envelope", bgColorClass: "bg-purple-500" },
            { title: "Viết bài luận", path: "/writing/p3", icon: "pi pi-file-edit", bgColorClass: "bg-purple-500" },
        ]
    }
];
export default function ExercisePage() {
    const navigate = useNavigate();
    return (
        <main className="pt-5 pb-5 min-h-screen surface-ground"> {/* Thêm surface-ground để glassmorphism có nền để blur */}
            <div className="container mx-auto px-2 md:px-4"> {/* Container để giới hạn chiều rộng và căn giữa */}
                <Panel header="Chọn Phần Luyện Tập TOEIC" className="mb-5 shadow-2 border-round-lg" pt={{ header: { className: 'text-2xl font-bold text-primary' } }}>
                    {/* Bạn có thể thêm mô tả hoặc hướng dẫn ở đây nếu muốn */}
                </Panel>

                <div className="grid">
                    {practiceSections.map((section, sectionIndex) => (
                        // Mỗi section là một cột trên màn hình lớn, chiếm toàn bộ chiều rộng trên màn hình nhỏ hơn
                        // xl:col-3 (4 cột trên XL), lg:col-4 (3 cột trên LG), md:col-6 (2 cột trên MD), col-12 (1 cột trên SM)
                        // Hoặc đơn giản là md:col-6 xl:col-3 cho 2 hoặc 4 cột
                        <div key={sectionIndex} className="col-12 md:col-6 xl:col-3 flex flex-column">
                            {/* Optional: Tiêu đề cho mỗi section nếu bạn muốn hiển thị */}
                            {/* <h2 className="text-xl font-semibold mb-2 text-center md:text-left">{section.title}</h2> */}
                            {section.items.map((item) => (
                                <GlassCard
                                    key={item.title}
                                    title={item.title}
                                    onClick={() => navigate(item.path)}
                                    bgColorClass={item.bgColorClass || 'bg-gray-700'} // Lớp màu nền tùy chỉnh với alpha
                                    textColorClass="text-white" // Giữ màu chữ trắng cho dễ đọc trên nền màu
                                    icon={item.icon}
                                    className="h-10rem md:h-12rem" // Set chiều cao cố định hoặc min-height cho card
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
} 