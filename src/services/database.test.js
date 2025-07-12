jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => 'MOCK_TIMESTAMP')
}));

// Mock the firebase db import
jest.mock('../firebase', () => ({
  db: {}
}));

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  onSnapshot,
  orderBy
} from 'firebase/firestore';

import {
  addExpense,
  getExpenses,
  deleteExpense,
  addCategory,
  getCategories,
  subscribeToExpenses,
  subscribeToCategories
} from './database';

describe('Database Service', () => {
  let originalConsoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore console.error after tests
    console.error = originalConsoleError;
  });

  describe('addExpense', () => {
    it('should throw error when adding expense fails', async () => {
      const error = new Error('Firebase error');
      addDoc.mockRejectedValue(error);
      collection.mockReturnValue('expenses-collection');
      const userId = 'user123';
      
      await expect(addExpense(userId, { amount: 100, title: 'Lunch', category: 'Food', date: '2024-01-15' })).rejects.toThrow();
    });
  });

  describe('getExpenses', () => {
    it('should throw error when getting expenses fails', async () => {
      const error = new Error('Firebase error');
      getDocs.mockRejectedValue(error);
      collection.mockReturnValue('expenses-collection');
      query.mockReturnValue('query-object');
      where.mockReturnValue('where-clause');
      
      await expect(getExpenses('user123')).rejects.toThrow('Firebase error');
    });
  });

  describe('deleteExpense', () => {
    it('should delete expense successfully', async () => {
      const expenseId = 'expense123';
      const userId = 'user123';
      
      doc.mockReturnValue('expense-doc');
      deleteDoc.mockResolvedValue();
      
      await deleteExpense(userId, expenseId);
      
      expect(doc).toHaveBeenCalledWith({}, 'users', userId, 'expenses', expenseId);
      expect(deleteDoc).toHaveBeenCalledWith('expense-doc');
    });

    it('should throw error when deleting expense fails', async () => {
      const error = new Error('Firebase error');
      deleteDoc.mockRejectedValue(error);
      doc.mockReturnValue('expense-doc');
      
      await expect(deleteExpense('user123', 'expense123')).rejects.toThrow('Firebase error');
    });
  });

  describe('addCategory', () => {
    it('should throw error when adding category fails', async () => {
      const error = new Error('Firebase error');
      addDoc.mockRejectedValue(error);
      collection.mockReturnValue('categories-collection');
      
      await expect(addCategory('user123', { name: 'Food' })).rejects.toThrow('Firebase error');
    });
  });

  describe('getCategories', () => {
    it('should throw error when getting categories fails', async () => {
      const error = new Error('Firebase error');
      getDocs.mockRejectedValue(error);
      collection.mockReturnValue('categories-collection');
      query.mockReturnValue('query-object');
      where.mockReturnValue('where-clause');
      
      await expect(getCategories('user123')).rejects.toThrow('Firebase error');
    });
  });

  describe('subscribeToExpenses', () => {
    it('should set up real-time subscription for expenses', () => {
      const userId = 'user123';
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      
      collection.mockReturnValue('expenses-collection');
      query.mockReturnValue('query-object');
      orderBy.mockReturnValue('order-by-createdAt');
      onSnapshot.mockReturnValue(mockUnsubscribe);
      
      const result = subscribeToExpenses(userId, mockCallback);
      
      expect(collection).toHaveBeenCalledWith({}, 'users', userId, 'expenses');
      expect(query).toHaveBeenCalledWith('expenses-collection', 'order-by-createdAt');
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(onSnapshot).toHaveBeenCalledWith('query-object', expect.any(Function), expect.any(Function));
      expect(result).toBe(mockUnsubscribe);
    });

    it('should call callback with expenses data when snapshot updates', () => {
      const userId = 'user123';
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      
      collection.mockReturnValue('expenses-collection');
      query.mockReturnValue('query-object');
      orderBy.mockReturnValue('order-by-createdAt');
      onSnapshot.mockImplementation((query, callback) => {
        // Simulate snapshot update
        const mockQuerySnapshot = {
          forEach: jest.fn((forEachCallback) => {
            forEachCallback({ id: 'expense1', data: () => ({ amount: 100, category: 'Food' }) });
          })
        };
        callback(mockQuerySnapshot);
        return mockUnsubscribe;
      });
      
      subscribeToExpenses(userId, mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith([
        { id: 'expense1', amount: 100, category: 'Food' }
      ]);
    });
  });

  describe('subscribeToCategories', () => {
    it('should set up real-time subscription for categories', () => {
      const userId = 'user123';
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      
      collection.mockReturnValue('categories-collection');
      query.mockReturnValue('query-object');
      orderBy.mockReturnValue('order-by-createdAt');
      onSnapshot.mockReturnValue(mockUnsubscribe);
      
      const result = subscribeToCategories(userId, mockCallback);
      
      expect(collection).toHaveBeenCalledWith({}, 'users', userId, 'categories');
      expect(query).toHaveBeenCalledWith('categories-collection', 'order-by-createdAt');
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(onSnapshot).toHaveBeenCalledWith('query-object', expect.any(Function), expect.any(Function));
      expect(result).toBe(mockUnsubscribe);
    });

    it('should call callback with categories data when snapshot updates', () => {
      const userId = 'user123';
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      
      collection.mockReturnValue('categories-collection');
      query.mockReturnValue('query-object');
      orderBy.mockReturnValue('order-by-createdAt');
      onSnapshot.mockImplementation((query, callback) => {
        // Simulate snapshot update
        const mockQuerySnapshot = {
          forEach: jest.fn((forEachCallback) => {
            forEachCallback({ id: 'category1', data: () => ({ name: 'Food', color: '#FF0000' }) });
          })
        };
        callback(mockQuerySnapshot);
        return mockUnsubscribe;
      });
      
      subscribeToCategories(userId, mockCallback);
      
      expect(mockCallback).toHaveBeenCalledWith([
        { id: 'category1', name: 'Food', color: '#FF0000' }
      ]);
    });
  });
}); 