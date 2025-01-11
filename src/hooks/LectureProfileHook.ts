import { useEffect, useState } from "react";
import { callGetLectureCardProfile } from "../api/api";
import { LectureCard } from "../utils/types/type";

export default function useLectureProfile() {
    const [onGoingLectures, setOnGoingLecture] = useState<LectureCard[]>([]);
    const [completeLectures, setCompleteLecture] = useState<LectureCard[]>([]);
    useEffect(() => {
        callGetLectureCardProfile().then((result) => {
            if (!result) {
                return;
            }
            setCompleteLecture(result.completed);
            setOnGoingLecture(result.notCompleted);
        })
    }, [])
    return {
        onGoingLectures,
        completeLectures,
    }
}