// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/life_insurance_test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Mock the database service to avoid actual database connections
jest.mock('./src/services/DatabaseService', () => {
  const mockMethods = {
    query: jest.fn(),
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
    storeSubmission: jest.fn(),
    getUserSubmissions: jest.fn(),
    storeUserFeedback: jest.fn(),
    healthCheck: jest.fn().mockResolvedValue(true),
    close: jest.fn(),
  };

  return {
    DatabaseService: jest.fn().mockImplementation(() => mockMethods),
  };
});

// Mock the logger to avoid file system operations
jest.mock('./src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Global test timeout
jest.setTimeout(10000); 