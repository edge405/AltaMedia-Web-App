# Client Requests & Concerns Feature

## Overview
The Client Requests & Concerns feature allows clients to submit requests, questions, or concerns through their dashboard, and provides admins with a comprehensive interface to manage and respond to these requests.

## Features

### For Clients
- **Submit Requests**: Create new requests with subject, message, category, and priority
- **Track Status**: View the status of submitted requests (pending, in progress, resolved, closed)
- **View Responses**: See admin responses to their requests
- **Filter & Search**: Filter requests by status, category, and search terms
- **Request History**: View all past and current requests

### For Admins
- **View All Requests**: See all client requests across the system
- **Filter & Search**: Advanced filtering by status, category, priority, and search terms
- **Respond to Requests**: Update request status and provide responses
- **Priority Management**: Handle urgent requests with priority indicators
- **Request Details**: View complete request information and client details

## Database Schema

### `client_requests` Table
```sql
CREATE TABLE `client_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `category` enum('general','technical','billing','feature_request','bug_report','other') DEFAULT 'general',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `status` enum('pending','in_progress','resolved','closed') DEFAULT 'pending',
  `admin_response` text DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `client_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
```

## API Endpoints

### Client Endpoints
- `POST /api/client-requests` - Create new request
- `GET /api/client-requests` - Get user's requests (with filtering)
- `GET /api/client-requests/:id` - Get specific request

### Admin Endpoints
- `GET /api/admin/client-requests` - Get all requests (with filtering)
- `GET /api/admin/client-requests/:id` - Get specific request
- `PUT /api/admin/client-requests/:id` - Update request status and response

## Frontend Components

### Client Components
- `ClientRequestForm.jsx` - Form for submitting new requests
- `ClientRequestList.jsx` - List view of user's requests
- `ClientRequestModal.jsx` - Detailed view modal for requests

### Admin Components
- `AdminClientRequests.jsx` - Complete admin interface for managing requests

## Installation

1. **Database Setup**
   ```bash
   # Run the SQL script to create the table
   mysql -u your_username -p your_database < backend/add-client-requests-table.sql
   ```

2. **Backend Setup**
   - The routes and controllers are already added to the server
   - The feature is automatically available once the database table is created

3. **Frontend Setup**
   - Components are already integrated into the existing dashboard
   - Client access: Available in the Support section of the client dashboard
   - Admin access: Available in the "Client Requests" section of the admin portal

## Usage

### For Clients
1. Navigate to the Support section in your dashboard
2. Click "New Request" tab
3. Fill out the form with your request details
4. Submit the request
5. Track the status in the "My Requests" tab

### For Admins
1. Navigate to the admin portal
2. Click "Client Requests" in the sidebar
3. View and filter requests as needed
4. Click "View" to see request details
5. Click "Respond" to update status and provide a response

## Categories
- **General Inquiry**: General questions about services
- **Technical Issue**: Technical problems or bugs
- **Billing Question**: Questions about billing or payments
- **Feature Request**: Requests for new features
- **Bug Report**: Reports of bugs or issues
- **Other**: Miscellaneous requests

## Priorities
- **Low**: Non-urgent requests
- **Medium**: Standard priority requests
- **High**: Important requests requiring attention
- **Urgent**: Critical requests requiring immediate attention

## Status Flow
1. **Pending**: Request submitted, awaiting admin review
2. **In Progress**: Admin is working on the request
3. **Resolved**: Request has been resolved
4. **Closed**: Request has been closed

## Security
- All endpoints require authentication
- Clients can only view their own requests
- Admins can view and manage all requests
- Input validation and sanitization implemented
- SQL injection protection through parameterized queries

## Future Enhancements
- Email notifications for status updates
- File attachments for requests
- Request templates for common issues
- Automated responses for certain categories
- Request escalation for urgent issues
- Integration with external support systems
