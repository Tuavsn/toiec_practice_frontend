import { Topic } from "../types/type";

export default function GetTopicNameFromTopic(topics: Topic[]): string {
    return topics.map((t: Topic) => t.name).join(" ,")
}