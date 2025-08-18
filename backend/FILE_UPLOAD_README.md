# File Upload Functionality

This document describes the file upload functionality implemented for the AltaMedia Client Dashboard backend.

## Overview

The file upload system uses Multer to handle local file storage instead of Cloudinary. Files are stored in the `uploads/forms/` directory and their paths are saved in the database as JSON arrays.

## Features

- **Local File Storage**: Files are stored locally in the `uploads/forms/` directory
- **Multiple File Support**: Supports multiple files per field
- **File Type Validation**: Validates file types (images, documents, archives, videos)
- **File Size Limits**: 10MB maximum file size
- **Unique Filenames**: Generates unique filenames to prevent conflicts
- **Static File Serving**: Files are served via `/uploads` endpoint

## Supported File Types

### Images
- JPEG, JPG, PNG, GIF, WebP, SVG

### Documents
- PDF, DOC, DOCX, XLS, XLSX, TXT, CSV

### Archives
- ZIP, RAR, 7Z

### Videos (optional)
- MP4, AVI, MOV, WMV

## Implementation

### File Upload Utility (`src/utils/fileUploadUtils.js`)

Provides reusable functions for file upload handling:

- `createLocalUpload()`: Creates configured Multer instance
- `processUploadedFiles()`: Processes uploaded files and returns file information
- `extractFileUploads()`: Extracts file paths from form data and uploaded files
- `cleanupOldFiles()`: Removes old files when they're no longer needed

### File Upload Middleware (`src/middleware/fileUpload.js`)

Provides middleware functions for handling file uploads:

- `handleFormFileUpload()`: Handles single field file uploads
- `handleMultipleFileUploads()`: Handles multiple field file uploads
- `handleFileUploadError()`: Error handling for file uploads

### Integration with Controllers

#### BrandKit Controller

Handles file uploads for:
- `reference_materials`: Reference files uploaded by users
- `inspiration_links`: Inspiration files uploaded by users

#### ProductService Controller

Handles file uploads for:
- `reference_materials`: Reference files uploaded by users

## API Endpoints

### BrandKit Form Save
```
PUT /api/brandkit/save
Content-Type: multipart/form-data

Fields:
- userId: number
- currentStep: number
- stepData: JSON string
- reference_materials: file(s) (optional)
- inspiration_links: file(s) (optional)
```

### ProductService Form Save
```
PUT /api/productservice/save
Content-Type: multipart/form-data

Fields:
- userId: number
- currentStep: number
- stepData: JSON string
- reference_materials: file(s) (optional)
```

## File Storage Structure

```
uploads/
└── forms/
    ├── form_1234567890_abc123_test1.jpg
    ├── form_1234567891_def456_test2.pdf
    └── form_1234567892_ghi789_test3.zip
```

## Database Storage

File paths are stored in the database as JSON arrays:

```json
{
  "reference_materials": "[\"uploads/forms/form_1234567890_abc123_test1.jpg\", \"uploads/forms/form_1234567891_def456_test2.pdf\"]",
  "inspiration_links": "[\"uploads/forms/form_1234567892_ghi789_test3.zip\"]"
}
```

## Frontend Integration

### File Upload Component

The frontend uses a `FileUpload` component that handles:
- File selection
- File validation
- Upload progress
- Error handling

### Form Integration

Forms send data using `FormData` with:
- Regular form fields as JSON in `stepData`
- File uploads as separate fields

## Testing

Run the file upload test:

```bash
node test-file-upload.js
```

This will:
1. Create a test file
2. Upload it to both BrandKit and ProductService endpoints
3. Verify the upload was successful
4. Clean up test files

## Configuration

### File Size Limits
- Maximum file size: 10MB
- Maximum files per field: 10
- Maximum total files: 50 (for multiple fields)

### Upload Directory
- Default: `./uploads/forms`
- Can be configured in `createLocalUpload()` options

### File Naming
- Format: `{prefix}_{timestamp}_{randomId}_{originalName}`
- Example: `form_1234567890_abc123_test.jpg`

## Security Considerations

1. **File Type Validation**: Only allowed file types are accepted
2. **File Size Limits**: Prevents large file uploads
3. **Unique Filenames**: Prevents filename conflicts
4. **Directory Traversal Protection**: Multer handles this automatically
5. **Static File Serving**: Files are served from a controlled directory

## Error Handling

Common error scenarios:
- File too large
- Too many files
- Invalid file type
- Upload directory not writable
- Disk space full

Errors are returned as JSON responses with appropriate HTTP status codes.

## Future Enhancements

1. **File Compression**: Automatically compress large images
2. **Virus Scanning**: Integrate virus scanning for uploaded files
3. **CDN Integration**: Option to use CDN for file serving
4. **File Cleanup**: Automatic cleanup of orphaned files
5. **Thumbnail Generation**: Generate thumbnails for images
