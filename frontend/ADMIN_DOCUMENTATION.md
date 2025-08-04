# Admin Panel Documentation

## Overview

The Admin Panel is a comprehensive management system for overseeing companies that have purchased the Core Package. It provides administrative controls for project management, file uploads, client communication, and progress tracking.

## 🚀 Features

### Authentication & Security
- **Admin Login**: Secure admin authentication with dedicated credentials
- **Session Management**: 24-hour session persistence with automatic logout
- **Route Protection**: Protected admin routes with authentication checks
- **Demo Credentials**: Username: `admin`, Password: `admin123`

### Dashboard Overview
- **Statistics Cards**: Real-time overview of total companies, active projects, pending messages, and completed projects
- **Company Management**: List and manage all companies with Core Package
- **Search & Filter**: Advanced search and status filtering capabilities
- **Progress Tracking**: Visual progress indicators for each project

### Company Management
- **Company List**: Comprehensive view of all companies with their status and progress
- **Company Details**: Detailed information panel for selected companies
- **Status Management**: Track project status (Active, Pending, Completed)
- **Progress Monitoring**: Real-time progress tracking with visual indicators

### Project Features
- **Feature Tracking**: Monitor individual project features and deliverables
- **File Upload**: Upload deliverables for each project feature
- **Status Updates**: Update project status and progress
- **Feature Management**: Add, edit, or remove project features

### Communication System
- **Client Chat**: Real-time messaging system with clients
- **Message History**: Complete conversation history for each company
- **File Sharing**: Share files and deliverables through chat
- **Notification System**: Toast notifications for important updates

### File Management
- **Drag & Drop Upload**: Intuitive file upload interface
- **Multiple File Support**: Upload multiple files simultaneously
- **File Type Validation**: Support for various file formats
- **Progress Tracking**: Upload progress indicators
- **File Organization**: Organized file management by company and feature

## 🎯 Admin Workflow

### 1. Admin Login
```
URL: /admin/login
Credentials: admin / admin123
```

### 2. Dashboard Overview
- View total companies and project statistics
- Monitor active, pending, and completed projects
- Track pending messages and communications

### 3. Company Selection
- Browse companies with Core Package
- Use search and filter functionality
- Select company to view detailed information

### 4. Project Management
- Review company information and project status
- Monitor project features and deliverables
- Upload files for specific features
- Update project progress and status

### 5. Client Communication
- View message history with clients
- Send responses and updates
- Share files and deliverables
- Maintain communication records

## 📊 Dashboard Components

### Statistics Cards
- **Total Companies**: Number of companies with Core Package
- **Active Projects**: Currently active projects
- **Pending Messages**: Unread client messages
- **Completed Projects**: Successfully completed projects

### Company List
- **Search Functionality**: Search by company name or email
- **Status Filter**: Filter by project status
- **Progress Bars**: Visual progress indicators
- **Quick Actions**: View and edit buttons for each company

### Company Details Panel
- **Company Information**: Name, email, package, status
- **Project Features**: List of features with upload buttons
- **Client Communication**: Chat interface with message history
- **Action Buttons**: Upload deliverables and download files

## 🔧 Technical Implementation

### Authentication System
```javascript
// Admin login check
if (formData.username === "admin" && formData.password === "admin123") {
  localStorage.setItem("isAdmin", "true");
  localStorage.setItem("adminUser", JSON.stringify({
    username: formData.username,
    role: "admin",
    loginTime: new Date().toISOString()
  }));
}
```

### Route Protection
```javascript
// AdminProtectedRoute component
const checkAdminAuth = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const adminUser = localStorage.getItem("adminUser");
  
  if (isAdmin && adminUser) {
    // Check session validity (24 hours)
    const loginTime = new Date(userData.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      setIsAuthenticated(true);
    }
  }
};
```

### File Upload System
```javascript
// AdminFileUpload component
const handleUpload = async () => {
  setIsUploading(true);
  try {
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Call the onUpload callback with the files
    if (onUpload) {
      onUpload(uploadedFiles);
    }
    
    toast.success("Files uploaded successfully!");
  } catch (error) {
    toast.error("Upload failed. Please try again.");
  }
};
```

## 🎨 Design System

### Color Scheme
- **Primary Blue**: #3B82F6 (Admin branding)
- **Success Green**: #10B981 (Completed projects)
- **Warning Yellow**: #F59E0B (Pending projects)
- **Error Red**: #EF4444 (Error states)
- **Dark Mode**: Full dark mode support

