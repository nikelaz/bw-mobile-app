import type { StateCreator } from 'zustand';
import type { Store } from './store';

import { Transaction, calculateTotalPages } from '@nikelaz/bw-shared-libraries';
import { api } from '@/config';

type PartialTransactionWithId = Pick<Transaction, 'id'> & Partial<Omit<Transaction, 'id'>>;

type CreateTransactionObj = 
  Omit<Transaction, 'categoryBudget' | 'id'>
  & { categoryBudget: { id: number } };

export type TransactionsState = {
  transactions: Transaction[];
  transactionsPage: number;
  transactionsTotalPages: number;
  transactionsFilter: string;
  transactionsCategory: string;
  transactionsPerPage: number;
};

export type TransactionsActions = {
  setTransactionsPage: (page: number) => Promise<void>;
  setTransactionsFilter: (filter: string) => Promise<void>;
  setTransactionsCategory: (category: string) => void;
  nextTransactionsPage: () => Promise<void>;
  prevTransactionsPage: () => Promise<void>;
  fetchTransactions: (
    limit: number, 
    offset: number, 
    filter?: string,
  ) => Promise<{ transactions: Transaction[], count: string }>;
  refreshTransactions: () => Promise<void>;
  createTransaction: (transaction: CreateTransactionObj) => Promise<void>;
  updateTransaction: (transaction: PartialTransactionWithId) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
};

export const createTransactionsSlice: StateCreator<
  Store,
  [],
  [],
  TransactionsState & TransactionsActions
> = (set, get) => ({
  transactions: [],
  transactionsPage: 0,
  transactionsTotalPages: 1,
  transactionsFilter: '',
  transactionsCategory: '',
  transactionsPerPage: 20,
  
  setTransactionsPage: async (page) => {
    const { refreshTransactions } = get();
    set({ transactionsPage: page });
    await refreshTransactions();
  },
  
  setTransactionsFilter: async (filter) => {
    const { refreshTransactions } = get();
    set({
      transactionsFilter: filter,
      transactionsPage: 0,
    });
    await refreshTransactions();
  },
  
  setTransactionsCategory: (category) => set({ transactionsCategory: category }),
  
  nextTransactionsPage: async () => {
    const {
      transactionsPage,
      transactionsTotalPages,
      refreshTransactions,
    } = get();

    if (transactionsPage < transactionsTotalPages - 1) {
      set({ transactionsPage: transactionsPage + 1 });
    }

    await refreshTransactions();
  },
  
  prevTransactionsPage: async () => {
    const {
      transactionsPage,
      refreshTransactions,
    } = get();

    if (transactionsPage > 0) {
      set({ transactionsPage: transactionsPage - 1 });
    }

    await refreshTransactions();
  },
  
  fetchTransactions: async (limit, offset, filter = '') => {
    const {
      token,
      currentBudget,
    } = get();

    if (!token) return { transactions: [], count: '0' };
    
    const budgetId = currentBudget?.id;
    
    if (!budgetId) return { transactions: [], count: '0' };
    
    try {
      const reqOptions = {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
    
      const req = await fetch(
        `${api}/transactions/${budgetId}?limit=${limit}&offset=${offset}&filter=${filter}`, 
        reqOptions
      );
    
      if (!req.ok) {
        const errorData = await req.json().catch(() => ({}));
        throw new Error(errorData.message || `Error fetching transactions: ${req.status}`);
      }
    
      const jsonResponse = await req.json();
      return {
        transactions: jsonResponse.transactions || [],
        count: jsonResponse.count || '0'
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return { transactions: [], count: '0' };
    }
  },
  
  refreshTransactions: async () => {
    const {
      fetchTransactions,
      transactionsPerPage,
      transactionsPage,
      transactionsFilter,
    } = get();
 
    set({ isLoading: true });
    
    try {
      const response = await fetchTransactions(transactionsPerPage, transactionsPage * transactionsPerPage, transactionsFilter);
      
      set({
        transactions: response.transactions,
        transactionsTotalPages: calculateTotalPages(parseFloat(response.count), transactionsPerPage)
      });
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  createTransaction: async (transaction) => {
    const {
      token,
      refreshBudgets,
      refreshTransactions,
    } = get();

    if (!token) return;
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transaction })
      };
    
      const req = await fetch(`${api}/transactions`, reqOptions);
      const jsonResponse = await req.json();
    
      if (!req.ok) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }
    
      // Refresh budget store first, then transactions
      await refreshBudgets();
      await refreshTransactions();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again later.');
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteTransaction: async (id) => {
    const {
      token,
      refreshBudgets,
      refreshTransactions,
    } = get();

    if (!token) return;
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
    
      const req = await fetch(`${api}/transactions/${id}`, reqOptions);
      const jsonResponse = await req.json();
    
      if (!req.ok) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }
    
      // Refresh budget store first, then transactions
      await refreshBudgets();
      await refreshTransactions();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again later.');
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateTransaction: async (transaction) => {
    const {
      token,
      refreshBudgets,
      refreshTransactions,
    } = get();

    if (!token) return;
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transaction })
      };
    
      const req = await fetch(`${api}/transactions`, reqOptions);
      const jsonResponse = await req.json();
    
      if (!req.ok) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }
    
      // Refresh budget store first, then transactions
      await refreshBudgets();
      await refreshTransactions();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again later.');
    } finally {
      set({ isLoading: false });
    }
  },
});

