import { StateCreator } from 'zustand';
import { Budget, findClosestBudgetDate, parseBudget } from '@nikelaz/bw-shared-libraries';
import { api } from '@/config';

export type BudgetState = {
  budgets: Budget[];
  currentBudget: Budget | null;
  isLoading: boolean;
};

export type BudgetActions = {
  setCurrentBudget: (budget: Budget | null) => void;
  refresh: (token: string) => Promise<Budget[]>;
  create: (budget: Budget, copyFrom: Budget, token: string) => Promise<void>;
  budgetExistsForMonth: (monthIndex: number) => boolean;
}

export const createBudgetSlice: StateCreator<BudgetState & BudgetActions> = (set, get) => ({
  budgets: [],
  currentBudget: null,
  isLoading: false,
   
  setCurrentBudget: (budget: Budget | null) => set({ currentBudget: budget }),
  
  budgetExistsForMonth: (monthIndex: number) => {
    const { budgets } = get();
    return budgets.some((budget: Budget) => {
      const tmpDate = new Date(budget.month);
      return tmpDate.getMonth() === monthIndex;
    });
  },
  
  refresh: async (token: string) => {
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
      
      set({ budgets: fetchedBudgets });
      
      const { currentBudget } = get();
      const updatedCurrentBudget = fetchedBudgets.find(budget => 
        budget.id === currentBudget?.id
      );
      
      if (updatedCurrentBudget) {
        set({ currentBudget: updatedCurrentBudget });
      }
      else if (currentBudget === null || !updatedCurrentBudget) {
        const initiallySelectedBudget = findClosestBudgetDate(new Date(), fetchedBudgets);
        set({ currentBudget: initiallySelectedBudget });
      }
      
      return fetchedBudgets;
    } catch (error) {
      console.error('Error refreshing budgets:', error);
      throw new Error('An unexpected error occurred while refreshing budgets');
    } finally {
      set({ isLoading: false });
    }
  },
  
  create: async (budget: Budget, copyFrom: Budget, token: string) => {
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
      const newBudget = newBudgets.find((budget: Budget) => budget.id === jsonResponse.budget.id);
      
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
});

// TODO: Incorporate this logic somewhere else
/*
export const initBudgetStore = (token: string) => {
  const { refresh } = useBudgetStore();
  
  useEffect(() => {
    if (token) {
      refresh(token);
    }
  }, [token, refresh]); 
};
*/
