import { PaginatorPageChangeEvent } from "primereact/paginator";
import { TreeNode } from "primereact/treenode";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { callGetQuestionRows, callGetTopics } from "../api/api";
import { QuestionID, QuestionRow, TestID, Topic } from "../utils/types/type";

export function useQuestion() {

    const [resourceDialogBodyVisible, setResourceDialogBodyVisible] = useState<JSX.Element | null>(null);
    const [topicDialogBodyVisible, setTopicDialogBodyVisible]       = useState<JSX.Element | null>(null);
    const [contextDialogBodyVisible, setContextDialogBodyVisible]   = useState<JSX.Element | null>(null);



    return {
        contextDialogBodyVisible,
        resourceDialogBodyVisible,
        topicDialogBodyVisible,
        setContextDialogBodyVisible,
        setResourceDialogBodyVisible,
        setTopicDialogBodyVisible

    }
}

export function useQuestionTable() {
    // === Lấy test_id từ URL ===
    // Lấy test_id từ URL thông qua hook useParams, nếu không có thì mặc định là "no_idTest_found"
    const { test_id = "no_idTest_found" } = useParams<{ test_id: TestID }>();

    // === Khởi tạo các trạng thái cần thiết ===
    const [currentPageIndex, setCurrentPageIndex]   = useState(-1);             // Lưu trang hiện tại
    const [isVisible, setIsVisible]                 = useState<boolean>(false); // Trạng thái hiển thị của Dialog
    const currentSelectedQuestion                   = useRef<TreeNode>({});     // Câu hỏi hiện tại được chọn
    const [nodes, setNodes]                         = useState<TreeNode[]>([]); // Lưu dữ liệu câu hỏi dạng TreeNode
    const [title, setTitle]                         = useState<string>("Xóa");  // Tiêu đề của Dialog
    const totalItems                                = useRef<number>(0);        // Lưu tổng số mục, không gây render lại
    const topics                                    = useRef<Topic[]>([]);      // Lưu danh sách chủ đề

    // === Hàm lấy dữ liệu câu hỏi theo trang ===
    const fetchQuestionByPage = useCallback(async (pageIndex: number) => {
        // Gọi API để lấy dữ liệu câu hỏi
        const responseData = await callGetQuestionRows(test_id, pageIndex, 5);

        // Lưu trữ tổng số mục
        totalItems.current = responseData.data.meta.totalItems;

        // Chuyển đổi dữ liệu thành dạng TreeNode và cập nhật state
        setNodes(ConvertQuestionRowListToTreeNodeList(responseData.data.result));

        // Cập nhật lại trang hiện tại
        setCurrentPageIndex(pageIndex);
    }, []); // Hàm fetchQuestionByPage sẽ được tạo lại khi testID thay đổi

    // === useEffect để gọi fetchQuestionByPage khi khởi tạo ===
    useEffect(() => {
        const getAllTopic = async () => {
            const responseData = await callGetTopics();
            topics.current = responseData.data; // Lưu chủ đề vào ref topics
        }
        fetchQuestionByPage(0); // Gọi hàm fetch dữ liệu câu hỏi lần đầu
        getAllTopic(); // Gọi hàm lấy tất cả chủ đề
    }, []);

    // === Hàm xử lý thay đổi trang ===
    const onPageChange = useCallback(async (event: PaginatorPageChangeEvent) => {
        // Gọi fetchQuestionByPage với trang mới
        await fetchQuestionByPage(event.page);
    }, []);

    // === Giá trị trả về từ hook ===
    return {
        currentSelectedQuestion, // Câu hỏi hiện tại được chọn
        totalItems, // Tổng số mục
        currentPageIndex, // Trang hiện tại
        onPageChange, // Hàm xử lý thay đổi trang
        setIsVisible, // Hàm thay đổi trạng thái hiển thị của Dialog
        isVisible, // Trạng thái hiển thị của Dialog
        setTitle, // Hàm thay đổi tiêu đề của Dialog
        topics, // Danh sách chủ đề
        title, // Tiêu đề của Dialog
        nodes, // Dữ liệu câu hỏi dạng TreeNode
    };
}

