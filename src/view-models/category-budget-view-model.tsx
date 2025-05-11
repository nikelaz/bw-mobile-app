import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback
} from 'react';
import { CategoryBudget, CategoryType } from '@nikelaz/bw-shared-libraries';
import { useBudgetModel } from '@/src/view-models/budget-view-model';
import { useTransactionsModel } from '@/src/view-models/transactions-view-model';
import { api } from '@/config';

interface CategoryBudgetModelContextType {
  categoryBudgets: CategoryBudget[];
  categoryBudgetsByType: {
    [CategoryType.INCOME]: CategoryBudget[];
    [CategoryType.EXPENSE]: CategoryBudget[];
    [CategoryType.SAVINGS]: CategoryBudget[];
    [CategoryType.DEBT]: CategoryBudget[];
  };
  create: (categoryBudget: CategoryBudget) => Promise<void>;
  update: (categoryBudget: CategoryBudget) => Promise<void>;
  remove: (categoryBudget: CategoryBudget) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CategoryBudgetModelContext = createContext<CategoryBudgetModelContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  token: string;
};

export const CategoryBudgetModelContextProvider = ({ children, token }: Props) => {
  const budgetModel = useBudgetModel();
  const transactionsModel = useTransactionsModel();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryBudgets = useMemo(() => {
    return budgetModel.currentBudget?.categoryBudgets ?? [];
  }, [budgetModel.currentBudget]);

  const categoryBudgetsByType = useMemo(() => {
    return categoryBudgets.reduce((acc, cb) => {
      const type = cb.category?.type;
      if (type !== undefined) {
        acc[type].push(cb);
      }
      return acc;
    }, {
      [CategoryType.INCOME]: [] as CategoryBudget[],
      [CategoryType.EXPENSE]: [] as CategoryBudget[],
      [CategoryType.SAVINGS]: [] as CategoryBudget[],
      [CategoryType.DEBT]: [] as CategoryBudget[],
    });
  }, [categoryBudgets]);

  const create = useCallback(async (categoryBudget: CategoryBudget) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${api}/category-budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryBudget }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Unexpected error during creation');

      await budgetModel.refresh();
      await transactionsModel.refresh();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [token, budgetModel, transactionsModel]);

  const update = useCallback(async (categoryBudget: CategoryBudget) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${api}/category-budgets`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryBudget }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Unexpected error during update');

      await budgetModel.refresh();
      await transactionsModel.refresh();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [token, budgetModel, transactionsModel]);

  const remove = useCallback(async (categoryBudget: CategoryBudget) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${api}/category-budgets/${categoryBudget.id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Unexpected error during deletion');

      await budgetModel.refresh();
      await transactionsModel.refresh();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [token, budgetModel, transactionsModel]);

  const categoryBudgetModel = useMemo(() => ({
    categoryBudgets,
    categoryBudgetsByType,
    create,
    update,
    remove,
    isLoading,
    error
  }), [categoryBudgets, categoryBudgetsByType, create, update, remove, isLoading, error]);

  return (
    <CategoryBudgetModelContext.Provider value={categoryBudgetModel}>
      {children}
    </CategoryBudgetModelContext.Provider>
  );
};

export const useCategoryBudgetModel = (): CategoryBudgetModelContextType => {
  const context = useContext(CategoryBudgetModelContext);
  if (!context) {
    throw new Error('useCategoryBudgetModel must be used within a CategoryBudgetModelContextProvider');
  }
  return context;
};
