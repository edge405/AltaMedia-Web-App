const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getAISuggestions = async (req, res) => {
  try {
    const { fieldName, formData } = req.query;

    if (!fieldName) {
      return res.status(400).json({
        success: false,
        message: 'Field name is required'
      });
    }

    // Parse form data
    let parsedFormData = {};
    if (formData) {
      try {
        parsedFormData = JSON.parse(formData);
      } catch (e) {
        console.warn('Failed to parse formData:', e);
      }
    }
    console.log("parsedFormData from frontend: ", JSON.stringify(parsedFormData));
    

    // Simple prompt based on field
    const prompt = `Provide a helpful suggestion for ${fieldName} based on this business data: ${JSON.stringify(parsedFormData)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert brand strategist. Provide concise, helpful suggestions. In one paragraph and concise, don't say "based on the provided business data"`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim();

    res.json({
      success: true,
      data: {
        suggestion,
        fieldName
      }
    });

  } catch (error) {
    console.error('AI Suggestions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI suggestion'
    });
  }
};

// const validateAISuggestionsRequest = [];

module.exports = {
  getAISuggestions
};
