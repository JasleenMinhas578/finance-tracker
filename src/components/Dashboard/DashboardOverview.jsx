import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { PieChart, LineChart } from '../Charts';
import '../../styles/main.css';
import '../../styles/dashboard-fixes.css';

/**
 * DashboardOverview Component
 * 
 * This is the main dashboard component that displays:
 * - Welcome section with user greeting
 * - Summary cards with key financial metrics
 * - Interactive charts (pie chart for categories, line chart for trends)
 * - Recent expenses list
 * 
 * Features:
 * - Real-time data synchronization with Firestore
 * - Automatic chart updates when data changes
 * - Responsive design for mobile and desktop
 * - Summary calculations (total, monthly, average, top category)
 */
export default function DashboardOverview() {
  // State management for data
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  
  // Get current user from authentication context
  const { currentUser } = useAuth();

  // Debug logging for development
  console.log('currentUser:', currentUser);
  if (currentUser) {
    console.log('Firestore path:', `users/${currentUser.uid}/expenses`);
  }

  /**
   * Set up real-time data listeners for expenses and categories
   * This effect runs when the component mounts and when currentUser changes
   */
  useEffect(() => {
    if (currentUser) {
      console.log('Firestore path:', `users/${currentUser.uid}/expenses`);
      
      // Set up real-time listener for expenses
      const qExpenses = query(
        collection(db, 'users', currentUser.uid, 'expenses'),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribeExpenses = onSnapshot(qExpenses, (querySnapshot) => {
        const expensesData = [];
        querySnapshot.forEach((doc) => {
          expensesData.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort expenses by date (most recent first)
        const sortedExpenses = expensesData.sort((a, b) => {
          if (a.date && b.date) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          return 0;
        });
        
        setExpenses(sortedExpenses);
        // Get the 5 most recent expenses for the recent activity section
        setRecentExpenses(sortedExpenses.slice(0, 5));
      });

      // Set up real-time listener for categories
      const qCategories = query(
        collection(db, 'users', currentUser.uid, 'categories')
      );
      
      const unsubscribeCategories = onSnapshot(qCategories, (querySnapshot) => {
        const categoriesData = [];
        querySnapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, ...doc.data() });
        });
        setCategories(categoriesData);
      });

      // Cleanup function to remove listeners when component unmounts
      return () => {
        unsubscribeExpenses();
        unsubscribeCategories();
      };
    }
  }, [currentUser]);

  // Calculate summary statistics from expenses data
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate this month's expenses
  const thisMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate average expense amount
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  
  // Calculate top spending category
  const topCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategoryName = Object.keys(topCategory).length > 0 
    ? Object.entries(topCategory).sort(([,a], [,b]) => b - a)[0][0]
    : 'None';

  // Default categories that are always available in the system
  const defaultCategories = [
    { id: 'food', name: 'Food', icon: '🍕' },
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'utilities', name: 'Utilities', icon: '⚡' },
    { id: 'rent', name: 'Rent', icon: '🏠' },
    { id: 'other', name: 'Other', icon: '📦' }
  ];

  // Combine default categories with user-created custom categories
  const allCategories = [
    ...defaultCategories,
    ...categories.map(cat => ({ ...cat, icon: '📊' }))
  ];

  /**
   * Prepare data for pie chart showing spending by category
   * 
   * This function:
   * 1. Initializes all categories with 0 spending
   * 2. Sums up expenses by category
   * 3. Returns data in Chart.js format
   * 
   * @returns {Object} Chart.js data object for pie chart
   */
  const getCategoryData = useCallback(() => {
    const categoryMap = {};
    
    // Initialize all categories (default + custom) with 0 spending
    allCategories.forEach(cat => {
      categoryMap[cat.name] = 0;
    });
    
    // Sum expenses by category
    expenses.forEach(expense => {
      if (categoryMap.hasOwnProperty(expense.category)) {
        categoryMap[expense.category] += expense.amount;
      }
    });
    
    return {
      labels: Object.keys(categoryMap),
      datasets: [{
        data: Object.values(categoryMap),
        backgroundColor: [
          '#4fd1c5', '#f687b3', '#f6ad55', '#68d391', '#63b3ed', '#b794f4',
          '#fc8181', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb7185'
        ]
      }]
    };
  }, [expenses, allCategories]);

  /**
   * Prepare data for line chart showing monthly spending trends
   * 
   * This function:
   * 1. Groups expenses by month
   * 2. Calculates total spending per month
   * 3. Sorts months chronologically
   * 4. Returns data in Chart.js format
   * 
   * @returns {Object} Chart.js data object for line chart
   */
  const getMonthlyData = useCallback(() => {
    const monthlyMap = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      if (!isNaN(date)) {
        const month = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        if (monthlyMap[month]) {
          monthlyMap[month] += expense.amount;
        } else {
          monthlyMap[month] = expense.amount;
        }
      }
    });
    const sortedMonths = Object.keys(monthlyMap).sort((a, b) => new Date(a) - new Date(b));
    return {
      labels: sortedMonths,
      datasets: [{
        label: 'Monthly Spending',
        data: sortedMonths.map(month => monthlyMap[month]),
        borderColor: '#4fd1c5',
        backgroundColor: 'rgba(79, 209, 197, 0.1)',
        tension: 0.4
      }]
    };
  }, [expenses]);

  // Generate chart data
  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${months[parseInt(month, 10) - 1]} ${day}, ${year}`;
  };

  return (
    <div className="dashboard-overview">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back!</h1>
          <p className="welcome-subtitle">Here's what's happening with your finances today.</p>
        </div>
        <div className="welcome-illustration">
          <div className="illustration-circle">
            <span>💰</span>
          </div>
        </div>
      </div>

      {/* Summary Cards - Key financial metrics */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <span>📊</span>
          </div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <p className="card-amount">${totalExpenses.toFixed(2)}</p>
            <p className="card-subtitle">All time</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <span>📅</span>
          </div>
          <div className="card-content">
            <h3>This Month</h3>
            <p className="card-amount">${thisMonthExpenses.toFixed(2)}</p>
            <p className="card-subtitle">Current month spending</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <span>📈</span>
          </div>
          <div className="card-content">
            <h3>Average</h3>
            <p className="card-amount">${averageExpense.toFixed(2)}</p>
            <p className="card-subtitle">Per transaction</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <span>🏆</span>
          </div>
          <div className="card-content">
            <h3>Top Category</h3>
            <p className="card-amount">{topCategoryName}</p>
            <p className="card-subtitle">Most spent category</p>
          </div>
        </div>
      </div>

      {/* Charts Section - Visual data representation */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-card">
            <h3>Spending by Category</h3>
            <div className="chart-wrapper">
              <PieChart data={categoryData} />
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-card">
            <h3>Monthly Trend</h3>
            <div className="chart-wrapper">
              <LineChart data={monthlyData} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity">
        <div className="activity-header">
          <h3>Recent Expenses</h3>
          <a href="/dashboard/expenses" className="btn btn-primary view-all-link">View All</a>
        </div>
        
        <div className="activity-list">
          {recentExpenses.length > 0 ? (
            // Display recent expenses with details
            recentExpenses.map((expense) => (
              <div key={expense.id} className="activity-item">
                <div className="activity-icon">
                  <span>💸</span>
                </div>
                <div className="activity-content">
                  <h4>{expense.title}</h4>
                  <p>{expense.category} • {formatDate(expense.date)}</p>
                </div>
                <div className="activity-amount">
                  <span>${expense.amount.toFixed(2)}</span>
                </div>
              </div>
            ))
          ) : (
            // Empty state when no expenses exist
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h4>No expenses yet</h4>
              <p>Start tracking your expenses to see them here</p>
              <a href="/dashboard/expenses" className="btn btn-primary">Add First Expense</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 