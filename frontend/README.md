# Alta Flow - Client Management System

A modern, full-stack client management system built with React (Frontend) and Laravel (Backend) for Altamedia. This project provides a comprehensive dashboard for managing client projects, billing, communication, and brand kit forms with full mobile responsiveness.

## 🚀 Tech Stack

### Frontend
- **React 18.2.0** - Modern JavaScript library for building user interfaces
- **Vite 6.1.0** - Fast build tool and development server
- **React Router DOM 7.2.0** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Beautiful & consistent icon toolkit
- **Framer Motion 12.4.7** - Animation library
- **React Hook Form 7.54.2** - Performant forms with easy validation
- **Zod 3.24.2** - TypeScript-first schema validation
- **Sonner 2.0.1** - Toast notifications
- **Recharts 2.15.1** - Composable charting library
- **Date-fns 3.6.0** - Modern JavaScript date utility library

### Backend
- **Laravel 12.0** - PHP web application framework
- **PHP 8.2+** - Server-side programming language
- **Composer** - PHP dependency management
- **Laravel Tinker 2.10.1** - REPL for Laravel
- **Laravel Sail 1.41** - Docker development environment
- **PHPUnit 11.5.3** - Testing framework

### Development Tools
- **ESLint 9.19.0** - JavaScript linting
- **PostCSS 8.5.3** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixing
- **TypeScript support** - Type checking and IntelliSense

## 📁 Project Structure

```
alta-flow-b12fc8a2-main/
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── ClientSidebar.jsx
│   │   │   ├── MainDashboard.jsx
│   │   │   ├── ProjectForms.jsx
│   │   │   ├── ProjectsSidebar.jsx
│   │   │   ├── RecentProjects.jsx
│   │   │   └── StatsOverview.jsx
│   │   ├── form/              # Form components
│   │   │   ├── AISuggestion.jsx
│   │   │   ├── CheckboxGroup.jsx
│   │   │   ├── ColorPicker.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── KnowingYouForm.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── TagInput.jsx
│   │   ├── ui/                # Base UI components (shadcn/ui)
│   │   ├── AltamediaLogo.jsx
│   │   ├── BillingManagement.jsx
│   │   ├── CartModal.jsx
│   │   ├── CustomNotification.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── FeatureDetails.jsx
│   │   ├── Inbox.jsx
│   │   ├── Messages.jsx
│   │   ├── PackageDetails.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/                 # Application pages
│   │   ├── Dashboard.jsx
│   │   ├── Forms.jsx          # Brand Kit Forms
│   │   ├── KnowingYouFormPage.jsx
│   │   ├── Layout.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   └── index.jsx
│   ├── hooks/                 # Custom React hooks
│   │   └── use-mobile.jsx
│   ├── lib/                   # Utility libraries
│   │   └── utils.js
│   ├── styles/                # CSS styles
│   │   └── layout.css
│   ├── utils/                 # Helper functions
│   │   └── index.ts
│   ├── api/                   # API integration
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
├── backend/                   # Laravel backend application
│   ├── app/
│   │   ├── Http/
│   │   ├── Models/
│   │   └── Providers/
│   ├── routes/
│   ├── database/
│   ├── resources/
│   ├── config/
│   ├── storage/
│   ├── tests/
│   ├── composer.json
│   ├── package.json
│   └── artisan
└── README.md
```

## 🎯 Core Functionality

### Authentication & Authorization
- **Login System**: Secure authentication with email/password
- **Protected Routes**: Route protection for authenticated users
- **Session Management**: Persistent login state with localStorage
- **Demo Mode**: Quick access with demo credentials

### Dashboard Features
- **Project Management**: Track project progress and status
- **Billing & Packages**: Manage client packages and billing
- **Analytics**: Visual charts and statistics
- **Recent Projects**: Quick access to recent work
- **Client Sidebar**: Client information and quick actions
- **Brand Kit Forms**: Comprehensive 12-step brand kit creation process

