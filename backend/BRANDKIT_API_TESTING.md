# Brand Kit Forms API Testing Guide

## 🎯 Overview
This guide covers testing the Brand Kit Forms API endpoints for step-by-step form progression.

## 📋 API Endpoints

### 1. PUT `/api/brandkit/progress` - Update Form Progress
**Purpose**: Updates form data step by step as user clicks "Next"

**Headers**:
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body Examples**:

#### Step 1 - Business Type
```json
{
  "current_step": 1,
  "progress_percentage": 8.33,
  "is_completed": false,
  "form_data": {
    "what_building": "Business/Company"
  }
}
```

#### Step 2 - Identity Verification
```json
{
  "current_step": 2,
  "progress_percentage": 16.67,
  "is_completed": false,
  "form_data": {
    "what_building": "Business/Company",
    "business_email": "test@example.com",
    "has_proventous_id": "No",
    "full_business_name": "Test Business Inc."
  }
}
```

#### Step 3 - About Your Business
```json
{
  "current_step": 3,
  "progress_percentage": 25.00,
  "is_completed": false,
  "form_data": {
    "what_building": "Business/Company",
    "business_email": "test@example.com",
    "has_proventous_id": "No",
    "full_business_name": "Test Business Inc.",
    "contact_number": "+1234567890",
    "preferred_communication": "email",
    "industry_niche": ["Technology", "SaaS"],
    "year_started": 2023,
    "primary_location": "New York, NY"
  }
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Form progress updated successfully",
  "data": {
    "id": "uuid",
    "user_id": 1,
    "current_step": 3,
    "progress_percentage": 25.00,
    "is_completed": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### 2. GET `/api/brandkit/progress` - Retrieve Form Data
**Purpose**: Retrieves existing form data when user goes back

**Headers**:
```
Authorization: Bearer {{auth_token}}
```

**Expected Response** (if form exists):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": 1,
    "what_building": "Business/Company",
    "business_email": "test@example.com",
    "current_step": 3,
    "progress_percentage": 25.00,
    "is_completed": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Expected Response** (if no form exists):
```json
{
  "success": false,
  "message": "Brand kit form not found",
  "data": null
}
```

### 3. POST `/api/brandkit` - Complete Form Submission
**Purpose**: Submit complete form data

**Headers**:
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body Example**:
```json
{
  "what_building": "Business/Company",
  "business_email": "test@example.com",
  "has_proventous_id": "No",
  "full_business_name": "Test Business Inc.",
  "contact_number": "+1234567890",
  "preferred_communication": "email",
  "industry_niche": ["Technology", "SaaS"],
  "year_started": 2023,
  "primary_location": "New York, NY",
  "desired_feeling": "inspired",
  "target_interests": ["Technology", "Innovation"],
  "target_professions": ["Entrepreneurs", "Developers"],
  "current_step": 12,
  "progress_percentage": 100.00,
  "is_completed": true
}
```

### 4. DELETE `/api/brandkit` - Delete Form
**Purpose**: Delete user's form data

**Headers**:
```
Authorization: Bearer {{auth_token}}
```

## 🧪 Testing Scenarios

### Scenario 1: New User - Step by Step
1. **PUT** `/api/brandkit/progress` with Step 1 data
2. **GET** `/api/brandkit/progress` - Verify data is saved
3. **PUT** `/api/brandkit/progress` with Step 2 data
4. **GET** `/api/brandkit/progress` - Verify cumulative data
5. Continue through all 12 steps

### Scenario 2: Returning User
1. **GET** `/api/brandkit/progress` - Retrieve existing data
2. **PUT** `/api/brandkit/progress` - Update with new step
3. Verify all previous data is preserved

### Scenario 3: Complete Form
1. **POST** `/api/brandkit` with complete form data
2. **GET** `/api/brandkit/progress` - Verify completion
3. **DELETE** `/api/brandkit` - Clean up

## 🔧 Postman Setup

### 1. Import Collection
- Import `BrandKit_Forms_Postman_Collection.json`
- Set up environment variables

### 2. Environment Variables
```json
{
  "base_url": "http://localhost:3000/api",
  "auth_token": "your-jwt-token-here",
  "user_id": "1"
}
```

### 3. Test Sequence
1. **Form Progress - Step 1** → Should create new form
2. **Get Form Progress** → Should return Step 1 data
3. **Form Progress - Step 2** → Should update with Step 2 data
4. **Get Form Progress** → Should return cumulative data
5. **Complete Form Submission** → Should mark as completed
6. **Delete Form** → Should remove form data

## ⚠️ Error Scenarios

### 1. Unauthorized Access
**Request**: Without Authorization header
**Expected**: 401 Unauthorized

### 2. Invalid Token
**Request**: With invalid Bearer token
**Expected**: 401 Unauthorized

### 3. Invalid Data
**Request**: Missing required fields
**Expected**: 400 Bad Request

### 4. Server Error
**Request**: Valid request but database error
**Expected**: 500 Internal Server Error

## 📊 Test Data Examples

### Complete Form Data (All 12 Steps)
```json
{
  "what_building": "Business/Company",
  "business_email": "test@example.com",
  "has_proventous_id": "No",
  "full_business_name": "Test Business Inc.",
  "contact_number": "+1234567890",
  "preferred_communication": "email",
  "industry_niche": ["Technology", "SaaS"],
  "year_started": 2023,
  "primary_location": "New York, NY",
  "desired_feeling": "inspired",
  "target_interests": ["Technology", "Innovation"],
  "target_professions": ["Entrepreneurs", "Developers"],
  "target_reach_locations": ["Online", "Social Media"],
  "target_age_groups": ["Young Adults (20–29)", "Adults (30–39)"],
  "current_customer_interests": ["Technology", "Business"],
  "current_spending_habits": ["Value-seeking", "Premium"],
  "current_audience_behavior": ["Early adopters", "Tech-savvy"],
  "interaction_methods": ["Website", "Email"],
  "customer_challenges": "Complex technical solutions",
  "customer_motivation": "Innovation and efficiency",
  "current_brand_feeling": "inspired",
  "culture_words": ["Innovative", "Collaborative", "Fast-paced"],
  "team_traditions": "Weekly innovation sessions",
  "reason1": "Solve complex problems",
  "reason2": "Innovate in the industry",
  "reason3": "Help businesses grow",
  "brand_soul": "Innovation-driven problem solver",
  "personality_words": ["Innovative", "Professional", "Reliable"],
  "brand_voice": ["Professional", "Friendly"],
  "brand1": "Apple - Clean, innovative design",
  "brand2": "Tesla - Disruptive innovation",
  "brand3": "Google - User-focused simplicity",
  "brand_avoid_associations": "Outdated, complex interfaces",
  "has_logo": "no",
  "logo_action": ["Create"],
  "preferred_colors": ["#2563eb", "#1e40af"],
  "colors_to_avoid": ["#dc2626", "#991b1b"],
  "font_styles": ["Sans-serif", "Modern"],
  "design_style": ["Minimalist", "Modern"],
  "logo_type": ["Wordmark", "Symbol"],
  "visual_imagery_style": ["Clean", "Professional"],
  "design_inspiration_links": "https://example.com/inspiration",
  "brand_kit_usage": ["Website", "Social Media", "Print Materials"],
  "brand_elements_needed": ["Logo", "Color Palette", "Typography"],
  "file_format_preferences": ["PNG", "PDF", "SVG"],
  "primary_goal_this_year": "Launch MVP and get first 100 customers",
  "short_term_goals": "Improve user onboarding and reduce churn",
  "three_to_five_year_goal": "Become market leader in our niche",
  "mid_term_goals": "Expand to international markets",
  "long_term_vision": "Revolutionize how businesses handle complex workflows",
  "success_metrics": ["Revenue Growth", "Customer Satisfaction"],
  "business_mission": "Empower businesses with innovative solutions",
  "long_term_vision_ai": "Transform business operations globally",
  "business_values": ["Innovation", "Excellence", "Customer-First"],
  "business_journey_stage": "growing",
  "spending_type": "premium",
  "other_audiences": "Enterprise clients and international markets",
  "special_requirements": "Must work well on mobile devices",
  "brand_kit_timeline": "Within 1 month",
  "review_approval_person": "John Doe",
  "reference_materials": "https://example.com/references",
  "current_step": 12,
  "progress_percentage": 100.00,
  "is_completed": true
}
```

## 🚀 Running Tests

### 1. Start Backend Server
```bash
cd backend
npm start
```

### 2. Import Postman Collection
- Open Postman
- Import `BrandKit_Forms_Postman_Collection.json`
- Set environment variables

### 3. Run Test Sequence
1. Execute requests in order
2. Verify responses match expected format
3. Check database for data persistence

### 4. Verify Database
```sql
SELECT * FROM brand_kit_forms WHERE user_id = 1;
```

## ✅ Success Criteria

- ✅ PUT requests create/update form data correctly
- ✅ GET requests return saved form data
- ✅ Progress percentage calculates correctly
- ✅ Step tracking works properly
- ✅ Data persists between requests
- ✅ Error handling works for invalid requests
- ✅ Authentication protects all endpoints 