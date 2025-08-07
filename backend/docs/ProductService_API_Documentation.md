# ProductService API Documentation

## 📋 Overview

The ProductService API provides a streamlined 5-step brand identity form system specifically designed for products and services. This simplified form captures essential information about product basics, audience analysis, brand style, deliverables, and final requirements to create a focused brand kit for product/service businesses.

## 🗄️ Database Schema

### Table: `product_service_forms`

```sql
CREATE TABLE product_service_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Step 1: Product Basics
    building_type VARCHAR(50) DEFAULT 'product',
    product_name VARCHAR(255),
    product_description TEXT,
    industry TEXT[], -- Array of industry tags
    want_to_attract TEXT, -- Target audience description
    mission_story TEXT, -- Problem solving story
    desired_emotion VARCHAR(100), -- Emotional response
    brand_tone VARCHAR(50), -- Tone of voice
    
    -- Step 2: Audience & Market Fit
    target_audience_profile TEXT, -- Types of people trying to reach
    reach_locations TEXT[], -- Array of platforms/places
    
    -- Step 3: Brand Style & Identity
    brand_personality TEXT[], -- Array of 3 personality words
    design_style TEXT[], -- Array of visual direction tags
    preferred_colors TEXT[], -- Array of preferred colors
    colors_to_avoid TEXT[], -- Array of colors to avoid
    competitors TEXT, -- Direct competitors description
    
    -- Step 4: Needs & Deliverables
    brand_kit_use TEXT[], -- Array of where product will appear
    brand_elements TEXT[], -- Array of needed assets
    file_formats TEXT[], -- Array of preferred file formats
    platform_support TEXT[], -- Array of platform support needs
    
    -- Step 5: Final Info
    timeline VARCHAR(50), -- When do you need this ready by
    primary_location VARCHAR(255),
    preferred_contact VARCHAR(100), -- How should we reach you
    approver VARCHAR(255), -- Who else is involved in approvals
    special_notes TEXT, -- Additional information
    reference_materials TEXT, -- File upload path/URL
    
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

### Database Features

#### Indexes for Performance
```sql
-- Basic indexes
CREATE INDEX idx_product_service_forms_user_id ON product_service_forms(user_id);
CREATE INDEX idx_product_service_forms_created_at ON product_service_forms(created_at);
CREATE INDEX idx_product_service_forms_is_completed ON product_service_forms(is_completed);
CREATE INDEX idx_product_service_forms_current_step ON product_service_forms(current_step);
CREATE INDEX idx_product_service_forms_progress_percentage ON product_service_forms(progress_percentage);
CREATE INDEX idx_product_service_forms_building_type ON product_service_forms(building_type);

-- GIN indexes for array columns
CREATE INDEX idx_product_service_forms_industry ON product_service_forms USING GIN (industry);
CREATE INDEX idx_product_service_forms_reach_locations ON product_service_forms USING GIN (reach_locations);
CREATE INDEX idx_product_service_forms_brand_personality ON product_service_forms USING GIN (brand_personality);
CREATE INDEX idx_product_service_forms_design_style ON product_service_forms USING GIN (design_style);
CREATE INDEX idx_product_service_forms_preferred_colors ON product_service_forms USING GIN (preferred_colors);
CREATE INDEX idx_product_service_forms_colors_to_avoid ON product_service_forms USING GIN (colors_to_avoid);
CREATE INDEX idx_product_service_forms_brand_kit_use ON product_service_forms USING GIN (brand_kit_use);
CREATE INDEX idx_product_service_forms_brand_elements ON product_service_forms USING GIN (brand_elements);
CREATE INDEX idx_product_service_forms_file_formats ON product_service_forms USING GIN (file_formats);
CREATE INDEX idx_product_service_forms_platform_support ON product_service_forms USING GIN (platform_support);
```

#### Triggers for Automation
```sql
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_service_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_product_service_forms_updated_at 
    BEFORE UPDATE ON product_service_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_product_service_forms_updated_at();

-- Function to calculate progress percentage
CREATE OR REPLACE FUNCTION calculate_product_service_progress_percentage()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate progress based on current_step (5 steps total)
    NEW.progress_percentage = CASE 
        WHEN NEW.current_step IS NULL THEN 0
        WHEN NEW.current_step >= 5 THEN 100
        ELSE (NEW.current_step * 100) / 5
    END;
    
    -- Set is_completed based on progress
    NEW.is_completed = CASE 
        WHEN NEW.progress_percentage >= 100 THEN TRUE
        ELSE FALSE
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate progress
CREATE TRIGGER update_product_service_progress_percentage 
    BEFORE INSERT OR UPDATE ON product_service_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_product_service_progress_percentage();
