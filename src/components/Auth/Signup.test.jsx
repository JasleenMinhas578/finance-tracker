// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn()
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp')
}));

// Mock Auth Context
const mockSignup = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  
  useAuth: () => ({
    signup: mockSignup
  })
}));

// Mock React Router
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock Firebase
jest.mock('../../firebase', () => ({
  db: {}
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from './Signup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

describe('Signup Component', () => {
  let originalConsoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockSignup.mockClear();
    
    // Suppress console.error during Signup tests
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore console.error after tests
    console.error = originalConsoleError;
  });

  const renderSignup = () => {
    return render(<Signup />);
  };

  describe('Rendering', () => {
    it('should render signup form with all elements', () => {
      renderSignup();
      
      expect(screen.getByText('Join FinTrack')).toBeInTheDocument();
      expect(screen.getByText('Create your account and start tracking your finances')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('should render back button', () => {
      renderSignup();
      
      const backButton = screen.getByRole('button', { name: /go back to home/i });
      expect(backButton).toBeInTheDocument();
    });

    it('should not show error messages initially', () => {
      renderSignup();
      
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/password must be/i)).not.toBeInTheDocument();
    });

    it('should render password visibility toggles', () => {
      renderSignup();
      
      const passwordToggles = screen.getAllByLabelText('Show password');
      
      expect(passwordToggles).toHaveLength(2);
      expect(passwordToggles[0]).toBeInTheDocument();
      expect(passwordToggles[1]).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should update email input value', () => {
      renderSignup();
      
      const emailInput = screen.getByLabelText('Email Address');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password input value', () => {
      renderSignup();
      
      const passwordInput = screen.getByLabelText('Password');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      
      expect(passwordInput.value).toBe('Password123!');
    });

    it('should update confirm password input value', () => {
      renderSignup();
      
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      
      expect(confirmPasswordInput.value).toBe('Password123!');
    });

    it('should toggle password visibility', () => {
      renderSignup();
      
      const passwordInput = screen.getByLabelText('Password');
      const passwordToggles = screen.getAllByLabelText('Show password');
      const passwordToggle = passwordToggles[0];
      
      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click toggle to show password
      fireEvent.click(passwordToggle);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
      
      // Click toggle to hide password again
      fireEvent.click(screen.getByLabelText('Hide password'));
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should toggle confirm password visibility', () => {
      renderSignup();
      
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const passwordToggles = screen.getAllByLabelText('Show password');
      const confirmPasswordToggle = passwordToggles[1];
      
      // Initially password should be hidden
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      
      // Click toggle to show password
      fireEvent.click(confirmPasswordToggle);
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    });

    it('should handle keyboard navigation for password toggles', () => {
      renderSignup();
      
      const passwordToggles = screen.getAllByLabelText('Show password');
      const passwordToggle = passwordToggles[0];
      const passwordInput = screen.getByLabelText('Password');
      
      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Press Enter to show password
      fireEvent.keyDown(passwordToggle, { key: 'Enter' });
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Press Space to hide password
      fireEvent.keyDown(screen.getByLabelText('Hide password'), { key: ' ' });
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Password Validation', () => {
    it('should show error for weak password (too short)', () => {
      renderSignup();
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });
      fireEvent.click(submitButton);
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });
    it('should show error for password without uppercase letter', () => {
      renderSignup();
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.change(passwordInput, { target: { value: 'password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123!' } });
      fireEvent.click(submitButton);
      expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
    });
    it('should show error for password without lowercase letter', () => {
      renderSignup();
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.change(passwordInput, { target: { value: 'PASSWORD123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'PASSWORD123!' } });
      fireEvent.click(submitButton);
      expect(screen.getByText(/password must contain at least one lowercase letter/i)).toBeInTheDocument();
    });
    it('should show error for password without number', () => {
      renderSignup();
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.change(passwordInput, { target: { value: 'Password!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password!' } });
      fireEvent.click(submitButton);
      expect(screen.getByText(/password must contain at least one number/i)).toBeInTheDocument();
    });

    it('should accept valid password', () => {
      renderSignup();
      
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      
      expect(screen.queryByText(/password must be at least 8 characters/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call signup with correct credentials', async () => {
      const mockUserCredential = {
        user: { uid: 'user123', email: 'test@example.com' }
      };
      mockSignup.mockResolvedValue(mockUserCredential);
      setDoc.mockResolvedValue();
      
      renderSignup();
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'Password123!');
      });
    });

    it('should navigate to dashboard on successful signup', async () => {
      const mockUserCredential = {
        user: { uid: 'user123', email: 'test@example.com' }
      };
      mockSignup.mockResolvedValue(mockUserCredential);
      setDoc.mockResolvedValue();
      
      renderSignup();
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show loading state during signup', async () => {
      mockSignup.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      renderSignup();
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Creating account...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error message when signup fails', async () => {
      mockSignup.mockRejectedValue(new Error('Signup failed'));
      
      renderSignup();
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to create an account')).toBeInTheDocument();
      });
    });

    it('should clear previous errors when form is resubmitted', async () => {
      // First submission - should show error
      mockSignup.mockRejectedValueOnce(new Error('Signup failed'));
      renderSignup();
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText('Failed to create an account')).toBeInTheDocument();
      });
      // Second submission - should clear error and succeed
      const mockUserCredential = {
        user: { uid: 'user123', email: 'test@example.com' }
      };
      mockSignup.mockResolvedValueOnce(mockUserCredential);
      setDoc.mockResolvedValue();
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.queryByText('Failed to create an account')).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate back when back button is clicked', () => {
      renderSignup();
      
      const backButton = screen.getByRole('button', { name: /go back to home/i });
      fireEvent.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should have correct link to login page', () => {
      renderSignup();
      
      const loginLink = screen.getByText('Sign In');
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });
  });

  describe('Form Validation', () => {
    it('should require email field', () => {
      renderSignup();
      
      const emailInput = screen.getByLabelText('Email Address');
      expect(emailInput).toHaveAttribute('required');
    });

    it('should require password field', () => {
      renderSignup();
      
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('required');
    });

    it('should require confirm password field', () => {
      renderSignup();
      
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      expect(confirmPasswordInput).toHaveAttribute('required');
    });

    it('should have correct input types', () => {
      renderSignup();
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      renderSignup();
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toBeInTheDocument();
    });

    it('should have proper aria-label for back button', () => {
      renderSignup();
      
      const backButton = screen.getByRole('button', { name: /go back to home/i });
      expect(backButton).toHaveAttribute('aria-label', 'Go back to home');
    });

    it('should have proper aria-labels for password toggles', () => {
      renderSignup();
      
      const passwordToggles = screen.getAllByLabelText('Show password');
      
      expect(passwordToggles[0]).toHaveAttribute('aria-label', 'Show password');
      expect(passwordToggles[1]).toHaveAttribute('aria-label', 'Show password');
    });
  });
}); 