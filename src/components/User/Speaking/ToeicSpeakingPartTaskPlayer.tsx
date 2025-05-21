//------------------------------------------------------
// Task Player Component

import { Divider } from "primereact/divider";
import { Image } from "primereact/image";
import { Panel } from "primereact/panel";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCallback, useEffect, useState } from "react";
import { ToeicSpeakingPartTaskPlayerProps } from "../../../utils/types/props";
import { ToeicSpeakingPracticeView, ToeicSpeakingTaskType } from "../../../utils/types/type";
import ToeicSpeakingPartAudioRecorder from "./ToeicSpeakingPartAudioRecorder";
import ToeicSpeakingPartTimer from "./ToeicSpeakingPartTimer";
//------------------------------------------------------
const ToeicSpeakingPartTaskPlayer: React.FC<ToeicSpeakingPartTaskPlayerProps> = ({
    task,
    taskIndex,
    currentGlobalView,
    isCurrentTaskContentLoading,
    actions,
}) => {
    // This local state can manage sub-phases within the global view if needed,
    // but for now, we mostly follow currentGlobalView.
    // const [currentPhase, setCurrentPhase] = useState<'loading' | 'preparation' | 'recording' | 'review'>('loading');

    const TIMING_MULTIPLIER = 1.5;
    const [forceStopRecorder, setForceStopRecorder] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined;

        if (currentGlobalView === ToeicSpeakingPracticeView.LOADING_TASK_CONTENT) {
            if (
                task.type === ToeicSpeakingTaskType.DESCRIBE_PICTURE &&
                !task.imageUrl &&
                !task.isContentLoading && // Ensure not already loading this task's content
                !task.contentError
            ) {
                // Defer the dispatch to allow the current render cycle to complete
                timeoutId = setTimeout(() => {
                    // Double-check conditions inside timeout in case state changed rapidly
                    // This check might be overly cautious if dependencies are well-managed
                    if (currentGlobalView === ToeicSpeakingPracticeView.LOADING_TASK_CONTENT && !task.isContentLoading) {
                        actions.fetchDynamicContentForTask(taskIndex);
                    }
                }, 0);
            } else if (!task.isContentLoading) {
                // If not a picture task needing fetch, or content is already considered (not loading, no error for it)
                // Defer the dispatch
                timeoutId = setTimeout(() => {
                    // Similar cautious check
                    if (currentGlobalView === ToeicSpeakingPracticeView.LOADING_TASK_CONTENT && !task.isContentLoading) {
                        actions.proceedToPreparation();
                    }
                }, 0);
            }
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [
        task.type,
        task.imageUrl,
        task.isContentLoading,
        task.contentError,
        taskIndex,
        currentGlobalView,
        actions
    ]);
    useEffect(() => { setForceStopRecorder(false); }, [task, currentGlobalView]);

    const handlePrepTimerEnd = useCallback(() => {
        console.log(`[TaskPlayer] Preparation for task ${task.id} ended.`);
        actions.startRecordingPhase(); // Trigger transition to recording phase
    }, [actions, task.id]);
    const handleResponseTimerEnd = useCallback(() => {
        console.log(`[TaskPlayer] Response time for task ${task.id} ended.`);
        setForceStopRecorder(true);
        // The saveResponse action in the hook now automatically calls NEXT_QUESTION_OR_TASK
    }, [task.id]);
    const handleAudioRecordingComplete = useCallback((audioBlob: Blob) => {
        console.log(`[TaskPlayer] Audio recording complete for task ${task.id}. Blob size: ${audioBlob.size}`);
        actions.saveResponse({
            taskId: task.id,
            // subQuestionId: undefined, // Add if handling sub-questions
            audioBlob: audioBlob, // Use the real Blob from the recorder
        });
        // The saveResponse action in the hook automatically calls NEXT_QUESTION_OR_TASK
        // Reset forceStop for the next potential recording (if any, or next task)
        setForceStopRecorder(false);
    }, [actions, task.id]);
    //------------------------------------------------------
    // Render Task Content
    //------------------------------------------------------
    const renderTaskSpecificContent = () => {
        if (!task) return <p>Không có thông tin bài tập.</p>;

        // Handle content loading state for the task
        if (task.isContentLoading || isCurrentTaskContentLoading) { // Check both specific task and global flag from prop
            return (
                <div className="p-d-flex p-flex-column p-ai-center p-my-3">
                    <ProgressSpinner style={{ width: '60px', height: '60px' }} />
                    <p className="p-mt-2">Đang tải nội dung bài tập...</p>
                </div>
            );
        }

        if (task.contentError) {
            return (
                <div className="p-message p-message-error p-my-3">
                    <p>Lỗi khi tải nội dung: {task.contentError}</p>
                    {/* Optionally, a retry button could call actions.fetchDynamicContentForTask(taskIndex) again */}
                </div>
            );
        }

        // Render content based on task type
        switch (task.type) {
            case ToeicSpeakingTaskType.READ_ALOUD:
                return (
                    <div className="toeic-task-read-aloud">
                        <h4>Đọc to đoạn văn sau:</h4>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{task.content}</p>
                    </div>
                );
            case ToeicSpeakingTaskType.DESCRIBE_PICTURE:
                if (task.imageUrl) {
                    return (
                        <div className="toeic-task-describe-picture p-text-center">
                            <h4>Miêu tả bức tranh sau:</h4>
                            <Image src={task.imageUrl} alt={`Hình ảnh cho chủ đề: ${task.imageQuery}`} width="80%" preview />
                        </div>
                    );
                }
                // If imageUrl is not available yet, but not loading and no error,
                // it means fetching might not have been triggered or completed.
                // The useEffect above should handle triggering the fetch.
                return <p>Đang chờ hình ảnh...</p>;

            case ToeicSpeakingTaskType.RESPOND_TO_QUESTIONS:
                // For now, just display the series title and general instructions.
                // Individual question handling will come later.
                return (
                    <div className="toeic-task-respond-to-questions">
                        <h4>{task.seriesTitle || task.title}</h4>
                        {/* We'll need to manage currentSubQuestionIndex later */}
                        {/* For now, just show the first question's text as an example or general instructions */}
                        <p>Bạn sẽ trả lời một chuỗi các câu hỏi.</p>
                        {task.questions && task.questions.length > 0 && (
                            <div className="p-mt-2">
                                <strong>Câu hỏi đầu tiên (ví dụ):</strong> {task.questions[0].questionText}
                            </div>
                        )}
                    </div>
                );
            // Add cases for other task types later
            // case ToeicSpeakingTaskType.EXPRESS_OPINION:
            //   return <h4>Trình bày quan điểm của bạn về chủ đề: {task.topic}</h4>;
            default:
                return <p>Loại bài tập này chưa được hỗ trợ hiển thị chi tiết.</p>;
        }
    };


    // Determine which timer to show or if task content is loading
    let contentToShow;

    if (currentGlobalView === ToeicSpeakingPracticeView.LOADING_TASK_CONTENT) {
        contentToShow = renderTaskSpecificContent();
    } else if (currentGlobalView === ToeicSpeakingPracticeView.PREPARATION) {
        const prepTime = Math.max(1, Math.floor((task.prepTimeSeconds || 0) * TIMING_MULTIPLIER));
        contentToShow = (
            <>
                {renderTaskSpecificContent()}
                <Divider />
                <ToeicSpeakingPartTimer
                    key={`${task.id}-prep`}
                    durationSeconds={prepTime}
                    standardDurationSeconds={task.prepTimeSeconds || 0}
                    onTimerEnd={handlePrepTimerEnd}
                    isPrepTime={true}
                    title="Thời gian chuẩn bị"
                />
            </>
        );
    } else if (currentGlobalView === ToeicSpeakingPracticeView.RECORDING) {
        const responseTime = Math.max(1, Math.floor((task.responseTimeSeconds || 0) * TIMING_MULTIPLIER));
        contentToShow = (
            <>
                {renderTaskSpecificContent()}
                <Divider />
                {/* HIGHLIGHT: Integrate Audio Recorder F*/}
                <ToeicSpeakingPartAudioRecorder
                    key={`${task.id}-audio-recorder`} // Key to re-mount if needed for new task
                    onRecordingComplete={handleAudioRecordingComplete}
                    forceStop={forceStopRecorder}
                    isRecordingActivePhase={currentGlobalView === ToeicSpeakingPracticeView.RECORDING}
                />
                <Divider className="p-my-2" />
                <ToeicSpeakingPartTimer
                    key={`${task.id}-response`}
                    durationSeconds={responseTime}
                    standardDurationSeconds={task.responseTimeSeconds || 0}
                    onTimerEnd={handleResponseTimerEnd} // This will set forceStopRecorder
                    isPrepTime={false}
                    title="Thời gian trả lời"
                />
            </>
        );

    }
    return (
        <Panel header={`${task.title || "Bài tập"} (${viewTypeToDisplay(currentGlobalView)})`} className="toeic-task-player">
            <p className="p-mb-3"><em>{task.instructions}</em></p>
            <Divider />
            <div className="task-content-area p-my-3">
                {contentToShow}
            </div>
        </Panel>
    );
};
// Helper to make view names more user-friendly in the panel header
const viewTypeToDisplay = (view: ToeicSpeakingPracticeView): string => {
    switch (view) {
        case ToeicSpeakingPracticeView.LOADING_TASK_CONTENT: return "Đang tải";
        case ToeicSpeakingPracticeView.PREPARATION: return "Chuẩn bị";
        case ToeicSpeakingPracticeView.RECORDING: return "Ghi âm";
        default: return view;
    }
};
export default ToeicSpeakingPartTaskPlayer;