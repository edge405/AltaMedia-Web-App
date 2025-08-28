import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { deliverableApi } from '@/utils/deliverableApi';

export default function EditRevisionRequestModal({
    isOpen,
    onClose,
    revisionRequestId,
    deliverableName,
    onUpdateSuccess
}) {
    const [requestReason, setRequestReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load existing revision request data when modal opens
    useEffect(() => {
        if (isOpen && revisionRequestId) {
            loadRevisionRequest();
        }
    }, [isOpen, revisionRequestId]);

    const loadRevisionRequest = async () => {
        setIsLoading(true);
        try {
            const response = await deliverableApi.getRevisionRequest(revisionRequestId);
            if (response.success && response.data) {
                setRequestReason(response.data.request_reason || '');
            }
        } catch (error) {
            console.error('Error loading revision request:', error);
            toast.error('Failed to load revision request details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!requestReason.trim()) {
            toast.error('Please provide a reason for the revision request');
            return;
        }

        setIsSubmitting(true);
        try {
            await deliverableApi.updateRevisionRequest(revisionRequestId, requestReason);
            onUpdateSuccess();
            onClose();
            toast.success('Revision request updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update revision request');
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
                        Edit Revision Request
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f7e833]"></div>
                        <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                ) : (
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
                                {isSubmitting ? 'Updating...' : 'Update Request'}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
