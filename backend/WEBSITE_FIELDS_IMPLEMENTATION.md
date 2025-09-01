# Website Fields Implementation for KnowingYouForm

## Overview
This implementation adds website-related fields to the "Knowing You" form (Business/Company section) to capture information about the client's current web presence and future website needs.

## Database Changes

### New Fields Added to `company_brand_kit_forms` table:

1. **`has_website`** (varchar(10))
   - Values: 'yes', 'no'
   - Purpose: Indicates whether the brand currently has a website

2. **`website_files`** (text)
   - Purpose: Stores file paths for uploaded website files
   - Format: JSON array of file paths
   - Example: `["uploads/forms/website_file1.html", "uploads/forms/website_file2.css"]`

3. **`website_url`** (varchar(500))
   - Purpose: Stores the website URL if applicable
   - Example: `"https://example.com"`

4. **`want_website`** (varchar(50))
   - Values: 'yes', 'sales-funnel', 'both', 'no', 'maybe'
   - Purpose: Indicates future website development needs

### Database Migration
Run the following SQL script to add the new fields:

```sql
-- File: backend/database/add_website_fields.sql
ALTER TABLE `company_brand_kit_forms` 
ADD COLUMN `has_website` varchar(10) DEFAULT NULL COMMENT 'Whether the brand has a website (yes/no)',
ADD COLUMN `website_files` text DEFAULT NULL COMMENT 'Uploaded website files paths',
ADD COLUMN `website_url` varchar(500) DEFAULT NULL COMMENT 'Website URL if applicable',
ADD COLUMN `want_website` varchar(50) DEFAULT NULL COMMENT 'Future website needs (yes/sales-funnel/both/no/maybe)';

-- Add indexes for better performance
ALTER TABLE `company_brand_kit_forms` 
ADD INDEX `idx_has_website` (`has_website`),
ADD INDEX `idx_want_website` (`want_website`);
```

## Backend Changes

### Updated Files:

1. **`backend/src/controllers/brandKitController.js`**
   - Added new fields to `validFields` array:
     - `has_website`
     - `website_files`
     - `website_url`
     - `want_website`
   - Updated `fileFields` array to include `website_files` for file upload handling
   - File upload processing now handles website files with the same logic as other file fields

### File Upload Handling:
- **Field**: `website_files`
- **Processing**: Same as `reference_materials` and `inspiration_links`
- **Storage**: Files are stored in `uploads/forms/` directory
- **Database**: File paths stored as JSON array in `website_files` field
- **Replacement Logic**: New files replace existing files completely

## Frontend Integration

### Form Fields Added to `KnowingYouForm.jsx` (Step 2):

1. **Main Question**: "Does your brand have a web page?"
   - Dropdown with options: "Yes, I have a website", "No, I don't have a website"

2. **If Yes**:
   - File upload for current website files with tooltip
   - URL input field for existing website

3. **If No**:
   - Follow-up question: "Do you want to have a compelling web page or sales funnel for your brand?"
   - Options: professional website, sales funnel, both, not interested, maybe

### Field Mapping:
- Frontend `hasWebsite` → Database `has_website`
- Frontend `websiteFiles` → Database `website_files`
- Frontend `websiteUrl` → Database `website_url`
- Frontend `wantWebsite` → Database `want_website`

## API Endpoints

### Existing Endpoint (Updated):
- **PUT** `/api/brandkit/save`
  - Now handles the new website fields
  - File upload for `website_files` field
  - All fields are validated and cleaned before database storage

## Data Flow

1. **Frontend** → User fills website fields in Step 2
2. **Form Submission** → Data sent to `/api/brandkit/save`
3. **File Processing** → Website files uploaded to `uploads/forms/`
4. **Database Storage** → All fields saved to `company_brand_kit_forms` table
5. **Response** → Updated form data returned to frontend

## Validation

### Frontend Validation:
- No required field validation (as per user request)
- File upload supports multiple files
- URL field accepts valid URLs

### Backend Validation:
- Field names validated against `validFields` array
- File uploads processed through Multer middleware
- JSON fields properly serialized for database storage

## Usage Examples

### Example Form Data:
```javascript
{
  "hasWebsite": "yes",
  "websiteFiles": ["uploads/forms/website_file1.html", "uploads/forms/website_file2.css"],
  "websiteUrl": "https://mywebsite.com",
  "wantWebsite": null // Not applicable when hasWebsite is "yes"
}
```

### Example Database Record:
```sql
INSERT INTO company_brand_kit_forms (
  user_id, has_website, website_files, website_url, want_website
) VALUES (
  123, 'yes', '["uploads/forms/website_file1.html", "uploads/forms/website_file2.css"]', 
  'https://mywebsite.com', NULL
);
```

## Notes

- The implementation follows the same patterns as existing file upload fields
- No breaking changes to existing functionality
- Backward compatible with existing form data
- File upload handling prevents duplication issues
- All fields are optional as per user requirements
