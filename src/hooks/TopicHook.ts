import { useRef, useEffect } from "react";
import { callGetTopics } from "../api/api";
import { Topic } from "../utils/types/type";

export default function useTopicRef() {
    const topicListRef = useRef<Topic[]>([])
    useEffect(() => {
        const getAllTopic = async () => {
            const responseData = await callGetTopics();
            topicListRef.current = responseData.data; // Lưu chủ đề 
        }
        getAllTopic();
    }, [])

    return topicListRef;
}