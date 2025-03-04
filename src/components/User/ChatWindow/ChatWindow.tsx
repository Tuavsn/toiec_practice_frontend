import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { callGetChatMessage } from "../../../api/api";
import { ChatMessage } from "../../../utils/types/type";

const ChatWindow: React.FC = React.memo(() => {
    const { input, setInput, messageLogs, sendMessage, handleKeyPress } = useChat();

    return (
        <Card title="Chat with Assistant" className="p-4 w-96">
            <div className="chat-box p-2 max-h-80 overflow-auto border rounded mb-2">
                {messageLogs.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"} mb-2`}>
                        <span className={`p-2 rounded-lg inline-block max-w-xs ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
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

