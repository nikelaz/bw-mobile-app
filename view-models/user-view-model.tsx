import { createContext, useContext } from 'react';
import { Currency, currencies } from '../data/currencies';
import { api } from '../config';
import React, { useState } from 'react';
import Storage from '@/helpers/storage';

export class UserViewModel {
  user: any;
  setUser: Function;
  currency: string | null;
  setCurrency: Function;
  cachedCurrency: null | Currency;
  token: string | null;
  setToken: Function;

  constructor() {
    this.cachedCurrency = null;
    [this.token, this.setToken] = useState(null);
    [this.user, this.setUser] = useState(null);
    [this.currency, this.setCurrency] = useState(null);
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

  async login(email: string, password: string) {
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

    await Storage.setItem('token', jsonResponse.token);
    await Storage.setItem('user', JSON.stringify(jsonResponse.user));

    if (req.status !== 200) {
      throw new Error(jsonResponse.message);
    }

    this.token = jsonResponse.token;
    this.user = jsonResponse.user;
    this.currency = jsonResponse.user.currency;
  };

  async signup(user: any) {
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

  async logout() {
    await Storage.removeItem('token');
    await Storage.removeItem('user');
  };

  async getToken() {
    if (this.token) return this.token;
    
    const storedToken = await Storage.getItem('token');
    this.setToken(storedToken);

    if (!this.user) {
      const storedUser = await Storage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        this.setUser(parsedUser);
        this.setCurrency(parsedUser.currency);
      }
    }

    return storedToken;
  };

  async update(user: any) {
    if (!this.token || !user) return;
  
    const reqOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ user })
    };
  
    const req = await fetch(`${api}/users`, reqOptions);
  
    const jsonResponse = await req.json();
  
    if (req.status !== 200 && jsonResponse.message) {
      throw new Error(jsonResponse.message);
    }
  
    if (req.status !== 200 && !jsonResponse.message) {
      throw new Error('An unexpected error occured. Please try again later.')
    }
  
    await Storage.setItem('user', JSON.stringify({
      ...this.user,
      ...user
    }));

    if (req.status !== 200) {
      throw new Error(jsonResponse.message);
    }

    this.setUser({
      ...this.user,
      ...user
    });

    if (user.currency) {
      this.setCurrency(user.currency);
    }
  };
  
  async changePassword(currentPassword: string, newPassword: string, repeatNewPassword: string) {
    if (repeatNewPassword !== newPassword) {
      throw new Error('The new passwords do not match');
    }
  
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    };
  
    let req;
  
    try {
      req = await fetch(`${api}/users/change-password`, reqOptions);
    } catch (error) {
      throw new Error('An unexpected error occured. Try again later.');
    }
  
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