```

## 🔐 Authentication

All endpoints require JWT authentication via Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📡 API Endpoints

### 1. Save Form Data

**PUT** `/api/productservice/save`

Saves or updates ProductService form data for a specific step. This endpoint handles both creating new form data and updating existing data.

#### Request Body
```json
{
  "userId": 1,
  "stepData": {
    "building_type": "product",
    "product_name": "My Awesome App",
    "product_description": "A revolutionary mobile application",
    "industry": ["Technology", "Mobile Apps"],
    "want_to_attract": "Young professionals aged 25-35",
    "mission_story": "Solving the problem of inefficient task management",
    "desired_emotion": "inspired",
    "brand_tone": "friendly"
  },
  "currentStep": 1
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "ProductService form data saved successfully",
  "data": {
    "formId": "uuid-string",
    "currentStep": 1,
    "progressPercentage": 20
  }
}
```

### 2. Get Form Data

**GET** `/api/productservice/data/:userId`

Retrieves all ProductService form data for a specific user.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "ProductService form data retrieved successfully",
  "data": {
    "formData": {
      "id": "uuid-string",
      "user_id": 1,
      "building_type": "product",
      "product_name": "My Awesome App",
      "product_description": "A revolutionary mobile application",
      "industry": ["Technology", "Mobile Apps"],
      "want_to_attract": "Young professionals aged 25-35",
      "mission_story": "Solving the problem of inefficient task management",
      "desired_emotion": "inspired",
      "brand_tone": "friendly",
      "current_step": 1,
      "progress_percentage": 20,
      "is_completed": false,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "currentStep": 1,
    "progressPercentage": 20,
    "isCompleted": false
  }
}
```

#### Response (No Data Found)
```json
{
  "success": true,
  "message": "No ProductService form data found for this user",
  "data": {
    "formData": null,
    "currentStep": 1,
    "progressPercentage": 0,
    "isCompleted": false
  }
}
```

## 🔧 Implementation Details

### File Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── productServiceController.js
│   ├── routes/
│   │   └── productServiceRoutes.js
│   └── server.js
├── docs/
│   └── ProductService_API_Documentation.md
├── product_service_form_schema.sql
└── test-simple-productservice.js

frontend/
├── src/
│   ├── components/form/
│   │   └── ProductServiceForm.jsx
│   └── utils/
│       └── productServiceApi.js
```

### Key Features

1. **Streamlined 5-Step Form System**
   - Focused on product/service specific needs
   - Progress tracking with percentage calculation (0-100%)
   - Step-by-step data persistence

2. **Data Transformation**
   - Frontend camelCase to database snake_case conversion
   - Array field handling for tags and selections
   - Bidirectional data transformation utilities

3. **Progress Management**
   - Automatic progress percentage calculation (0-100%)
   - Current step tracking (1-5)
   - Completion status management

4. **File Upload Integration**
   - Reference materials upload support
   - File format validation

5. **Comprehensive Validation**
   - Required field validation
   - Data type conversion
   - Error handling and logging

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
   - Array field validation
   - UUID primary keys

## 🎨 Frontend Integration

### ProductServiceForm Component

The frontend includes a comprehensive React component with:

- **5 Step Form Structure**
- **Progress Bar Visualization**
- **Field Validation**
- **File Upload Components**
- **Tag Input Components**
- **Form Type Switching** (back to Business/Company form)

### API Integration

```javascript
// Save form data
const saveFormData = async (userId, stepData, currentStep) => {
  const response = await apiService.put('/productservice/save', {
    userId,
    stepData,
    currentStep
  });
  return response;
};

// Get form data
const getFormData = async (userId) => {
  const response = await apiService.get(`/productservice/data/${userId}`);
  return response;
};
```

### Data Transformation

The API includes comprehensive data transformation utilities:

```javascript
// Frontend to Database
export const transformToDatabaseFormat = (formData) => {
  // Converts camelCase to snake_case
  // Handles special cases like JSON parsing
  // Manages array fields
};

// Database to Frontend
export const transformToFrontendFormat = (dbData) => {
  // Converts snake_case to camelCase
  // Handles JSON stringification
  // Manages type conversions
};
```

## 📋 Form Steps Overview

### Step 1: Product Basics
- Building type (default: 'product')
- Product name
- Product description
- Industry selection (array)
- Target audience description
- Mission story (problem solving)
- Desired emotion
- Brand tone

### Step 2: Audience & Market Fit
- Target audience profile
- Reach locations (array of platforms/places)

### Step 3: Brand Style & Identity
- Brand personality (array of 3 words)
- Design style (array)
- Preferred colors (array)
- Colors to avoid (array)
- Competitors description

### Step 4: Needs & Deliverables
- Brand kit usage (array of where product will appear)
- Brand elements needed (array)
- File format preferences (array)
- Platform support needs (array)

### Step 5: Final Info
- Timeline preferences
- Primary location
- Preferred contact method
- Approver information
- Special notes
- Reference materials upload

## 🧪 Testing

### Test Scripts

#### Simple API Test
```javascript
// backend/test-simple-productservice.js
const axios = require('axios');

