# Content Calendar Feature

## Overview
The Content Calendar feature allows users to plan and manage their content schedule with a visual calendar interface. It provides a comprehensive solution for content planning with drag-and-drop functionality, filtering, and status management.

## Features

### 🗓️ Calendar View
- **Monthly Grid View**: Traditional calendar layout showing all days of the month
- **Weekly View**: Focused view showing one week at a time
- **Navigation**: Easy month/week navigation with Previous/Next buttons
- **Today Button**: Quick navigation to current date
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📝 Post Management
- **Create Posts**: Add new content with title, description, date/time, status, media files, and platform selection
- **Edit Posts**: Modify existing posts through an intuitive modal interface
- **Delete Posts**: Remove posts with confirmation
- **Media Upload**: Support for images and videos with preview and management
- **Platform Selection**: Choose which social media platforms to publish to
- **Status Management**: Three status types:
  - **Draft** (Gray): Work in progress
  - **Scheduled** (Blue): Ready to be published
  - **Posted** (Green): Already published

### 🎯 UI/UX Features
- **Drag & Drop**: Reschedule posts by dragging them to different dates
- **Color-coded Statuses**: Visual status indicators for quick identification
- **Media Preview**: Thumbnail previews for uploaded images and videos
- **Platform Icons**: Visual indicators for selected publishing platforms
- **Search & Filter**: Find posts by keyword, status, or platform
- **Modal Interface**: Clean, accessible form for creating/editing posts
- **Responsive Design**: Mobile-first approach with touch-friendly interactions

## Components

### ContentCalendarSection.jsx
Main container component that manages the overall state and coordinates between child components.

### CalendarView.jsx
Renders the calendar grid with navigation controls and handles drag-and-drop functionality.

### PostCard.jsx
Individual post display component with status colors, action buttons, and drag handles.

### PostModal.jsx
Modal form for creating and editing posts with validation and error handling.

### FilterBar.jsx
Search and filter interface with active filter display and clear functionality.

### PlatformIcons.jsx
Visual component for displaying social media platform icons with brand colors.

## Data Structure

Posts are stored with the following structure:
```javascript
{
  id: string,
  title: string,
  description: string,
  date: string (ISO date string),
  status: 'draft' | 'scheduled' | 'posted',
  media: [
    {
      id: string,
      name: string,
      type: 'image' | 'video',
      url: string,
      size: number,
      uploadedAt: string (ISO date string)
    }
  ],
  platforms: {
    facebook: boolean,
    instagram: boolean,
    twitter: boolean,
    linkedin: boolean,
    tiktok: boolean,
    youtube: boolean
  },
  createdAt: string (ISO date string)
}
```

## State Management
- Uses React useState for local state management
- Posts are stored in component state (no backend integration)
- All CRUD operations are handled locally
- Filtering and search are performed in real-time

## Responsive Design
- Mobile-first approach with Tailwind CSS
- Collapsible navigation on mobile devices
- Touch-friendly drag-and-drop interactions
- Adaptive layout for different screen sizes

## Future Enhancements
- Backend integration for persistent storage
- Recurring posts functionality
- Bulk operations (delete multiple posts)
- Export calendar data
- Integration with social media platforms
- Advanced scheduling options
- Team collaboration features
- Media library management
- Platform-specific content optimization
- Analytics and performance tracking
- Automated posting to selected platforms

## Usage
1. Navigate to the Content Calendar section in the sidebar
2. Use the "New Post" button to create content
3. Drag posts to reschedule them
4. Use search and filters to find specific posts
5. Click on posts to edit or delete them
6. Switch between monthly and weekly views as needed
