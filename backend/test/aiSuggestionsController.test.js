const { getAISuggestions } = require('../src/controllers/aiSuggestionsController');

// Mock OpenAI
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'Mock AI suggestion'
            }
          }]
        })
      }
    }
  }))
}));

describe('AI Suggestions Controller - BrandKit Integration', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      query: {}
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('BrandKit Questionnaire Fields', () => {
    test('should handle brandDescription field', async () => {
      mockReq.query = {
        fieldName: 'brandDescription',
        formData: JSON.stringify({
          brandName: 'Test Brand',
          industry: 'Technology',
          primaryCustomers: 'Young professionals'
        })
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fieldName: 'brandDescription',
            fieldType: 'short_text'
          })
        })
      );
    });

    test('should handle problemSolved field', async () => {
      mockReq.query = {
        fieldName: 'problemSolved',
        formData: JSON.stringify({
          brandName: 'Test Brand',
          primaryCustomers: 'Small business owners',
          unfairAdvantage: 'Unique technology solution'
        })
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fieldName: 'problemSolved',
            fieldType: 'long_text'
          })
        })
      );
    });

    test('should handle brandWords field', async () => {
      mockReq.query = {
        fieldName: 'brandWords',
        formData: JSON.stringify({
          brandName: 'Test Brand',
          brandDescription: 'Innovative tech solution',
          primaryCustomers: 'Entrepreneurs'
        })
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fieldName: 'brandWords',
            fieldType: 'tag'
          })
        })
      );
    });

    test('should handle brandAvoidWords field', async () => {
      mockReq.query = {
        fieldName: 'brandAvoidWords',
        formData: JSON.stringify({
          brandName: 'Test Brand',
          brandDescription: 'Professional service',
          primaryCustomers: 'Corporate clients'
        })
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fieldName: 'brandAvoidWords',
            fieldType: 'tag'
          })
        })
      );
    });

    test('should handle tagline field', async () => {
      mockReq.query = {
        fieldName: 'tagline',
        formData: JSON.stringify({
          brandName: 'Test Brand',
          brandDescription: 'Revolutionary product',
          mission: 'To transform the industry'
        })
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fieldName: 'tagline',
            fieldType: 'short_text'
          })
        })
      );
    });

    test('should handle mission field', async () => {
      mockReq.query = {
        fieldName: 'mission',
        formData: JSON.stringify({
          brandName: 'Test Brand',
          brandDescription: 'Sustainable solutions',
          primaryCustomers: 'Environmentally conscious consumers'
        })
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fieldName: 'mission',
            fieldType: 'long_text'
          })
        })
      );
    });

    test('should handle vision field', async () => {
      mockReq.query = {
        fieldName: 'vision',
        formData: JSON.stringify({
          brandName: 'Test Brand',
          brandDescription: 'Future-focused technology',
          mission: 'To innovate and inspire'
        })
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fieldName: 'vision',
            fieldType: 'long_text'
          })
        })
      );
    });

    test('should handle coreValues field', async () => {
      mockReq.query = {
        fieldName: 'coreValues',
        formData: JSON.stringify({
          brandName: 'Test Brand',
          brandDescription: 'Customer-centric service',
          mission: 'To serve with integrity'
        })
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fieldName: 'coreValues',
            fieldType: 'tag'
          })
        })
      );
    });
  });

  describe('Context Extraction', () => {
    test('should extract BrandKit context correctly', async () => {
      const formData = {
        brandName: 'Test Brand',
        brandDescription: 'Innovative solution',
        primaryCustomers: 'Tech professionals',
        unfairAdvantage: 'Unique algorithm',
        problemSolved: 'Complex data processing',
        competitors: ['Competitor A', 'Competitor B'],
        brandWords: ['Innovative', 'Reliable', 'Fast'],
        mission: 'To revolutionize the industry',
        vision: 'A world where technology serves everyone'
      };

      mockReq.query = {
        fieldName: 'brandDescription',
        formData: JSON.stringify(formData)
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true
        })
      );
    });

    test('should handle missing BrandKit context gracefully', async () => {
      mockReq.query = {
        fieldName: 'brandDescription',
        formData: JSON.stringify({})
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true
        })
      );
    });
  });

  describe('Error Handling', () => {
    test('should handle missing fieldName', async () => {
      mockReq.query = {};

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Field name is required'
        })
      );
    });

    test('should handle invalid formData JSON', async () => {
      mockReq.query = {
        fieldName: 'brandDescription',
        formData: 'invalid json'
      };

      await getAISuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true
        })
      );
    });
  });
});
