import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './pages/PrivateRoute';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import Expenses from './components/Dashboard/Expenses';
import Categories from './components/Dashboard/Categories';
import Reports from './components/Dashboard/Reports';
import './styles/main.css';
import './styles/dashboard-fixes.css';

/**
 * Main App Component
 * 
 * This is the root component that sets up:
 * 1. Browser routing with React Router
 * 2. Authentication context provider
 * 3. Route definitions for the entire application
 * 
 * Route Structure:
 * - / (Landing page)
 * - /login (Authentication)
 * - /signup (User registration)
 * - /dashboard/* (Protected routes requiring authentication)
 */
function App() {
  return (
    <Router>
      {/* AuthProvider wraps the entire app to provide authentication context */}
      <AuthProvider>
        <Routes>
          {/* Public routes - accessible without authentication */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            {/* Nested routes within dashboard */}
            <Route index element={<DashboardOverview />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="categories" element={<Categories />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;