import { useState, useRef, useEffect } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FileUpload = ({ value, onChange, placeholder }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Initialize uploadedFiles from value prop (handle both string and array values)
  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setUploadedFiles(value);
      } else if (typeof value === 'string') {
        // If it's a string, it might be a JSON array, comma-separated list, or file paths
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            setUploadedFiles(parsed);
          }
        } catch (e) {
          // If JSON parsing fails, check if it's a comma-separated list of file paths
          if (value.includes(',')) {
            const filePaths = value.split(',').filter(path => path.trim());
            // Convert file paths to file-like objects for display
            const fileObjects = filePaths.map(path => ({
              name: path.split('/').pop() || path.split('\\').pop() || 'Unknown file',
              path: path,
              size: 0, // We don't have the actual file size
              type: 'application/octet-stream'
            }));
            setUploadedFiles(fileObjects);
          } else {
            // Single file path or empty string
            setUploadedFiles([]);
          }
        }
      }
    } else {
      setUploadedFiles([]);
    }
  }, [value]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const newUploadedFiles = [...uploadedFiles, ...fileArray];
    setUploadedFiles(newUploadedFiles);
    
    // Call onChange with all file objects for form submission
    onChange(newUploadedFiles);
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };

  return (
    <div className="space-y-3">
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop files here, or click to browse
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar,.7z"
        />
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Files:</p>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-md p-2">
              <File className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm flex-1">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 