
import { Card } from 'primereact/card';
import React, { memo } from 'react';
import { DialogForQuestionPage } from '../../components/Admin/AdminDialog/DialogQuestionRelate';
import QuestionTreeTable from '../../components/Admin/Table/TableQuestion';
import { CustomBreadCrumb } from '../../components/Common/Index';
import { useQuestion } from '../../hooks/QuestionHook';

// Hàm xuất trang quản lý câu hỏi của Admin
export function AdminManageQuestionPage() {


    // Sử dụng hook useQuestion để lấy các dữ liệu liên quan như:
    const {
        setResourceDialogBodyVisible,
        setContextDialogBodyVisible,
        resourceDialogBodyVisible,
        setTopicDialogBodyVisible,
        contextDialogBodyVisible,
        topicDialogBodyVisible,
    } = useQuestion()

    return (
        <React.Fragment>
            <div key={'b'}>
                <CustomBreadCrumb />
                <Card className="my-2">
                    <div key={'a'}>

                        {/* Hiển thị bảng cây chứa các câu hỏi có phân trang */}
                        <QuestionTreeTable
                            setContextDialogBody={setContextDialogBodyVisible}
                            setResourceDialogBody={setResourceDialogBodyVisible}
                            setTopicDialogBody={setTopicDialogBodyVisible}
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
                        <DialogForQuestionPage
                            title='Chủ đề của câu hỏi'
                            dialogBodyVisible={topicDialogBodyVisible}
                            setIsDialogVisible={setTopicDialogBodyVisible}
                        />

                    </div>
                </Card>
            </div>
        </React.Fragment>
    )
}

export default memo(AdminManageQuestionPage);