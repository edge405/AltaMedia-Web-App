import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  X, 
  Clock,
  CheckCircle,
  MessageSquare,
  User,
  Bot,
  Users
} from "lucide-react";

export default function Inbox({ isOpen, onClose, isDarkMode }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages] = useState([
    {
      id: 1,
      sender: "AI Support",
      senderType: "ai",
      subject: "Welcome to Altamedia",
      preview: "Thank you for joining our platform. We're here to help you succeed!",
      time: "2 hours ago",
      unread: true,
      content: "Welcome to Altamedia! We're excited to have you on our platform. Our AI assistant is here to help you with any questions or concerns you may have. Feel free to reach out anytime."
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      senderType: "human",
      subject: "Project Update",
      preview: "Your recent project has been reviewed and approved. Great work!",
      time: "1 day ago",
      unread: false,
      content: "Hi there! I wanted to let you know that your recent project submission has been reviewed and approved. The quality of your work was excellent, and we're very pleased with the results. Keep up the great work!"
    },
    {
      id: 3,
      sender: "System",
      senderType: "system",
      subject: "Payment Received",
      preview: "Your payment of $150 has been processed successfully.",
      time: "3 days ago",
      unread: false,
      content: "Your payment of $150 has been processed successfully and will be reflected in your account within 1-2 business days. Thank you for using our platform!"
    },
    {
      id: 4,
      sender: "AI Support",
      senderType: "ai",
      subject: "Feature Update",
      preview: "New features have been added to improve your experience.",
      time: "1 week ago",
      unread: false,
      content: "We've added several new features to improve your experience on our platform. These include enhanced project tracking, better communication tools, and improved analytics. Check them out!"
    }
  ]);

  const getSenderIcon = (senderType) => {
    switch (senderType) {
      case 'ai':
        return <Bot className="w-4 h-4 text-white" />;
      case 'human':
        return <Users className="w-4 h-4 text-white" />;
      case 'system':
        return <MessageSquare className="w-4 h-4 text-white" />;
      default:
        return <User className="w-4 h-4 text-white" />;
    }
  };

  const getSenderColor = (senderType) => {
    switch (senderType) {
      case 'ai':
        return 'bg-blue-500';
      case 'human':
        return 'bg-green-500';
      case 'system':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  const handleCloseDetail = () => {
    setSelectedMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-sm mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
        {/* Header */}
        <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Inbox
                </h3>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {messages.filter(m => m.unread).length} unread
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-6 h-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Messages List */}
        <div className="h-80 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 border-b cursor-pointer transition-colors ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
              } ${selectedMessage?.id === message.id ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') : ''}`}
              onClick={() => handleMessageClick(message)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getSenderColor(message.senderType)}`}>
                  {getSenderIcon(message.senderType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} ${message.unread ? 'font-semibold' : ''}`}>
                      {message.sender}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {message.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mt-1`}>
                    {message.subject}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 line-clamp-2`}>
                    {message.preview}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Detail - Compact */}
        {selectedMessage && (
          <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${getSenderColor(selectedMessage.senderType)}`}>
                  {getSenderIcon(selectedMessage.senderType)}
                </div>
                <div>
                  <h4 className={`font-medium text-xs ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {selectedMessage.sender}
                  </h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedMessage.time}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDetail}
                className="w-5 h-5 p-0"
              >
                <X className="w-2.5 h-2.5" />
              </Button>
            </div>
            <div>
              <h5 className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {selectedMessage.subject}
              </h5>
              <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {selectedMessage.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 