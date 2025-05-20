import { useNavigate } from "react-router-dom";


export default function ExercisePage() {
    const navigate = useNavigate();
    return (
        <main className="flex flex-wrap flex-row gap-3 pt-7 min-h-screen">
            <section className="flex-1 flex flex-column" style={{ minWidth: "400px" }}>
                <div className="shadow-5 m-2 w-full py-4 h-full bg-orange-700 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/doexercise/topic=Câu hỏi từ vựng")} ><h1 className="text-gray-100">Từ vựng</h1></div>
                <div className="shadow-5 m-2 w-full py-4 h-full bg-yellow-700 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/doexercise/topic=Câu hỏi ngữ pháp")} ><h1 className="text-gray-100">Ngữ pháp</h1></div>
            </section>

            <section className="flex-1 flex flex-column" style={{ minWidth: "400px" }}>
                <div className="shadow-5 m-2 w-full py-4 flex-1 bg-green-700 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/doexercise/partNum=1")} ><h1 className="text-gray-100">Nghe hình ảnh</h1></div>
                <div className="shadow-5 m-2 w-full py-4 flex-1 bg-green-700 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/doexercise/partNum=2")} ><h1 className="text-gray-100">Nghe câu hỏi và trả lời</h1></div>
                <div className="shadow-5 m-2 w-full py-4 flex-1 bg-green-700 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/doexercise/partNum=3")} ><h1 className="text-gray-100">Nghe hội thoại</h1></div>
                <div className="shadow-5 m-2 w-full py-4 flex-1 bg-green-700 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/doexercise/partNum=4")} ><h1 className="text-gray-100">Nghe bài học</h1></div>
            </section>

            <section className="flex-1 flex flex-column" style={{ minWidth: "400px" }}>
                <div className="shadow-5 m-2 w-full py-4 h-full bg-blue-700 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/doexercise/partNum=5")} ><h1 className="text-gray-100">Đọc câu</h1></div>
                <div className="shadow-5 m-2 w-full py-4 h-full bg-blue-700 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/doexercise/partNum=6")} ><h1 className="text-gray-100">Đọc đoạn văn</h1></div>
                <div className="shadow-5 m-2 w-full py-4 h-full bg-blue-700 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/doexercise/partNum=7")} ><h1 className="text-gray-100">Đọc hiểu</h1></div>
            </section>
            <section className="flex-1 flex flex-column" style={{ minWidth: "400px" }}>
                <div className="shadow-5 m-2 w-full py-4 h-full bg-purple-200 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/writing/p1")} ><h1 className="text-gray-100">Viết mô tả</h1></div>
                <div className="shadow-5 m-2 w-full py-4 h-full bg-purple-200 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/writing/p2")} ><h1 className="text-gray-100">Trả lời email</h1></div>
                <div className="shadow-5 m-2 w-full py-4 h-full bg-purple-200 glassmorphism text-center align-content-center" style={{ minWidth: "100px" }} onClick={() => navigate("/writing/p3")} ><h1 className="text-gray-100">Viết bài luận</h1></div>
            </section>

        </main>
    )
} 