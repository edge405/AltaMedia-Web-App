import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export default function CustomNotification({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'warning', // 'warning', 'info', 'success'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDarkMode = false 
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'success':
        return 'bg-green-100 dark:bg-green-900/20';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/20';
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className={`w-full max-w-md mx-4 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'} shadow-xl animate-slide-down`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full ${getIconBg()} flex items-center justify-center`}>
                {getIcon()}
              </div>
              <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
            {message}
          </p>
          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 ${getConfirmButtonStyle()} transition-colors duration-200`}
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 