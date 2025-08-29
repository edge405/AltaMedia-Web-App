import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Send,
    X,
    Bot,
    Users
} from "lucide-react";

export default function Messages({ isOpen, onClose, chatType, isDarkMode }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && chatType) {
            // Add welcome message
            const welcomeMessage = {
                id: Date.now(),
                text: chatType === 'ai'
                    ? "Hello! I'm your AI assistant. How can I help you today?"
                    : "Hello! I'm connecting you with a human support agent. Please wait a moment...",
                sender: chatType === 'ai' ? 'ai' : 'system',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([welcomeMessage]);

            if (chatType === 'human') {
                // Simulate human agent joining
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: "Hi! I'm Sarah, your support agent. How can I assist you today?",
                        sender: 'human',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                }, 2000);
            }
        }
    }, [isOpen, chatType]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setIsTyping(true);

        // Simulate response
        setTimeout(() => {
            let responseText = "";
            if (chatType === 'ai') {
                const responses = [
                    "I understand your question. Let me help you with that.",
                    "That's a great question! Here's what I can tell you...",
                    "I can assist you with that. Let me provide some information.",
                    "Thank you for asking. Here's the answer you're looking for."
                ];
                responseText = responses[Math.floor(Math.random() * responses.length)];
            } else {
                const responses = [
                    "I'll help you with that right away.",
                    "Let me look into this for you.",
                    "I understand your concern. Let me assist you.",
                    "I'll get this sorted out for you."
                ];
                responseText = responses[Math.floor(Math.random() * responses.length)];
            }

            const responseMessage = {
                id: Date.now(),
                text: responseText,
                sender: chatType === 'ai' ? 'ai' : 'human',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, responseMessage]);
            setIsTyping(false);
        }, 1000 + Math.random() * 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`w-full max-w-md mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
                {/* Header */}
                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${chatType === 'ai' ? 'bg-blue-500' : 'bg-green-500'
                                }`}>
                                {chatType === 'ai' ? (
                                    <Bot className="w-5 h-5 text-white" />
                                ) : (
                                    <Users className="w-5 h-5 text-white" />
                                )}
                            </div>
                            <div>
                                <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                    {chatType === 'ai' ? 'AI Support' : 'Human Support'}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${chatType === 'ai' ? 'bg-green-500' : 'bg-blue-500'
                                        }`}></div>
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {chatType === 'ai' ? 'Online' : 'Connected'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="w-8 h-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user'
                                    ? `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                                    : message.sender === 'ai'
                                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`
                                        : `${isDarkMode ? 'bg-green-700' : 'bg-green-100'} ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`
                                }`}>
                                <p className="text-sm">{message.text}</p>
                                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    {message.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className={`max-w-xs px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                <div className="flex items-center space-x-1">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-center space-x-2">
                        <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className={`flex-1 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            className="w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 