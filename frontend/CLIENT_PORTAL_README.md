# Alta Media Client Portal

A comprehensive client portal for Alta Media that allows clients to view their purchased packages, track progress, download deliverables, check analytics, and request support.

## Features

### 🏠 Dashboard (Home)
- **Personalized Greeting**: Shows client name and welcome message
- **Active Package Card**: Displays current package details including:
  - Package name and price
  - Status (Active/Pending/Completed)
  - Start & End dates
  - Remaining budget with visual progress
  - Quick access to package details
- **Quick Stats**: Weekly performance metrics
  - Weekly reach with trend indicator
  - Click-through rate (CTR)
  - Conversion count
- **Recent Deliverables**: Preview of latest project deliverables with status indicators

### 📦 Package Details
- **Comprehensive Progress Tracking**: Shows all deliverables with detailed progress indicators
- **Progress Bars**: Visual representation of completion status for multi-item deliverables
- **Status Icons**: Clear status indicators (Completed, In Progress, Pending, Ongoing)
- **Package Information**: Complete package details including descriptions and specifications

### 📥 Deliverables Gallery
- **Search & Filter**: Advanced search and filtering capabilities
  - Search by title or type
  - Filter by status (Approved, Pending Approval, In Revision)
- **Visual Gallery**: Grid layout with thumbnails and file information
- **File Details**: Shows file size, format, upload date, and approval status
- **Action Buttons**: Preview and download functionality
- **Approval System**: Approve or request revisions for pending deliverables

### 📊 Analytics Dashboard
- **Weekly Performance**: Key metrics display
  - Impressions
  - Engagement
  - Clicks
  - Conversions
- **Campaign Performance Table**: Detailed campaign metrics
  - Campaign name
  - Reach
  - CTR (Click-Through Rate)
  - Conversions
  - Status
- **Budget Tracker**: Visual circular progress chart showing used vs remaining budget
- **Performance Summary**: Weekly summary with key insights

### 💬 Support System
- **Live Chat**: Real-time chat with assigned project manager
- **Message History**: Complete conversation history with timestamps
- **Support Tickets**: Ticket management system
  - View existing tickets
  - Ticket status tracking
  - Create new support requests
- **Quick Actions**: One-click buttons for common requests
  - Request more revisions
  - Submit concerns
- **FAQ Section**: Frequently asked questions with answers

## Package Types Supported

### META Marketing Packages
1. **Basic (₱6,999)**
   - 8 layout graphics
   - 2 reels (30 sec max)
   - Page optimization & audit
   - Facebook ads setup
   - 2 campaigns, 3 ad sets, 6 ads
   - Analytics monitoring
   - ₱20,000 ad budget

2. **AI Marketing (₱7,999)**
   - AI image and video generation
   - AI copywriting
   - AI marketing strategies
   - AI chatbot training
   - 4 layout graphics, 2 reels
   - Same ad structure as Basic
   - ₱20,000 ad budget

3. **Starter (₱11,999)**
   - 12 layout graphics
   - 4 reels
   - 3 campaigns, 4 ad sets, 12 ads
   - ₱30,000 ad budget

4. **Standard (₱14,999)**
   - 16 layout graphics
   - 8 reels
   - 4 campaigns, 6 ad sets, 16 ads
   - ₱50,000 ad budget

5. **Premium (₱17,999)**
   - 20 layout graphics
   - 12 reels
   - 6 campaigns, 8 ad sets, 20 ads
   - ₱70,000 ad budget

### Website Development Packages
- **Webpage (₱5,999)**: Single webpage
- **Landing Page (₱7,999)**: Contact form landing page
- **Sales Funnel (₱11,999)**: Sales funnel with ads
- **Basic Website (₱14,999)**: 3 pages, up to 8 sections each
- **Standard Website (₱19,999)**: 5 pages, up to 10 sections each
- **Premium Website (₱23,999)**: 7 pages, up to 12 sections each
- **E-Commerce Website (₱27,999)**: Complete e-commerce solution

### Google Ads Packages
- **Search Engine Marketing (₱5,999)**
- **Display Advertising (₱7,999)**
- **Performance Max (₱11,999)**: Up to 8 ads
- **YouTube Ads (₱4,999)**: Up to 3 videos
- **YouTube Ads (₱9,999)**: Up to 5 videos
- **YouTube Video Production (₱5,999)**: Up to 1 min video

## Technical Implementation

### File Structure
```
frontend/src/
├── pages/
│   └── ClientPortal.jsx          # Main client portal component
├── data/
│   ├── clientData.js             # Sample client data and analytics
│   └── packages.js               # Package definitions and deliverables
└── components/
    └── ui/                       # UI components (cards, buttons, etc.)
```

### Key Components
- **ClientPortal.jsx**: Main portal component with tabbed interface
- **clientData.js**: Comprehensive sample data including:
  - Client information
  - Active package details
  - Deliverables with metadata
  - Analytics data (weekly/monthly)
  - Support tickets and chat history
  - Project timeline
- **packages.js**: Complete package definitions with deliverables and progress tracking

### Data Structure
The portal uses a comprehensive data structure that includes:
- **Client Profile**: Name, email, company, contact info
- **Package Details**: Name, price, status, dates, budget
- **Deliverables**: Files with metadata, status, approval workflow
- **Analytics**: Performance metrics, campaign data, budget tracking
- **Support**: Chat history, tickets, FAQ

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Collapsible navigation
- Touch-friendly interface
- Dark mode support

## Usage

### Accessing the Portal
1. Navigate to `/client-portal` in the application
2. Or use the profile dropdown menu → "Client Portal"

### Navigation
- **Dashboard**: Overview and quick stats
- **Package Details**: Detailed progress tracking
- **Deliverables**: File gallery and management
- **Analytics**: Performance metrics and reports
- **Support**: Chat and ticket system

### Key Actions
- **View Progress**: Check package completion status
- **Download Files**: Access approved deliverables
- **Approve/Request Revisions**: Manage deliverable workflow
- **Track Analytics**: Monitor campaign performance
- **Request Support**: Chat with project manager or create tickets

## Future Enhancements

### Planned Features
- **Real-time Notifications**: Push notifications for updates
- **File Preview**: In-browser file preview functionality
- **Advanced Analytics**: More detailed reporting and insights
- **Mobile App**: Native mobile application
- **Integration**: API integration with backend systems
- **Customization**: Client-specific branding and customization

### Technical Improvements
- **API Integration**: Connect to real backend services
- **Real-time Updates**: WebSocket integration for live updates
- **File Upload**: Client-side file upload capabilities
- **Advanced Search**: Full-text search across all content
- **Export Features**: PDF reports and data export
- **Multi-language Support**: Internationalization

## Development Notes

### Current Implementation
- Uses dummy data for demonstration
- Fully functional UI with sample data
- Responsive design with dark mode support
- Modular component structure

### Data Sources
- **clientData.js**: Sample client information and analytics
- **packages.js**: Package definitions and deliverables
- **Component State**: Local state management for UI interactions

### Styling
- Tailwind CSS for styling
- Custom dark mode implementation
- Responsive design patterns
- Consistent UI component library

This client portal provides a comprehensive solution for Alta Media clients to manage their projects, track progress, and communicate with their project managers effectively.
