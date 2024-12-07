import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";


export default function ExercisePage() {
    const navigate = useNavigate();
    return (
        <main className="flex flex-wrap flex-row gap-3 pt-7 min-h-screen">
            <section className="flex-1 flex flex-column" style={{ minWidth: "400px" }}>
                <Button severity="success" className="shadow-5 m-2 w-full py-4 h-full bg-red-100 glassmorphism" style={{ minWidth: "100px" }} text raised onClick={() => navigate("/doexercise/topic=vocabulary")} label="Từ vựng" />
                <Button severity="danger" className="shadow-5 m-2 w-full py-4 h-full bg-yellow-100 glassmorphism" style={{ minWidth: "100px" }} text raised onClick={() => navigate("/doexercise/topic=grammar")} label="Ngữ pháp" />
            </section>

            <section className="flex-1 flex flex-column" style={{ minWidth: "400px" }}>
                <Button severity="help" className="shadow-5 m-2 w-full py-4 flex-1 bg-green-100 glassmorphism" style={{ minWidth: "100px" }} text raised onClick={() => navigate("/doexercise/partNum=1")} label="Nghe hình ảnh" />
                <Button severity="help" className="shadow-5 m-2 w-full py-4 flex-1 bg-green-100 glassmorphism" style={{ minWidth: "100px" }} text raised onClick={() => navigate("/doexercise/partNum=2")} label="Nghe câu hỏi và trả lời" />
                <Button severity="help" className="shadow-5 m-2 w-full py-4 flex-1 bg-green-100 glassmorphism" style={{ minWidth: "100px" }} text raised onClick={() => navigate("/doexercise/partNum=3")} label="Nghe hội thoại" />
                <Button severity="help" className="shadow-5 m-2 w-full py-4 flex-1 bg-green-100 glassmorphism" style={{ minWidth: "100px" }} text raised onClick={() => navigate("/doexercise/partNum=4")} label="Nghe bài giảng" />
            </section>

            <section className="flex-1 flex flex-column" style={{ minWidth: "400px" }}>
                <Button severity="warning" className="shadow-5 m-2 w-full py-4 h-full bg-blue-100 glassmorphism" style={{ minWidth: "100px" }} text raised onClick={() => navigate("/doexercise/partNum=5")} label="Đọc câu" />
                <Button severity="warning" className="shadow-5 m-2 w-full py-4 h-full bg-blue-100 glassmorphism" style={{ minWidth: "100px" }} text raised onClick={() => navigate("/doexercise/partNum=6")} label="Đọc đoạn văn" />
                <Button severity="warning" className="shadow-5 m-2 w-full py-4 h-full bg-blue-100 glassmorphism" style={{ minWidth: "100px" }} text raised onClick={() => navigate("/doexercise/partNum=7")} label="Đọc hiểu" />
            </section>

        </main>
    )
} 