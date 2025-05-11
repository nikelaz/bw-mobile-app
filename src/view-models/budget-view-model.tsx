import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Budget, findClosestBudgetDate, parseBudget } from '@nikelaz/bw-shared-libraries';
import { useUserModel } from '@/src/view-models/user-view-model';
import { api } from '@/config';

interface BudgetModelContextType {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  currentBudget: Budget | null;
  setCurrentBudget: React.Dispatch<React.SetStateAction<Budget | null>>;
  refresh: () => Promise<Budget[]>;
  create: (budget: Budget, copyFrom: Budget) => Promise<void>;
  budgetExistsForMonth: (monthIndex: number) => boolean;
  isLoading: boolean;
  error: string | null;
}

const BudgetModelContext = createContext<BudgetModelContextType | undefined>(undefined);

type BudgetModelContextProviderProps = Readonly<{
  children: React.ReactNode,
  token: string,
}>;

export const BudgetModelContextProvider = (props: BudgetModelContextProviderProps) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userModel = useUserModel();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchBudgets = useCallback(async (): Promise<Budget[]> => {
    if (!props.token) return [];
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      const reqOptions = {
        method: 'GET',
        headers: {
          authorization: `Bearer ${props.token}`,
        },
        signal: abortControllerRef.current.signal,
      };
    
      const req = await fetch(`${api}/budgets`, reqOptions);
      
      if (!req.ok) {
        const errorData = await req.json().catch(() => ({}));
        throw new Error(errorData.message || `Error fetching budgets: ${req.status}`);
      }
      
      const jsonResponse = await req.json(); 
      return jsonResponse.budgets || [];
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
      return [];
    }
  }, [props.token]);

  const budgetExistsForMonth = useCallback((monthIndex: number): boolean => {
    return budgets.some(budget => {
      const tmpDate = new Date(budget.month);
      return tmpDate.getMonth() === monthIndex;
    });
  }, [budgets]);

  const refresh = useCallback(async (): Promise<Budget[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedBudgets = await fetchBudgets();
      const parsedBudgets = parseBudget(fetchedBudgets);
      
      setBudgets(parsedBudgets);
      
      const updatedCurrentBudget = parsedBudgets.find(budget => 
        budget.id === currentBudget?.id
      );
      
      if (updatedCurrentBudget) {
        setCurrentBudget(updatedCurrentBudget);
      } else if (currentBudget === null || !updatedCurrentBudget) {
        const initiallySelectedBudget = findClosestBudgetDate(new Date(), parsedBudgets);
        setCurrentBudget(initiallySelectedBudget);
      }
      
      return parsedBudgets;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while refreshing budgets');
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [fetchBudgets, currentBudget]);

  const create = useCallback(async (budget: Budget, copyFrom: Budget): Promise<void> => {
    if (!props.token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify({ budget, copyFrom })
      };
    
      const req = await fetch(`${api}/budgets`, reqOptions);
      const jsonResponse = await req.json();
    
      if (!req.ok) {
        throw new Error(jsonResponse.message || `Error creating budget: ${req.status}`);
      }
    
      const newBudgets = await refresh();
      const newBudget = newBudgets.find(budget => budget.id === jsonResponse.budget.id);
      
      if (newBudget) {
        setCurrentBudget(newBudget);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while creating the budget');
      }
      throw error; 
    } finally {
      setIsLoading(false);
    }
  }, [props.token, refresh]);

  useEffect(() => {
    refresh();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [props.token, userModel.user, refresh]);

  const budgetModel = useMemo((): BudgetModelContextType => ({
    budgets,
    setBudgets,
    currentBudget,
    setCurrentBudget,
    refresh,
    create,
    budgetExistsForMonth,
    isLoading,
    error
  }), [
    budgets, 
    currentBudget, 
    refresh, 
    create, 
    budgetExistsForMonth,
    isLoading,
    error
  ]);

  return (
    <BudgetModelContext.Provider value={budgetModel}>
      {props.children}
    </BudgetModelContext.Provider>
  );
};

export const useBudgetModel = (): BudgetModelContextType => {
  const context = useContext(BudgetModelContext);
  
  if (context === undefined) {
    throw new Error('useBudgetModel must be used within a BudgetModelContextProvider');
  }
  
  return context;
};
