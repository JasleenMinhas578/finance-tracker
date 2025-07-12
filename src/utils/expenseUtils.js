/**
 * Expense Utility Functions
 * 
 * This module contains utility functions for:
 * - Calculating expense statistics
 * - Formatting currency and dates
 * - Processing expense data
 * - Validating expense information
 * 
 * These functions are used throughout the application to ensure
 * consistent data handling and formatting.
 */

/**
 * Calculate total expenses from an array of expense objects
 * @param {Array} expenses - Array of expense objects with amount property
 * @returns {number} Total amount of all expenses
 */
export const getTotalExpenses = (expenses) => {
  if (!Array.isArray(expenses)) return 0;
  return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
};

/**
 * Calculate total expenses for a specific category
 * @param {Array} expenses - Array of expense objects
 * @param {string} category - Category name to filter by
 * @returns {number} Total amount for the category
 */
export const getTotalByCategory = (expenses, category) => {
  if (!Array.isArray(expenses)) return 0;
  return expenses
    .filter(expense => expense.category === category)
    .reduce((total, expense) => total + (expense.amount || 0), 0);
};

/**
 * Calculate total expenses for a specific month
 * @param {Array} expenses - Array of expense objects
 * @param {string} month - Month in YYYY-MM format
 * @returns {number} Total amount for the month
 */
export const getTotalByMonth = (expenses, month) => {
  if (!Array.isArray(expenses)) return 0;
  return expenses
    .filter(expense => expense.date && expense.date.startsWith(month))
    .reduce((total, expense) => total + (expense.amount || 0), 0);
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount || 0);
};

/**
 * Sort expenses by date (newest first)
 * @param {Array} expenses - Array of expense objects
 * @returns {Array} Sorted array of expenses
 */
export const sortExpensesByDate = (expenses) => {
  if (!Array.isArray(expenses)) return [];
  return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Get expenses for the last N days
 * @param {Array} expenses - Array of expense objects
 * @param {number} days - Number of days to look back
 * @returns {Array} Filtered array of expenses
 */
export const getExpensesForLastDays = (expenses, days) => {
  if (!Array.isArray(expenses)) return [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= cutoffDate;
  });
}; 

export function validateExpense(expense) {
  if (!expense.title || expense.title.trim() === '') {
    return { isValid: false, error: 'Title is required' };
  }
  if (typeof expense.amount !== 'number' || expense.amount <= 0) {
    return { isValid: false, error: 'Amount must be positive' };
  }
  return { isValid: true };
} 