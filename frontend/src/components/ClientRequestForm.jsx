import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Send, AlertCircle, CheckCircle } from 'lucide-react';

export default function ClientRequestForm({ onRequestSubmitted }) {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'bug_report', label: 'Bug Report' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/client-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({ type: 'success', message: 'Request submitted successfully!' });
        setFormData({
          subject: '',
          message: '',
          category: 'general',
          priority: 'medium'
        });

        if (onRequestSubmitted) {
          onRequestSubmitted(result.data);
        }
      } else {
        setSubmitStatus({ type: 'error', message: result.message || 'Failed to submit request' });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-black p-6">
        <CardTitle className="flex items-center space-x-3 text-xl">
          <div className="w-8 h-8 bg-[#f7e833] rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-black" />
          </div>
          <span className='text-[#f7e833]'>Submit Request/Concern</span>
        </CardTitle>
        <p className="text-[#f7e833] text-sm mt-1">
          We're here to help! Submit your request or concern and we'll get back to you as soon as possible.
        </p>
      </CardHeader>

      <CardContent className="p-6">
        {submitStatus && (
          <Alert className={`mb-6 ${submitStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {submitStatus.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category *
              </label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Priority *
              </label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center space-x-2">
                        <Badge className={priority.color}>
                          {priority.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Subject *
            </label>
            <Input
              type="text"
              placeholder="Brief description of your request"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="w-full"
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Message *
            </label>
            <Textarea
              placeholder="Please provide detailed information about your request or concern..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="w-full min-h-[120px]"
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.message.length}/2000 characters
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(formData.priority)}>
                {priorities.find(p => p.value === formData.priority)?.label}
              </Badge>
              <span className="text-sm text-gray-600">
                Priority Level
              </span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#f7e833] text-black hover:bg-[#f7e833]/90 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </div>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">What happens next?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-[#f7e833] rounded-full mt-2 flex-shrink-0"></div>
              <p>Your request will be reviewed by our support team</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-[#f7e833] rounded-full mt-2 flex-shrink-0"></div>
              <p>We'll respond within 24-48 hours for urgent requests</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-[#f7e833] rounded-full mt-2 flex-shrink-0"></div>
              <p>You can track the status of your request in your dashboard</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
