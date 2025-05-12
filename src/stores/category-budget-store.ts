import { create } from 'zustand';
import { CategoryBudget, CategoryType } from '@nikelaz/bw-shared-libraries';
import { api } from '@/config';
import { useBudgetStore } from './budget-store'; // Update with the correct path

interface CategoryBudgetsByType {
  [CategoryType.INCOME]: CategoryBudget[];
  [CategoryType.EXPENSE]: CategoryBudget[];
  [CategoryType.SAVINGS]: CategoryBudget[];
  [CategoryType.DEBT]: CategoryBudget[];
}

interface CategoryBudgetState {
  categoryBudgets: CategoryBudget[];
  categoryBudgetsByType: CategoryBudgetsByType;
  isLoading: boolean;
  
  // Actions
  update: (categoryBudget: CategoryBudget, token: string) => Promise<void>;
  create: (categoryBudget: CategoryBudget, token: string) => Promise<void>;
  delete: (categoryBudget: CategoryBudget, token: string) => Promise<void>;
  getCategoryBudgetsByType: () => CategoryBudgetsByType;
}

export const useCategoryBudgetStore = create<CategoryBudgetState>((set, get) => ({
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
}));

// Hook to sync categoryBudgets with the current budget
export const useCategoryBudgetStoreSync = () => {
  const currentBudget = useBudgetStore(state => state.currentBudget);
  
  React.useEffect(() => {
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
