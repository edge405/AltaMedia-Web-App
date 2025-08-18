import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  FileEdit, 
  AlertCircle, 
  Send 
} from 'lucide-react';

export default function SupportSection({ 
  clientData, 
  newMessage, 
  setNewMessage, 
  getStatusColor 
}) {
  return (
    <div className="space-y-6">
      {/* Chat Support */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Chat with Project Manager</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-64 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {clientData.support.chatHistory.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-4 py-2 max-w-xs ${message.sender === 'client'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                    }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ticket System */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {clientData.support.tickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{ticket.title}</h4>
                  <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                    {ticket.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ticket.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Assigned to: {ticket.assignedTo}</span>
                  <span>Created: {ticket.createdAt}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <FileEdit className="w-6 h-6" />
              <span>Request More Revisions</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="w-6 h-6" />
              <span>Submit a Concern</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              How long does it take to complete deliverables?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Most deliverables are completed within 3-5 business days. Complex projects may take longer.
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Can I request revisions on approved deliverables?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Yes, you can request revisions within 7 days of approval. Additional revisions may incur extra charges.
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              How do I track my ad campaign performance?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              You can view real-time analytics in the Analytics tab. We also provide weekly performance reports.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