### Brand Kit Forms (Enhanced)
- **Multi-step Form**: 12-page comprehensive brand kit questionnaire
- **Field Types**: Text, textarea, dropdown, checkbox, tags, color picker, file upload
- **AI Suggestions**: Mock AI-powered text suggestions for enhanced user experience
- **Progress Tracking**: Visual progress bar showing completion status
- **Full Mobile Responsiveness**: Optimized for all screen sizes with no content cutoff
- **Form Validation**: Real-time validation with error handling
- **File Upload**: Drag-and-drop file upload functionality
- **Color Selection**: Interactive color picker for brand colors
- **No Height Constraints**: Full form extension without scrolling limitations

### Project Management
- **Project Status Tracking**: Monitor project completion
- **Progress Indicators**: Visual progress bars and status badges
- **Feature Management**: Track individual project features
- **Timeline View**: Project timeline and milestones

### Communication
- **Inbox System**: Client message management
- **Messaging Interface**: Real-time communication
- **Notification System**: Toast notifications for user feedback

### User Interface
- **Mobile-First Design**: Comprehensive mobile responsiveness with no cutoff
- **Dark/Light Mode**: Theme switching capability with localStorage persistence
- **Modern UI**: Clean, professional design with shadcn/ui
- **Accessibility**: WCAG compliant components with proper ARIA labels
- **Error Boundaries**: Graceful error handling with fallback UI
- **Loading States**: Comprehensive loading indicators and user feedback
- **Touch-Friendly**: Optimized touch targets and spacing for mobile devices

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js 18+** and **npm**
- **PHP 8.2+** and **Composer**
- **Git**

### Frontend Setup

1. **Navigate to the project directory:**
   ```bash
   cd alta-flow-b12fc8a2-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

5. **Configure database in `.env` file**

6. **Run migrations:**
   ```bash
   php artisan migrate
   ```

7. **Start Laravel development server:**
   ```bash
   php artisan serve
   ```

### Development Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `php artisan serve` - Start Laravel server
- `php artisan migrate` - Run database migrations
- `php artisan test` - Run tests
- `composer test` - Run PHPUnit tests

## 🔧 Configuration

### Frontend Configuration
- **Vite Config**: Path aliases and build optimization
- **Tailwind Config**: Custom theme and component styling
- **ESLint Config**: Code quality and formatting rules

### Backend Configuration
- **Environment Variables**: Database, mail, and app settings
- **Database**: MySQL/PostgreSQL configuration
- **CORS**: Cross-origin resource sharing setup

## 🚀 Deployment

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure your web server to serve the SPA

### Backend Deployment
1. Set up your production environment
2. Configure environment variables
3. Run migrations: `php artisan migrate --force`
4. Set up queue workers if using queues
5. Configure web server (Apache/Nginx)

## 📊 Key Features

### Dashboard Analytics
- **Revenue Tracking**: Monthly and yearly revenue charts
- **Project Statistics**: Active, completed, and pending projects
- **Performance Metrics**: Client satisfaction and project success rates

### Brand Kit Forms (Enhanced)
- **12-Step Process**: Comprehensive brand kit creation workflow
- **Field Types**: 
  - Short Text (Input)
  - Long Text (Textarea)
  - Dropdown (Select)
  - Checkbox
  - Tags (TagInput)
  - Color Picker
  - File Upload
  - AI Suggestions
- **Navigation**: Previous/Next buttons with "Back to Dashboard" option
- **Progress Tracking**: Visual progress bar
- **Form Validation**: Real-time validation with error messages
- **Full Mobile Responsiveness**: No content cutoff, optimized for all screen sizes
- **Dark Mode Support**: Full dark mode compatibility
- **Touch-Friendly Interface**: Large touch targets and proper spacing

### Project Management
- **Package Management**: Core package with add-ons
- **Feature Tracking**: Individual feature progress monitoring
- **Timeline Management**: Project milestones and deadlines

### Client Communication
- **Message Center**: Inbox and messaging system
- **Notification System**: Real-time updates and alerts
- **File Sharing**: Document and media sharing capabilities

### Billing & Payments
- **Package Pricing**: Transparent pricing structure
- **Invoice Management**: Automated billing system
- **Payment Tracking**: Payment status and history

## 🔒 Security Features

- **Route Protection**: Authentication middleware
- **CSRF Protection**: Cross-site request forgery prevention
- **Input Validation**: Form validation and sanitization
- **Secure Storage**: Encrypted sensitive data storage
- **Error Boundaries**: Graceful error handling

## 🧪 Testing

### Frontend Testing
- Component testing with React Testing Library
- Integration testing for user flows
- E2E testing with Playwright (recommended)

### Backend Testing
- Unit tests with PHPUnit
- Feature tests for API endpoints
- Database testing with factories

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Project Endpoints
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Client Endpoints
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/{id}` - Update client
- `DELETE /api/clients/{id}` - Delete client

