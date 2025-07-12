import { useState } from 'react';
import Navigation from '../Layout/Navigation';
import DashboardOverview from './DashboardOverview';
import ExpenseForm from '../Expense/ExpenseForm';
import ExpenseList from '../Expense/ExpenseList';
import Toast from '../UI/Toast';
import '../../styles/main.css';

/**
 * Dashboard Component
 * 
 * This component serves as the main dashboard page with:
 * - Navigation header
 * - Dashboard overview with charts and summaries
 * - Expense form for adding new expenses
 * - Expense list with filtering and management
 * - Toast notifications for user feedback
 * - Responsive layout design
 * 
 * Features:
 * - Comprehensive dashboard layout
 * - Real-time expense management
 * - Interactive charts and visualizations
 * - Form validation and error handling
 * - Toast notification system
 * - Responsive design for all devices
 * - Component composition and state management
 * 
 * State Management:
 * - refreshTrigger: Triggers expense list refresh when new expense is added
 * - toast: Manages toast notification state (message, type, visibility)
 */
export default function Dashboard() {
  // State for triggering expense list refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State for toast notifications
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  /**
   * Handle new expense addition
   * 
   * This function:
   * 1. Increments refresh trigger to update expense list
   * 2. Shows success toast notification
   * 3. Ensures all dashboard components reflect new data
   */
  const handleExpenseAdded = () => {
    // Trigger refresh of expense list and dashboard overview
    setRefreshTrigger(prev => prev + 1);
    
    // Show success toast notification
    showToast('Expense added successfully!', 'success');
  };

  /**
   * Show toast notification
   * 
   * This function:
   * 1. Sets toast message and type
   * 2. Makes toast visible
   * 3. Automatically hides toast after duration
   * 
   * @param {string} message - Toast message text
   * @param {string} type - Toast type ('success', 'error', 'warning', 'info')
   */
  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  /**
   * Hide toast notification
   * 
   * This function:
   * 1. Hides the toast notification
   * 2. Resets toast state
   */
  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return (
    <div className="dashboard">
      {/* Navigation header */}
      <Navigation />
      
      {/* Main dashboard content */}
      <main className="dashboard-main">
        {/* Dashboard overview with charts and summaries */}
        <section className="dashboard-overview-section">
          <DashboardOverview refreshTrigger={refreshTrigger} />
        </section>
        
        {/* Expense management section */}
        <section className="expense-management-section">
          <div className="expense-management-grid">
            {/* Expense form for adding new expenses */}
            <div className="expense-form-section">
              {/* Add Expense Button */}
              <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            </div>
            
            {/* Expense list with filtering and management */}
            <div className="expense-list-section">
              <ExpenseList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </section>
      </main>
      
      {/* Toast notification system */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={3000}
      />
    </div>
  );
} 