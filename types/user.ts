import type { Category } from '@/types/category';
import type { Budget } from '@/types/budget';
import type { Transaction } from '@/types/transaction';

export type User = {
  id: number,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  currency: string,
  categories?: Array<Category>,
  budgets?: Array<Budget>,
  transactions?: Array<Transaction>,
};
