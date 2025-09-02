const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import MySQL configuration
const { initializePool, testConnection } = require('./config/mysql');

// Import routes
const authRoutes = require('./routes/authRoutes');
const brandKitRoutes = require('./routes/brandKitRoutes');
const brandKitConsolidationRoutes = require('./routes/brandKitConsolidationRoutes');
const brandKitQuestionnaireRoutes = require('./routes/brandKitQuestionnaireRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const aiSuggestionsRoutes = require('./routes/aiSuggestionsRoutes');
const emailRoutes = require('./routes/emailRoutes');
const emailVerificationRoutes = require('./routes/emailVerificationRoutes');
const userPackageRoutes = require('./routes/userPackageRoutes');
const deliverableRoutes = require('./routes/deliverableRoutes');
const revisionRequestRoutes = require('./routes/revisionRequestRoutes');
const clientRequestRoutes = require('./routes/clientRequestRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize MySQL connection pool
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing MySQL connection pool...');
    await initializePool();
    
    console.log('🔄 Testing MySQL connection...');
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ MySQL database connection established successfully');
    } else {
      console.error('❌ Failed to connect to MySQL database');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, process.env.ALLOWED_ORIGINS] 
    : true, // Allow all origins for development
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.'
//   }
// });
// app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AltaMedia Client Dashboard Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MySQL'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/brandkit', brandKitRoutes);
app.use('/api/brandkit', brandKitConsolidationRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/ai-suggestions', aiSuggestionsRoutes);
app.use('/api/brandkit-questionnaire', brandKitQuestionnaireRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/email-verification', emailVerificationRoutes);
app.use('/api/user-package', userPackageRoutes);
app.use('/api/deliverables', deliverableRoutes);
app.use('/api/revision-requests', revisionRequestRoutes);
app.use('/api/client-requests', clientRequestRoutes);

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: MySQL`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Shutting down server gracefully...');
  process.exit(0);
});

// Start the server
startServer(); 