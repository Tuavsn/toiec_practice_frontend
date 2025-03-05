import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import React, { useState } from "react";
import { callGetChatMessage } from "../../../api/api";
import { ChatMessage } from "../../../utils/types/type";

const ChatWindow: React.FC = React.memo(() => {
    const { input, setInput, messageLogs, sendMessage, handleKeyPress } = useChat();

    return (
        <Card title="Hỏi cùng chuyên gia" className="bg-yellow-100 border-solid p-4 w-96">
            <hr></hr>
            <ScrollPanel className="chat-box p-2 h-24rem mb-2">
                {messageLogs.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-content-end pl-4" : "justify-content-start pr-4"} mb-2`}>
                        <span className={`p-2 border-round-lg inline-block max-w-xs white-space-normal text-overflow-wrap ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                            {msg.text}
                        </span>

                    </div>
                ))}
            </ScrollPanel>
            <div className="flex gap-2">
                <InputText
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1"
                    placeholder="Type a message..."
                />
                <Button label="Send" icon="pi pi-send" onClick={() => sendMessage(input)} disabled={!input.trim()} />
            </div>
        </Card>

    );
});
function useChat() {
    const [messageLogs, setMessageLogs] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const sendMessage = async (message: string) => {
        if (!message.trim()) return;

        const newMessageLogs: ChatMessage[] = [...messageLogs, { sender: "user", text: message }];
        setMessageLogs(newMessageLogs);
        setInput("");
        const response = await callGetChatMessage(message);
        setMessageLogs([...newMessageLogs, { sender: "bot", text: response } as ChatMessage]);
    };
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            sendMessage(input);
        }
    };
    return { input, setInput, messageLogs, sendMessage, handleKeyPress };
}

export default ChatWindow;

