import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { calculateTotalPages, Transaction } from '@nikelaz/bw-shared-libraries';
import { useBudgetModel } from '@/src/view-models/budget-view-model';
import { api } from '@/config';

/**
 * The function below is a generally bad idea that needs to be removed
 * Ideally pagination should be refactored to loading on scroll
 */
const calculatePerPageBasedOnHeight = (height: number) => {
  let coefficient = height < 1000 ? 300 : 100;
  return Math.max(3, Math.ceil((height - coefficient) / 100));
};

interface TransactionsModelContextType {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  filter: string;
  category: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  refresh: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  create: (transaction: Transaction) => Promise<void>;
  update: (transaction: Partial<Transaction>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  isLoading: boolean;
}

const TransactionsModelContext = createContext<TransactionsModelContextType | undefined>(undefined);

type TransactionsModelContextProps = Readonly<{
  children: React.ReactNode,
  token: string,
  height: number,
}>;

export const TransactionsModelContextProvider = (props: TransactionsModelContextProps) => {
  const budgetModel = useBudgetModel();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filter, setFilter] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const perPage = useMemo(() => calculatePerPageBasedOnHeight(props.height), [props.height]);

  const fetchTransactions = useCallback(async (limit: number, offset: number, filter: string = '') => {
    if (!props.token || !budgetModel.currentBudget?.id) return { transactions: [], count: 0 };

    try {
      const req = await fetch(
        `${api}/transactions/${budgetModel.currentBudget.id}?limit=${limit}&offset=${offset}&filter=${filter}`,
        {
          method: 'GET',
          headers: { authorization: `Bearer ${props.token}` },
        }
      );

      const json = await req.json();
      return json;
    } catch (error) {
      console.error(error);
      return { transactions: [], count: 0 };
    }
  }, [props.token, budgetModel.currentBudget?.id]);

  const refresh = useCallback(async () => {
    if (!props.token || !budgetModel.currentBudget?.id) return;

    setIsLoading(true);

    try {
      const offset = currentPage * perPage;
      const data = await fetchTransactions(perPage, offset, filter);
      setTransactions(data.transactions);
      setTotalPages(calculateTotalPages(data.count, perPage));
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [props.token, budgetModel.currentBudget?.id, currentPage, filter, perPage, fetchTransactions]);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  }, []);

  const create = useCallback(async (transaction: Transaction) => {
    if (!props.token) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${api}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${props.token}`
        },
        body: JSON.stringify({ transaction })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'An unexpected error occurred.');
      }

      await budgetModel.refresh();
      await refresh();
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [props.token, budgetModel, refresh]);

  const update = useCallback(async (transaction: Partial<Transaction>) => {
    if (!props.token) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${api}/transactions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${props.token}`
        },
        body: JSON.stringify({ transaction })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'An unexpected error occurred.');
      }

      await budgetModel.refresh();
      await refresh();
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [props.token, budgetModel, refresh]);

  const remove = useCallback(async (id: number) => {
    if (!props.token) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${api}/transactions/${id}`, {
        method: 'DELETE',
        headers: { authorization: `Bearer ${props.token}` }
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'An unexpected error occurred.');
      }

      await budgetModel.refresh();
      await refresh();
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [props.token, budgetModel, refresh]);

  useEffect(() => {
    refresh();
  }, [budgetModel.currentBudget?.id, currentPage, filter, refresh]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filter, budgetModel.currentBudget?.id]);

  const transactionsModel = useMemo(() => ({
    transactions,
    currentPage,
    totalPages,
    filter,
    category,
    setFilter,
    setCategory,
    refresh,
    nextPage,
    prevPage,
    create,
    update,
    remove,
    isLoading,
  }), [
    transactions,
    currentPage,
    totalPages,
    filter,
    category,
    setFilter,
    setCategory,
    refresh,
    nextPage,
    prevPage,
    create,
    update,
    remove,
    isLoading,
  ]);

  return (
    <TransactionsModelContext.Provider value={transactionsModel}>
      {props.children}
    </TransactionsModelContext.Provider>
  );
};

export const useTransactionsModel = (): TransactionsModelContextType => {
  const context = useContext(TransactionsModelContext);
  if (context === undefined) {
    throw new Error('useTransactionsModel must be used within a TransactionsModelContextProvider');
  }
  return context;
};
