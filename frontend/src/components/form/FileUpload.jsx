import { useState, useRef, useEffect } from "react";
import { Upload, File as FileIcon, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FileUpload = ({ value, onChange, placeholder }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({});
  const fileInputRef = useRef(null);

  // Initialize uploadedFiles from value prop (handle both string and array values)
  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setUploadedFiles(value);
        // Generate previews for image files
        generateImagePreviews(value);
      } else if (typeof value === 'string') {
        // If it's a string, it might be a JSON array, comma-separated list, or file paths
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            setUploadedFiles(parsed);
            generateImagePreviews(parsed, 0);
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
            generateImagePreviews(fileObjects, 0);
          } else {
            // Single file path or empty string
            setUploadedFiles([]);
            setImagePreviews({});
          }
        }
      }
    } else {
      setUploadedFiles([]);
      setImagePreviews({});
    }
  }, [value]);

  // Generate image previews for uploaded files
  const generateImagePreviews = (files, startIndex = 0) => {
    // Don't clear existing previews - add new ones
    files.forEach((file, index) => {
      if (file.type && file.type.startsWith('image/')) {
        if (file instanceof window.File) {
          // For new file uploads
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreviews(prev => ({
              ...prev,
              [startIndex + index]: e.target.result
            }));
          };
          reader.readAsDataURL(file);
        } else if (file.path) {
          // For existing files from database (file paths)
          setImagePreviews(prev => ({
            ...prev,
            [startIndex + index]: file.path
          }));
        }
      }
    });
  };

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

    // Always add new files to existing files for multiple file support
    // This allows users to upload multiple files in multiple sessions
    const newUploadedFiles = [...uploadedFiles, ...fileArray];
    setUploadedFiles(newUploadedFiles);

    // Generate previews for new image files only
    generateImagePreviews(fileArray, uploadedFiles.length);

    // Call onChange with all file objects for form submission
    onChange(newUploadedFiles);
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);

    // Remove preview for deleted file
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      // Shift remaining previews
      const shiftedPreviews = {};
      Object.keys(newPreviews).forEach(key => {
        const keyNum = parseInt(key);
        if (keyNum > index) {
          shiftedPreviews[keyNum - 1] = newPreviews[key];
        } else {
          shiftedPreviews[keyNum] = newPreviews[key];
        }
      });
      return shiftedPreviews;
    });

    onChange(newFiles);
  };

  // Check if file is an image
  const isImageFile = (file) => {
    return file.type && file.type.startsWith('image/');
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
          Drag and drop multiple files here, or click to browse
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
        <div className="space-y-3">
          <p className="text-sm font-medium">Selected Files:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative bg-muted/50 rounded-lg p-3 border">
                {isImageFile(file) && imagePreviews[index] ? (
                  // Image preview
                  <div className="space-y-2">
                    <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={imagePreviews[index]}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden absolute inset-0 items-center justify-center bg-gray-100">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate flex-1">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    {file.size > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    )}
                  </div>
                ) : (
                  // Non-image file display
                  <div className="flex items-center gap-2">
                    <FileIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm truncate block">{file.name}</span>
                      {file.size > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;