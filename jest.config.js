/**
 * Jest Configuration for Finance Tracker
 * 
 * This file configures Jest testing framework for the React application.
 * It sets up the testing environment, file patterns, coverage requirements,
 * and custom transformations needed for the project.
 */

module.exports = {
  // Use jsdom environment to simulate browser environment in tests
  testEnvironment: 'jsdom',
  
  // Define where Jest should look for test files
  // Tests can be in src/ directory or test/unit/ directory
  roots: ['<rootDir>/src', '<rootDir>/test/unit'],
  
  // Files to run before each test suite
  // This loads our test setup file with mocks and configurations
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  
  // Module name mapping for handling imports
  moduleNameMapper: {
    // Handle CSS imports by returning an empty object
    // This prevents Jest from trying to parse CSS files
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // Handle static file imports (images, fonts, etc.)
    // These are mocked to prevent import errors in tests
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js'
  },
  
  // Pattern for identifying test files
  // Looks for files ending in .test.js, .spec.js, .test.jsx, or .spec.jsx
  testMatch: [
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  // Files to include in coverage reports
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',        // All JS/JSX files in src/
    '!src/index.js',           // Exclude main entry point
    '!src/reportWebVitals.js', // Exclude web vitals reporting
    '!src/firebase.js'         // Exclude Firebase config (contains sensitive data)
  ],
  
  // Coverage thresholds - tests will fail if coverage drops below these levels
  coverageThreshold: {
    global: {
      branches: 70,    // 70% of code branches must be tested
      functions: 70,   // 70% of functions must be tested
      lines: 70,       // 70% of code lines must be tested
      statements: 70   // 70% of statements must be tested
    }
  },
  
  // Transform configuration for handling different file types
  transform: {
    // Transform JS and JSX files using babel-jest
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // File extensions that Jest should recognize
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Directories to ignore when running tests
  testPathIgnorePatterns: [
    '/node_modules/',  // Ignore node_modules
    '/build/',         // Ignore build directory
    '/dist/'           // Ignore dist directory
  ],
  
  // Enable verbose output for better debugging
  verbose: true
}; 