async function testSimpleProductService() {
  console.log('🧪 Testing ProductService API endpoints...\n');

  // Test server health
  const healthResponse = await axios.get('http://localhost:3000/health');
  console.log('✅ Server health:', healthResponse.data);

  // Test authentication requirement
  try {
    await axios.get('http://localhost:3000/api/productservice/data/1');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly requires authentication (401 Unauthorized)');
    }
  }
}
```

### Test Scenarios

1. **New User Flow**
   - Start with Step 1 data
   - Progress through all 5 steps
   - Verify data persistence
   - Check progress calculation

2. **Returning User Flow**
   - Load existing form data
   - Continue from last step
   - Verify data integrity
   - Test back navigation

3. **Complete Form Submission**
   - Submit all 5 steps
   - Verify completion status
   - Check final progress (100%)

4. **Form Type Switching**
   - Switch back to Business/Company form
   - Verify form reset
   - Test callback functionality

5. **Error Handling**
   - Invalid data submission
   - Missing required fields
   - Authentication failures
   - Database errors

### Test Data Examples

#### Step 1: Product Basics
```json
{
  "userId": 1,
  "stepData": {
    "building_type": "product",
    "product_name": "My Awesome App",
    "product_description": "A revolutionary mobile application",
    "industry": ["Technology", "Mobile Apps"],
    "want_to_attract": "Young professionals aged 25-35",
    "mission_story": "Solving the problem of inefficient task management",
    "desired_emotion": "inspired",
    "brand_tone": "friendly"
  },
  "currentStep": 1
}
```

#### Step 2: Audience & Market Fit
```json
{
  "userId": 1,
  "stepData": {
    "building_type": "product",
    "product_name": "My Awesome App",
    "product_description": "A revolutionary mobile application",
    "industry": ["Technology", "Mobile Apps"],
    "want_to_attract": "Young professionals aged 25-35",
    "mission_story": "Solving the problem of inefficient task management",
    "desired_emotion": "inspired",
    "brand_tone": "friendly",
    "target_audience_profile": "Tech-savvy professionals who need efficient task management",
    "reach_locations": ["App Store", "Google Play", "Social Media", "Professional Networks"]
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
  "message": "Failed to save ProductService form data",
  "error": "Database connection error"
}
```

## 🚀 Usage Examples

### cURL Examples

#### Save Form Data
```bash
curl -X PUT http://localhost:3000/api/productservice/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": 1,
    "stepData": {
      "building_type": "product",
      "product_name": "My Awesome App",
      "product_description": "A revolutionary mobile application",
      "industry": ["Technology", "Mobile Apps"],
      "want_to_attract": "Young professionals aged 25-35",
      "mission_story": "Solving the problem of inefficient task management",
      "desired_emotion": "inspired",
      "brand_tone": "friendly"
    },
    "currentStep": 1
  }'
```

#### Get Form Data
```bash
curl -X GET http://localhost:3000/api/productservice/data/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript/Fetch Examples

#### Save Form Data
```javascript
const response = await fetch('/api/productservice/save', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userId: 1,
    stepData: {
      building_type: 'product',
      product_name: 'My Awesome App',
      product_description: 'A revolutionary mobile application',
      industry: ['Technology', 'Mobile Apps'],
      want_to_attract: 'Young professionals aged 25-35',
      mission_story: 'Solving the problem of inefficient task management',
      desired_emotion: 'inspired',
      brand_tone: 'friendly'
    },
    currentStep: 1
  })
});

const data = await response.json();
```

#### Get Form Data
```javascript
const response = await fetch('/api/productservice/data/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
```

## 🔄 Recent Updates

### Version 1.0.0 (Latest)
- ✅ **Streamlined 5-Step Form System**
  - Focused on product/service specific needs
  - Progress tracking and percentage calculation
  - Data persistence and retrieval

- ✅ **Database Schema**
  - Single table design with array fields
  - Comprehensive indexing for performance
  - Automatic triggers for timestamps and progress

- ✅ **Frontend Integration**
  - React component with 5 steps
  - Progress bar visualization
  - File upload integration
  - Data transformation utilities

- ✅ **API Endpoints**
  - Save form data (PUT /api/productservice/save)
  - Get form data (GET /api/productservice/data/:userId)

- ✅ **Testing & Documentation**
  - Comprehensive test scripts
  - Complete API documentation
  - Error handling examples

## 📝 Notes

1. **Progress Calculation**: Automatically calculates progress percentage based on current step (1-5 steps total).

2. **Data Persistence**: All form data is saved step-by-step, allowing users to return and continue later.

3. **File Uploads**: Integration with file upload system for reference materials.

4. **Validation**: Comprehensive validation for all field types including arrays and text data.

5. **Performance**: Optimized with database indexes and efficient queries for large datasets.

6. **Scalability**: Designed to handle multiple concurrent users and large form datasets.

7. **Form Switching**: Includes callback functionality to switch back to Business/Company form.

---

**Last Updated**: August 2025  
**API Version**: 1.0.0  
**Maintainer**: Edjay Lindayao
