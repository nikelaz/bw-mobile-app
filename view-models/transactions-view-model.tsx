'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { BudgetViewModel, useBudgetModel } from '@/view-models/budget-view-model';
import { calculateTotalPages } from '@/helpers/pagination-utils';
import type { Transaction } from '@/types/transaction';
import { Budget } from '@/types/budget';
import { api } from '@/config';

export class TransactionsViewModel {
  perPage = 6;
  token: string;
  budgetModel: BudgetViewModel;
  transactions: Array<Transaction>;
  setTransactions: Function;
  page: number;
  setPage: Function;
  totalPages: number;
  setTotalPages: Function;
  filter: string;
  setFilter: Function;
  category: string;
  setCategory: Function;


  constructor(token: string) {
    this.token = token;
    this.budgetModel = useBudgetModel();
    [this.transactions, this.setTransactions] = useState([]);
    [this.page, this.setPage] = useState(0);
    [this.filter, this.setFilter] = useState('');
    [this.totalPages, this.setTotalPages] = useState(calculateTotalPages(0, this.perPage));
    [this.category, this.setCategory] = useState('');

    useEffect(() => {
      this.refresh();
    }, [this.budgetModel.currentBudget, this.page, this.filter]);

    useEffect(() => {
      this.setPage(0);
    }, [this.filter, this.budgetModel.currentBudget]);
  }

  async refresh() {
    if (!this.token || !this.budgetModel.currentBudget?.id) return;
    const response = await this.fetchTransactions(this.perPage, this.page * this.perPage, this.filter);
    this.setTransactions(response.transactions);
    this.setTotalPages(calculateTotalPages(parseFloat(response.count),  this.perPage));
  };

  nextPage() {
    this.setPage(this.page + 1);
  }

  prevPage() {
    this.setPage(this.page - 1);
  }

  async fetchTransactions(limit: number, offset: number, filter: string = '') {
    const budgetId = this.budgetModel.currentBudget?.id;
    
    if (!this.token || budgetId === undefined) return;

    const reqOptions = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    };
  
    const req = await fetch(`${api}/transactions/${budgetId}?limit=${limit}&offset=${offset}&filter=${filter}`, reqOptions);
  
    const jsonResponse = await req.json();
  
    return jsonResponse;
  };

  async createTransaction(transaction: Transaction) {
    if (!this.token) return;
  
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ transaction })
    };
  
    const req = await fetch(`${api}/transactions`, reqOptions);
  
    const jsonResponse = await req.json();
  
    if (req.status !== 200 && jsonResponse.message) {
      throw new Error(jsonResponse.message);
    }
  
    if (req.status !== 200 && !jsonResponse.message) {
      throw new Error('An unexpected error occured. Please try again later.')
    }
  
    return jsonResponse;
  };

  async deleteTransaction(id: number) {
    if (!this.token) return;
  
    const reqOptions = {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    };
  
    const req = await fetch(`${api}/transactions/${id}`, reqOptions);
  
    const jsonResponse = await req.json();
  
    if (req.status !== 200 && jsonResponse.message) {
      throw new Error(jsonResponse.message);
    }
  
    if (req.status !== 200 && !jsonResponse.message) {
      throw new Error('An unexpected error occured. Please try again later.')
    }
  
    return jsonResponse;
  };

  async updateTransaction(transaction: Partial<Transaction>) {
    if (!this.token) return;
  
    const reqOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ transaction })
    };
  
    const req = await fetch(`${api}/transactions`, reqOptions);
  
    const jsonResponse = await req.json();
  
    if (req.status !== 200 && jsonResponse.message) {
      throw new Error(jsonResponse.message);
    }
  
    if (req.status !== 200 && !jsonResponse.message) {
      throw new Error('An unexpected error occured. Please try again later.')
    }
  
    return jsonResponse;
  };
}

const TransactionsModelContext = createContext<any>(null);

type TransactionsModelContextProviderProps = Readonly<{
  children: React.ReactNode,
  token: string,
}>;

export const TransactionsModelContextProvider = (props: TransactionsModelContextProviderProps) => {
  const transactionsModel = new TransactionsViewModel(props.token);

  return (
    <TransactionsModelContext.Provider value={transactionsModel}>
      {props.children}
    </TransactionsModelContext.Provider>
  )
};

export const useTransactionsModel = () => useContext(TransactionsModelContext);
