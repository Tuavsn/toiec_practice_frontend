// Filename: src/features/ToeicSpeakingPart/components/ToeicSpeakingPartTimer.tsx
import { ProgressBar } from 'primereact/progressbar'; // Sử dụng ProgressBar cho trực quan hóa thời gian
import { Tag } from 'primereact/tag'; // Để hiển thị trạng thái (ví dụ: "Thời gian chuẩn đã hết")
import React, { useEffect, useRef, useState } from 'react';
import { ToeicSpeakingPartTimerProps } from '../../../utils/types/props';


//------------------------------------------------------
// Helper Functions
//------------------------------------------------------

/**
 * @description Định dạng số giây thành chuỗi MM:SS.
 * @param totalSeconds Tổng số giây.
 * @returns Chuỗi định dạng MM:SS.
 */
const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

//------------------------------------------------------
// Timer Component
//------------------------------------------------------
const ToeicSpeakingPartTimer: React.FC<ToeicSpeakingPartTimerProps> = ({
    durationSeconds,          // Thời gian thực tế để đếm ngược (đã nhân 1.5x)
    standardDurationSeconds,  // Thời gian chuẩn của ETS (để hiển thị tham khảo)
    onTimerEnd,               // Callback khi hết giờ
    isPrepTime,               // Cờ xác định đây là thời gian chuẩn bị hay thời gian trả lời
    title = isPrepTime ? "Thời gian chuẩn bị" : "Thời gian trả lời", // Tiêu đề cho timer
}) => {
    const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
    const [hasExceededStandardTime, setHasExceededStandardTime] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Reset remaining seconds when durationSeconds changes (e.g., new task/phase)
        // This ensures the timer visually starts from the new duration.
        setRemainingSeconds(durationSeconds);

        // The TaskPlayer ensures durationSeconds is >= 1, so direct call to onTimerEnd here is less likely.
        // However, to be absolutely safe if that assumption is violated:
        if (durationSeconds <= 0) {
            const timerId = setTimeout(() => onTimerEnd(), 0); // Defer to next tick
            return () => clearTimeout(timerId);
        }

        intervalRef.current = setInterval(() => {
            setRemainingSeconds((prevSeconds) => {
                if (prevSeconds <= 1) {
                    clearInterval(intervalRef.current!);
                    onTimerEnd(); // This is an async callback, generally fine.
                    return 0;
                }
                return prevSeconds - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [durationSeconds, onTimerEnd]); // onTimerEnd should be stable if memoized by parent

    // Effect to manage 'hasExceededStandardTime' state
    useEffect(() => {
        // This effect runs when remainingSeconds, durationSeconds, or standardDurationSeconds changes.
        // It correctly calculates if the standard time has been exceeded based on current remaining time.
        const elapsedTime = durationSeconds - remainingSeconds;
        const shouldBeExceeded = elapsedTime >= standardDurationSeconds;

        // Only update the state if the calculated value is different from the current state
        // This prevents redundant re-renders and potential issues.
        if (shouldBeExceeded !== hasExceededStandardTime) {
            setHasExceededStandardTime(shouldBeExceeded);
        }
    }, [remainingSeconds, durationSeconds, standardDurationSeconds, hasExceededStandardTime]);

    const progressValue = durationSeconds > 0 ? (remainingSeconds / durationSeconds) * 100 : 0;

    const standardTimeStyle: React.CSSProperties = {
        transition: 'color 0.3s ease',
        color: hasExceededStandardTime ? 'var(--orange-500)' : 'var(--text-color-secondary)',
        fontWeight: hasExceededStandardTime ? 'bold' : 'normal',
    };

    return (
        <div className="toeic-speaking-timer p-card p-p-3" style={{ border: `2px solid ${isPrepTime ? 'var(--blue-500)' : 'var(--green-500)'}`, borderRadius: '6px' }}>
            <h4 className="p-my-0 p-mb-2">{title}</h4>
            <div className="p-d-flex p-ai-center p-jc-between p-mb-2">
                <div className="timer-display" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: isPrepTime ? 'var(--blue-700)' : 'var(--green-700)' }}>
                    {formatTime(remainingSeconds)}
                </div>
                <div className="standard-time-info p-text-right">
                    <div style={standardTimeStyle}>
                        Thời gian chuẩn: {formatTime(standardDurationSeconds)}
                    </div>
                    {hasExceededStandardTime && (
                        <Tag severity="warning" value="Đã qua thời gian chuẩn" className="p-mt-1"></Tag>
                    )}
                </div>
            </div>
            <ProgressBar
                value={progressValue}
                showValue={false}
                style={{ height: '10px' }}
                color={isPrepTime ? 'var(--blue-500)' : 'var(--green-500)'}
            />
            {remainingSeconds <= 5 && remainingSeconds > 0 && (
                <div className="p-mt-2 p-text-center" style={{ color: 'var(--red-500)', fontWeight: 'bold' }}>
                    Sắp hết giờ!
                </div>
            )}
        </div>
    );
};

export default ToeicSpeakingPartTimer;