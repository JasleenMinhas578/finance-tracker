import { validateExpense } from '../utils/expenseUtils';
// tests/unit/expenseValidation.test.js
describe('validateExpense', () => {
    it('should reject empty title', () => {
      const result = validateExpense({ title: '', amount: 10 });
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/title/i);
    });
  
    it('should accept valid expense', () => {
      const result = validateExpense({ title: 'Coffee', amount: 5 });
      expect(result.isValid).toBe(true);
    });
  });
  