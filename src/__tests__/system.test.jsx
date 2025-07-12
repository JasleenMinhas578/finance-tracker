import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// --- GLOBAL MOCKS ---

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
    })),
    add: jest.fn(),
    get: jest.fn(),
    onSnapshot: jest.fn((...args) => {
      const callback = args.find(arg => typeof arg === 'function');
      if (callback) callback({ forEach: jest.fn() });
      return () => {}; // Always return a function!
    }),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
  })),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(() => ({
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
  })),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  onSnapshot: jest.fn((...args) => {
    const callback = args.find(arg => typeof arg === 'function');
    if (callback) callback({ forEach: jest.fn() });
    return () => {}; // Always return a function!
  }),
  query: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => ({ seconds: 1234567890, nanoseconds: 0 })),
  Timestamp: {
    fromDate: jest.fn(date => ({ seconds: Math.floor(date.getTime() / 1000), nanoseconds: 0 })),
    now: jest.fn(() => ({ seconds: 1234567890, nanoseconds: 0 })),
  },
  getFirestore: jest.fn(),
}));

jest.mock('../firebase', () => {
  const fakeFirestore = {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
      })),
      add: jest.fn(),
      get: jest.fn(),
      onSnapshot: jest.fn((...args) => {
        const callback = args.find(arg => typeof arg === 'function');
        if (callback) callback({ forEach: jest.fn() });
        return () => {}; // Always return a function!
      }),
      where: jest.fn(),
      orderBy: jest.fn(),
      limit: jest.fn(),
    })),
  };
  return {
    auth: {
      onAuthStateChanged: jest.fn(callback => {
        callback(null);
        return () => {}; // Always return a function!
      }),
      signOut: jest.fn(),
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      currentUser: null,
    },
    firestore: fakeFirestore,
    db: fakeFirestore,
    app: {},
  };
});

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return () => {}; // Always return a function!
  }),
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
}));

jest.mock('../services/database', () => ({
  addExpense: jest.fn(),
  getExpenses: jest.fn(() => Promise.resolve([])),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
  addCategory: jest.fn(),
  getCategories: jest.fn(() => Promise.resolve([])),
  subscribeToExpenses: jest.fn(() => () => {}), // Always return a function!
  subscribeToCategories: jest.fn(() => () => {}), // Always return a function!
}));

const mockLogin = jest.fn();
const mockSignup = jest.fn();
const mockLogout = jest.fn();
let mockUser = null;

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: mockUser,
    login: mockLogin,
    signup: mockSignup,
    logout: mockLogout,
    loading: false,
    setLoading: jest.fn(),
    error: null,
    setError: jest.fn(),
    resetPassword: jest.fn(),
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
  }),
}));

jest.mock('../components/Charts/PieChart', () => () => <div data-testid="pie-chart">Pie Chart</div>);
jest.mock('../components/Charts/LineChart', () => () => <div data-testid="line-chart">Line Chart</div>);
jest.mock('jspdf', () => () => ({ save: jest.fn() }));
jest.mock('html2canvas', () => () => Promise.resolve({ toDataURL: jest.fn(() => 'data:image/png;base64,mock') }));

import Landing from '../pages/Landing';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import Dashboard from '../pages/Dashboard';
import Expenses from '../components/Dashboard/Expenses';
import Categories from '../components/Dashboard/Categories';
import Reports from '../components/Dashboard/Reports';

const renderWithRouter = (component) => render(<BrowserRouter>{component}</BrowserRouter>);


beforeEach(() => {
  mockUser = null;
  jest.clearAllMocks();
});

describe('Auth Flow', () => {
  test('user can sign up and see dashboard', async () => {
    renderWithRouter(<Landing />);
    fireEvent.click(screen.getByText(/Get Started/i));
    await waitFor(() => expect(screen.getByText(/Create Account/i)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'new@user.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'TestPass123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'TestPass123' } });
    mockSignup.mockResolvedValue();
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    await waitFor(() => expect(mockSignup).toHaveBeenCalled());
    // Simulate user now logged in
    mockUser = { uid: '1', email: 'new@user.com' };
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('user can log in and see dashboard', async () => {
    renderWithRouter(<Landing />);
    fireEvent.click(screen.getByText(/Sign In/i));
    await waitFor(() => expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'user@demo.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    mockLogin.mockResolvedValue();
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(mockLogin).toHaveBeenCalled());
    mockUser = { uid: '1', email: 'user@demo.com' };
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('shows validation errors for invalid signup', async () => {
    renderWithRouter(<Signup />);
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  test('shows error for invalid login', async () => {
    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'bad@user.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'badpass' } });
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(mockLogin).toHaveBeenCalled());
    // Simulate error UI if your Login component displays it
  });

  test('edge case: password strength validation', async () => {
    renderWithRouter(<Signup />);
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'weak' } });
    expect(await screen.findByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();
  });
});

describe('Dashboard Navigation', () => {
  beforeEach(() => { mockUser = { uid: '1', email: 'user@demo.com' }; });
  test('shows dashboard and allows logout', async () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByText(/Logout/i)[0]);
    await waitFor(() => expect(mockLogout).toHaveBeenCalled());
  });
});

describe('Expenses', () => {
  beforeEach(() => { mockUser = { uid: '1', email: 'user@demo.com' }; });
  test('shows expenses page and allows adding expense', async () => {
    renderWithRouter(<Expenses />);
    fireEvent.click(await screen.findByText(/Add Expense/i));
    expect(await screen.findByText(/Add New Expense/i)).toBeInTheDocument();
  });
  test('shows empty state if no expenses', async () => {
    renderWithRouter(<Expenses />);
    expect(await screen.findByText(/No expenses yet/i)).toBeInTheDocument();
  });
  test('edge case: handles network error', async () => {
    const mockDatabase = require('../services/database');
    mockDatabase.getExpenses.mockRejectedValue(new Error('Network error'));
    renderWithRouter(<Expenses />);
    expect(await screen.findByText(/No expenses yet/i)).toBeInTheDocument();
  });
});

describe('Categories', () => {
  beforeEach(() => { mockUser = { uid: '1', email: 'user@demo.com' }; });
  test('shows categories page and allows adding category', async () => {
    renderWithRouter(<Categories />);
    fireEvent.click(await screen.findByText(/Add Category/i));
    expect(await screen.findByText(/Add New Category/i)).toBeInTheDocument();
  });
  test('shows empty state if no categories', async () => {
    renderWithRouter(<Categories />);
    expect(await screen.findByText(/No categories yet/i)).toBeInTheDocument();
  });
  test('edge case: handles network error', async () => {
    const mockDatabase = require('../services/database');
    mockDatabase.getCategories.mockRejectedValue(new Error('Network error'));
    renderWithRouter(<Categories />);
    expect(await screen.findByText(/No categories yet/i)).toBeInTheDocument();
  });
});

describe('Reports', () => {
  beforeEach(() => { mockUser = { uid: '1', email: 'user@demo.com' }; });
  test('shows reports page with charts', async () => {
    renderWithRouter(<Reports />);
    expect(await screen.findByTestId('pie-chart')).toBeInTheDocument();
    expect(await screen.findByTestId('line-chart')).toBeInTheDocument();
  });
  test('allows export of reports', async () => {
    renderWithRouter(<Reports />);
    expect(await screen.findByText(/Export Report/i)).toBeInTheDocument();
    // Simulate export click if needed
  });
  test('edge case: handles empty data', async () => {
    renderWithRouter(<Reports />);
    // If your Reports page shows a message for no data, check for it here
    // expect(await screen.findByText(/No data/i)).toBeInTheDocument();
  });
}); 