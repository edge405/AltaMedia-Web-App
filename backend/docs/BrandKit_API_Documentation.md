# BrandKit API Documentation

## 📋 Overview

The BrandKit API provides a comprehensive 11-step brand identity form system that guides users through creating a complete brand identity. This multi-step form captures detailed information about business basics, audience analysis, brand identity, visual direction, and business goals to create a complete brand kit.

## 🗄️ Database Schema

### Table: `company_brand_kit_forms`

```sql
CREATE TABLE company_brand_kit_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Step 1: Business Basics
    building_type business_type_enum,
    business_email VARCHAR(255),
    has_proventous_id proventous_id_enum,
    proventous_id VARCHAR(100),
    business_name VARCHAR(255),
    
    -- Step 2: About Your Business
    contact_number VARCHAR(50),
    preferred_contact contact_method_enum,
    industry TEXT[], -- Array of industry tags
    year_started INTEGER,
    primary_location JSONB, -- Store location as JSON with coordinates
    behind_brand TEXT,
    current_customers buyer_type_enum[],
    want_to_attract TEXT,
    team_description TEXT,
    
    -- Step 3: Audience Clarity
    desired_emotion desired_emotion_enum,
    target_professions TEXT[], -- Array of profession tags
    reach_locations TEXT[], -- Array of location tags
    age_groups age_group_enum[],
    spending_habits TEXT[], -- Array of spending habit tags
    interaction_methods interaction_method_enum[],
    customer_challenges TEXT,
    customer_motivation TEXT,
    audience_behavior TEXT[], -- Array of behavior tags
    customer_choice TEXT,
    
    -- Step 4: Team & Culture
    culture_words TEXT[], -- Array of culture words
    team_traditions TEXT,
    team_highlights TEXT,
    
    -- Step 5: Brand Identity
    reason1 VARCHAR(255),
    reason2 VARCHAR(255),
    reason3 VARCHAR(255),
    brand_soul VARCHAR(255),
    brand_tone brand_voice_enum[],
    brand1 TEXT,
    brand2 TEXT,
    brand3 TEXT,
    brand_avoid TEXT,
    mission_statement TEXT,
    long_term_vision TEXT,
    core_values TEXT[], -- Array of core values
    brand_personality TEXT[], -- Array of personality traits
    
    -- Step 6: Visual Direction
    has_logo existing_logo_enum,
    logo_action logo_action_enum[],
    preferred_colors TEXT[], -- Array of color codes
    colors_to_avoid TEXT[], -- Array of color codes
    font_styles font_preference_enum[],
    design_style TEXT[], -- Array of design styles
    logo_type logo_style_enum[],
    imagery_style imagery_style_enum[],
    inspiration_links TEXT, -- Cloudinary URL for uploaded inspiration files
    
    -- Step 7: Collateral Needs
    brand_kit_use usage_channel_enum[],
    brand_elements brand_element_enum[],
    file_formats file_format_enum[],
    
    -- Step 8: Business Goals
    primary_goal TEXT,
    short_term_goals TEXT,
    mid_term_goals TEXT,
    long_term_goal TEXT,
    big_picture_vision TEXT,
    success_metrics key_metric_enum[],
    
    -- Step 9: AI-Powered Insights
    business_description TEXT,
    inspiration TEXT,
    target_interests TEXT[], -- Array of target interests
    current_interests TEXT[], -- Array of current interests
    
    -- Step 10: Wrap-Up
    special_notes TEXT,
    timeline timeline_enum,
    approver VARCHAR(255),
    
    -- Step 11: Upload References
    reference_materials TEXT, -- Cloudinary URL for uploaded reference files
    
    -- Progress tracking
    current_step INTEGER DEFAULT 1,
    progress_percentage INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enum Types

The schema includes 15 custom enum types for dropdown fields:

- `business_type_enum`: 'business', 'product'
- `proventous_id_enum`: 'yes', 'no'
- `contact_method_enum`: 'email', 'phone', 'messenger', 'other'
- `desired_emotion_enum`: 'happy', 'fulfilled', 'inspired', 'satisfied', 'energized', 'empowered', 'safe & secure', 'confident'
- `age_group_enum`: 'Teens', 'Young Adults', 'Adults', 'Mature Adults', 'Seniors'
- `interaction_method_enum`: 'Online', 'In-person', 'Phone', 'Email', 'Social Media', 'Mobile App'
- `buyer_type_enum`: 'Male', 'Female', 'Everyone'
- `brand_voice_enum`: 'Friendly', 'Professional', 'Casual', 'Formal', 'Humorous', 'Serious', 'Inspirational', 'Direct'
- `existing_logo_enum`: 'yes', 'no'
- `logo_action_enum`: 'Keep', 'Improve', 'Redo'
- `font_preference_enum`: 'Serif', 'Sans-serif', 'Script', 'Display', 'Modern', 'Classic', 'Bold', 'Light'
- `logo_style_enum`: 'Wordmark', 'Symbol', 'Combination', 'Lettermark', 'Emblem', 'Abstract'
- `imagery_style_enum`: 'Photography', 'Illustration', 'Abstract', 'Geometric', 'Nature', 'Urban', 'Hand-drawn', 'Digital'
- `usage_channel_enum`: 'Website', 'Social Media', 'Business Cards', 'Letterhead', 'Packaging', 'Signage', 'Apparel', 'Digital Ads', 'Print Materials'
- `brand_element_enum`: 'Logo', 'Color Palette', 'Typography', 'Icon Set', 'Patterns', 'Photography Style', 'Illustration Style', 'Brand Guidelines'
- `file_format_enum`: 'PNG', 'SVG', 'PDF', 'AI', 'EPS', 'JPG', 'TIFF'
- `key_metric_enum`: 'Revenue Growth', 'Customer Acquisition', 'Brand Recognition', 'Market Share', 'Customer Satisfaction', 'Employee Retention', 'Operational Efficiency', 'Innovation'
- `timeline_enum`: '1-2-weeks', '3-4-weeks', '1-2-months', '3-6-months', '6+months', 'flexible'

## 🔐 Authentication

All endpoints require JWT authentication via Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📡 API Endpoints

### 1. Save Form Data

**PUT** `/api/brandkit/save`

Saves or updates BrandKit form data for a specific step. This endpoint handles both creating new form data and updating existing data.

#### Request Body
```json
{
  "userId": 1,
  "stepData": {
    "building_type": "business",
    "business_email": "test@example.com",
    "business_name": "Test Business Inc.",
    "contact_number": "+1234567890",
    "preferred_contact": "email",
    "industry": ["Technology", "SaaS"],
    "year_started": 2023,
    "primary_location": {
      "address": "New York, NY",
      "coordinates": {"lat": 40.7128, "lng": -74.0060}
    }
  },
  "currentStep": 2
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Form data saved successfully",
  "data": {
    "formId": "uuid-string",
    "currentStep": 2,
    "progressPercentage": 18
  }
}
```

### 2. Get Form Data

**GET** `/api/brandkit/data/:userId`

Retrieves all BrandKit form data for a specific user.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Form data retrieved successfully",
  "data": {
    "formData": {
      "id": "uuid-string",
      "user_id": 1,
      "building_type": "business",
      "business_email": "test@example.com",
      "business_name": "Test Business Inc.",
      "contact_number": "+1234567890",
      "preferred_contact": "email",
      "industry": ["Technology", "SaaS"],
      "year_started": 2023,
      "primary_location": {
        "address": "New York, NY",
        "coordinates": {"lat": 40.7128, "lng": -74.0060}
      },
      "current_step": 2,
      "progress_percentage": 18,
      "is_completed": false,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "currentStep": 2,
    "progressPercentage": 18,
    "isCompleted": false
  }
}
```

