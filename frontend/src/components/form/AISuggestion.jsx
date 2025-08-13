import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, Copy, Check, Tag, Type, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const AISuggestion = ({
  fieldName,
  onApplySuggestion,
  formData = {}
}) => {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldType, setFieldType] = useState('long_text');

  // Field type indicators
  const getFieldTypeIcon = (type) => {
    switch (type) {
      case 'tag':
        return <Tag className="w-4 h-4" />;
      case 'short_text':
        return <Type className="w-4 h-4" />;
      case 'long_text':
        return <FileText className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getFieldTypeLabel = (type) => {
    switch (type) {
      case 'tag':
        return 'Tags';
      case 'short_text':
        return 'Short Text';
      case 'long_text':
        return 'Long Text';
      default:
        return 'Suggestion';
    }
  };

  const handleGetSuggestion = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Log the form data being sent for debugging
      console.log('Sending form data to AI:', formData);
      console.log('Field name:', fieldName);

      const params = new URLSearchParams({
        fieldName,
        formData: JSON.stringify(formData)
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ai-suggestions?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get AI suggestions');
      }

      const data = await response.json();

      if (data.success && data.data.suggestion) {
        setSuggestion(data.data.suggestion);
        setFieldType(data.data.fieldType || 'long_text');
        setShowSuggestion(true);

        // Show different success messages based on field type
        const typeLabel = getFieldTypeLabel(data.data.fieldType);
        toast.success(`AI ${typeLabel} generated successfully!`);
      } else {
        throw new Error('No suggestion received from AI service');
      }
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      toast.error(error.message || 'Failed to get AI suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    const typeLabel = getFieldTypeLabel(fieldType);
    toast.success(`AI ${typeLabel} copied to clipboard`);
  };

  const handleApply = () => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
      const typeLabel = getFieldTypeLabel(fieldType);
      toast.success(`AI ${typeLabel} has been applied to the field`);
    }
  };

  // Format suggestion display based on field type
  const formatSuggestion = (suggestion, type) => {
    if (type === 'tag') {
      // For tags, show them as individual items
      const tags = suggestion.split(',').map(tag => tag.trim()).filter(tag => tag);
      return (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      );
    }

    // For text fields, show as regular text
    return (
      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
        {suggestion}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={handleGetSuggestion}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 dark:from-yellow-500 dark:to-orange-500 dark:hover:from-yellow-600 dark:hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5 mr-2" />
        )}
        {isLoading ? '🤖 Getting AI suggestions...' : '✨ Get AI Suggestions'}
      </Button>

      {showSuggestion && suggestion && (
        <Card className="animate-fade-in border-2 border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg ai-suggestion-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                  AI Suggestions
                </h4>
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-800 rounded-full text-xs font-medium text-yellow-800 dark:text-yellow-200">
                  {getFieldTypeIcon(fieldType)}
                  <span>{getFieldTypeLabel(fieldType)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-3 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </Button>
                {onApplySuggestion && (
                  <Button
                    type="button"
                    onClick={handleApply}
                    className="h-8 px-4 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Apply
                  </Button>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
              {formatSuggestion(suggestion, fieldType)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AISuggestion; 