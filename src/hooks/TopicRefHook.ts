import { useRef, useEffect } from "react";
import { callGetTopics } from "../api/api";
import { Topic } from "../utils/types/type";
import { useToast } from "../context/ToastProvider";

export default function useTopicRef() {
    const topicListRef = useRef<Topic[]>([]);
    const { toast } = useToast();
    useEffect(() => {
        const getAllTopic = async () => {
            const responseData = await callGetTopics();
            if (responseData) {
                topicListRef.current = responseData // Lưu chủ đề 
            }
            else {
                toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải được danh sách chủ đề" });
            }
        }
        getAllTopic();
    }, [])

    return topicListRef;
}