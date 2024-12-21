import React, { useEffect, useState } from "react";
import { SimpleTimeCountDownProps } from "../../../utils/types/props";

const SimpleTimeCountDown: React.FC<SimpleTimeCountDownProps> = React.memo(
    ({ timeLeftInSecond, onTimeUp, isTutorial }) => {
        const [secondsLeft, setSecondsLeft] = useState(timeLeftInSecond);

        useEffect(() => {
            if (secondsLeft <= 0) { onTimeUp(); return; }
            const timer = setInterval(() => { if (!isTutorial) setSecondsLeft(prev => prev - 1); }, 1000);
            return () => clearInterval(timer);
        }, [secondsLeft]);

        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;

        // Determine background color class based on time left
        const bgColorClass = secondsLeft <= 30 ? 'bg-red-200' : 'bg-blue-200';

        return (
            <div className={` text-center align-items-center justify-content-center`}>
                <h5 className={`px-1 inline py-1 ${bgColorClass} border-dashed border-round-md`}>
                    {minutes} phút và {seconds < 10 ? `0${seconds}` : seconds} giây
                </h5>
            </div>
        );
    }
)

export default SimpleTimeCountDown;