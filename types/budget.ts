import type { CategoryBudget } from '@/types/category-budget';
import type { User } from '@/types/user';

export type Budget = {
  id: number,
  month: Date | string,
  categoryBudgets?: Array<CategoryBudget>,
  user?: User
};
