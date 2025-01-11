import type { CategoryBudget } from '@/types/category-budget';
import type { User } from '@/types/user';

export type Transaction = {
  id: number,
  title: string,
  amount: number,
  date: Date,
  categoryBudget?: CategoryBudget,
  user?: User,
};
