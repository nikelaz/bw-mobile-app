import { createContext, useContext, useState, useEffect } from 'react';
import { Budget } from '@nikelaz/bw-shared-libraries';
import { api } from '@/config';
import { findClosestBudgetDate } from '@nikelaz/bw-shared-libraries';
import { parseBudget } from '@nikelaz/bw-shared-libraries';
import { useUserModel } from './user-view-model';

export class BudgetViewModel {
  token: string;
  budgets: Array<Budget>;
  setBudgets: Function;
  currentBudget: Budget | null;
  setCurrentBudget: Function;

  constructor(token: string) {
    this.token = token;
    [this.budgets, this.setBudgets] = useState([]);
    [this.currentBudget, this.setCurrentBudget] = useState(null);
  }

  async refresh() {
    const budgets = await this.fetchBudgets();
    const parsedBudgets = parseBudget(budgets);

    this.setBudgets(parsedBudgets);

    const updatedCurrentBudget = parsedBudgets.find(budget => budget.id === this.currentBudget?.id);

    if (updatedCurrentBudget) {
      this.setCurrentBudget(updatedCurrentBudget);
    }

    if (this.currentBudget === null || !updatedCurrentBudget) {
      const initiallySelectedBudget = findClosestBudgetDate(new Date(), parsedBudgets);
      this.setCurrentBudget(initiallySelectedBudget);
    }

    return parsedBudgets;
  }

  async fetchBudgets(): Promise<Array<Budget>> {
    if (!this.token) return [];
  
    const reqOptions = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    };
  
    const req = await fetch(`${api}/budgets`, reqOptions);
  
    const jsonResponse = await req.json();
  
    return jsonResponse.budgets;
  };

  budgetExistsForMonth(monthIndex: number) {
    for (let i = 0; i < this.budgets.length; i++) {
      const budget = this.budgets[i];
      const tmpDate = new Date(budget.month);
      if (tmpDate.getMonth() === monthIndex) return true;
    }

    return false;
  }

  async create(budget: Budget, copyFrom: Budget) {
    if (!this.token) return;
  
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ budget, copyFrom })
    };
  
    const req = await fetch(`${api}/budgets`, reqOptions);
  
    const jsonResponse = await req.json();
  
    if (req.status !== 200 && jsonResponse.message) {
      throw new Error(jsonResponse.message);
    }
  
    if (req.status !== 200 && !jsonResponse.message) {
      throw new Error('An unexpected error occured. Please try again later.')
    }
  
    const newBudgets = await this.refresh();
    const newBudget = newBudgets.find(budget => budget.id === jsonResponse.budget.id);
    if (newBudget) this.setCurrentBudget(newBudget);
  };
}

const BudgetModelContext = createContext<any>([null, null]);

type BudgetModelContextProviderProps = Readonly<{
  children: React.ReactNode,
  token: string,
}>;

export const BudgetModelContextProvider = (props: BudgetModelContextProviderProps) => {
  const budgetModel = new BudgetViewModel(props.token);
  const userModel = useUserModel();

  useEffect(() => {
    budgetModel.refresh();
  }, [props.token, userModel.user]);

  return (
    <BudgetModelContext.Provider value={budgetModel}>
      {props.children}
    </BudgetModelContext.Provider>
  )
};

export const useBudgetModel = () => useContext(BudgetModelContext);
