# AltaMedia Backend

A secure and scalable Express.js backend API for the AltaMedia Backend with authentication features powered by Supabase.

## 🚀 Features

- **Authentication System**: Complete login/logout functionality with JWT tokens
- **Package Management**: Full CRUD operations for packages and addons
- **Purchase System**: User purchase tracking with addon support
- **Supabase Integration**: Secure database operations with Row Level Security (RLS)
- **Role-based Access Control**: Admin, user, and moderator roles
- **Security Features**: Rate limiting, CORS, Helmet, input validation
- **Error Handling**: Comprehensive error handling and logging
- **Scalable Architecture**: Modular folder structure for easy maintenance
- **Postman Collection**: Ready-to-use API testing collection

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Supabase client configuration
│   ├── controllers/
│   │   └── authController.js     # Authentication logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── validation.js        # Input validation middleware
│   │   └── errorHandler.js      # Global error handling
│   ├── routes/
│   │   └── authRoutes.js        # Authentication routes
│   ├── utils/
│   │   └── logger.js            # Logging utility
│   └── server.js                # Main server file
├── database/
│   └── schema.sql               # Database schema and migrations
├── docs/
│   ├── API_DOCUMENTATION.md     # Complete API documentation
│   └── AltaMedia_API.postman_collection.json # Postman collection
├── package.json                 # Dependencies and scripts
├── env.example                  # Environment variables template
└── README.md                    # This file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sieitzz/AltaMedia-Web-App.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   PORT=3000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

4. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the SQL commands from `database/schema.sql` in your Supabase SQL editor
   - Configure Row Level Security (RLS) policies as defined in the schema

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🗄️ Database Setup

### Required Tables

The application requires the following tables in your Supabase database:

1. **users** - Extended user profiles
2. **user_sessions** - Active session tracking
3. **token_blacklist** - Invalidated JWT tokens

Run the SQL commands in `database/schema.sql` to create all necessary tables, indexes, and security policies.

### Row Level Security (RLS)

The application uses Supabase's Row Level Security to ensure data protection:

- Users can only access their own profile data
- Session data is protected by user ownership
- Token blacklist is admin-only for security

## 🔐 Authentication API

### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | User registration | No |
| `POST` | `/api/auth/login` | User login | No |
| `POST` | `/api/auth/logout` | User logout | Yes |
| `GET` | `/api/auth/profile` | Get user profile | Yes |
| `POST` | `/api/auth/refresh` | Refresh access token | No |

### Package Management
| `GET` | `/api/packages` | Get all packages | No |
| `GET` | `/api/packages/:id` | Get package by ID | No |
| `POST` | `/api/packages` | Create package | Admin |
| `PUT` | `/api/packages/:id` | Update package | Admin |
| `DELETE` | `/api/packages/:id` | Delete package | Admin |

### Addon Management
| `GET` | `/api/addons` | Get all addons | No |
| `GET` | `/api/addons/:id` | Get addon by ID | No |
| `POST` | `/api/addons` | Create addon | Admin |
| `PUT` | `/api/addons/:id` | Update addon | Admin |
| `DELETE` | `/api/addons/:id` | Delete addon | Admin |

### Purchase Management
| `GET` | `/api/purchases` | Get user purchases | Yes |
| `GET` | `/api/purchases/:id` | Get purchase by ID | Yes |
| `POST` | `/api/purchases` | Create purchase | Yes |
| `PUT` | `/api/purchases/:id/cancel` | Cancel purchase | Yes |
| `GET` | `/api/purchases/admin/all` | Get all purchases | Admin |

### Request/Response Examples

#### Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SUPABASE_URL` | Your Supabase project URL | Yes | - |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | - |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes | - |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | No | `24h` |
| `PORT` | Server port | No | `3000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `ALLOWED_ORIGINS` | CORS allowed origins | No | `http://localhost:3000` |

### Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable allowed origins
- **Helmet**: Security headers
- **Input Validation**: Express-validator for request validation
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password handling

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Health Check

The application provides a health check endpoint:

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "AltaMedia Client Dashboard Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🔍 Error Handling

The application includes comprehensive error handling:

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (invalid routes)
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

All errors return a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## 🧪 Testing

### Automated Tests
Run tests with Jest:
```bash
npm test
```

### Manual Testing with Postman
1. Import the Postman collection: `docs/AltaMedia_API.postman_collection.json`
2. Set up environment variables in Postman:
   - `base_url`: `http://localhost:3000/api`
   - `token`: Your JWT token after login
   - `admin_token`: Admin JWT token
3. Test all endpoints with the provided examples

### API Documentation
Complete API documentation with examples: `docs/API_DOCUMENTATION.md`

## 📝 Logging

The application uses a custom logger utility:

```javascript
const Logger = require('./src/utils/logger');

Logger.info('User logged in', { userId: '123' });
Logger.error('Database connection failed', error);
Logger.warn('Rate limit exceeded', { ip: '192.168.1.1' });
Logger.debug('Debug information', data);
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **JWT Secrets**: Use strong, unique secrets
3. **Rate Limiting**: Prevents abuse
4. **Input Validation**: Sanitizes all inputs
5. **CORS**: Restricts cross-origin requests
6. **Helmet**: Adds security headers
7. **Row Level Security**: Database-level protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the AltaMedia development team or create an issue in the repository.

---

**Built with ❤️ by the AltaMedia Team** 