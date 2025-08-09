# AI Suggestions Setup Guide

## Overview

This guide will help you set up the AI suggestions feature for your KnowingYouForm. The feature provides intelligent, context-aware suggestions for form fields using OpenAI's GPT-3.5-turbo model.

## Prerequisites

1. **OpenAI API Key**: You'll need an OpenAI API key
2. **Node.js**: Ensure you have Node.js installed
3. **Backend Server**: The backend should be running on port 3000

## Setup Steps

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in your dashboard
4. Create a new API key
5. Copy the API key (you'll only see it once!)

### 2. Configure Environment Variables

In your `backend` directory, create or update your `.env` file:

```env
# Add this line to your existing .env file
OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 3. Install Dependencies

The OpenAI package has already been installed. If you need to reinstall:

```bash
cd backend
npm install openai
```

### 4. Start the Backend Server

```bash
cd backend
npm run dev
```

The server should start on port 3000 with the new AI suggestions endpoint available.

### 5. Test the API

You can test the API using the provided test script:

```bash
cd backend
node test-ai-suggestions.js
```

Note: You'll need to modify the test script to include a valid JWT token for authentication.

## Frontend Integration

The frontend has already been updated to use the new AI suggestions API. The `AISuggestion` component will automatically:

- Send authenticated requests to the backend
- Handle loading states and error messages
- Provide copy and apply functionality
- Integrate with form data for context

## Usage

### In the KnowingYouForm

The AI suggestions are already integrated into the form. Users can:

1. Click the "✨ Get AI Suggestions" button on any field with AI suggestions enabled
2. Review the generated suggestion
3. Copy the suggestion to clipboard
4. Apply the suggestion directly to the form field

### Supported Fields

The following fields in the KnowingYouForm have AI suggestions enabled:

- Business Description
- Inspiration
- Target Market Interests
- Current Customer Interests
- Audience Behavior
- Customer Choice Reasons
- Mission Statement
- Long-Term Vision
- Core Values
- Brand Personality
- Team Traditions

## Security Features

- **API Key Protection**: Your OpenAI API key is never exposed to the frontend
- **Authentication**: All requests require a valid JWT token
- **Rate Limiting**: Prevents abuse and controls costs
- **Input Validation**: All inputs are validated and sanitized
- **Error Handling**: Comprehensive error handling with appropriate messages

## Cost Management

- Uses GPT-3.5-turbo for cost efficiency
- Limited to 200 tokens per response
- Rate limiting prevents excessive API calls
- Monitor your OpenAI usage in the OpenAI dashboard

## Troubleshooting

### Common Issues

1. **"Authentication required"**
   - Ensure users are logged in
   - Check that JWT tokens are being sent correctly

2. **"AI service configuration error"**
   - Verify OPENAI_API_KEY is set in your .env file
   - Check that your API key is valid

3. **"Too many requests"**
   - The rate limit is 100 requests per 15 minutes per IP
   - Wait for the rate limit to reset

4. **"Failed to generate AI suggestion"**
   - Check your OpenAI account has sufficient credits
   - Verify network connectivity
   - Check OpenAI API status

### Debug Mode

To get detailed error messages, set `NODE_ENV=development` in your backend `.env` file.

## API Documentation

For detailed API documentation, see: `backend/docs/AI_SUGGESTIONS_API_DOCUMENTATION.md`

## Support

If you encounter issues:

1. Check the browser console for frontend errors
2. Check the backend server logs for API errors
3. Verify your OpenAI API key and account status
4. Ensure all environment variables are properly set

## Next Steps

1. Test the feature with different types of businesses
2. Monitor OpenAI usage and costs
3. Consider implementing caching for repeated requests
4. Add more field types as needed
