# AI Suggestions Setup Guide

## Prerequisites

1. **OpenAI API Account**: You need an OpenAI account with API access
2. **Node.js Backend**: Your backend server should be running
3. **Frontend React App**: Your React application should be set up
4. **Authentication System**: JWT authentication should be working

## Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (you'll only see it once)

## Step 2: Configure Environment Variables

1. Navigate to your backend directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

3. Edit the `.env` file and add your OpenAI API key:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

## Step 3: Install Dependencies

The OpenAI package should already be installed, but verify:

```bash
cd backend
npm install openai
```

## Step 4: Start the Backend Server

```bash
cd backend
npm start
```

The server should start on port 3000 (or your configured PORT).

## Step 5: Test the API

1. First, get a valid JWT token by logging into your frontend application
2. Copy the token from your browser's localStorage
3. Edit the test file:
   ```bash
   cd backend
   nano test-ai-suggestions.js
   ```
4. Replace `YOUR_JWT_TOKEN_HERE` with your actual token
5. Run the test:
   ```bash
   node test-ai-suggestions.js
   ```

## Step 6: Test in Frontend

1. Start your frontend application:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to the KnowingYouForm
3. Go to Step 9 (AI-Powered Insights)
4. Click "✨ Get AI Suggestions" on any field
5. Verify that suggestions are generated and can be applied

## Step 7: Verify Integration

The AI suggestions should now be working in your form. Each field in Step 9 includes:

- A yellow "✨ Get AI Suggestions" button
- Loading state while generating suggestions
- Copy and Apply functionality
- Error handling with toast notifications

## Troubleshooting

### Common Issues

1. **"Authentication required" error**
   - Ensure you're logged into the frontend
   - Check that the JWT token is valid
   - Verify the token is being sent in the request headers

2. **"AI service configuration error"**
   - Check that OPENAI_API_KEY is set in your .env file
   - Verify the API key is correct
   - Ensure the backend server is running

3. **"Too many requests" error**
   - Wait 15 minutes for the rate limit to reset
   - The limit is 100 requests per 15 minutes per IP

4. **No suggestions generated**
   - Check the browser console for errors
   - Verify the backend server logs for errors
   - Ensure you have sufficient OpenAI credits

### Debug Mode

To get more detailed error messages, set your environment to development:

```env
NODE_ENV=development
```

## Cost Management

- Each suggestion uses approximately 200 tokens
- GPT-3.5-turbo costs about $0.002 per 1K tokens
- Monitor usage in your OpenAI dashboard
- Consider implementing additional rate limiting if needed

## Security Notes

- The OpenAI API key is never exposed to the frontend
- All requests are authenticated with JWT
- Input is validated and sanitized
- Rate limiting prevents abuse

## Next Steps

1. **Customize Prompts**: Modify the prompts in `aiSuggestionsController.js` to better match your needs
2. **Add More Fields**: Extend the `fieldPrompts` object to support additional form fields
3. **Improve Context**: Enhance the business context gathering for better suggestions
4. **Monitor Usage**: Set up monitoring for API usage and costs

## Support

If you encounter issues:

1. Check the browser console for frontend errors
2. Check the backend server logs for API errors
3. Verify your OpenAI API key and account status
4. Test with the provided test script
5. Review the API documentation for detailed information
