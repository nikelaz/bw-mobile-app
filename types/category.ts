import type { User } from '@/types/user';
import type { CategoryBudget } from '@/types/category-budget';

export enum CategoryType {
  INCOME = 0,
  EXPENSE = 1,
  SAVINGS = 2,
  DEBT = 3
};

export type Category = {
  id: number,
  type: CategoryType,
  title: string,
  accAmount: number,
  user?: User,
  categoryBudgets?: Array<CategoryBudget>
};
