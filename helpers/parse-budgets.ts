import { Budget } from '@/types/budget';

const parseBudgets = (budgets: Budget[]) => budgets.map(budget => ({
  ...budget,
  month: new Date(budget.month),
}));

export default parseBudgets;
