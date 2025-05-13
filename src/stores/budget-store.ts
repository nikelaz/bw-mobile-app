import { create } from 'zustand';
import { useEffect } from 'react';
import { Budget, findClosestBudgetDate, parseBudget } from '@nikelaz/bw-shared-libraries';
import { api } from '@/config';

interface BudgetState {
  budgets: Budget[];
  currentBudget: Budget | null;
  isLoading: boolean;
  
  // Actions
  setBudgets: (budgets: Budget[]) => void;
  setCurrentBudget: (budget: Budget | null) => void;
  refresh: (token: string) => Promise<Budget[]>;
  create: (budget: Budget, copyFrom: Budget, token: string) => Promise<void>;
  budgetExistsForMonth: (monthIndex: number) => boolean;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  currentBudget: null,
  isLoading: false,
  
  setBudgets: (budgets) => set({ budgets }),
  
  setCurrentBudget: (budget) => set({ currentBudget: budget }),
  
  budgetExistsForMonth: (monthIndex) => {
    const { budgets } = get();
    return budgets.some(budget => {
      const tmpDate = new Date(budget.month);
      return tmpDate.getMonth() === monthIndex;
    });
  },
  
  refresh: async (token) => {
    if (!token) return [];
    
    set({ isLoading: true });
    
    try {
      // Fetch budgets from API
      const reqOptions = {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
    
      const req = await fetch(`${api}/budgets`, reqOptions);
      
      if (!req.ok) {
        const errorData = await req.json().catch(() => ({}));
        throw new Error(errorData.message || `Error fetching budgets: ${req.status}`);
      }
      
      const jsonResponse = await req.json();
      const fetchedBudgets = jsonResponse.budgets || [];
      const parsedBudgets = parseBudget(fetchedBudgets);
      
      set({ budgets: parsedBudgets });
      
      const { currentBudget } = get();
      const updatedCurrentBudget = parsedBudgets.find(budget => 
        budget.id === currentBudget?.id
      );
      
      if (updatedCurrentBudget) {
        set({ currentBudget: updatedCurrentBudget });
      }
      else if (currentBudget === null || !updatedCurrentBudget) {
        const initiallySelectedBudget = findClosestBudgetDate(new Date(), parsedBudgets);
        set({ currentBudget: initiallySelectedBudget });
      }
      
      return parsedBudgets;
    } catch (error) {
      console.error('Error refreshing budgets:', error);
      throw new Error('An unexpected error occurred while refreshing budgets');
    } finally {
      set({ isLoading: false });
    }
  },
  
  create: async (budget, copyFrom, token) => {
    if (!token) return;
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ budget, copyFrom })
      };
    
      const req = await fetch(`${api}/budgets`, reqOptions);
      const jsonResponse = await req.json();
    
      if (!req.ok) {
        throw new Error(jsonResponse.message || `Error creating budget: ${req.status}`);
      }
    
      const newBudgets = await get().refresh(token);
      const newBudget = newBudgets.find(budget => budget.id === jsonResponse.budget.id);
      
      if (newBudget) {
        set({ currentBudget: newBudget });
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      throw new Error('An unexpected error occurred while creating the budget'); 
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Hook to initialize the store with a token
export const useBudgetStoreInit = (token: string) => {
  // Refresh the store when token changes
  const { refresh } = useBudgetStore();
  
  useEffect(() => {
    if (token) {
      refresh(token);
    }
  }, [token, refresh]);
  
  return useBudgetStore();
};
