import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

/**
 * Authentication Context
 * 
 * This context provides authentication state and methods throughout the app.
 * It manages user login, signup, logout, and tracks the current user state.
 */

// Create the context
const AuthContext = createContext();

/**
 * AuthProvider Component
 * 
 * Wraps the app and provides authentication functionality:
 * - User registration (signup)
 * - User login
 * - User logout
 * - Current user state tracking
 * - Loading state management
 * 
 * @param {Object} children - React components to be wrapped
 */
export function AuthProvider({ children }) {
  // State to track the currently logged-in user
  const [currentUser, setCurrentUser] = useState(null);
  
  // State to track if authentication is still loading
  const [loading, setLoading] = useState(true);

  /**
   * Register a new user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise} Firebase auth result
   */
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  /**
   * Log in an existing user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise} Firebase auth result
   */
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Log out the current user
   * @returns {Promise} Firebase auth result
   */
  function logout() {
    return signOut(auth);
  }

  /**
   * Listen for authentication state changes
   * This effect runs once when the component mounts and sets up
   * a listener that updates the currentUser state whenever
   * the user logs in or out
   */
  useEffect(() => {
    // Set up the authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update current user state
      setLoading(false);    // Mark loading as complete
    });

    // Cleanup function to remove the listener when component unmounts
    return unsubscribe;
  }, []);

  // Value object to be provided by the context
  const value = {
    currentUser,  // Current user object (null if not logged in)
    signup,       // Function to register new users
    login,        // Function to log in users
    logout        // Function to log out users
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children when authentication is not loading */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the authentication context
 * 
 * This hook provides easy access to authentication state and methods
 * in any component that needs them.
 * 
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  return useContext(AuthContext);
}