#### Response (No Data Found)
```json
{
  "success": true,
  "message": "No form data found for this user",
  "data": {
    "formData": null,
    "currentStep": 1,
    "progressPercentage": 0,
    "isCompleted": false
  }
}
```

### 3. Test Endpoint

**GET** `/api/brandkit/test`

Simple test endpoint to verify BrandKit routes are working.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "BrandKit routes are working!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Implementation Details

### File Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── brandKitController.js
│   ├── routes/
│   │   └── brandKitRoutes.js
│   └── server.js
├── docs/
│   └── BrandKit_API_Documentation.md
├── company_brand_kit_forms_schema.sql
├── BRANDKIT_API_TESTING.md
└── BrandKit_Forms_Postman_Collection.json

frontend/
├── src/
│   ├── components/form/
│   │   └── BrandKitForm.jsx
│   └── utils/
│       └── brandKitApi.js
```

### Key Features

1. **Multi-Step Form System**
   - 11 comprehensive steps covering all aspects of brand identity
   - Progress tracking with percentage calculation
   - Step-by-step data persistence

2. **Data Transformation**
   - Frontend camelCase to database snake_case conversion
   - Array field handling for tags and selections
   - JSON handling for location data

3. **Progress Management**
   - Automatic progress percentage calculation (0-100%)
   - Current step tracking (1-11)
   - Completion status management

4. **File Upload Integration**
   - Cloudinary integration for inspiration materials
   - Reference materials upload support
   - File format validation

5. **Comprehensive Validation**
   - Required field validation
   - Enum type validation
   - Data type conversion

### Database Features

1. **Indexes for Performance**
   - User ID index for fast lookups
   - Progress percentage index for analytics
   - GIN indexes for array fields

2. **Triggers for Automation**
   - Automatic `updated_at` timestamp updates
   - Progress percentage calculation
   - Completion status management

3. **Data Integrity**
   - Foreign key constraints
   - Enum type validation
   - Array field validation

## 🎨 Frontend Integration

### BrandKitForm Component

The frontend includes a comprehensive React component with:

- **11 Step Form Structure**
- **Progress Bar Visualization**
- **Field Validation**
- **File Upload Components**
- **Color Picker Integration**
- **Map Picker for Location**
- **AI Suggestion Features**

### API Integration

```javascript
// Save form data
const saveFormData = async (userId, stepData, currentStep) => {
  const response = await apiService.put('/brandkit/save', {
    userId,
    stepData,
    currentStep
  });
  return response;
};

