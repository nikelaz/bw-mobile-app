import { create } from 'zustand';
import { useEffect } from 'react';
import { Transaction, calculateTotalPages } from '@nikelaz/bw-shared-libraries';
import { api } from '@/config';
import { useBudgetStore } from './budget-store'; // Update with correct path

// Helper function moved outside the store
const calculatePerPageBasedOnHeight = (height: number) => {
  let coefficient = height < 1000 ? 300 : 100;
  return Math.max(3, Math.ceil((height - coefficient) / 100));
};

interface TransactionsState {
  transactions: Transaction[];
  page: number;
  totalPages: number;
  filter: string;
  category: string;
  perPage: number;
  isLoading: boolean;
  
  // Actions
  setPage: (page: number) => void;
  setFilter: (filter: string) => void;
  setCategory: (category: string) => void;
  nextPage: () => void;
  prevPage: () => void;
  fetchTransactions: (
    limit: number, 
    offset: number, 
    filter?: string,
    token?: string
  ) => Promise<{ transactions: Transaction[], count: string }>;
  refresh: (token: string) => Promise<void>;
  create: (transaction: Transaction, token: string) => Promise<void>;
  update: (transaction: Partial<Transaction>, token: string) => Promise<void>;
  delete: (id: number, token: string) => Promise<void>;
  setPerPage: (height: number) => void;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  page: 0,
  totalPages: 1,
  filter: '',
  category: '',
  perPage: 5, // Default value, will be recalculated based on height
  isLoading: false,
  
  setPage: (page) => set({ page }),
  
  setFilter: (filter) => {
    // Reset to first page when filter changes
    set({ filter, page: 0 });
  },
  
  setCategory: (category) => set({ category }),
  
  nextPage: () => {
    const { page, totalPages } = get();
    if (page < totalPages - 1) {
      set({ page: page + 1 });
    }
  },
  
  prevPage: () => {
    const { page } = get();
    if (page > 0) {
      set({ page: page - 1 });
    }
  },
  
  setPerPage: (height) => {
    const perPage = calculatePerPageBasedOnHeight(height);
    set({ perPage });
  },
  
  fetchTransactions: async (limit, offset, filter = '', token) => {
    if (!token) return { transactions: [], count: '0' };
    
    const budgetStore = useBudgetStore.getState();
    const budgetId = budgetStore.currentBudget?.id;
    
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
  
  refresh: async (token) => {
    if (!token) return;
    
    set({ isLoading: true });
    
    try {
      const { perPage, page, filter } = get();
      const response = await get().fetchTransactions(perPage, page * perPage, filter, token);
      
      set({
        transactions: response.transactions,
        totalPages: calculateTotalPages(parseFloat(response.count), perPage)
      });
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  create: async (transaction, token) => {
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
      const budgetStore = useBudgetStore.getState();
      await budgetStore.refresh(token);
      await get().refresh(token);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again later.');
    } finally {
      set({ isLoading: false });
    }
  },
  
  delete: async (id, token) => {
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
      const budgetStore = useBudgetStore.getState();
      await budgetStore.refresh(token);
      await get().refresh(token);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again later.');
    } finally {
      set({ isLoading: false });
    }
  },
  
  update: async (transaction, token) => {
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
      const budgetStore = useBudgetStore.getState();
      await budgetStore.refresh(token);
      await get().refresh(token);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again later.');
    } finally {
      set({ isLoading: false });
    }
  },
}));

// A hook to automatically handle refreshing when dependencies change
export const useTransactionsStoreInit = (token: string, height: number) => {
  const currentBudget = useBudgetStore(state => state.currentBudget);
  const { 
    page, 
    filter, 
    refresh, 
    setPerPage 
  } = useTransactionsStore();
  
  // Set the perPage value based on height
  useEffect(() => {
    setPerPage(height);
  }, [height, setPerPage]);
  
  // Refresh when these dependencies change
  useEffect(() => {
    if (token && currentBudget) {
      refresh(token);
    }
  }, [token, currentBudget, page, filter, refresh]);
  
  return useTransactionsStore();
};
