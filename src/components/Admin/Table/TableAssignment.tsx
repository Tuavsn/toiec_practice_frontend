// ------------------------ Thành phần bảng câu hỏi dạng cây --------------------------------------

import { TreeNode } from "primereact/treenode";
import { TreeTable } from "primereact/treetable";
import React from "react";
import { useAssignmentTable } from "../../../hooks/AssignmentHook";
import { AssignmentQuestionTableProps } from "../../../utils/types/props";
import { RenderColumnsForTable } from "../AdminColumn/ColumnsQuestionAssignmentTreeTable";
import { DialogQuestionActionButton } from "../AdminDialog/DialogAssignmentRelate";

// Thành phần hiển thị bảng câu hỏi dạng cây, với các cột và hàng được thiết kế cụ thể
const AssignmentQuestionTreeTable: React.FC<AssignmentQuestionTableProps> = React.memo(
    ({
        setContextDialogBody,
        setResourceDialogBody,
    }) => {

        const {
            currentSelectedQuestion,
            setIsVisible,
            setReload,
            isVisible,
            setTitle,
            nodes,
            title,
        } = useAssignmentTable();
        // tạo ra màn hình chờ 
        // if (currentPageIndex === -1) {
        //     return <LoadingSpinner text='Dữ liệu đang tải' />
        // }
        // Xác định lớp CSS của hàng dựa trên điều kiện (các hàng là PART 1 2 3...7 sẽ có màu xanh dương bao phủ)
        const rowClassName = (node: TreeNode) => {
            return { 'p-highlight': (!node.data.createdAt) };
        }

        return (
            <React.Fragment>
                {/* Dialog dùng để hiển thị nội dung xác nhận xóa hoặc cập nhật câu hỏi. */}
                <DialogQuestionActionButton setReload={setReload} isVisible={isVisible} title={title} setIsVisible={setIsVisible} currentSelectedQuestion={currentSelectedQuestion} />

                <TreeTable paginator value={nodes} rows={5} scrollable emptyMessage="Không có câu hỏi" rowClassName={rowClassName} >

                    {RenderColumnsForTable(setContextDialogBody, setResourceDialogBody, setTitle, setIsVisible, currentSelectedQuestion)}

                </TreeTable>

            </React.Fragment>

        )
    }
)

export default AssignmentQuestionTreeTable;