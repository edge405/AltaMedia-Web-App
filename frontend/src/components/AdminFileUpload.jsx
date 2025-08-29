import React, { useState, useRef } from "react";
import { Upload, X, File, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const AdminFileUpload = ({ onUpload, acceptedTypes = "*", maxSize = 10 }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const validFiles = files.filter(file => {
            // Check file size (MB)
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > maxSize) {
                toast.error(`${file.name} is too large. Maximum size is ${maxSize}MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setUploadedFiles(prev => [...prev, ...validFiles]);
            toast.success(`${validFiles.length} file(s) added successfully`);
        }
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (uploadedFiles.length === 0) {
            toast.error("Please select files to upload");
            return;
        }

        setIsUploading(true);
        try {
            // Simulate upload process
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Call the onUpload callback with the files
            if (onUpload) {
                onUpload(uploadedFiles);
            }

            toast.success("Files uploaded successfully!");
            setUploadedFiles([]);
        } catch (error) {
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const getFileIcon = (file) => {
        const type = file.type;
        if (type.startsWith("image/")) return "🖼️";
        if (type.includes("pdf")) return "📄";
        if (type.includes("word") || type.includes("document")) return "📝";
        if (type.includes("zip") || type.includes("rar")) return "📦";
        return "📎";
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${isDragOver
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Deliverables
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Drag and drop files here, or click to select files
                </p>
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* File List */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        Selected Files ({uploadedFiles.length})
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{getFileIcon(file)}</span>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Button */}
            {uploadedFiles.length > 0 && (
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setUploadedFiles([])}
                        disabled={isUploading}
                    >
                        Clear All
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Files
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                            Uploading files...
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFileUpload; 