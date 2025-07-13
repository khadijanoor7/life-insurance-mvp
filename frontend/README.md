# Life Insurance Frontend

A Next.js 15 frontend application for the Life Insurance Recommendation MVP, providing an intuitive user interface for insurance recommendations and user management.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **State Management**: React hooks and context
- **API Client**: Custom fetch wrapper with authentication

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Backend API running (see backend README)
- PostgreSQL database (handled by backend)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# From project root
docker-compose up -d frontend
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🏗 Project Structure

```
frontend/
├── app/                     # Next.js App Router
│   ├── auth/               # Authentication pages
│   │   └── page.tsx        # Login/Signup page
│   ├── components/         # Reusable React components
│   │   ├── ui/            # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── AuthPage.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LandingPage.tsx
│   │   ├── RecommendationForm.tsx
│   │   ├── RecommendationResult.tsx
│   │   └── EducationalContent.tsx
│   ├── lib/               # Utilities and API client
│   │   ├── api.ts         # API client with authentication
│   │   └── utils.ts       # Utility functions
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── profile/           # User profile pages
│   │   └── page.tsx
│   ├── recommendations/   # Recommendation pages
│   │   └── page.tsx
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── public/                # Static assets
├── __tests__/             # Test files
├── Dockerfile            # Docker configuration
├── jest.config.js        # Jest configuration
├── jest.setup.js         # Jest setup file
├── middleware.ts         # Next.js middleware
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Features

### Core Functionality
- **User Authentication**: Login and signup with JWT tokens
- **Insurance Recommendations**: Form-based recommendation generation
- **User Profile**: View and manage personal information
- **Recommendation History**: Track past recommendations
- **Educational Content**: Insurance education and guidance

### UI Components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: Client-side validation with error handling
- **Loading States**: Skeleton loaders and progress indicators
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels and keyboard navigation

## 🔌 API Integration

The frontend communicates with the backend API through a custom client:

```typescript
// Example API usage
import { api } from '@/lib/api';

// Get recommendations
const recommendations = await api.get('/user/submissions');

// Submit recommendation form
const result = await api.post('/recommendation', formData);
```

### Authentication Flow
1. User submits login/signup form
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in subsequent API requests
5. Automatic token refresh handling

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
- **Unit Tests**: Individual component testing
- **Integration Tests**: API integration testing
- **E2E Tests**: User flow testing (future)

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t life-insurance-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:5001 \
  life-insurance-frontend
```

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment-Specific Configurations

**Development**
- Hot reloading
- Detailed error messages
- Development API endpoints
- Unrestricted CORS

**Production**
- Optimized builds
- Error boundaries
- Production API endpoints
- Performance optimizations

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔒 Security

- **JWT Token Management**: Secure token storage and refresh
- **Input Validation**: Client-side validation with server verification
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookies and token validation

## 📊 Performance

- **Next.js 15**: Latest performance optimizations
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Static generation and ISR where applicable
- **Bundle Analysis**: Webpack bundle analyzer integration

## 🔮 Future Enhancements

- [ ] Progressive Web App (PWA) features
- [ ] Real-time notifications
- [ ] Advanced form validation with react-hook-form
- [ ] Chart.js integration for analytics
- [ ] PDF generation for recommendations
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced search and filtering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


---

Built using Next.js, React, TypeScript, and Tailwind CSS
