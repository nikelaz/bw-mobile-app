import { StateCreator } from 'zustand';
import { useEffect } from 'react';
import { CategoryBudget, CategoryType } from '@nikelaz/bw-shared-libraries';
import { api } from '@/config';

export type CategoryBudgetsByType = {
  [CategoryType.INCOME]: CategoryBudget[];
  [CategoryType.EXPENSE]: CategoryBudget[];
  [CategoryType.SAVINGS]: CategoryBudget[];
  [CategoryType.DEBT]: CategoryBudget[];
};

export type CategoryBudgetState = {
  categoryBudgets: CategoryBudget[];
  categoryBudgetsByType: CategoryBudgetsByType;
  isLoading: boolean; 
};

export type CategoryBudgetActions = {
  update: (categoryBudget: CategoryBudget, token: string) => Promise<void>;
  create: (categoryBudget: CategoryBudget, token: string) => Promise<void>;
  delete: (categoryBudget: CategoryBudget, token: string) => Promise<void>;
  getCategoryBudgetsByType: () => CategoryBudgetsByType;
};

export const createCategoryBudgetSlice: StateCreator<CategoryBudgetState & CategoryBudgetActions> = (set, get) => ({
  categoryBudgets: [],
  categoryBudgetsByType: {
    [CategoryType.INCOME]: [],
    [CategoryType.EXPENSE]: [],
    [CategoryType.SAVINGS]: [],
    [CategoryType.DEBT]: [],
  },
  isLoading: false,
  
  getCategoryBudgetsByType: () => {
    const { categoryBudgets } = get();
    
    const categoryBudgetsByType: CategoryBudgetsByType = {
      [CategoryType.INCOME]: [],
      [CategoryType.EXPENSE]: [],
      [CategoryType.SAVINGS]: [],
      [CategoryType.DEBT]: [],
    };

    categoryBudgets.forEach((categoryBudget: CategoryBudget) => {
      if (!categoryBudget.category || categoryBudget.category.type === undefined) return;
      categoryBudgetsByType[categoryBudget.category.type].push(categoryBudget);
    });
    
    return categoryBudgetsByType;
  },
 
  // Todo: token does not need to be passed
  update: async (categoryBudget, token) => {
    if (!token) return;
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryBudget })
      };

      const req = await fetch(`${api}/category-budgets`, reqOptions);
      const jsonResponse = await req.json();

      if (req.status !== 200) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }

      // Refresh related stores
      const budgetStore = useBudgetStore.getState();
      await budgetStore.refresh(token);
      
      // Update our local state based on updated budget store data
      const updatedCategoryBudgets = useBudgetStore.getState().currentBudget?.categoryBudgets || [];
      set({ 
        categoryBudgets: updatedCategoryBudgets,
        categoryBudgetsByType: get().getCategoryBudgetsByType()
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  delete: async (categoryBudget, token) => {
    if (!token) return;
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const req = await fetch(`${api}/category-budgets/${categoryBudget.id}`, reqOptions);
      const jsonResponse = await req.json();

      if (req.status !== 200) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }

      // Refresh related stores
      const budgetStore = useBudgetStore.getState();
      await budgetStore.refresh(token);
      
      // Update our local state based on updated budget store data
      const updatedCategoryBudgets = useBudgetStore.getState().currentBudget?.categoryBudgets || [];
      set({ 
        categoryBudgets: updatedCategoryBudgets,
        categoryBudgetsByType: get().getCategoryBudgetsByType()
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  create: async (categoryBudget, token) => {
    if (!token) return;
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryBudget })
      };

      const req = await fetch(`${api}/category-budgets`, reqOptions);
      const jsonResponse = await req.json();

      if (req.status !== 200) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }

      // Refresh related stores
      const budgetStore = useBudgetStore.getState();
      await budgetStore.refresh(token);
      
      // Update our local state based on updated budget store data
      const updatedCategoryBudgets = useBudgetStore.getState().currentBudget?.categoryBudgets || [];
      set({ 
        categoryBudgets: updatedCategoryBudgets,
        categoryBudgetsByType: get().getCategoryBudgetsByType()
      });
    } finally {
      set({ isLoading: false });
    }
  },
});

// Hook to init/sync categoryBudgets with the current budget
// Todo: rework this so that useEffect is not needed at all
/*
export const useCategoryBudgetStoreInit = () => {
  const currentBudget = useBudgetStore(state => state.currentBudget);
  
  useEffect(() => {
    if (currentBudget) {
      const categoryBudgets = currentBudget.categoryBudgets || [];
      
      useCategoryBudgetStore.setState({
        categoryBudgets,
        categoryBudgetsByType: useCategoryBudgetStore.getState().getCategoryBudgetsByType()
      });
    }
  }, [currentBudget]);
  
  return useCategoryBudgetStore();
};
*/
