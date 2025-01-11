import type { Budget } from '@/types/budget';
import parseBudgets from './parse-budgets';

const findClosestBudgetDate = (referenceDate: Date, budgets: Array<Budget>): Budget | null => {
  if (budgets.length === 0) return null;

  const currentMonth = new Date().getMonth();

  const budgetsCopy = parseBudgets(budgets);

  const exactBudget = budgetsCopy.find(budget => budget.month.getMonth() === currentMonth);

  if (exactBudget) return exactBudget;

  budgetsCopy.sort((a: any, b: any) => {
    const distancea = Math.abs(referenceDate.getTime() - a.month);
    const distanceb = Math.abs(referenceDate.getTime() - b.month);
    return distancea - distanceb;
  });

  return budgetsCopy[0];
};

export default findClosestBudgetDate;
