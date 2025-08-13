
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Bell, MessageSquare, ChevronDown, User, Settings, LogOut, Moon, Sun, Bot, Users, Inbox, BarChart3, Building2, Package, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AltamediaLogo from "../components/AltamediaLogo.jsx";
import Messages from "../components/Messages.jsx";
import InboxComponent from "../components/Inbox.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Layout({ children, currentPageName, isDarkMode: parentIsDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const darkModeIconRef = useRef(null);

  // Use parent's dark mode state if provided, otherwise use local state
  const effectiveDarkMode = parentIsDarkMode !== undefined ? parentIsDarkMode : isDarkMode;
  const [showMessages, setShowMessages] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [chatType, setChatType] = useState(null);
  const [notifications] = useState([
    { id: 1, title: "New project assigned", time: "2 min ago", unread: true },
    { id: 2, title: "Payment received", time: "1 hour ago", unread: true },
    { id: 3, title: "Deadline reminder", time: "3 hours ago", unread: false }
  ]);

  const unreadNotifications = notifications.filter(n => n.unread).length;

  // Apply dark mode to document
  useEffect(() => {
    if (effectiveDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [effectiveDarkMode]);

  const handleNavigation = (path) => {
    navigate(path);
    toast.success(`Navigated to ${path.split('/').pop() || 'Home'}`);
  };

  const handleDarkModeToggle = () => {
    if (darkModeIconRef.current) {
      if (isDarkMode) {
        // Switching to light mode - sun rises
        darkModeIconRef.current.classList.add('animate-sun-rise');
        setTimeout(() => {
          if (darkModeIconRef.current) {
            darkModeIconRef.current.classList.remove('animate-sun-rise');
          }
        }, 300);
      } else {
        // Switching to dark mode - moon sets
        darkModeIconRef.current.classList.add('animate-moon-set');
        setTimeout(() => {
          if (darkModeIconRef.current) {
            darkModeIconRef.current.classList.remove('animate-moon-set');
          }
        }, 300);
      }
    }

    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const handleNotificationClick = (notification) => {
    toast.success(`Notification: ${notification.title}`);
  };

  const handleProfileAction = async (action) => {
    switch (action) {
      case 'profile':
        navigate("/profile");
        toast.success("Navigating to Profile");
        break;
      case 'settings':
        toast.info("Settings page - Coming soon");
        break;
      case 'logout':
        await logout();
        navigate("/login");
        break;
      default:
        break;
    }
  };

  const handleMessageToggle = () => {
    setShowMessages(!showMessages);
  };

  const handleChatOption = (type) => {
    setChatType(type);
    setShowMessages(false);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setChatType(null);
  };

  const handleInboxClick = () => {
    setShowMessages(false);
    setShowInbox(true);
  };

  const handleCloseInbox = () => {
    setShowInbox(false);
  };

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>


      {/* Main Container - Full Width */}
      <div className="w-full min-h-screen">
        {/* Top Navigation - Full Width */}
        <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} px-4 sm:px-6 py-3 sm:py-4 shadow-sm`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div onClick={() => handleNavigation("/")} className="cursor-pointer">
                <AltamediaLogo size="default" className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
              </div>
            </div>

            {/* Center - Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/dashboard")}
                className={`${currentPageName === 'Dashboard' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''} hover:bg-blue-50 dark:hover:bg-blue-900/10`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/company-selection")}
                className={`${currentPageName === 'CompanySelection' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''} hover:bg-purple-50 dark:hover:bg-purple-900/10`}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Companies
              </Button>
            </nav>

            {/* Right side - Notifications, Profile */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={handleDarkModeToggle}
                className="icon-button dark-mode-transition"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <div ref={darkModeIconRef} className={`dark-mode-icon ${isDarkMode ? 'rotate' : ''}`}>
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
              </button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="icon-button relative" title="Notifications">
                    <Bell className="w-4 h-4" />
                    {unreadNotifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center notification-badge">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`p-3 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Bell className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{notification.title}</p>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.time}</span>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="profile-avatar hover-lift" title="User Profile">U</div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-56 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      {user?.fullname || 'User'}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  <DropdownMenuItem
                    onClick={() => handleProfileAction('profile')}
                    className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleProfileAction('settings')}
                    className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} />
                  <DropdownMenuItem
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleProfileAction('logout')}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content - Full Width */}
        <main className={`w-full min-h-screen pt-20 ${effectiveDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            {React.cloneElement(children, { isDarkMode: effectiveDarkMode })}
          </div>
        </main>
      </div>

      {/* Messages Button - Bottom Right */}
      <button
        onClick={handleMessageToggle}
        className="messages-button"
        title="Messages"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Messages Panel */}
      {showMessages && (
        <div className="messages-panel">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Messages
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Choose how you'd like to get help
            </p>
          </div>
          <div className="p-2">
            <div
              className="chat-option"
              onClick={() => handleInboxClick()}
            >
              <div className="chat-option-icon bg-gray-500">
                <Inbox className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Inbox
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  View your messages
                </p>
              </div>
            </div>
            <div
              className="chat-option"
              onClick={() => handleChatOption('ai')}
            >
              <div className="chat-option-icon bg-blue-500">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  AI Support
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Instant help with AI assistant
                </p>
              </div>
            </div>
            <div
              className="chat-option"
              onClick={() => handleChatOption('human')}
            >
              <div className="chat-option-icon bg-green-500">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Human Support
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Connect with real person
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <Messages
        isOpen={showChat}
        onClose={handleCloseChat}
        chatType={chatType}
        isDarkMode={isDarkMode}
      />

      {/* Inbox Interface */}
      <InboxComponent
        isOpen={showInbox}
        onClose={handleCloseInbox}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
