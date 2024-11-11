import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";


export default function ExercisePage() {
    const navigate = useNavigate();
    return (
        <main className="flex flex-wrap flex-row gap-3 pt-7">
            <section className="flex-1" style={{minWidth:"400px"}}>
                <Card className="shadow-5 m-2" style={{ minWidth: "100px" }} onClick={()=>navigate("/practice/vocabulary")} title="Từ vựng" />
                <Card className="shadow-5 m-2" style={{ minWidth: "100px" }} onClick={()=>navigate("/practice/grammar")} title="Ngữ pháp" />

            </section>
            <section className="flex-1" style={{minWidth:"400px"}}>

                <Card className="shadow-5 m-2" style={{ minWidth: "100px" }} onClick={()=>navigate("/practice/part1")} title="Nghe hình ảnh" />
                <Card className="shadow-5 m-2" style={{ minWidth: "100px" }} onClick={()=>navigate("/practice/part2")} title="Nghe câu hỏi và trả lời" />
                <Card className="shadow-5 m-2" style={{ minWidth: "100px" }} onClick={()=>navigate("/practice/part3")} title="Nghe hội thoại" />
                <Card className="shadow-5 m-2" style={{ minWidth: "100px" }} onClick={()=>navigate("/practice/part4")} title="Nghe bài giảng" />
            </section>
            <section className="flex-1" style={{minWidth:"400px"}}>
                <Card className="shadow-5 m-2" style={{ minWidth: "100px" }} onClick={()=>navigate("/practice/part5")} title="Đọc câu" />
                <Card className="shadow-5 m-2" style={{ minWidth: "100px" }} onClick={()=>navigate("/practice/part6")} title="Đọc đoạn văn" />
                <Card className="shadow-5 m-2" style={{ minWidth: "100px" }} onClick={()=>navigate("/practice/part7")} title="Đọc hiểu" />
            </section>
        </main>
    )
} 