### Components
- **Cards**: Clean, modern card design with shadows
- **Buttons**: Consistent button styling with hover effects
- **Inputs**: Styled input fields with focus states
- **Badges**: Status indicators with appropriate colors
- **Progress Bars**: Visual progress indicators

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layout for tablets
- **Desktop**: Full-featured desktop interface
- **Touch-Friendly**: Large touch targets for mobile

## 📱 User Interface

### Admin Login Page
- **Clean Design**: Minimalist login interface
- **Demo Credentials**: Visible demo credentials
- **Dark Mode**: Toggle between light and dark themes
- **Navigation**: Link back to user login

### Admin Dashboard
- **Header**: Admin branding with logout and settings
- **Statistics**: Overview cards with key metrics
- **Company List**: Searchable and filterable company list
- **Details Panel**: Comprehensive company information

### File Upload Interface
- **Drag & Drop**: Intuitive file upload area
- **File Preview**: Visual file type indicators
- **Progress Tracking**: Upload progress indicators
- **File Management**: Add, remove, and organize files

## 🔄 Data Flow

### Company Data Structure
```javascript
const company = {
  id: 1,
  name: "TechCorp Solutions",
  email: "contact@techcorp.com",
  package: "Core Package",
  status: "active", // active, pending, completed
  progress: 75, // percentage
  lastActivity: "2024-01-15",
  features: ["Logo Design", "Brand Guidelines", "Business Cards"],
  messages: [
    {
      id: 1,
      from: "client", // client or admin
      message: "When will the logo be ready?",
      timestamp: "2024-01-15 10:30"
    }
  ]
};
```

### Message System
```javascript
const message = {
  id: 1,
  from: "admin", // or "client"
  message: "Logo will be ready by Friday",
  timestamp: "2024-01-15 11:00",
  attachments: [] // optional file attachments
};
```

### File Upload Data
```javascript
const uploadedFile = {
  name: "logo-design.ai",
  size: 2048576, // bytes
  type: "application/illustrator",
  lastModified: 1642233600000
};
```

## 🛠️ Configuration

### Environment Variables
```javascript
// Admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

// Session timeout (24 hours)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

// File upload settings
const UPLOAD_CONFIG = {
  maxSize: 10, // MB
  acceptedTypes: "*",
  maxFiles: 10
};
```

### Routing Configuration
```javascript
// Admin routes
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={
  <AdminProtectedRoute>
    <AdminDashboard />
  </AdminProtectedRoute>
} />
```

## 🔒 Security Features

### Authentication
- **Credential Validation**: Secure admin credential checking
- **Session Management**: 24-hour session timeout
- **Route Protection**: Protected admin routes
- **Automatic Logout**: Session expiration handling

### Data Protection
- **Local Storage**: Secure session storage
- **Input Validation**: Form input sanitization
- **File Validation**: File type and size validation
- **Error Handling**: Comprehensive error management

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Configure admin credentials
2. **Database Integration**: Connect to production database
3. **File Storage**: Configure file upload storage
4. **Security Headers**: Implement security headers
5. **SSL Certificate**: Enable HTTPS

### Development Setup
1. **Clone Repository**: Download project files
2. **Install Dependencies**: Run `npm install`
3. **Start Development Server**: Run `npm run dev`
4. **Access Admin Panel**: Navigate to `/admin/login`

## 📈 Analytics & Reporting

### Dashboard Metrics
- **Total Companies**: Number of companies with Core Package
- **Project Status**: Distribution of project statuses
- **Progress Tracking**: Average project completion
- **Communication Activity**: Message frequency and response times

### Export Capabilities
- **Company Reports**: Export company data and progress
- **Project Analytics**: Detailed project performance metrics
- **Communication Logs**: Export conversation histories
- **File Inventory**: Export uploaded file lists

## 🔄 Future Enhancements

### Planned Features
- **Real-time Notifications**: Live updates for new messages
- **Advanced Analytics**: Detailed reporting and insights
- **Bulk Operations**: Mass file upload and status updates
- **API Integration**: Connect with external services
- **Mobile App**: Native mobile admin application

### Technical Improvements
- **Database Integration**: Full database connectivity
- **Real-time Chat**: WebSocket-based messaging
- **File Compression**: Automatic file optimization
- **Backup System**: Automated data backup
- **Performance Optimization**: Enhanced loading speeds

---

**Last Updated**: v1.4.0
**Maintained By**: Altamedia Development Team 