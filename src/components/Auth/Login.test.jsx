// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn()
}));

// Mock Auth Context
const mockLogin = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin
  })
}));

// Mock Firebase
jest.mock('../../firebase', () => ({
  auth: {}
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

describe('Login Component', () => {
  let originalConsoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockLogin.mockClear();
    
    // Suppress console.error during Login tests
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore console.error after tests
    console.error = originalConsoleError;
  });

  const renderLogin = () => {
    return render(<Login />);
  };

  describe('Rendering', () => {
    it('should render login form with all elements', () => {
      renderLogin();
      
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your FinTrack account')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('should render back button', () => {
      renderLogin();
      
      const backButton = screen.getByRole('button', { name: /go back to home/i });
      expect(backButton).toBeInTheDocument();
    });

    it('should not show error message initially', () => {
      renderLogin();
      
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should update email input value', () => {
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password input value', () => {
      renderLogin();
      
      const passwordInput = screen.getByLabelText('Password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      expect(passwordInput.value).toBe('password123');
    });

    it('should show loading state when form is submitted', async () => {
      signInWithEmailAndPassword.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should navigate to dashboard on successful login', async () => {
      signInWithEmailAndPassword.mockResolvedValue();
      
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });
  });



  describe('Navigation', () => {
    it('should navigate back when back button is clicked', () => {
      renderLogin();
      
      const backButton = screen.getByRole('button', { name: /go back to home/i });
      fireEvent.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should have correct link to signup page', () => {
      renderLogin();
      
      const signupLink = screen.getByText('Sign Up');
      expect(signupLink.closest('a')).toHaveAttribute('href', '/signup');
    });
  });

  describe('Form Validation', () => {
    it('should require email field', () => {
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address');
      expect(emailInput).toHaveAttribute('required');
    });

    it('should require password field', () => {
      renderLogin();
      
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('required');
    });

    it('should have correct input types', () => {
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('should have proper aria-label for back button', () => {
      renderLogin();
      
      const backButton = screen.getByRole('button', { name: /go back to home/i });
      expect(backButton).toHaveAttribute('aria-label', 'Go back to home');
    });
  });
}); 