import type { BudgetState, BudgetActions } from './budget-slice';
import type { UserState, UserActions } from './user-slice';
import type { CategoryBudgetState, CategoryBudgetActions } from './category-budget-slice';
import type { TransactionsState, TransactionsActions } from './transactions-slice';

import { create } from 'zustand';
import { createBudgetSlice } from './budget-slice';
import { createUserSlice } from './user-slice';
import { createCategoryBudgetSlice } from './category-budget-slice';
import { createTransactionsSlice } from './transactions-slice';

export type GlobalState = {
  isLoading: boolean;
};

export type GlobalActions = {
  setIsLoading: (isLoading: boolean) => void;
};

export type StoreState = GlobalState & UserState & BudgetState & CategoryBudgetState & TransactionsState;

export type StoreActions = GlobalActions & UserActions & BudgetActions & CategoryBudgetActions & TransactionsActions;

export type Store = StoreState & StoreActions;

export const useStore = create<Store>((...args) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {
    const set = args[0];
    set({ isLoading });
  },

  ...createUserSlice(...args),
  ...createBudgetSlice(...args),
  ...createCategoryBudgetSlice(...args),
  ...createTransactionsSlice(...args),
}));

