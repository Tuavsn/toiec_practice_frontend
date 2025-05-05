
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import React, { memo } from 'react';
import { DialogForQuestionPage } from '../../components/Admin/AdminDialog/DialogAssignmentRelate';
import AssignmentQuestionTreeTable from '../../components/Admin/Table/TableAssignment';
import { CustomBreadCrumb } from '../../components/Common/Index';
import { useQuestion } from '../../hooks/QuestionHook';

// Hàm xuất trang quản lý câu hỏi của Admin
export function AdminManageAssignmentPage() {


    // Sử dụng hook useQuestion để lấy các dữ liệu liên quan như:
    const {
        setResourceDialogBodyVisible,
        setContextDialogBodyVisible,
        resourceDialogBodyVisible,
        contextDialogBodyVisible,
    } = useQuestion()

    return (
        <React.Fragment>
            <div key={'b'}>
                <CustomBreadCrumb />
                <Card className="my-2">
                    <div key={'a'}>
                        <div className="card pb-5">
                            {/* Thanh công cụ hiển thị tiêu đề */}
                            <Toolbar start={<h1>Danh sách câu hỏi</h1>} />
                        </div>

                        {/* Hiển thị bảng cây chứa các câu hỏi có phân trang */}
                        <AssignmentQuestionTreeTable
                            setContextDialogBody={setContextDialogBodyVisible}
                            setResourceDialogBody={setResourceDialogBodyVisible}
                        />
                        <DialogForQuestionPage
                            title='Tài nguyên của câu hỏi'
                            dialogBodyVisible={resourceDialogBodyVisible}
                            setIsDialogVisible={setResourceDialogBodyVisible}
                        />
                        <DialogForQuestionPage
                            title='Nội dung câu hỏi'
                            dialogBodyVisible={contextDialogBodyVisible}
                            setIsDialogVisible={setContextDialogBodyVisible}
                        />

                    </div>
                </Card>
            </div>
        </React.Fragment>
    )
}

export default memo(AdminManageAssignmentPage);