# BrandKit Questionnaire API Documentation

## 📋 Overview

The BrandKit Questionnaire API provides a comprehensive 9-step brand identity questionnaire system that guides users through creating a complete brand identity. This multi-step form captures detailed information about brand identity, target audience, competitive landscape, applications, brand voice, visual preferences, technical deliverables, inspiration, and closing information to create a complete brand kit.

## 🗄️ Database Schema

### Table: `brandkit_questionnaire_forms`

```sql
CREATE TABLE brandkit_questionnaire_forms (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id BIGINT NOT NULL,
    
    -- Step 1: Brand Identity
    brand_name VARCHAR(255),
    brand_description TEXT,
    
         -- Step 2: Target Audience & Positioning
     primary_customers TEXT,
     desired_emotion VARCHAR(50), -- Dynamic field for emotional responses
     unfair_advantage TEXT,
     customer_miss TEXT,
     problem_solved TEXT,
     
     -- Step 3: Competitive Landscape
     competitors JSON, -- Array of competitor names
     competitor_likes TEXT,
     competitor_dislikes TEXT,
     brand_differentiation TEXT,
     
     -- Step 4: Applications & Use Cases
     brand_kit_use JSON, -- Array of use cases
     templates JSON, -- Array of template types
     internal_assets JSON, -- Array of internal asset types
     file_formats JSON, -- Array of file formats
     cultural_adaptation VARCHAR(20), -- Dynamic field for adaptation options
     
     -- Step 5: Brand Voice & Personality
     brand_voice JSON, -- Array of voice characteristics
     admired_brands TEXT,
     inspiration_brand VARCHAR(255),
     communication_perception JSON, -- Array of perception traits
     
     -- Step 6: Visual Preferences
     brand_logo TEXT, -- File path or URL
     logo_redesign VARCHAR(20), -- Dynamic field for redesign options
     has_existing_colors VARCHAR(10), -- Dynamic field for yes/no
     existing_colors JSON, -- JSON array of colors
     preferred_colors JSON, -- JSON array of colors
     colors_to_avoid JSON, -- JSON array of colors
     imagery_style JSON, -- Array of imagery styles
     font_types JSON, -- Array of font types
     font_styles JSON, -- Array of font styles
     legal_considerations TEXT,
     
     -- Step 7: Technical Deliverables
     source_files JSON, -- Array of source file types
     required_formats JSON, -- Array of required formats
     
     -- Step 8: Inspiration & References
     reference_materials TEXT, -- File paths or URLs
     inspiration_brands TEXT,
     brand_vibe JSON, -- Array of vibe descriptors
     
     -- Step 9: Closing Information
     brand_words JSON, -- Array of brand descriptor words
     brand_avoid_words JSON, -- Array of words to avoid
     tagline VARCHAR(255),
     mission TEXT,
     vision TEXT,
     core_values JSON, -- Array of core values
     has_web_page VARCHAR(10), -- Dynamic field for yes/no
     web_page_upload TEXT, -- File path or URL
     want_web_page VARCHAR(50), -- Dynamic field for web page options
    
    -- Metadata
    current_step INT DEFAULT 1,
    progress_percentage INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔌 API Endpoints

### 1. Save Form Data

**PUT** `/api/brandkit-questionnaire/save`

**Description:** Save or update BrandKit Questionnaire form data for a specific step

**Authentication:** Required (JWT Bearer token)

**Request Body:**
```json
{
  "userId": 1,
  "stepData": {
    "brandName": "Example Brand",
    "brandDescription": "A comprehensive brand description",
    "primaryCustomers": "Young professionals aged 25-35",
    "desiredEmotion": "inspired",
    "competitors": ["Competitor A", "Competitor B"],
    "brandKitUse": ["Website", "Social Media", "Print Materials"],
    "brandVoice": ["Professional", "Friendly"],
    "preferredColors": ["#FF0000", "#00FF00"],
    "mission": "Our mission statement",
    "vision": "Our vision statement",
    "coreValues": ["Innovation", "Integrity", "Excellence"]
  },
  "currentStep": 3
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "BrandKit Questionnaire form data saved successfully",
  "data": {
    "currentStep": 3,
    "progressPercentage": 33,
    "isCompleted": false,
    "savedFields": ["brandName", "brandDescription", "primaryCustomers", "desiredEmotion", "competitors", "brandKitUse", "brandVoice", "preferredColors", "mission", "vision", "coreValues"]
  }
}
```

### 2. Get Form Data

**GET** `/api/brandkit-questionnaire/data/:userId`

**Description:** Get BrandKit Questionnaire form data for a user

**Authentication:** Required (JWT Bearer token)

**Parameters:**
- `userId` (path parameter): The ID of the user

**Response (200 OK):**
```json
{
  "success": true,
  "message": "BrandKit Questionnaire form data retrieved successfully",
  "data": {
    "formData": {
      "id": "uuid-here",
      "user_id": 1,
      "brand_name": "Example Brand",
      "brand_description": "A comprehensive brand description",
      "primary_customers": "Young professionals aged 25-35",
      "desired_emotion": "inspired",
      "competitors": ["Competitor A", "Competitor B"],
      "brand_kit_use": ["Website", "Social Media", "Print Materials"],
      "brand_voice": ["Professional", "Friendly"],
      "preferred_colors": ["#FF0000", "#00FF00"],
      "mission": "Our mission statement",
      "vision": "Our vision statement",
      "core_values": ["Innovation", "Integrity", "Excellence"],
      "current_step": 3,
      "progress_percentage": 33,
      "is_completed": false,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "currentStep": 3,
    "progressPercentage": 33,
    "isCompleted": false
  }
}
```

**Response (No Data Found):**
```json
{
  "success": true,
  "message": "No BrandKit Questionnaire form data found for this user",
  "data": {
    "formData": null,
    "currentStep": 1,
    "progressPercentage": 0,
    "isCompleted": false
  }
}
```

### 3. Get All Forms (Admin)

**GET** `/api/brandkit-questionnaire/admin/all`

**Description:** Get all BrandKit Questionnaire forms (Admin only)

**Authentication:** Required (JWT Bearer token with admin role)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All BrandKit Questionnaire forms retrieved successfully",
  "data": {
    "total_forms": 5,
    "forms": [
      {
        "id": "uuid-here",
        "user_id": 1,
        "user_email": "user@example.com",
        "user_name": "John Doe",
        "brand_name": "Example Brand",
        "current_step": 9,
        "progress_percentage": 100,
        "is_completed": true,
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### 4. Complete Form

**PUT** `/api/brandkit-questionnaire/complete/:userId`

**Description:** Mark BrandKit Questionnaire form as completed

**Authentication:** Required (JWT Bearer token)

**Parameters:**
- `userId` (path parameter): The ID of the user

**Response (200 OK):**
```json
{
  "success": true,
  "message": "BrandKit Questionnaire form marked as completed",
  "data": {
    "currentStep": 9,
    "progressPercentage": 100,
    "isCompleted": true
  }
}
```

### 5. Test Endpoint

**GET** `/api/brandkit-questionnaire/test`

**Description:** Simple test endpoint to verify BrandKit Questionnaire routes are working

**Response (200 OK):**
```json
{
  "success": true,
  "message": "BrandKit Questionnaire routes are working!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Implementation Details

### File Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── brandKitQuestionnaireController.js
│   ├── routes/
│   │   └── brandKitQuestionnaireRoutes.js
│   └── server.js
├── docs/
│   └── BrandKitQuestionnaire_API_Documentation.md
├── brandkit_questionnaire_mysql_schema.sql
└── brandkit_questionnaire_schema.sql

frontend/
├── src/
│   ├── components/form/
│   │   └── BrandKitQuestionnaire.jsx
│   └── utils/
│       └── brandKitQuestionnaireApi.js
```

### Key Features

1. **Multi-Step Form System**
   - 9 comprehensive steps covering all aspects of brand identity
   - Progress tracking with percentage calculation
   - Step-by-step data persistence

2. **Data Transformation**
   - Frontend camelCase to database snake_case conversion
   - Array field handling for tags and selections
   - JSON handling for complex data structures

3. **Progress Management**
   - Automatic progress percentage calculation (0-100%)
   - Current step tracking (1-9)
   - Completion status management

4. **File Upload Integration**
   - Cloudinary integration for brand logos and reference materials
   - Multiple file upload support
   - File format validation

 5. **Comprehensive Validation**
    - Required field validation
    - Dynamic field validation with length limits
    - Data type conversion

### Database Features

1. **Indexes for Performance**
   - User ID index for fast lookups
   - Created at index for chronological sorting
   - Completion status index for filtering

2. **Triggers for Automation**
   - Progress percentage calculation
   - Completion status management
   - Timestamp updates

 3. **Dynamic Field Support**
    - VARCHAR fields for flexible dropdown options
    - Native JSON fields for array data
    - Efficient storage and retrieval
    - Flexible schema for future extensions

### Frontend Integration

The BrandKit Questionnaire form integrates with the backend through the `brandKitQuestionnaireApi.js` utility, which provides:

1. **Data Persistence**
   - Automatic saving on step progression
   - Form data restoration on page reload
   - Progress tracking and completion status

2. **File Upload Handling**
   - Drag-and-drop file uploads
   - Multiple file support
   - Progress indicators

3. **AI Suggestions Integration**
   - Context-aware AI suggestions for form fields
   - OpenAI GPT-4 integration
   - Intelligent field completion

4. **Error Handling**
   - Comprehensive error messages
   - Retry mechanisms
   - User-friendly notifications

## 🚀 Getting Started

### 1. Database Setup

Run the MySQL schema file:
```bash
mysql -u your_username -p your_database < brandkit_questionnaire_mysql_schema.sql
```

### 2. Backend Setup

Ensure the routes are registered in `server.js`:
```javascript
const brandKitQuestionnaireRoutes = require('./routes/brandKitQuestionnaireRoutes');
app.use('/api/brandkit-questionnaire', brandKitQuestionnaireRoutes);
```

### 3. Frontend Integration

Import and use the API utility:
```javascript
import { brandKitQuestionnaireApi } from '@/utils/brandKitQuestionnaireApi';

// Save form data
const response = await brandKitQuestionnaireApi.saveFormData(userId, formData, currentStep);

// Get form data
const formData = await brandKitQuestionnaireApi.getFormData(userId);
```

## 🔒 Security Features

1. **Authentication Required**: All endpoints require valid JWT tokens
2. **Role-Based Access**: Admin endpoints require admin role
3. **Input Validation**: All data is validated and sanitized
4. **File Upload Security**: File type and size validation
5. **SQL Injection Prevention**: Parameterized queries

## 📊 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (missing/invalid parameters)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (user/form not found)
- `500`: Internal Server Error
