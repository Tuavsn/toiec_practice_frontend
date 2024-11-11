
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { memo } from 'react';
import { useQuestion } from '../../hooks/QuestionHook';
import { DialogForQuestionPage } from './DialogRelate';
import QuestionTreeTable from './TableQuestion';

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
        toast,
    } = useQuestion()

    return (
        <React.Fragment>
            <div key={'b'}>
                <Card className="my-2">
                    <div key={'a'}>
                        {/* Thành phần Toast để hiển thị thông báo */}
                        <Toast ref={toast} />
                        <div className="card pb-5">
                            {/* Thanh công cụ hiển thị tiêu đề */}
                            <Toolbar start={<h1>chưa biết làm gì</h1>} />
                        </div>

                        {/* Hiển thị bảng cây chứa các câu hỏi có phân trang */}
                        <QuestionTreeTable
                            toast={toast}
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