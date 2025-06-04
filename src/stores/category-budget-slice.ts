import type { Store } from './store';

import { StateCreator } from 'zustand';
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
};

type PartialCategoryBudgetWithId = Partial<Omit<CategoryBudget, 'id'>> & Pick<CategoryBudget, 'id'>;

export type CategoryBudgetActions = {
  updateCategoryBudget: (categoryBudget: PartialCategoryBudgetWithId) => Promise<void>;
  createCategoryBudget: (categoryBudget: Partial<CategoryBudget>) => Promise<void>;
  deleteCategoryBudget: (categoryBudget: PartialCategoryBudgetWithId) => Promise<void>;
  getCategoryBudgetsByType: () => CategoryBudgetsByType;
  refreshCategoryBudgets: () => void;
};

export const createCategoryBudgetSlice: StateCreator<
  Store,
  [],
  [],
  CategoryBudgetState & CategoryBudgetActions
> = (set, get) => ({
  categoryBudgets: [],
  categoryBudgetsByType: {
    [CategoryType.INCOME]: [],
    [CategoryType.EXPENSE]: [],
    [CategoryType.SAVINGS]: [],
    [CategoryType.DEBT]: [],
  },
  
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
 
  updateCategoryBudget: async (categoryBudget) => {
    const {
      token,
      refreshBudgets,
      currentBudget,
      getCategoryBudgetsByType,
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
        body: JSON.stringify({ categoryBudget })
      };

      const req = await fetch(`${api}/category-budgets`, reqOptions);
      const jsonResponse = await req.json();

      if (req.status !== 200) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }

      // Refresh related stores
      await refreshBudgets();
      
      // Update our local state based on updated budget store data
      const updatedCategoryBudgets = currentBudget?.categoryBudgets || [];
      set({ 
        categoryBudgets: updatedCategoryBudgets,
        categoryBudgetsByType: getCategoryBudgetsByType()
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteCategoryBudget: async (categoryBudget) => {
    const {
      token,
      refreshBudgets,
      currentBudget,
      getCategoryBudgetsByType,
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

      const req = await fetch(`${api}/category-budgets/${categoryBudget.id}`, reqOptions);
      const jsonResponse = await req.json();

      if (req.status !== 200) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }

      // Refresh related stores
      await refreshBudgets();
      
      // Update our local state based on updated budget store data
      const updatedCategoryBudgets = currentBudget?.categoryBudgets || [];
      set({ 
        categoryBudgets: updatedCategoryBudgets,
        categoryBudgetsByType: getCategoryBudgetsByType()
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createCategoryBudget: async (categoryBudget) => {
    const {
      token,
      refreshBudgets,
      currentBudget,
      getCategoryBudgetsByType,
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
        body: JSON.stringify({ categoryBudget })
      };

      const req = await fetch(`${api}/category-budgets`, reqOptions);
      const jsonResponse = await req.json();

      if (req.status !== 200) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }

      // Refresh related stores
      await refreshBudgets();
      
      // Update our local state based on updated budget store data
      const updatedCategoryBudgets = currentBudget?.categoryBudgets || [];
      set({ 
        categoryBudgets: updatedCategoryBudgets,
        categoryBudgetsByType: getCategoryBudgetsByType()
      });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshCategoryBudgets: () => {
    const {
      currentBudget,
      getCategoryBudgetsByType,
    } = get();

    if (!currentBudget) return;

    const categoryBudgets = currentBudget.categoryBudgets || [];

    set({ categoryBudgets });

    set({
      categoryBudgetsByType: getCategoryBudgetsByType(),
    });
  },
});

