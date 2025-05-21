// Filename: src/features/ToeicSpeakingPart/components/ToeicSpeakingPartAudioRecorder.tsx
import { Button } from 'primereact/button';
import { Message } from 'primereact/message'; // For displaying errors or info
import { Tag } from 'primereact/tag'; // For recording status
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ToeicSpeakingPartAudioRecorderProps } from '../../../utils/types/props';



enum RecordingState {
    IDLE = 'idle', // Chưa ghi âm, sẵn sàng
    REQUESTING_PERMISSION = 'requesting_permission', // Đang yêu cầu quyền mic
    PERMISSION_DENIED = 'permission_denied', // Quyền mic bị từ chối
    READY_TO_RECORD = 'ready_to_record', // Đã có quyền, sẵn sàng nhấn nút ghi âm
    RECORDING = 'recording', // Đang ghi âm
    PROCESSING = 'processing', // Đang xử lý audio sau khi dừng
    ERROR = 'error', // Lỗi khác
}

const ToeicSpeakingPartAudioRecorder: React.FC<ToeicSpeakingPartAudioRecorderProps> = ({
    onRecordingComplete,
    forceStop = false,
    isRecordingActivePhase,
}) => {
    const [recordingState, setRecordingState] = useState<RecordingState>(RecordingState.IDLE);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const MimeType = 'audio/webm;codecs=opus'; // Recommended modern codec

    // Function to request microphone permission and initialize MediaRecorder
    const initializeMediaRecorder = useCallback(async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setErrorDetails('Trình duyệt không hỗ trợ API ghi âm (getUserMedia).');
            setRecordingState(RecordingState.ERROR);
            return null;
        }

        setRecordingState(RecordingState.REQUESTING_PERMISSION);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setRecordingState(RecordingState.READY_TO_RECORD);

            const options: { mimeType?: string } = { mimeType: MimeType };
            if (!MediaRecorder.isTypeSupported(MimeType) && MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
                options.mimeType = 'audio/ogg;codecs=opus';
            } else if (!MediaRecorder.isTypeSupported(MimeType) && MediaRecorder.isTypeSupported('audio/wav')) { // Fallback for broader compatibility if needed
                options.mimeType = 'audio/wav';
                console.warn("Using WAV for recording, file sizes may be larger.");
            } else if (!MediaRecorder.isTypeSupported(MimeType)) {
                console.warn(`${MimeType} is not supported. Using default system mimeType.`);
                delete options.mimeType; // Let the browser decide
            }


            const recorder = new MediaRecorder(stream, options);
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            recorder.onstop = () => {
                setRecordingState(RecordingState.PROCESSING);
                const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || MimeType });
                onRecordingComplete(audioBlob);
                audioChunksRef.current = []; // Reset chunks for next recording
                setRecordingState(RecordingState.READY_TO_RECORD); // Ready for another recording
                // Stop media stream tracks to turn off microphone indicator
                stream.getTracks().forEach(track => track.stop());
            };
            recorder.onerror = (event) => {
                console.error("MediaRecorder error:", event);
                setErrorDetails(`Lỗi MediaRecorder: ${(event as any).error?.name} - ${(event as any).error?.message}`);
                setRecordingState(RecordingState.ERROR);
            };
            return recorder;
        } catch (err) {
            console.error("Lỗi khi yêu cầu quyền microphone:", err);
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setErrorDetails('Bạn đã từ chối quyền truy cập microphone. Vui lòng cho phép để ghi âm.');
                    setRecordingState(RecordingState.PERMISSION_DENIED);
                } else {
                    setErrorDetails(`Lỗi microphone: ${err.name} - ${err.message}`);
                    setRecordingState(RecordingState.ERROR);
                }
            } else {
                setErrorDetails('Lỗi không xác định khi truy cập microphone.');
                setRecordingState(RecordingState.ERROR);
            }
            return null;
        }
    }, [onRecordingComplete]); // MimeType is constant within this scope

    const startRecording = async () => {
        if (!isRecordingActivePhase) {
            console.warn("Recording phase is not active, cannot start recording.");
            setErrorDetails("Chức năng ghi âm chưa sẵn sàng hoặc đã kết thúc.");
            setRecordingState(RecordingState.IDLE);
            return;
        }
        switch (recordingState) {
            case RecordingState.IDLE:
            case RecordingState.READY_TO_RECORD:
                let recorderToUse = mediaRecorderRef.current;
                if (!recorderToUse || recordingState === RecordingState.IDLE) {
                    recorderToUse = await initializeMediaRecorder();
                    if (recorderToUse) { mediaRecorderRef.current = recorderToUse; }
                    else { return; }
                }
                if (mediaRecorderRef.current && recordingState === RecordingState.READY_TO_RECORD) { // Check again, initializeMediaRecorder sets this state
                    audioChunksRef.current = [];
                    mediaRecorderRef.current.start();
                    setRecordingState(RecordingState.RECORDING);
                } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
                    mediaRecorderRef.current.resume();
                    setRecordingState(RecordingState.RECORDING);
                } else if (![RecordingState.REQUESTING_PERMISSION, RecordingState.ERROR, RecordingState.PERMISSION_DENIED, RecordingState.RECORDING].includes(recordingState)) {
                    console.warn(`Could not start recording. Current state: ${recordingState}. MediaRecorder: ${mediaRecorderRef.current?.state}`);
                }
                break;
            case RecordingState.RECORDING: console.warn("Already recording."); break;
            case RecordingState.REQUESTING_PERMISSION: case RecordingState.PROCESSING: console.warn(`Cannot start recording in state: ${recordingState}`); break;
            case RecordingState.PERMISSION_DENIED: case RecordingState.ERROR: console.warn(`Cannot start recording due to: ${recordingState}. Error: ${errorDetails}`); break;
            default: console.warn(`Unhandled recording state in startRecording: ${recordingState}`);
        }
    };

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && (mediaRecorderRef.current.state === "recording" || mediaRecorderRef.current.state === "paused")) {
            mediaRecorderRef.current.stop();
            // The onstop event handler will manage further state transitions and callback
        } else {
            // console.warn("Cannot stop: Not recording or MediaRecorder not initialized.");
        }
    }, []);


    // Effect to handle forceStop from parent
    useEffect(() => {
        if (forceStop && recordingState === RecordingState.RECORDING) {
            stopRecording();
        }
    }, [forceStop, recordingState, stopRecording]);

    // Effect to initialize when the recording phase becomes active
    useEffect(() => {
        const statesRequiringReinitialization: RecordingState[] = [
            RecordingState.IDLE,
            RecordingState.ERROR,
            RecordingState.PERMISSION_DENIED,
        ];

        if (isRecordingActivePhase && statesRequiringReinitialization.includes(recordingState)) {
            const init = async () => {
                const recorder = await initializeMediaRecorder();
                if (recorder) {
                    mediaRecorderRef.current = recorder;
                    // initializeMediaRecorder will set state to READY_TO_RECORD on success
                }
            };
            init();
        } else if (!isRecordingActivePhase && mediaRecorderRef.current) {
            if (mediaRecorderRef.current.state === "recording") {
                stopRecording();
            }
            // Clean up existing stream if any, and reset recorder instance
            mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current = null;
            setRecordingState(RecordingState.IDLE); // Reset to IDLE when phase is no longer active
            setErrorDetails(null); // Clear any previous errors
        }
    }, [isRecordingActivePhase, recordingState, initializeMediaRecorder, stopRecording]);



    const handleButtonClick = () => {
        if (recordingState === RecordingState.RECORDING) {
            stopRecording();
        } else {
            const attemptStartStates: RecordingState[] = [
                RecordingState.IDLE,
                RecordingState.READY_TO_RECORD,
                RecordingState.ERROR, // Allow re-attempt from error states
                RecordingState.PERMISSION_DENIED, // Allow re-attempt from permission denied
            ];
            if (isRecordingActivePhase && attemptStartStates.includes(recordingState)) {
                startRecording();
            } else if (!isRecordingActivePhase) {
                // If user clicks when phase is not active, show a message and potentially reset some states
                setErrorDetails("Chức năng ghi âm chưa được kích hoạt bởi bài tập.");
                if ([RecordingState.ERROR, RecordingState.PERMISSION_DENIED, RecordingState.READY_TO_RECORD].includes(recordingState)) {
                    setRecordingState(RecordingState.IDLE); // Reset to a clean idle state
                    setErrorDetails(null); // Clear specific error if just phase issue
                }
            }
            // If in other states like REQUESTING_PERMISSION or PROCESSING, button is typically disabled.
        }
    };


    // TODO: Implement "Hold Space to Record" logic if desired.
    // This would involve adding and removing global event listeners for keydown/keyup.
    // Be careful with focus management and event listener cleanup.
    let statusMessage = "";
    let buttonLabel = "Bắt đầu Ghi âm";
    let buttonIcon = "pi pi-microphone";
    let buttonSeverity: "success" | "danger" | "warning" | "info" | "help" | undefined = "success";
    let isButtonDisabled = !isRecordingActivePhase; // Initial disabled state

    switch (recordingState) {
        case RecordingState.IDLE:
            statusMessage = isRecordingActivePhase ? "Nhấn để chuẩn bị Mic & Ghi âm" : "Ghi âm chưa được kích hoạt.";
            buttonLabel = "Chuẩn bị Mic & Ghi âm"; // Changed label for clarity
            isButtonDisabled = !isRecordingActivePhase;
            break;
        // ... other cases for UI rendering ...
        case RecordingState.REQUESTING_PERMISSION:
            statusMessage = "Đang yêu cầu quyền microphone...";
            isButtonDisabled = true;
            break;
        case RecordingState.PERMISSION_DENIED:
            return <Message severity="error" text={errorDetails || "Quyền microphone bị từ chối."} className="p-w-full" />;
        case RecordingState.READY_TO_RECORD:
            statusMessage = "Sẵn sàng ghi âm. Nhấn để bắt đầu.";
            buttonLabel = "Bắt đầu Ghi âm";
            buttonIcon = "pi pi-microphone";
            buttonSeverity = "success";
            isButtonDisabled = !isRecordingActivePhase;
            break;
        case RecordingState.RECORDING:
            statusMessage = "Đang ghi âm...";
            buttonLabel = "Dừng Ghi âm";
            buttonIcon = "pi pi-stop-circle";
            buttonSeverity = "danger";
            isButtonDisabled = false;
            break;
        case RecordingState.PROCESSING:
            statusMessage = "Đang xử lý âm thanh...";
            isButtonDisabled = true;
            break;
        case RecordingState.ERROR:
            return <Message severity="error" text={errorDetails || "Đã xảy ra lỗi không xác định."} className="p-w-full" />;
    }

    if (!isRecordingActivePhase && recordingState !== RecordingState.RECORDING) {
        isButtonDisabled = true;
        // Update status message if phase is not active but user might see the button
        if ([RecordingState.IDLE, RecordingState.READY_TO_RECORD].includes(recordingState)) {
            statusMessage = "Ghi âm chưa được kích hoạt bởi bài tập.";
            buttonLabel = "Chuẩn bị Mic"; // Revert label
        }
    }

    return (
        <div className="toeic-audio-recorder p-d-flex p-flex-column p-ai-center p-py-3">
            <Tag
                value={statusMessage}
                severity={
                    recordingState === RecordingState.RECORDING ? "danger" :
                        recordingState === RecordingState.READY_TO_RECORD ? "success" :
                            recordingState === RecordingState.PROCESSING ? "info" :
                                "info"
                }
                icon={
                    recordingState === RecordingState.RECORDING ? "pi pi-spin pi-spinner" :
                        recordingState === RecordingState.READY_TO_RECORD ? "pi pi-check" :
                            "pi pi-info-circle"
                }
                className="p-mb-3"
            />
            <Button
                label={buttonLabel}
                icon={buttonIcon}
                severity={buttonSeverity}
                onClick={handleButtonClick}
                disabled={isButtonDisabled || recordingState === RecordingState.REQUESTING_PERMISSION || recordingState === RecordingState.PROCESSING}
                className="p-button-lg"
            />
            {/* For "Hold Space to Record", you might hide the button or change its role */}
            <small className="p-mt-2 p-text-secondary">
                (Hoặc giữ phím Space để ghi âm - tính năng này sẽ được thêm sau)
            </small>
        </div>
    );
};

export default ToeicSpeakingPartAudioRecorder;