// Hàm chuyển đổi danh sách QuestionRow thành danh sách TreeNode
function ConvertQuestionRowListToTreeNodeList(QuestionRowList: QuestionRow[]): TreeNode[] {
    
    // Duyệt qua từng QuestionRow trong danh sách và chuyển đổi thành TreeNode
    const questionNodeList = QuestionRowList.map((questionRow): TreeNode => {
        return {
            // Chuyển đổi QuestionRow thành TreeNode, bao gồm cả id
            ...ConvertQuestionRowToNode(questionRow, questionRow.id),
            
            // Nếu có các subQuestions, chuyển đổi chúng thành TreeNode
            children: questionRow.subQuestions.length 
                ? questionRow.subQuestions.map((subquest): TreeNode => {
                    return {
                        ...ConvertQuestionRowToNode(subquest, subquest.id)
                    }
                }) 
                : undefined
        }
    });

    // Nhóm các TreeNode theo partNum bằng cách sử dụng Object.groupBy
    const groupByPartList = Object.groupBy(questionNodeList, (item) => item.data.partNum);

    // Duyệt qua các nhóm, chuyển đổi chúng thành TreeNode theo partNum
    return Object.entries(groupByPartList).map(([partNum, questionNodeArray], index): TreeNode => {
        return {
            key: "part" + index, // Tạo key cho từng nhóm part
            data: {
                type: partNum, // Lưu trữ loại partNum
                questionNum: GroupQuestionNumberForPart(questionNodeArray!) // Số lượng câu hỏi trong part
            },
            children: questionNodeArray // Các câu hỏi thuộc nhóm partNum
        }
    });
}


function ConvertQuestionRowToNode(questionRow: QuestionRow, uniqueID: QuestionID): TreeNode {
    return {
        key: uniqueID,
        data: {
            practiceID: questionRow.practiceId,
            testID: questionRow.testId,
            //----
            questionNum: GroupQuestionNumber(questionRow),
            partNum: questionRow.partNum,
            type: questionRow.type,
            difficulty: questionRow.difficulty || Math.max(...questionRow.subQuestions.map(sq => sq.difficulty)),
            //------
            ask: questionRow.content,
            choices: questionRow.answers,
            correctChoice: questionRow.correctAnswer,
            transcript: questionRow.transcript,
            explanation: questionRow.explanation,
            //------
            topic: questionRow.topic,
            //------
            resources: questionRow.resources,
            //------
            createdAt: questionRow.createdAt,
            updatedAt: questionRow.updatedAt
        }
    }
}

function GroupQuestionNumber(questionRow: QuestionRow): string {
    if (questionRow.subQuestions.length) {
        return questionRow.subQuestions[0].questionNum + " - " + questionRow.subQuestions.at(-1)?.questionNum;
    }
    return questionRow.questionNum.toString();
}

// Hàm xác định dải số câu hỏi cho một phần, từ câu đầu tiên đến câu cuối cùng
function GroupQuestionNumberForPart(questionNodeArray: TreeNode[]): string {
    
    // Lấy số câu hỏi đầu tiên và cuối cùng trong mảng questionNodeArray
    var start = questionNodeArray[0].data.questionNum, // Số câu hỏi đầu tiên
        end = questionNodeArray.at(-1)!.data.questionNum; // Số câu hỏi cuối cùng

    // Kiểm tra nếu phần tử đầu tiên có các câu hỏi con (children)
    if (questionNodeArray[0].children) {
        // Lấy số câu hỏi đầu tiên từ câu hỏi con đầu tiên
        start = Number(questionNodeArray[0].children[0].data.questionNum);

        // Lấy số câu hỏi cuối cùng từ câu hỏi con cuối cùng
        end = Number(questionNodeArray.at(-1)!.children!.at(-1)!.data.questionNum);
    }

    // Trả về dải số câu hỏi theo định dạng "start → end"
    return `${start} → ${end}`;
}
