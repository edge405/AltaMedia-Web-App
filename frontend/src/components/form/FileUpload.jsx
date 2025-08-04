import { useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FileUpload = ({ value, onChange, placeholder }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

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
    const fileNames = Array.from(files).map(file => file.name);
    setUploadedFiles(prev => [...prev, ...fileNames]);
    onChange([...uploadedFiles, ...fileNames].join(", "));
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onChange(newFiles.join(", "));
  };

  return (
    <div className="space-y-3">
      {/* URL Input */}
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Paste link or upload files below"}
      />
      
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
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
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>
      
      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files:</p>
          {uploadedFiles.map((fileName, index) => (
            <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-md p-2">
              <File className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm flex-1">{fileName}</span>
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