import type { Store } from './store';

import { StateCreator } from 'zustand';
import { Budget, findClosestBudgetDate } from '@nikelaz/bw-shared-libraries';
import { api } from '@/config';

type BudgetWithDate = Omit<Budget, 'month'> & { month: Date };

export type BudgetState = {
  budgets: BudgetWithDate[];
  currentBudget: BudgetWithDate | null;
};

export type BudgetActions = {
  setCurrentBudget: (budget: Budget | null) => void;
  refreshBudgets: () => Promise<BudgetWithDate[]>;
  createBudget: (budget: Omit<Budget, 'id'>, copyFrom: Pick<Budget, 'id'>) => Promise<void>;
  budgetExistsForMonth: (monthIndex: number) => boolean;
}

export const createBudgetSlice: StateCreator<
  Store,
  [],
  [],
  BudgetState & BudgetActions
> = (set, get) => ({
  budgets: [],
  currentBudget: null,
   
  setCurrentBudget: (budget) => {
    const {
      refreshCategoryBudgets,
      refreshTransactions,
    } = get();

    let budgetCopy: BudgetWithDate | null = null;

    if (budget !== null && typeof budget.month === 'string') {
      budgetCopy = { ...budget, month: new Date(budget.month) }; 
    }

    set({ currentBudget: budgetCopy });
    refreshCategoryBudgets();
    refreshTransactions();
  },
  
  budgetExistsForMonth: (monthIndex: number) => {
    const { budgets } = get();
    return budgets.some((budget: Budget) => {
      const tmpDate = new Date(budget.month);
      return tmpDate.getMonth() === monthIndex;
    });
  },
  
  refreshBudgets: async () => {
    const {
      token,
      currentBudget,
      setCurrentBudget,
    } = get();
    
    if (!token) return [];
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
    
      const req = await fetch(`${api}/budgets`, reqOptions);
      
      const jsonResponse = await req.json();

      if (!req.ok) {
        throw new Error(jsonResponse.message || `Error fetching budgets: ${req.status}`);
      }
     
      const fetchedBudgets: Budget[] = jsonResponse.budgets || [];
      
      const budgetsWithDate: BudgetWithDate[] = fetchedBudgets.map(budget => ({
        ...budget,
        month: new Date(budget.month),
      }));

      set({ budgets: budgetsWithDate });
      
      const updatedCurrentBudget = fetchedBudgets.find(budget => 
        budget.id === currentBudget?.id
      );
      
      if (updatedCurrentBudget) {
        setCurrentBudget(updatedCurrentBudget);
      }
      else if (currentBudget === null || !updatedCurrentBudget) {
        const initiallySelectedBudget = findClosestBudgetDate(new Date(), fetchedBudgets);
        setCurrentBudget(initiallySelectedBudget);
      }
      
      return budgetsWithDate;
    } catch (error) {
      console.error('Error refreshing budgets:', error);
      throw new Error('An unexpected error occurred while refreshing budgets');
    } finally {
      set({ isLoading: false });
    }
  },
  
  createBudget: async (budget, copyFrom) => {
    const {
      token,
      refreshBudgets,
      setCurrentBudget,
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
        body: JSON.stringify({ budget, copyFrom })
      };
    
      const req = await fetch(`${api}/budgets`, reqOptions);
      const jsonResponse = await req.json();
    
      if (!req.ok) {
        throw new Error(jsonResponse.message || `Error creating budget: ${req.status}`);
      }
    
      const newBudgets = await refreshBudgets();
      const newBudget = newBudgets.find((budget: Budget) => budget.id === jsonResponse.budget.id);
      
      if (newBudget) {
        setCurrentBudget(newBudget);
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      throw new Error('An unexpected error occurred while creating the budget'); 
    } finally {
      set({ isLoading: false });
    }
  },
});

