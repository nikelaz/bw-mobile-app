import { create } from 'zustand';
import { createBudgetSlice } from './budget-store';
import type { BudgetState, BudgetActions } from './budget-slice';

export const useStore = create<BudgetState & BudgetActions>((...args) => ({
  ...createBudgetSlice(...args),
}));

