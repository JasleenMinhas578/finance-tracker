import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getExpenses } from '../../services/database';
import { 
  calculateTotalExpenses, 
  calculateCategoryBreakdown, 
  calculateMonthlyTrend,
  getTopSpendingCategory 
} from '../../utils/expenseUtils';
import PieChart from '../Charts/PieChart';
import LineChart from '../Charts/LineChart';
import { motion } from 'framer-motion';
import '../../styles/main.css';

/**
 * Reports Component
 * 
 * This component provides comprehensive financial reports and analytics with:
 * - Total expense calculations and summaries
 * - Category breakdown with pie chart visualization
 * - Monthly spending trends with line chart
 * - Top spending category identification
 * - Date range filtering for reports
 * - Loading states and error handling
 * - Responsive design with animations
 * 
 * Features:
 * - Real-time data aggregation from Firebase
 * - Multiple chart visualizations
 * - Date range filtering
 * - Category-based analysis
 * - Monthly trend analysis
 * - Top spending insights
 * - Export-ready data formatting
 * - Responsive chart layouts
 */
export default function Reports() {
  // State management for reports and UI
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('all'); // all, month, year
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  
  // Get current user from authentication context
  const { currentUser } = useAuth();

  /**
   * Fetch expenses from Firebase database
   * 
   * This function:
   * 1. Sets loading state
   * 2. Fetches all expenses for current user
   * 3. Updates state with fetched data
   * 4. Handles errors appropriately
   * 5. Resets loading state
   */
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all expenses for current user from Firebase
      const userExpenses = await getExpenses(currentUser.uid);
      setExpenses(userExpenses);
    } catch (error) {
      setError('Failed to load expenses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter expenses based on selected date range
   * 
   * This function:
   * 1. Gets current date for comparison
   * 2. Filters expenses based on date range selection
   * 3. Updates filtered expenses state
   * 
   * Date ranges:
   * - 'all': All expenses
   * - 'month': Current month only
   * - 'year': Current year only
   */
  const filterExpensesByDateRange = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let filtered = [...expenses];
    
    switch (dateRange) {
      case 'month':
        // Filter to current month only
        filtered = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === currentMonth && 
                 expenseDate.getFullYear() === currentYear;
        });
        break;
      case 'year':
        // Filter to current year only
        filtered = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === currentYear;
        });
        break;
      case 'all':
      default:
        // No filtering - use all expenses
        filtered = [...expenses];
        break;
    }
    
    setFilteredExpenses(filtered);
  };

  /**
   * Fetch expenses when component mounts
   * 
   * This effect runs:
   * - On component mount
   * - When currentUser changes
   */
  useEffect(() => {
    if (currentUser) {
      fetchExpenses();
    }
  }, [currentUser]);

  /**
   * Filter expenses when date range or expenses change
   * 
   * This effect runs:
   * - When dateRange changes
   * - When expenses array changes
   */
  useEffect(() => {
    filterExpensesByDateRange();
  }, [dateRange, expenses]);

  /**
   * Calculate total expenses for the filtered period
   * 
   * @returns {number} Total amount of expenses
   */
  const totalExpenses = calculateTotalExpenses(filteredExpenses);

  /**
   * Calculate category breakdown for pie chart
   * 
   * @returns {Array} Array of category objects with name, amount, and percentage
   */
  const categoryBreakdown = calculateCategoryBreakdown(filteredExpenses);

  /**
   * Calculate monthly trend data for line chart
   * 
   * @returns {Array} Array of monthly data objects with month and total
   */
  const monthlyTrend = calculateMonthlyTrend(filteredExpenses);

  /**
   * Get the top spending category
   * 
   * @returns {Object} Category object with name and amount
   */
  const topCategory = getTopSpendingCategory(filteredExpenses);

  /**
   * Format currency for display
   * 
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  /**
   * Get date range label for display
   * 
   * @returns {string} Human-readable date range label
   */
  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      case 'all':
      default:
        return 'All Time';
    }
  };

  return (
    <div className="reports-container">
      {/* Header with title and date range filter */}
      <div className="reports-header">
        <h2>Financial Reports</h2>
        
        {/* Date range selector */}
        <div className="date-range-selector">
          <label>Time Period:</label>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Error message display */}
      {error && <div className="error-alert">{error}</div>}

      {/* Loading state */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      )}

      {/* Reports content */}
      {!loading && (
        <div className="reports-content">
          {/* Summary cards */}
          <div className="summary-cards">
            <motion.div 
              className="summary-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Total Expenses</h3>
              <p className="amount">{formatCurrency(totalExpenses)}</p>
              <small>{getDateRangeLabel()}</small>
            </motion.div>

            <motion.div 
              className="summary-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3>Top Category</h3>
              <p className="category">{topCategory?.name || 'No data'}</p>
              <small>{formatCurrency(topCategory?.amount || 0)}</small>
            </motion.div>

            <motion.div 
              className="summary-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>Total Transactions</h3>
              <p className="count">{filteredExpenses.length}</p>
              <small>{getDateRangeLabel()}</small>
            </motion.div>
          </div>

          {/* Charts section */}
          <div className="charts-section">
            {/* Category breakdown pie chart */}
            <motion.div 
              className="chart-container"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3>Spending by Category</h3>
              {categoryBreakdown.length > 0 ? (
                <PieChart data={categoryBreakdown} />
              ) : (
                <div className="no-data">No data available for the selected period</div>
              )}
            </motion.div>

            {/* Monthly trend line chart */}
            <motion.div 
              className="chart-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3>Monthly Spending Trend</h3>
              {monthlyTrend.length > 0 ? (
                <LineChart data={monthlyTrend} />
              ) : (
                <div className="no-data">No data available for the selected period</div>
              )}
            </motion.div>
          </div>

          {/* Category breakdown table */}
          <motion.div 
            className="category-breakdown"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3>Category Breakdown</h3>
            {categoryBreakdown.length > 0 ? (
              <div className="category-table">
                <div className="table-header">
                  <span>Category</span>
                  <span>Amount</span>
                  <span>Percentage</span>
                </div>
                {categoryBreakdown.map((category, index) => (
                  <div key={index} className="table-row">
                    <span className="category-name">{category.name}</span>
                    <span className="category-amount">
                      {formatCurrency(category.amount)}
                    </span>
                    <span className="category-percentage">
                      {category.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No expenses found for the selected period</div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
} 