// Get form data
const getFormData = async (userId) => {
  const response = await apiService.get(`/brandkit/data/${userId}`);
  return response;
};
```

### Data Transformation

The API includes comprehensive data transformation utilities:

```javascript
// Frontend to Database
export const transformToDatabaseFormat = (frontendData) => {
  // Converts camelCase to snake_case
  // Handles special cases like JSON parsing
  // Manages array fields and enum types
};

// Database to Frontend
export const transformToFrontendFormat = (dbData) => {
  // Converts snake_case to camelCase
  // Handles JSON stringification
  // Manages type conversions
};
```

## 🧪 Testing

### Postman Collection

A comprehensive Postman collection is available at:
`backend/BrandKit_Forms_Postman_Collection.json`

### Test Scenarios

1. **New User Flow**
   - Start with Step 1 data
   - Progress through all 11 steps
   - Verify data persistence
   - Check progress calculation

2. **Returning User Flow**
   - Load existing form data
   - Continue from last step
   - Verify data integrity
   - Test back navigation

3. **Complete Form Submission**
   - Submit all 11 steps
   - Verify completion status
   - Check final progress (100%)

4. **Error Handling**
   - Invalid data submission
   - Missing required fields
   - Authentication failures
   - Database errors

### Test Data Examples

#### Step 1: Business Basics
```json
{
  "userId": 1,
  "stepData": {
    "building_type": "business",
    "business_email": "test@example.com",
    "has_proventous_id": "no",
    "business_name": "Test Business Inc."
  },
  "currentStep": 1
}
```

#### Step 2: About Your Business
```json
{
  "userId": 1,
  "stepData": {
    "building_type": "business",
    "business_email": "test@example.com",
    "has_proventous_id": "no",
    "business_name": "Test Business Inc.",
    "contact_number": "+1234567890",
    "preferred_contact": "email",
    "industry": ["Technology", "SaaS"],
    "year_started": 2023,
    "primary_location": {
      "address": "New York, NY",
      "coordinates": {"lat": 40.7128, "lng": -74.0060}
    }
  },
  "currentStep": 2
}
```

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields: userId, stepData, currentStep",
  "received": {
    "userId": 1,
    "stepData": true,
    "currentStep": 1
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to save form data",
  "error": "Database connection error"
}
```

