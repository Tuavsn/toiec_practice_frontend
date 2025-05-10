import { TreeNode } from "primereact/treenode";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { callGetAssignmentRows } from "../api/api";
import SetWebPageTitle from "../utils/helperFunction/setTitlePage";
import { AssignmentQuestion, LectureID, QuestionNumber } from "../utils/types/type";

export function useAssignmentTable() {
    // === Lấy test_id từ URL ===
    // Lấy test_id từ URL thông qua hook useParams, nếu không có thì mặc định là "no_idTest_found"
    const { lecture_id = "no_idlecture_found" } = useParams<{ lecture_id: LectureID }>();
    // === Khởi tạo các trạng thái cần thiết ===
    const [isVisible, setIsVisible] = useState<boolean>(false); // Trạng thái hiển thị của Dialog
    const currentSelectedQuestion = useRef<TreeNode>({});     // Câu hỏi hiện tại được chọn
    const [nodes, setNodes] = useState<TreeNode[]>([]); // Lưu dữ liệu câu hỏi dạng TreeNode
    const [title, setTitle] = useState<string>("Xóa");  // Tiêu đề của Dialog
    const [reload, setReload] = useState(false); // Trạng thái reload
    // === Hàm lấy dữ liệu câu hỏi theo trang ===
    const fetchAssignmentQuestionByPage = useCallback(async () => {
        // Gọi API để lấy dữ liệu câu hỏi
        const responseData = await callGetAssignmentRows(lecture_id);
        if (!responseData) {
            return;
        }

        // Chuyển đổi dữ liệu thành dạng TreeNode và cập nhật state
        setNodes(ConvertAssignmentRowListToTreeNodeList(responseData));

    }, []);

    // === useEffect để gọi fetchQuestionByPage khi khởi tạo ===
    useEffect(() => { SetWebPageTitle("Quản lý câu hỏi") }, []); // Thiết lập tiêu đề trang web
    useEffect(() => { fetchAssignmentQuestionByPage() }, [reload]); // Gọi hàm fetch dữ liệu câu hỏi lần đầu


    // === Giá trị trả về từ hook ===
    return {
        currentSelectedQuestion, // Câu hỏi hiện tại được chọn
        setIsVisible, // Hàm thay đổi trạng thái hiển thị của Dialog
        isVisible, // Trạng thái hiển thị của Dialog,
        setReload, // Hàm thay đổi trạng thái reload
        setTitle, // Hàm thay đổi tiêu đề của Dialog
        title, // Tiêu đề của Dialog
        nodes, // Dữ liệu câu hỏi dạng TreeNode
    };
}

function ConvertAssignmentRowListToTreeNodeList(QuestionRowList: AssignmentQuestion[]): TreeNode[] {

    // Duyệt qua từng QuestionRow trong danh sách và chuyển đổi thành TreeNode
    const questionNodeList = QuestionRowList.map((questionRow: AssignmentQuestion, index: number): TreeNode => {
        return {
            // Chuyển đổi QuestionRow thành TreeNode, bao gồm cả id
            ...ConvertAssignmentRowToNode(questionRow, index + 1),

        }
    });
    return questionNodeList;
}

function ConvertAssignmentRowToNode(questionRow: AssignmentQuestion, qNum: QuestionNumber): TreeNode {
    return {
        key: `key_${qNum}`,
        data: {
            //----
            questionNum: qNum,
            //------
            ask: questionRow.content,
            choices: questionRow.answers,
            correctChoice: questionRow.correctAnswer,
            transcript: questionRow.transcript,
            explanation: questionRow.explanation,
            //------
            //------
            resources: questionRow.resources,
            //------
        }
    }
}