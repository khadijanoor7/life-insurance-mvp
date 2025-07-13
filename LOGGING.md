# Logging Setup

This application uses a minimalistic logging approach with structured logging for better debugging and monitoring.

## Backend Logging

### Winston Logger
- **Location**: `backend/src/utils/logger.ts`
- **Log Levels**: error, warn, info, debug
- **Output**: 
  - Console (development)
  - Files: `logs/error.log`, `logs/combined.log` (production)

### Request Logging
- **Middleware**: `backend/src/middleware/requestLogger.ts`
- **Tracks**: Request/response timing, status codes, request IDs
- **Format**: JSON with timestamps and metadata

### Log Files
```
backend/logs/
├── error.log      # Error-level logs only
└── combined.log   # All logs
```

## Frontend Logging

### Simple Logger
- **Location**: `frontend/app/lib/logger.ts`
- **Features**: 
  - Colored console output (development)
  - JSON format (production)
  - Request/response tracking

## Viewing Logs

### Using npm scripts
```bash
# View all logs
cd backend && npm run logs

# View error logs only
cd backend && npm run logs:error

# View combined logs only
cd backend && npm run logs:combined
```

### Using the script directly
```bash
# View all logs
./scripts/view-logs.sh

# View error logs only
./scripts/view-logs.sh error

# View combined logs only
./scripts/view-logs.sh combined
```

### Manual viewing
```bash
# View error logs
tail -f backend/logs/error.log | jq -r '.timestamp + " [" + .level + "] " + .message'

# View all logs
tail -f backend/logs/combined.log | jq -r '.timestamp + " [" + .level + "] " + .message'
```

## Log Format

### Backend Logs (JSON)
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Request completed",
  "requestId": "req_1705312200000_abc123",
  "method": "POST",
  "path": "/api/recommendation",
  "statusCode": 200,
  "duration": "45ms",
  "service": "life-insurance-api",
  "version": "1.0.0"
}
```

### Frontend Logs (Development)
```
[INFO] Form submitted {age: 30, income: 75000, dependents: 2, riskTolerance: "medium"}
[INFO] Recommendation received {type: "Term Life Insurance", coverage: "$1,650,000", monthlyPremium: "$1,320"}
```

## What Gets Logged

### Backend
- ✅ All HTTP requests and responses
- ✅ API errors and exceptions
- ✅ Database operations
- ✅ Recommendation generation
- ✅ Server startup/shutdown

### Frontend
- ✅ Form submissions
- ✅ API calls and responses
- ✅ User interactions
- ✅ Errors and exceptions

## Environment Variables

```bash
# Backend
LOG_LEVEL=info          # Log level (error, warn, info, debug)
NODE_ENV=production     # Environment (affects console logging)

# Frontend
NODE_ENV=development    # Environment (affects console colors)
```

## Future Enhancements

- [ ] Log rotation (daily/weekly)
- [ ] Log aggregation (ELK stack)
- [ ] Performance metrics
- [ ] User session tracking
- [ ] Error reporting service integration 