## 🚀 Usage Examples

### cURL Examples

#### Save Form Data
```bash
curl -X PUT http://localhost:3000/api/brandkit/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": 1,
    "stepData": {
      "building_type": "business",
      "business_email": "test@example.com",
      "business_name": "Test Business Inc."
    },
    "currentStep": 1
  }'
```

#### Get Form Data
```bash
curl -X GET http://localhost:3000/api/brandkit/data/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript/Fetch Examples

#### Save Form Data
```javascript
const response = await fetch('/api/brandkit/save', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userId: 1,
    stepData: {
      building_type: 'business',
      business_email: 'test@example.com',
      business_name: 'Test Business Inc.'
    },
    currentStep: 1
  })
});

const data = await response.json();
```

#### Get Form Data
```javascript
const response = await fetch('/api/brandkit/data/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
```

## 📋 Form Steps Overview

### Step 1: Business Basics
- Building type (Business/Company vs Product/Service)
- Business email
- Proventous ID status
- Business name

### Step 2: About Your Business
- Contact information
- Industry selection
- Year started
- Primary location (with map integration)
- Team description

### Step 3: Audience Clarity
- Desired emotion
- Target professions
- Reach locations
- Age groups
- Spending habits
- Interaction methods

### Step 4: Team & Culture
- Culture words
- Team traditions
- Team highlights

### Step 5: Brand Identity
- Brand reasons (3 reasons)
- Brand soul
- Brand tone
- Brand inspirations (3 brands)
- Brand avoidances
- Mission statement
- Long-term vision
- Core values
- Brand personality

### Step 6: Visual Direction
- Existing logo status
- Logo action preferences
- Preferred colors
- Colors to avoid
- Font styles
- Design style
- Logo type preferences
- Imagery style
- Inspiration links

### Step 7: Collateral Needs
- Brand kit usage channels
- Brand elements needed
- File format preferences

### Step 8: Business Goals
- Primary goal
- Short-term goals
- Mid-term goals
- Long-term goal
- Big picture vision
- Success metrics

### Step 9: AI-Powered Insights
- Business description
- Inspiration sources
- Target interests
- Current interests

### Step 10: Wrap-Up
- Special notes
- Timeline preferences
- Approver information

### Step 11: Upload References
- Reference materials upload

## 🔄 Recent Updates

### Version 1.0.0 (Latest)
- ✅ **Complete 11-Step Form System**
  - Comprehensive brand identity questionnaire
  - Progress tracking and percentage calculation
  - Data persistence and retrieval

- ✅ **Database Schema**
  - 15 custom enum types for dropdown fields
  - Array fields for tags and selections
  - JSON fields for location data
  - Comprehensive indexing for performance

- ✅ **Frontend Integration**
  - React component with 11 steps
  - Progress bar visualization
  - File upload integration
  - Data transformation utilities

- ✅ **API Endpoints**
  - Save form data (PUT /api/brandkit/save)
  - Get form data (GET /api/brandkit/data/:userId)
  - Test endpoint (GET /api/brandkit/test)

- ✅ **Testing & Documentation**
  - Comprehensive Postman collection
  - Detailed testing guide
  - Complete API documentation

## 📝 Notes

1. **Progress Calculation**: Automatically calculates progress percentage based on current step (1-11 steps total).

2. **Data Persistence**: All form data is saved step-by-step, allowing users to return and continue later.

3. **File Uploads**: Integration with Cloudinary for inspiration and reference materials.

4. **Validation**: Comprehensive validation for all field types including enums, arrays, and JSON data.

5. **Performance**: Optimized with database indexes and efficient queries for large datasets.

6. **Scalability**: Designed to handle multiple concurrent users and large form datasets.

---

**Last Updated**: August 2025  
**API Version**: 1.0.0  
**Maintainer**: Edjay Lindayao
