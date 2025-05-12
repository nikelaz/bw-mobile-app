import { createContext, useContext } from 'react';
import { BudgetViewModel, useBudgetModel } from '@/view-models/budget-view-model';
import { CategoryBudget } from '@nikelaz/bw-shared-libraries';
import { CategoryType } from '@nikelaz/bw-shared-libraries';
import { api } from '@/config';
import { useTransactionsModel } from '@/view-models/transactions-view-model';
import { useMemo } from 'react';

export class CategoryBudgetViewModel {
  token: string;
  budgetModel: BudgetViewModel;
  transactionsModel: any;
  categoryBudgets: Array<CategoryBudget>;
  categoryBudgetsByType: {
    [CategoryType.INCOME]: Array<CategoryBudget>,
    [CategoryType.EXPENSE]: Array<CategoryBudget>,
    [CategoryType.SAVINGS]: Array<CategoryBudget>,
    [CategoryType.DEBT]: Array<CategoryBudget>,
  };

  constructor(token: string) {
    this.token = token;
    this.budgetModel = useBudgetModel();
    this.transactionsModel = useTransactionsModel();

    this.categoryBudgets = this.budgetModel.currentBudget?.categoryBudgets || [];
    
    this.categoryBudgetsByType = useMemo(() => {
      return this.getCategoryBudgetsByType();
    }, [this.budgetModel.currentBudget]);
  }

  getCategoryBudgetsByType() {
    const categoryBudgetsByType: any = {
      [CategoryType.INCOME]: [],
      [CategoryType.EXPENSE]: [],
      [CategoryType.SAVINGS]: [],
      [CategoryType.DEBT]: [],
    };

    this.categoryBudgets.forEach((categoryBudget: CategoryBudget) => {
      if (!categoryBudget.category || categoryBudget.category.type === undefined) return;
      categoryBudgetsByType[categoryBudget.category.type].push(categoryBudget);
    });
    return categoryBudgetsByType;
  }

  async update(categoryBudget: CategoryBudget) {
    if (!this.token) return;

    const reqOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ categoryBudget })
    };

    const req = await fetch(`${api}/category-budgets`, reqOptions);

    const jsonResponse = await req.json();

    if (req.status !== 200 && jsonResponse.message) {
      throw new Error(jsonResponse.message);
    }

    if (req.status !== 200 && !jsonResponse.message) {
      throw new Error('An unexpected error occured. Please try again later.')
    }

    this.budgetModel.refresh();
    this.transactionsModel.refresh();
  }

  async delete(categoryBudget: CategoryBudget) {
    if (!this.token) return;

    const reqOptions = {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    };

    const req = await fetch(`${api}/category-budgets/${categoryBudget.id}`, reqOptions);

    const jsonResponse = await req.json();

    if (req.status !== 200 && jsonResponse.message) {
      throw new Error(jsonResponse.message);
    }

    if (req.status !== 200 && !jsonResponse.message) {
      throw new Error('An unexpected error occured. Please try again later.')
    }

    this.budgetModel.refresh();
    this.transactionsModel.refresh();
  }

  async create(categoryBudget: CategoryBudget) {
    if (!this.token) return;

    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ categoryBudget })
    };

    const req = await fetch(`${api}/category-budgets`, reqOptions);

    const jsonResponse = await req.json();

    if (req.status !== 200 && jsonResponse.message) {
      throw new Error(jsonResponse.message);
    }

    if (req.status !== 200 && !jsonResponse.message) {
      throw new Error('An unexpected error occured. Please try again later.')
    }

    this.budgetModel.refresh();
    this.transactionsModel.refresh();
  }
}

const CategoryBudgetModelContext = createContext<any>([null, null]);

type CategoryBudgetModelContextProviderProps = Readonly<{
  children: React.ReactNode,
  token: string,
}>;

export const CategoryBudgetModelContextProvider = (props: CategoryBudgetModelContextProviderProps) => {
  const categoryBudgetModel = new CategoryBudgetViewModel(props.token);

  return (
    <CategoryBudgetModelContext.Provider value={categoryBudgetModel}>
      {props.children}
    </CategoryBudgetModelContext.Provider>
  )
};

export const useCategoryBudgetModel = () => useContext(CategoryBudgetModelContext);
