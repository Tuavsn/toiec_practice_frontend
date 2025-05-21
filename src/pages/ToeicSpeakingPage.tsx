import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import ToeicSpeakingPartTaskPlayer from "../components/User/Speaking/ToeicSpeakingPartTaskPlayer";
import { useToeicSpeaking } from "../hooks/ToeicSpeakingLogicHook";
import { ToeicSpeakingPracticeView } from "../utils/types/type";

const ToeicSpeakingPartPage: React.FC = () => {
    const { viewState, uiControls, actions } = useToeicSpeaking();

    //------------------------------------------------------
    // Render Helper Functions
    // Các hàm hỗ trợ render từng phần của UI, sử dụng state và actions từ hook
    //------------------------------------------------------

    const renderIntroView = () => (
        <Card title="Chào mừng bạn đến với Luyện thi TOEIC Speaking">
            <div className="p-fluid">
                <p className="p-mb-4">
                    Đây là môi trường mô phỏng bài thi Nói TOEIC, giúp bạn làm quen với các dạng câu hỏi và rèn luyện kỹ năng.
                    Thời gian chuẩn bị và trả lời sẽ được kéo dài 1.5 lần so với thời gian thi thật để bạn có thêm thời gian luyện tập.
                    Thời gian chuẩn của bài thi vẫn sẽ được hiển thị để bạn tham khảo.
                </p>
                <p className="p-mb-4">
                    Nhấn "Bắt đầu" để thử sức!
                </p>
                {uiControls.isPromptsLoading && (
                    <div className="p-d-flex p-jc-center p-ai-center p-my-3">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" />
                        <p className="p-ml-2">Đang tải bài tập...</p>
                    </div>
                )}
                {viewState.overallError && !uiControls.isPromptsLoading && (
                    <div className="p-message p-message-error p-my-3">{viewState.overallError}</div>
                )}
                <Button
                    label="Bắt đầu luyện tập"
                    icon="pi pi-play"
                    onClick={actions.startSimulation}
                    disabled={uiControls.isStartSimulationDisabled}
                    className="p-mt-2"
                />
            </div>
        </Card>
    );

    const renderTestInProgressView = () => {
        if (!uiControls.isTestInProgress || !viewState.currentTask) {
            // This case should ideally be handled by the main view logic,
            // but as a fallback, show loading or an error.
            if (uiControls.isPromptsLoading || (uiControls.isTestInProgress && !viewState.currentTask && !viewState.overallError)) {
                return (
                    <div className="p-d-flex p-flex-column p-ai-center p-my-3">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                        <p className="p-mt-2">Đang chuẩn bị bài thi...</p>
                    </div>
                );
            }
            return (
                <Card title="Lỗi">
                    <p>Không thể hiển thị bài tập hiện tại. Vui lòng thử bắt đầu lại.</p>
                    <Button label="Về trang chủ" onClick={actions.resetSimulation} className="p-mt-2" />
                </Card>
            );
        }

        // We have a current task and the test is in progress
        return (
            <ToeicSpeakingPartTaskPlayer
                task={viewState.currentTask}
                taskIndex={viewState.currentTaskIndex} // Pass the 0-based index
                currentGlobalView={viewState.currentView}
                isCurrentTaskContentLoading={uiControls.isCurrentTaskContentLoading}
                actions={actions} // Pass all actions; TaskPlayer will use what it needs
            />
        );
    };

    const renderSummaryView = () => (
        <Card title="Kết quả luyện tập">
            <p>Bạn đã hoàn thành bài luyện tập!</p>
            <p><em>(Phần tổng kết và xem lại các câu trả lời sẽ được hiển thị ở đây)</em></p>
            <Button
                label="Luyện tập lại"
                icon="pi pi-refresh"
                onClick={actions.resetSimulation} // Sử dụng action từ hook
                className="p-mt-2"
            />
        </Card>
    );

    //------------------------------------------------------
    // Main Render Logic
    // Logic render chính dựa trên currentView từ hook
    //------------------------------------------------------
    let viewToRender;
    switch (viewState.currentView) {
        case ToeicSpeakingPracticeView.INTRO:
            viewToRender = renderIntroView();
            break;
        case ToeicSpeakingPracticeView.PREPARATION:
        case ToeicSpeakingPracticeView.RECORDING: // These will eventually be distinct.
        case ToeicSpeakingPracticeView.LOADING_TASK_CONTENT: // View for when task content is loading (e.g. Pexels image)
            if (uiControls.isTestInProgress) {
                viewToRender = renderTestInProgressView();
            } else {
                // Fallback if isTestInProgress is false but view suggests it should be
                viewToRender = renderIntroView();
            }
            break;
        case ToeicSpeakingPracticeView.SUMMARY:
            viewToRender = renderSummaryView();
            break;
        default:
            viewToRender = <p>Trạng thái không xác định.</p>;
    }

    return (
        <div className="toeic-speaking-part-page p-m-3 p-grid p-jc-center">
            <div className="p-col-12 p-md-10 p-lg-8">
                {viewToRender}
            </div>
        </div>
    );
};

export default ToeicSpeakingPartPage;