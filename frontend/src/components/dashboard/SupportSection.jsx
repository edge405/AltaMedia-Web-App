import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  List
} from 'lucide-react';
import ClientRequestForm from '../ClientRequestForm';
import ClientRequestList from '../ClientRequestList';
import ClientRequestModal from '../ClientRequestModal';

export default function SupportSection({
  clientData,
  newMessage,
  setNewMessage,
  getStatusColor
}) {
  const [activeTab, setActiveTab] = useState('new-request');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestSubmitted = (newRequest) => {
    setActiveTab('requests');
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-50 p-1 rounded-xl">
        <Button
          variant={activeTab === 'new-request' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('new-request')}
          className={`rounded-lg ${activeTab === 'new-request' ? 'bg-[#f7e833] text-black hover:bg-[#f7e833]/90' : 'hover:bg-gray-100'}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
        <Button
          variant={activeTab === 'requests' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('requests')}
          className={`rounded-lg ${activeTab === 'requests' ? 'bg-[#f7e833] text-black hover:bg-[#f7e833]/90' : 'hover:bg-gray-100'}`}
        >
          <List className="w-4 h-4 mr-2" />
          My Requests
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'new-request' && (
        <ClientRequestForm onRequestSubmitted={handleRequestSubmitted} />
      )}

      {activeTab === 'requests' && (
        <ClientRequestList onViewRequest={handleViewRequest} />
      )}

      {/* Request Details Modal */}
      <ClientRequestModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
}
