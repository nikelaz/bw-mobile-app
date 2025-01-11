import type { Category } from '@/types/category';
import type { Budget } from '@/types/budget';
import type { Transaction } from '@/types/transaction';

export type CategoryBudget = {
  id: number,
  amount: number,
  currentAmount: number,
  category?: Category,
  budget?: Budget,
  transactions?: Array<Transaction>,
};
