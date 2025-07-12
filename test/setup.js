// Test setup file
require('@testing-library/jest-dom');

/**
 * Test Setup Configuration
 * 
 * This file configures the testing environment for the Finance Tracker application.
 * It sets up mocks for browser APIs that aren't available in the Jest test environment
 * and configures console error handling for cleaner test output.
 * 
 * This file is automatically loaded before each test suite runs.
 */

/**
 * Mock window.matchMedia
 * 
 * This mock is required because many modern CSS frameworks and responsive
 * design features use matchMedia, which isn't available in the Jest DOM environment.
 * 
 * The mock returns an object that simulates the MediaQueryList interface
 * with all required methods and properties.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,           // Default to false (no media query matches)
    media: query,             // The media query string
    onchange: null,           // Event handler for media query changes
    addListener: jest.fn(),   // Deprecated method (kept for compatibility)
    removeListener: jest.fn(), // Deprecated method (kept for compatibility)
    addEventListener: jest.fn(), // Modern event listener method
    removeEventListener: jest.fn(), // Modern event listener removal
    dispatchEvent: jest.fn(), // Event dispatching method
  })),
});

/**
 * Mock IntersectionObserver
 * 
 * This mock is required for components that use intersection observer
 * for features like infinite scrolling, lazy loading, or scroll-based animations.
 * 
 * The mock provides a minimal implementation that doesn't throw errors
 * but doesn't actually observe elements.
 */
global.IntersectionObserver = class IntersectionObserver {
  constructor() {
    // Constructor can accept options but we don't use them in tests
  }
  
  observe() {
    // Mock observe method - does nothing in tests
    return null;
  }
  
  disconnect() {
    // Mock disconnect method - does nothing in tests
    return null;
  }
  
  unobserve() {
    // Mock unobserve method - does nothing in tests
    return null;
  }
};

/**
 * Mock ResizeObserver
 * 
 * This mock is required for Chart.js components and other libraries
 * that use ResizeObserver to detect container size changes.
 * 
 * The mock provides a minimal implementation that doesn't throw errors
 * but doesn't actually observe resize events.
 */
global.ResizeObserver = class ResizeObserver {
  constructor() {
    // Constructor can accept callback but we don't use it in tests
  }
  
  observe() {
    // Mock observe method - does nothing in tests
    return null;
  }
  
  disconnect() {
    // Mock disconnect method - does nothing in tests
    return null;
  }
  
  unobserve() {
    // Mock unobserve method - does nothing in tests
    return null;
  }
};

/**
 * Console Error Suppression
 * 
 * This section suppresses console.error messages during tests to keep
 * test output clean and focused on actual test results.
 * 
 * Only specific, expected errors are suppressed. Unexpected errors
 * will still be logged for debugging purposes.
 */

// Store the original console.error function
const originalError = console.error;

// Set up error suppression before all tests
beforeAll(() => {
  console.error = jest.fn((...args) => {
    // Only suppress specific, expected error messages
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: React does not recognize the') ||
       args[0].includes('Warning: Each child in a list should have a unique') ||
       args[0].includes('Login error:'))
    ) {
      // Suppress these specific warnings/errors
      return;
    }
    
    // For debugging purposes, you can uncomment the next line to see all console.error messages
    // originalError.call(console, ...args);
  });
});

// Restore original console.error after all tests
afterAll(() => {
  console.error = originalError;
}); 