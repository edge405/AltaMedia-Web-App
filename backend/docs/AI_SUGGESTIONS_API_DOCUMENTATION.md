# AI Suggestions API Documentation

## Overview
The AI Suggestions API provides intelligent suggestions for form fields in the KnowingYouForm component. It uses OpenAI's GPT-3.5-turbo model to generate contextual suggestions based on business information and form data.

## Endpoint

### GET /api/ai-suggestions

**Description:** Get AI-powered suggestions for form fields

**Authentication:** Required (JWT Bearer token)

**Rate Limiting:** 100 requests per 15 minutes per IP

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fieldName` | string | Yes | The name of the field to get suggestions for |
| `currentValue` | string | No | Current value in the field (if any) |
| `businessContext` | string | No | Business context information |
| `formData` | string | No | JSON string of all form data for context |

### Supported Field Names

- `businessDescription` - Business description in one sentence
- `inspiration` - What inspired the business founder
- `targetInterests` - Target market interests and lifestyle
- `currentInterests` - Current customers' interests
- `audienceBehavior` - Target audience behavior patterns
- `customerChoice` - Why customers choose this business
- `missionStatement` - Company mission statement
- `longTermVision` - Long-term business vision
- `coreValues` - Company core values
- `brandPersonality` - Brand personality traits
- `teamHighlights` - Team traditions and culture

## Request Example

```javascript
const params = new URLSearchParams({
  fieldName: 'businessDescription',
  currentValue: 'We provide digital marketing services',
  businessContext: 'Business: Digital Growth Co, Industry: Marketing',
  formData: JSON.stringify({
    businessName: 'Digital Growth Co',
    industry: 'Marketing',
    targetMarket: 'Small businesses'
  })
});

const response = await fetch(`/api/ai-suggestions?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "suggestion": "Digital Growth Co empowers small businesses to thrive in the digital landscape through strategic marketing solutions that drive measurable growth and sustainable success.",
    "fieldName": "businessDescription",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Responses

#### 400 - Bad Request
```json
{
  "success": false,
  "message": "Field name is required"
}
```

#### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

#### 429 - Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

#### 500 - Server Error
```json
{
  "success": false,
  "message": "Failed to generate AI suggestion",
  "error": "Internal server error"
}
```

## Security Features

1. **Authentication Required**: All requests must include a valid JWT token
2. **Rate Limiting**: 100 requests per 15 minutes per IP address
3. **Input Validation**: All parameters are validated and sanitized
4. **Error Handling**: Comprehensive error handling for API failures
5. **Environment Variables**: OpenAI API key is stored securely

## Frontend Integration

The AI suggestions are integrated into the `KnowingYouForm.jsx` component through the `AISuggestion.jsx` component. Each field in Step 9 (AI-Powered Insights) includes an AI suggestion button.

### Usage in Components

```jsx
<AISuggestion
  fieldName="businessDescription"
  currentValue={formData.businessDescription}
  onApplySuggestion={(suggestion) => updateFormData('businessDescription', suggestion)}
  formData={formData}
/>
```

## Environment Setup

1. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. Ensure the backend server is running:
   ```bash
   cd backend
   npm start
   ```

## Testing

Use the provided test script to verify the API:

```bash
cd backend
node test-ai-suggestions.js
```

**Note:** You'll need to replace `YOUR_JWT_TOKEN_HERE` with a valid token from your authentication system.

## Cost Considerations

- Uses OpenAI's GPT-3.5-turbo model
- Limited to 200 tokens per response
- Rate limited to prevent excessive usage
- Monitor usage through OpenAI dashboard

## Troubleshooting

1. **Authentication Errors**: Ensure you're logged in and have a valid JWT token
2. **Rate Limit Errors**: Wait 15 minutes before making more requests
3. **OpenAI Errors**: Check your API key and quota in OpenAI dashboard
4. **Network Errors**: Verify the backend server is running on the correct port
