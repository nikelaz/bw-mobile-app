import { createContext, useContext } from 'react';
import { Currency, currencies } from '../data/currencies';
import { api } from '../config';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class UserViewModel {
  user: any;
  currency?: string;
  cachedCurrency: null | Currency;

  constructor() {
    this.cachedCurrency = null;
  }

  getCurrency() {
    if (this.cachedCurrency !== null && this.currency === this.cachedCurrency.iso) {
      if (this.cachedCurrency.symbol) {
        return this.cachedCurrency.symbol;
      }
      return this.cachedCurrency.iso;
    }

    const currency = currencies.find(x => x.iso === this.currency);
   
    if (!currency) return null;

    this.cachedCurrency = currency;
    
    if (currency.symbol) {
      return currency.symbol;
    }

    return currency.iso;
  }

  async login (email: string, password: string) {
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          email,
          password,
        }
      })
    };

    const req = await fetch(`${api}/users/login`, reqOptions);
    const jsonResponse = await req.json();

    await AsyncStorage.setItem('token', jsonResponse.token);
    await AsyncStorage.setItem('user', jsonResponse.user);

    this.user = jsonResponse.user;
    this.currency = jsonResponse.user.currency;

    if (req.status !== 200) {
      throw new Error(jsonResponse.message);
    }
  };

  async signup (user: any) {
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    };
  

    const req = await fetch(`${api}/users`, reqOptions);
  
    const response = await req.json();
  
    if (req.status !== 200) {
      if (
        response.statusCode
        && response.statusCode === 500
        && response.message.includes('unique constraint')
      ) {
        throw new Error('A user already exists with this email');
      }
  
      if (
        response[0]
        && response[0].constraints
        && response[0].constraints.matches
      ) {
        throw new Error(response[0].constraints.matches);
      }
  
      throw new Error(response.message);
    }
  };

  logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };
}

const UserModelContext = createContext<any>([null, null]);

type UserModelContextProviderProps = Readonly<{
  children: React.ReactNode,
}>;

export const UserModelContextProvider = (props: UserModelContextProviderProps) => {
  const userModel = new UserViewModel();

  return (
    <UserModelContext.Provider value={userModel}>
      {props.children}
    </UserModelContext.Provider>
  )
};

export const useUserModel = () => useContext(UserModelContext);
