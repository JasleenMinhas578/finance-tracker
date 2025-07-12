import {
  getTotalExpenses,
  getTotalByCategory,
  getTotalByMonth,
  formatCurrency,
  sortExpensesByDate,
  getExpensesForLastDays,
  validateExpense
} from './expenseUtils';

describe('expenseUtils', () => {
  const mockExpenses = [
    { id: 1, amount: 100, category: 'Food', date: '2024-01-15' },
    { id: 2, amount: 50, category: 'Transport', date: '2024-01-20' },
    { id: 3, amount: 200, category: 'Food', date: '2024-02-01' },
    { id: 4, amount: 75, category: 'Entertainment', date: '2024-02-10' },
    { id: 5, amount: 0, category: 'Food', date: '2024-01-25' },
    { id: 6, amount: null, category: 'Transport', date: '2024-02-05' }
  ];

  describe('getTotalExpenses', () => {
    it('should calculate total expenses correctly', () => {
      const result = getTotalExpenses(mockExpenses);
      expect(result).toBe(425); // 100 + 50 + 200 + 75 + 0 + 0
    });

    it('should return 0 for empty array', () => {
      const result = getTotalExpenses([]);
      expect(result).toBe(0);
    });

    it('should return 0 for null input', () => {
      const result = getTotalExpenses(null);
      expect(result).toBe(0);
    });

    it('should return 0 for undefined input', () => {
      const result = getTotalExpenses(undefined);
      expect(result).toBe(0);
    });

    it('should handle expenses with missing amount property', () => {
      const expensesWithMissingAmount = [
        { id: 1, category: 'Food' },
        { id: 2, amount: 100, category: 'Transport' }
      ];
      const result = getTotalExpenses(expensesWithMissingAmount);
      expect(result).toBe(100);
    });
  });

  describe('getTotalByCategory', () => {
    it('should calculate total for specific category', () => {
      const result = getTotalByCategory(mockExpenses, 'Food');
      expect(result).toBe(300); // 100 + 200 + 0
    });

    it('should return 0 for non-existent category', () => {
      const result = getTotalByCategory(mockExpenses, 'NonExistent');
      expect(result).toBe(0);
    });

    it('should return 0 for empty array', () => {
      const result = getTotalByCategory([], 'Food');
      expect(result).toBe(0);
    });

    it('should return 0 for null input', () => {
      const result = getTotalByCategory(null, 'Food');
      expect(result).toBe(0);
    });
  });

  describe('getTotalByMonth', () => {
    it('should calculate total for specific month', () => {
      const result = getTotalByMonth(mockExpenses, '2024-01');
      expect(result).toBe(150); // 100 + 50 + 0
    });

    it('should return 0 for non-existent month', () => {
      const result = getTotalByMonth(mockExpenses, '2024-03');
      expect(result).toBe(0);
    });

    it('should return 0 for empty array', () => {
      const result = getTotalByMonth([], '2024-01');
      expect(result).toBe(0);
    });

    it('should return 0 for null input', () => {
      const result = getTotalByMonth(null, '2024-01');
      expect(result).toBe(0);
    });

    it('should handle expenses with missing date property', () => {
      const expensesWithMissingDate = [
        { id: 1, amount: 100, category: 'Food' },
        { id: 2, amount: 200, category: 'Transport', date: '2024-01-15' }
      ];
      const result = getTotalByMonth(expensesWithMissingDate, '2024-01');
      expect(result).toBe(200);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('$1,234.56');
    });

    it('should format EUR currency correctly', () => {
      const result = formatCurrency(1234.56, 'EUR');
      expect(result).toBe('€1,234.56');
    });

    it('should handle zero amount', () => {
      const result = formatCurrency(0);
      expect(result).toBe('$0.00');
    });

    it('should handle null amount', () => {
      const result = formatCurrency(null);
      expect(result).toBe('$0.00');
    });

    it('should handle undefined amount', () => {
      const result = formatCurrency(undefined);
      expect(result).toBe('$0.00');
    });

    it('should handle negative amounts', () => {
      const result = formatCurrency(-123.45);
      expect(result).toBe('-$123.45');
    });
  });

  describe('sortExpensesByDate', () => {
    it('should sort expenses by date (newest first)', () => {
      const result = sortExpensesByDate(mockExpenses);
      expect(result[0].date).toBe('2024-02-10');
      expect(result[1].date).toBe('2024-02-05');
      expect(result[2].date).toBe('2024-02-01');
      expect(result[3].date).toBe('2024-01-25');
      expect(result[4].date).toBe('2024-01-20');
      expect(result[5].date).toBe('2024-01-15');
    });

    it('should return empty array for null input', () => {
      const result = sortExpensesByDate(null);
      expect(result).toEqual([]);
    });

    it('should return empty array for undefined input', () => {
      const result = sortExpensesByDate(undefined);
      expect(result).toEqual([]);
    });

    it('should not mutate original array', () => {
      const originalExpenses = [...mockExpenses];
      sortExpensesByDate(mockExpenses);
      expect(mockExpenses).toEqual(originalExpenses);
    });
  });

  describe('getExpensesForLastDays', () => {
    beforeEach(() => {
      // Mock current date to ensure consistent tests
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-02-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return expenses from last 7 days', () => {
      const recentExpenses = [
        { id: 1, amount: 100, date: '2024-02-10' }, // 5 days ago
        { id: 2, amount: 50, date: '2024-02-08' },  // 7 days ago
        { id: 3, amount: 200, date: '2024-02-05' }, // 10 days ago
        { id: 4, amount: 75, date: '2024-02-12' }   // 3 days ago
      ];
      
      const result = getExpensesForLastDays(recentExpenses, 7);
      expect(result).toHaveLength(3);
      expect(result.map(e => e.id)).toEqual([1, 2, 4]);
    });

    it('should return empty array for null input', () => {
      const result = getExpensesForLastDays(null, 7);
      expect(result).toEqual([]);
    });

    it('should return empty array for undefined input', () => {
      const result = getExpensesForLastDays(undefined, 7);
      expect(result).toEqual([]);
    });

    it('should handle expenses with invalid dates', () => {
      const expensesWithInvalidDates = [
        { id: 1, amount: 100, date: 'invalid-date' },
        { id: 2, amount: 50, date: '2024-02-10' }
      ];
      
      const result = getExpensesForLastDays(expensesWithInvalidDates, 7);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });
  });

  describe('validateExpense (from form submission)', () => {
    it('should accept a valid expense object', () => {
      const result = validateExpense({ title: 'Groceries', amount: 50 });
      expect(result.isValid).toBe(true);
    });

    it('should reject an expense with missing title', () => {
      const result = validateExpense({ title: '', amount: 50 });
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/title/i);
    });

    it('should reject an expense with invalid amount', () => {
      const result = validateExpense({ title: 'Groceries', amount: 0 });
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/amount/i);
    });
  });
}); 