### Form Endpoints
- `POST /api/forms/brand-kit` - Submit brand kit form
- `GET /api/forms/brand-kit/{id}` - Get form data
- `PUT /api/forms/brand-kit/{id}` - Update form data

## 🎨 Design System

### Color Scheme
- **Primary**: Blue (#3B82F6) and Gold (#F59E0B)
- **Dark Mode**: Full dark mode support with proper contrast
- **No Gradients**: Clean, flat design approach

### Components
- **FormField**: Wrapper for form inputs with labels and validation
- **TagInput**: Multi-tag input with keyboard navigation
- **ColorPicker**: Interactive color selection
- **FileUpload**: Drag-and-drop file upload
- **AISuggestion**: Mock AI-powered text suggestions
- **ProgressBar**: Multi-step form progress indicator
- **CheckboxGroup**: Responsive checkbox groups with select all/clear all

### Responsive Design
- **Mobile-First**: Optimized for mobile devices with no content cutoff
- **Breakpoints**: Tailwind CSS responsive utilities (sm, md, lg, xl)
- **Touch-Friendly**: Large touch targets and proper spacing
- **No Height Constraints**: Full form extension without scrolling limitations
- **Responsive Typography**: Text scales appropriately for different screens
- **Flexible Layouts**: Components adapt seamlessly across all screen sizes

## 🔄 Recent Updates (v1.5.0)

### Mobile Responsiveness Improvements
- **Fixed Form Cutoff**: Removed height constraints and unwanted scrolling
- **Full Form Extension**: Forms now extend completely without content cutoff
- **Enhanced Mobile Layout**: Responsive design with proper touch targets
- **Improved Progress Bar**: Mobile-optimized step indicators and progress tracking
- **Better Button Layout**: Responsive button arrangements for mobile devices
- **Optimized Typography**: Responsive text sizing across all components

### New Features
- **Enhanced Form Components**: Mobile-responsive FormField, TagInput, and CheckboxGroup
- **Improved Navigation**: Better mobile navigation with responsive button layouts
- **Touch-Optimized Interface**: Larger touch targets and proper spacing for mobile
- **Responsive Progress Tracking**: Mobile-friendly progress indicators

### Improvements
- **No More Scrolling**: Removed forced scrolling on form steps
- **Full Content Display**: All form content visible without height restrictions
- **Better Mobile Experience**: Optimized for all screen sizes with responsive breakpoints
- **Enhanced Accessibility**: Improved mobile accessibility with proper touch targets
- **Consistent Spacing**: Responsive spacing and padding throughout the application

### Bug Fixes
- **Form Cutoff Issue**: Fixed content being cut off in form containers
- **Mobile Scrolling**: Removed unwanted scrolling on mobile devices
- **Responsive Layout**: Fixed responsive design issues across all form components
- **Touch Targets**: Improved touch target sizes for better mobile interaction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test` and `php artisan test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## 🔄 Version History

- **v1.0.0** - Initial release with core dashboard functionality
- **v1.1.0** - Added Laravel backend integration
- **v1.2.0** - Enhanced project management features
- **v1.3.0** - Improved UI/UX and performance optimizations
- **v1.4.0** - Added Brand Kit Forms and enhanced mobile support
- **v1.5.0** - Fixed form cutoff issues and enhanced mobile responsiveness

---

**Built with ❤️ by the Altamedia Development Team**