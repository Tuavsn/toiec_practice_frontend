import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import React, { useEffect, useState } from "react";
import { callContinueChat, callStartChat } from "../../../api/api";
import { ChatMessage } from "../../../utils/types/type";
import ReactMarkdown from 'react-markdown';

interface ChatWindowProps {
    questionId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = React.memo(({ questionId }) => {
    console.log("Chat window: " + questionId);
    const { 
        isInitiated, 
        isLoading, 
        input, 
        setInput, 
        messageLogs, 
        startChat, 
        sendMessage, 
        handleKeyPress 
    } = useChat(questionId);

    return (
        <Card title="Hỏi cùng chuyên gia" className="bg-yellow-100 border-solid p-4 w-96">
            <hr></hr>
            <ScrollPanel className="chat-box p-2 h-24rem mb-2">
                {messageLogs.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-content-end pl-4" : "justify-content-start pr-4"} mb-2`}>
                        <span className={`p-2 border-round-lg inline-block max-w-xs white-space-normal text-overflow-wrap ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </span>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-content-start pr-4 mb-2">
                        <span className="p-2 border-round-lg inline-block max-w-xs white-space-normal text-overflow-wrap bg-gray-300 text-black">
                            <i className="pi pi-spin pi-spinner mr-2"></i>
                            Đang suy nghĩ...
                        </span>
                    </div>
                )}
            </ScrollPanel>
            
            {!isInitiated ? (
                <div className="flex justify-content-center">
                    <Button 
                        label="Bắt đầu chat với chuyên gia" 
                        icon="pi pi-comments" 
                        onClick={startChat} 
                        disabled={isLoading}
                        className="p-button-rounded p-button-success"
                    />
                </div>
            ) : (
                <div className="flex gap-2">
                    <InputText
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1"
                        placeholder="Nhập câu hỏi của bạn..."
                        disabled={isLoading}
                    />
                    <Button 
                        icon="pi pi-send" 
                        onClick={() => sendMessage(input)} 
                        disabled={!input.trim() || isLoading}
                        className="p-button-rounded p-button-primary" 
                    />
                </div>
            )}
        </Card>
    );
});

function useChat(questionId: string) {
    const [messageLogs, setMessageLogs] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isInitiated, setIsInitiated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Check if there's a stored session ID
    useEffect(() => {
        console.log("Checking session for question: " + questionId);
        const storedSessionId = localStorage.getItem(`chat_session_${questionId}`);
        if (storedSessionId) {
            try {
                const sessionData = JSON.parse(storedSessionId);
                if (sessionData.expiry > Date.now()) {
                    setSessionId(sessionData.id);
                    setIsInitiated(true);
                    
                    // If we have stored messages, restore them
                    const storedMessages = localStorage.getItem(`chat_messages_${questionId}`);
                    if (storedMessages) {
                        setMessageLogs(JSON.parse(storedMessages));
                    }
                } else {
                    // Clear expired session
                    localStorage.removeItem(`chat_session_${questionId}`);
                    localStorage.removeItem(`chat_messages_${questionId}`);
                }
            } catch (e) {
                // Handle potential JSON parse error
                localStorage.removeItem(`chat_session_${questionId}`);
                localStorage.removeItem(`chat_messages_${questionId}`);
            }
        }
    }, [questionId]);

    // Store messages whenever they change
    useEffect(() => {
        if (messageLogs.length > 0) {
            localStorage.setItem(`chat_messages_${questionId}`, JSON.stringify(messageLogs));
        }
    }, [messageLogs, questionId]);

    const startChat = async () => {
        console.log("Start Question id: " + questionId);
        setIsLoading(true);
        try {
            const response = await callStartChat(questionId);
            
            if (response && response.data) {
                const { sessionId, chatResponse } = response.data;
                const assistantMessage = chatResponse.choices[0].message.content;
                
                // Store session ID with 24-hour expiry
                const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
                localStorage.setItem(
                    `chat_session_${questionId}`, 
                    JSON.stringify({ id: sessionId, expiry: expiryTime })
                );
                
                setSessionId(sessionId);
                setIsInitiated(true);
                setMessageLogs([{ sender: "bot", text: assistantMessage }]);
            } else {
                // Handle error response
                setMessageLogs([{ 
                    sender: "bot", 
                    text: "Xin lỗi, đã có lỗi xảy ra khi kết nối với chuyên gia. Vui lòng thử lại sau." 
                }]);
            }
        } catch (error) {
            console.error("Error starting chat:", error);
            setMessageLogs([{ 
                sender: "bot", 
                text: "Xin lỗi, đã có lỗi xảy ra khi kết nối với chuyên gia. Vui lòng thử lại sau." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (message: string) => {
        if (!message.trim() || !sessionId) return;

        setIsLoading(true);
        const newMessageLogs: ChatMessage[] = [...messageLogs, { sender: "user", text: message }];
        setMessageLogs(newMessageLogs);
        setInput("");
        
        try {
            const response = await callContinueChat(questionId, sessionId, message);
            
            if (response && response.data) {
                const assistantMessage = response.data.chatResponse.choices[0].message.content;
                setMessageLogs([...newMessageLogs, { sender: "bot", text: assistantMessage }]);
            } else {
                // Handle error response
                setMessageLogs([...newMessageLogs, { 
                    sender: "bot", 
                    text: "Xin lỗi, đã có lỗi xảy ra khi nhận phản hồi. Vui lòng thử lại sau." 
                }]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessageLogs([...newMessageLogs, { 
                sender: "bot", 
                text: "Xin lỗi, đã có lỗi xảy ra khi nhận phản hồi. Vui lòng thử lại sau." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !isLoading) {
            sendMessage(input);
        }
    };

    return { 
        isInitiated, 
        isLoading, 
        input, 
        setInput, 
        messageLogs, 
        startChat, 
        sendMessage, 
        handleKeyPress 
    };
}

export default ChatWindow;

