# Life Insurance Backend API

A Node.js/Express.js backend service for the Life Insurance Recommendation MVP, providing RESTful APIs for user authentication, recommendation generation, and data management.

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15 with connection pooling
- **Authentication**: JWT-based with bcrypt password hashing
- **Validation**: Express-validator + Zod schemas
- **Logging**: Winston structured logging
- **Security**: Helmet, CORS, Rate limiting
- **Testing**: Jest + Supertest

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15+ (or Docker)
- Docker and Docker Compose (for containerized setup)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# From project root
docker-compose up -d backend postgres
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
```

### Option 3: Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🏗 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── AuthController.ts
│   │   ├── RecommendationController.ts
│   │   └── UserController.ts
│   ├── services/             # Business logic
│   │   ├── DatabaseService.ts
│   │   └── RecommendationService.ts
│   ├── routes/               # API route definitions
│   │   ├── auth.ts
│   │   ├── health.ts
│   │   ├── protected.ts
│   │   ├── recommendation.ts
│   │   └── user.ts
│   ├── middleware/           # Express middleware
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   └── logger.ts
│   ├── __tests__/            # Test files
│   │   ├── basic.test.ts
│   │   └── health.test.ts
│   └── server.ts             # Express server setup
├── logs/                     # Application logs
├── Dockerfile               # Docker configuration
├── jest.config.js           # Jest test configuration
├── jest.setup.js            # Jest setup file
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Recommendations
- `POST /api/recommendation` - Generate insurance recommendation (authenticated)
- `GET /api/analytics` - Get recommendation analytics

### User Management
- `GET /api/user/submissions` - Get user's recommendation history (authenticated)
- `POST /api/user/submissions/:id/feedback` - Submit feedback for a recommendation (authenticated)

### Health & Monitoring
- `GET /health` - Application health check
- `GET /api/protected/profile` - Protected route example (authenticated)

## 🗄 Database Schema

### Tables

**users**
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR(255) UNIQUE)
- `password_hash` (VARCHAR(255))
- `first_name`, `last_name` (VARCHAR(100))
- `phone` (VARCHAR(20))
- `created_at`, `updated_at`, `last_login` (TIMESTAMP)

**submissions**
- `id` (SERIAL PRIMARY KEY)
- `age` (INTEGER, 18-80)
- `income` (INTEGER)
- `dependents` (INTEGER, 0-20)
- `risk_tolerance` (VARCHAR(10), 'low'|'medium'|'high')
- `recommendation_type` (VARCHAR(50))
- `coverage_amount` (VARCHAR(20))
- `monthly_premium` (VARCHAR(20))
- `created_at`, `updated_at` (TIMESTAMP)

**user_submissions**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users(id))
- `submission_id` (INTEGER REFERENCES submissions(id))
- `created_at` (TIMESTAMP)

**recommendation_analytics**
- `id` (SERIAL PRIMARY KEY)
- `submission_id` (INTEGER REFERENCES submissions(id))
- `user_feedback` (INTEGER, 1-5)
- `conversion_status` (VARCHAR(20), 'pending'|'converted'|'declined')
- `notes` (TEXT)
- `created_at` (TIMESTAMP)

## 🧠 Recommendation Algorithm

The recommendation engine uses a rules-based approach:

1. **Base Coverage**: 10x annual income + $100k per dependent
2. **Age Adjustments**:
   - Under 30: +20% (future growth potential)
   - Over 50: -20% (reduced needs)
3. **Insurance Type Selection**:
   - Young + Low Risk → Term Life (30 years)
   - Middle-aged + Medium Risk → Term Life (20 years)
   - High Risk → Universal Life (investment growth)
   - Conservative + Older → Whole Life (guaranteed growth)
4. **Premium Calculation**: Based on coverage amount and insurance type

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Express-validator + Zod schemas
- **Rate Limiting**: 10 req/min for API, 100 req/min general
- **Security Headers**: Helmet middleware
- **CORS**: Proper cross-origin configuration
- **SQL Injection Prevention**: Parameterized queries
- **Error Handling**: Structured logging without data exposure

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
- **Unit Tests**: Service layer and utilities
- **Integration Tests**: API endpoints with mocked database
- **Health Checks**: Basic connectivity and functionality

## 📊 Logging

The application uses Winston for structured logging:

- **Error Logs**: `logs/error.log`
- **Combined Logs**: `logs/combined.log`
- **Console Output**: Development environment
- **JSON Format**: Production environment

### Log Levels
- `error`: Application errors and exceptions
- `warn`: Warning conditions
- `info`: General information
- `debug`: Detailed debugging information

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/life_insurance_db

# Server
PORT=5001
NODE_ENV=development
LOG_LEVEL=info

# Frontend
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your-super-secret-jwt-key
```

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t life-insurance-backend .

# Run container
docker run -p 5001:5001 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/life_insurance_db \
  life-insurance-backend
```

### Environment-Specific Configurations

**Development**
- Hot reloading with nodemon
- Detailed error messages
- Console logging
- Unrestricted CORS

**Production**
- Compiled JavaScript
- Error handling without stack traces
- File-based logging
- Restricted CORS
- Rate limiting enabled

## 📈 Performance

- **Connection Pooling**: PostgreSQL connection pool (max 20 connections)
- **Response Compression**: gzip compression middleware
- **Rate Limiting**: Prevents API abuse
- **Optimized Queries**: Indexed database queries
- **Memory Management**: Proper connection cleanup

## 🔮 Future Enhancements

- [ ] Database migrations system
- [ ] Redis caching layer
- [ ] GraphQL API
- [ ] WebSocket support for real-time features
- [ ] Advanced analytics and reporting
- [ ] Integration with external insurance APIs
- [ ] PDF generation for recommendations
- [ ] Email notification system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


---

Built using Node.js, Express, TypeScript, and PostgreSQL 