import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Download,
  FileText,
  Image,
  File,
  AlertCircle,
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { toast } from 'sonner';
import { deliverableApi } from '@/utils/deliverableApi';

export default function FilePreviewModal({
  isOpen,
  onClose,
  filePath,
  fileName,
  fileType,
  deliverableInfo = {}
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [imageBlobUrl, setImageBlobUrl] = useState(null);

  // Get file extension and determine file type
  const getFileInfo = () => {
    if (!fileName) return { type: 'unknown', extension: '', isImage: false, isPDF: false };

    const extension = fileName.split('.').pop()?.toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension);
    const isPDF = extension === 'pdf';
    const isDocument = ['doc', 'docx', 'txt', 'rtf'].includes(extension);
    const isSpreadsheet = ['xls', 'xlsx', 'csv'].includes(extension);
    const isArchive = ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension);

    return {
      type: isImage ? 'image' : isPDF ? 'pdf' : isDocument ? 'document' : isSpreadsheet ? 'spreadsheet' : isArchive ? 'archive' : 'unknown',
      extension,
      isImage,
      isPDF,
      isDocument,
      isSpreadsheet,
      isArchive
    };
  };

  const fileInfo = getFileInfo();

  // Reset error state and load image when file changes
  useEffect(() => {
    if (isOpen && filePath && fileInfo.isImage) {
      setError(null);

      // Cleanup previous blob URL
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
        setImageBlobUrl(null);
      }

      // Use a simpler approach: create a blob URL from the download
      const loadImageForPreview = async () => {
        try {
          // Use the same URL construction as the working download
          const downloadUrl = deliverableApi.downloadFile(filePath);

          // Create a temporary link element to trigger the download
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.style.display = 'none';
          document.body.appendChild(link);

          // Try to fetch the image data using XMLHttpRequest (more compatible)
          const xhr = new XMLHttpRequest();
          xhr.open('GET', downloadUrl, true);
          xhr.responseType = 'blob';

          xhr.onload = function () {
            if (xhr.status === 200) {
              const blob = xhr.response;
              const blobUrl = URL.createObjectURL(blob);
              setImageBlobUrl(blobUrl);
            } else {
              setError(`Image preview not available due to browser restrictions. Please use the download button to view: ${fileName}`);
            }
            // Clean up
            document.body.removeChild(link);
          };

          xhr.onerror = function () {
            setError(`Image preview not available due to browser restrictions. Please use the download button to view: ${fileName}`);
            document.body.removeChild(link);
          };

          xhr.send();

        } catch (error) {
          setError(`Image preview not available due to browser restrictions. Please use the download button to view: ${fileName}`);
        }
      };

      loadImageForPreview();
    }

    // Cleanup function
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
    };
  }, [isOpen, filePath, fileInfo.isImage, fileName]);

  // Get file icon based on type
  const getFileIcon = () => {
    switch (fileInfo.type) {
      case 'image':
        return <Image className="w-8 h-8 text-blue-500" />;
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'document':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'spreadsheet':
        return <FileText className="w-8 h-8 text-green-600" />;
      case 'archive':
        return <File className="w-8 h-8 text-orange-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  // Handle file download with progress - FORCE DOWNLOAD TO LOCAL MACHINE
  const handleDownload = async () => {
    if (!filePath) {
      toast.error('No file available for download');
      return;
    }

    setIsLoading(true);
    setDownloadProgress(0);
    setError(null);

    try {
      const downloadUrl = deliverableApi.downloadFile(filePath);

      // Fetch the file as a blob to force download behavior
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
        }
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // Track progress if possible
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      let blob;
      if (total > 0 && response.body) {
        // Progress tracking for larger files
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          received += value.length;

          const progress = Math.round((received / total) * 90);
          setDownloadProgress(progress);
        }

        blob = new Blob(chunks, { type: 'application/octet-stream' });
      } else {
        // Simple blob conversion
        setDownloadProgress(50);
        blob = await response.blob();
        // Override the blob type to force download
        blob = new Blob([blob], { type: 'application/octet-stream' });
      }

      // Create blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'deliverable';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      setDownloadProgress(100);

      setTimeout(() => setDownloadProgress(0), 2000);

    } catch (error) {
      console.error('Download error:', error);

      // Fallback: Try XMLHttpRequest method
      try {
        setDownloadProgress(25);

        const downloadUrl = deliverableApi.downloadFile(filePath);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', downloadUrl, true);
        xhr.responseType = 'blob';

        xhr.onload = function () {
          if (xhr.status === 200) {
            setDownloadProgress(75);
            const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'deliverable';
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

            setDownloadProgress(100);
            setTimeout(() => setDownloadProgress(0), 2000);
          } else {
            throw new Error(`XHR failed: ${xhr.status}`);
          }
        };

        xhr.onerror = function () {
          throw new Error('XHR request failed');
        };

        xhr.send();

      } catch (fallbackError) {
        // Final fallback: Direct link method
        try {
          const downloadUrl = deliverableApi.downloadFile(filePath);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = fileName || 'deliverable';
          link.target = '_self';
          link.rel = 'noopener noreferrer';
          link.style.display = 'none';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (finalError) {
          setError('Failed to download file. Please try again or contact support.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preview based on file type
  const renderPreview = () => {
    if (!filePath) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No file available for preview</p>
          </div>
        </div>
      );
    }

    const fileUrl = deliverableApi.downloadFile(filePath);

    // For images, we need to use a different approach to avoid CORS issues
    // Use the same approach as the working download functionality
    const finalUrl = fileUrl;

    switch (fileInfo.type) {
      case 'image':
        return (
          <div className="relative">
            {imageBlobUrl ? (
              <img
                src={imageBlobUrl}
                alt={fileName}
                className={`w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg ${isFullscreen ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                onClick={() => setIsFullscreen(!isFullscreen)}
                onLoad={() => {
                  setError(null);
                }}
              />
            ) : error ? (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Image className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">{fileName}</p>
                  <p className="text-gray-500 text-sm mb-4">{error}</p>
                  <Button
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download to View
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading image...</p>
                </div>
              </div>
            )}
            {isFullscreen && imageBlobUrl && (
              <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                <div className="relative max-w-full max-h-full">
                  <img
                    src={imageBlobUrl}
                    alt={fileName}
                    className="max-w-full max-h-full object-contain"
                    onClick={() => setIsFullscreen(false)}
                  />
                  <Button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'pdf':
        return (
          <div className="w-full h-[70vh]">
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border-0 rounded-lg shadow-lg"
              title={fileName}
              onError={() => setError('Failed to load PDF')}
            />
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              {getFileIcon()}
              <p className="text-gray-700 font-medium mt-2">{fileName}</p>
              <p className="text-gray-500 text-sm mt-1">
                {fileInfo.extension.toUpperCase()} file - Preview not available
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Click download to save this file to your device
              </p>
              <div className="mt-4">
                <Button
                  onClick={handleDownload}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download to View
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  // Format file size (if available)
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${isFullscreen ? 'max-w-none w-screen h-screen' : 'sm:max-w-6xl'} max-h-[98vh] overflow-hidden flex flex-col`}
        aria-describedby="file-preview-description"
      >
        <DialogHeader className="flex-shrink-0 bg-gradient-to-r from-gray-50 to-gray-100 p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
                {getFileIcon()}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-base font-bold text-gray-900 mb-1">
                  {fileName || 'File Preview'}
                </DialogTitle>
                <div id="file-preview-description" className="sr-only">
                  File preview modal for {fileName || 'deliverable file'}. Use the download button to save the file to your device.
                </div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <Badge className="bg-white text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200">
                    {fileInfo.extension.toUpperCase()}
                  </Badge>
                  {fileInfo.type !== 'unknown' && (
                    <Badge className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {fileInfo.type.charAt(0).toUpperCase() + fileInfo.type.slice(1)}
                    </Badge>
                  )}
                  {deliverableInfo.version_number && (
                    <Badge className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      v{deliverableInfo.version_number}
                    </Badge>
                  )}
                  {deliverableInfo.feature_name && (
                    <Badge className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {deliverableInfo.feature_name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {fileInfo.isImage && (
                <Button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 h-8 px-2"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 h-8 px-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          {error ? (
            <div className="flex items-center justify-center min-h-48 bg-gray-50 rounded-lg">
              <div className="text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <p className="text-red-600 font-medium text-sm">{error}</p>
                <div className="flex space-x-2 mt-3 justify-center">
                  <Button
                    onClick={() => setError(null)}
                    className="bg-black hover:bg-gray-800 text-white"
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Instead
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-auto">
              {renderPreview()}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-gray-200 p-3 bg-gray-50 overflow-y-auto max-h-48">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* File Information */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wide">File Information</h4>
              <div className="space-y-1 text-xs">
                {deliverableInfo.uploaded_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upload Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(deliverableInfo.uploaded_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                {deliverableInfo.uploaded_by_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uploaded By:</span>
                    <span className="font-medium text-gray-900">{deliverableInfo.uploaded_by_name}</span>
                  </div>
                )}
                {deliverableInfo.feature_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Feature:</span>
                    <span className="font-medium text-gray-900">{deliverableInfo.feature_name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Information */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wide">Status</h4>
              <div className="space-y-1 text-xs">
                {deliverableInfo.status && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={`px-2 py-0.5 text-xs ${deliverableInfo.status === 'approved' ? 'bg-green-100 text-green-700' :
                      deliverableInfo.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        deliverableInfo.status === 'revision_requested' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {deliverableInfo.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                )}
                {deliverableInfo.version_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium text-gray-900">{deliverableInfo.version_number}</span>
                  </div>
                )}
                {deliverableInfo.file_path && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Size:</span>
                    <span className="font-medium text-gray-900">
                      {formatFileSize(deliverableInfo.file_size || 0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wide">Actions</h4>
              <div className="space-y-1.5">
                {downloadProgress > 0 && downloadProgress < 100 && (
                  <div className="flex items-center space-x-2 bg-white px-2 py-1.5 rounded border">
                    <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-600 font-medium">{downloadProgress}%</span>
                  </div>
                )}
                <Button
                  onClick={handleDownload}
                  disabled={isLoading || !filePath}
                  className="w-full bg-black hover:bg-gray-800 text-white py-1.5 rounded text-xs font-semibold transition-all duration-200"
                >
                  <Download className="w-3 h-3 mr-1" />
                  {isLoading ? 'Downloading...' : 'Download File'}
                </Button>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {deliverableInfo.admin_notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wide mb-1.5">Admin Notes:</h4>
              <div className="bg-white p-2 rounded border">
                <p className="text-gray-600 text-xs italic">"{deliverableInfo.admin_notes}"</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}