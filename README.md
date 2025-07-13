# Life Insurance Recommendation MVP

A full-stack life insurance recommendation engine built with **Next.js frontend** and **Node.js backend** that provides personalized insurance recommendations based on user profiles.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose
- **Authentication**: JWT-based with bcrypt
- **Testing**: Jest + React Testing Library (Frontend), Jest + Supertest (Backend)

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd life-insurance-mvp
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5001/api/recommendation
   - **Health Check**: http://localhost:5001/health
   - **Database**: localhost:5432 (postgres/postgres)

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

2. **Set up environment variables**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start PostgreSQL database**
   ```bash
   # Using Docker
   docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15-alpine
   ```

4. **Start development servers**
   ```bash
   # Start backend (from backend directory)
   cd backend && npm run dev
   
   # Start frontend (from frontend directory)
   cd frontend && npm run dev
   ```

## 🏗 Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │────│   Node.js API   │────│   PostgreSQL    │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
│   Port: 3000    │    │   Port: 5001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Project Structure
```
life-insurance-mvp/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/            # Utilities and API client
│   │   ├── types/          # TypeScript types
│   │   └── ...             # Next.js app structure
│   ├── Dockerfile
│   └── package.json
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Express server
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Multi-container setup
└── README.md
```

### Database Schema

**users** table:
- `id` (Primary Key)
- `email`, `password_hash`, `first_name`, `last_name`
- `created_at`, `updated_at`, `last_login`

**submissions** table:
- `id` (Primary Key)
- `age`, `income`, `dependents`, `risk_tolerance` (User inputs)
- `recommendation_type`, `coverage_amount`, `monthly_premium` (Generated recommendations)
- `created_at`, `updated_at` (Timestamps)

**user_submissions** table:
- Links users to their submissions (many-to-many relationship)

**recommendation_analytics** table:
- `submission_id`, `user_feedback`, `conversion_status`, `notes`

### API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/recommendation` - Generate insurance recommendation (authenticated)
- `GET /api/user/submissions` - Get user's recommendation history (authenticated)
- `POST /api/user/submissions/:id/feedback` - Submit feedback (authenticated)
- `GET /health` - Application health check

## 🧠 Recommendation Algorithm

The recommendation engine uses a rules-based approach:

1. **Coverage Calculation**: Base coverage = 10x annual income + $100k per dependent
2. **Age Adjustments**: 
   - Under 30: +20% coverage (future growth potential)
   - Over 50: -20% coverage (reduced needs)
3. **Insurance Type Selection**:
   - Young + Low Risk → Term Life (30 years)
   - Middle-aged + Medium Risk → Term Life (20 years)
   - High Risk → Universal Life (investment growth)
   - Conservative + Older → Whole Life (guaranteed growth)
4. **Premium Calculation**: Based on coverage amount, age multipliers, and insurance type

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication with bcrypt password hashing
- **Input Validation**: Zod schema validation on frontend, express-validator on backend
- **Rate Limiting**: 10 req/min for API, 100 req/min general
- **Security Headers**: Helmet middleware
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **SQL Injection Prevention**: Parameterized queries with connection pooling
- **Error Handling**: Structured logging without exposing sensitive data

## 🧪 Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# Run all tests (from root)
cd frontend && npm test && cd ../backend && npm test
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
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
JWT_SECRET=your-jwt-secret
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### AWS Deployment Options

1. **ECS with Fargate**: Containerized deployment
2. **Elastic Beanstalk**: Managed platform deployment
3. **Lambda + API Gateway**: Serverless backend (limited)

## 📊 Monitoring and Analytics

### Health Checks
- **Frontend**: HTTP GET to `/` (Next.js app)
- **Backend**: HTTP GET to `/health` (API status + DB connection)
- **Database**: PostgreSQL connection test

### Logging
- **Frontend**: Browser console + error boundaries
- **Backend**: Winston structured logging to files and console
- **Database**: PostgreSQL query logs

### Metrics to Monitor
- API response times and error rates
- Database connection pool usage
- Recommendation conversion rates
- User feedback scores
- Memory and CPU usage

## 🚀 Performance Optimizations

1. **Frontend**:
   - Next.js 15 with App Router
   - TypeScript for type safety
   - Tailwind CSS for optimized styling
   - Component-based architecture

2. **Backend**:
   - Connection pooling for PostgreSQL
   - Response compression with gzip
   - Rate limiting to prevent abuse
   - Structured logging for debugging

3. **Database**:
   - Optimized indexes on frequently queried columns
   - Connection pooling with proper limits
   - Efficient query patterns

## 🔮 Future Enhancements

### Phase 2 Features
- [x] User authentication (JWT-based) ✅
- [x] User profiles and recommendation history ✅
- [ ] Email notifications for quotes
- [ ] Machine learning recommendation engine
- [ ] React Native mobile app
- [ ] PDF quote generation
- [ ] A/B testing framework




## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the individual README files in `frontend/` and `backend/` directories

---

Built using Next.js, Node.js, Express, PostgreSQL, and Docker
