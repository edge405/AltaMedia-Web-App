import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function RevisionRequestModal({ 
  isOpen, 
  onClose, 
  deliverableId, 
  deliverableName,
  onSubmitRevision 
}) {
  const [requestReason, setRequestReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!requestReason.trim()) {
      toast.error('Please provide a reason for the revision request');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRevision(deliverableId, requestReason);
      setRequestReason('');
      onClose();
      toast.success('Revision request submitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit revision request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRequestReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Request Revision
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="deliverable" className="text-sm font-medium text-gray-700">
              Deliverable
            </Label>
            <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {deliverableName}
            </p>
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
              Revision Reason *
            </Label>
            <Textarea
              id="reason"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="Please explain what changes you'd like to see in this deliverable..."
              className="mt-1 min-h-[120px] resize-none"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Be specific about what needs to be changed or improved.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !requestReason.trim()}
              className="px-6 py-2 bg-[#f7e833] hover:bg-yellow-400 text-black font-semibold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
