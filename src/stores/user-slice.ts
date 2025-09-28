import type { Store } from './store';

import { StateCreator } from 'zustand';
import { Currency, currencies } from '@/data/currencies';
import { api } from '@/config';
import Storage from '@/src/helpers/storage';
import { OAuthProvider } from '@/src/constants/oauth-provider';

type User = {
  id: string;
  email: string;
  currency: string;
  oAuthProvider?: OAuthProvider | null;
  [key: string]: any;
};

type PartialUserWithId = Pick<User, 'id'> & Partial<Omit<User, 'id'>>;

export type UserState = {
  user: User | null;
  token: string | null;
  currency: string | null;
  cachedCurrency: Currency | null;
};

export type UserActions = {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => Promise<void>;
  setCurrency: (currency: string | null) => void;
  getCurrency: () => string;
  login: (email: string, password: string) => Promise<void>;
  oauth: (token: string, oAuthProvider: OAuthProvider, firstName?: string | null, lastName?: string | null) => Promise<void>;
  signup: (user: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  loginFromStorage: () => Promise<string | null>;
  updateUser: (userData: PartialUserWithId) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, repeatNewPassword: string) => Promise<any>;
  deleteAccount: () => Promise<void>;
};

export const createUserSlice: StateCreator<
  Store,
  [],
  [],
  UserState & UserActions
> = (set, get) => ({
  user: null,
  token: null,
  currency: null,
  cachedCurrency: null,
  
  setUser: (user) => set({ user }),
  
  setToken: async (token) => {
    const { refreshBudgets } = get();
    set({ token });
    await refreshBudgets();
  },
  
  setCurrency: (currency) => {
    const currencyObj = currencies.find(x => x.iso === currency);

    if (!currencyObj) {
      return set({
        currency: 'USD',
        cachedCurrency: currencies.find(x => x.iso === 'USD'),
      });
    }

    set({
      currency,
      cachedCurrency: currencyObj,
    });
  },
  
  getCurrency: () => {
    const { cachedCurrency } = get();
     
    if (!cachedCurrency) return 'USD';
 
    return cachedCurrency.iso || cachedCurrency.symbol || 'USD';
  },
  
  login: async (email, password) => {
    const {
      setToken,
      setCurrency,
    } = get();

    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { email, password }
        })
      };

      const req = await fetch(`${api}/users/login`, reqOptions);
      const jsonResponse = await req.json();

      if (req.status !== 200) {
        throw jsonResponse;
      }

      await Storage.setItem('token', jsonResponse.token);
      await Storage.setItem('user', JSON.stringify(jsonResponse.user));

      setToken(jsonResponse.token);
      setCurrency(jsonResponse.user.currency);
      set({ user: jsonResponse.user });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  oauth: async (token, oAuthProvider, firstName, lastName) => {
    const {
      setToken,
      setCurrency,
    } = get();
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          oAuthProvider,
          firstName,
          lastName,
        })
      };

      const req = await fetch(`${api}/users/oauth`, reqOptions);
      const jsonResponse = await req.json();

      if (req.status !== 200) {
        throw jsonResponse;
      }

      await Storage.setItem('token', jsonResponse.token);
      await Storage.setItem('user', JSON.stringify(jsonResponse.user));

      setToken(jsonResponse.token);
      setCurrency(jsonResponse.user.currency);
      set({ user: jsonResponse.user });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  signup: async (user) => {
    set({ isLoading: true });
    
    try {
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
          response.statusCode && 
          response.statusCode === 500 &&
          response.message.includes('unique constraint')
        ) {
          throw new Error('A user already exists with this email');
        }
    
        if (
          response[0] &&
          response[0].constraints &&
          response[0].constraints.matches
        ) {
          throw new Error(response[0].constraints.matches);
        }
    
        throw new Error(response.message);
      }
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    const {
      setToken,
      setCurrency,
    } = get();

    setToken(null);
    setCurrency(null);
    set({ user: null });
    await Storage.removeItem('token');
    await Storage.removeItem('user');
  },
  
  loginFromStorage: async () => {
    const {
      token,
      setToken,
      user,
      setCurrency,
    } = get();
    
    if (token) return token;
    
    const storedToken = await Storage.getItem('token');
    
    if (storedToken) {
      setToken(storedToken);
    }

    if (!user) {
      const storedUser = await Storage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setCurrency(parsedUser.currency);
          set({ user: parsedUser });
        } catch (e) {
          console.error('Failed to parse stored user data');
        }
      }
    }

    return storedToken;
  },
  
  updateUser: async (userData) => {
    if (!userData) return;

    const {
      token,
      user,
      setCurrency
    } = get();
    
    if (!token || !user) return;
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: userData })
      };
    
      const req = await fetch(`${api}/users`, reqOptions);
      const jsonResponse = await req.json();
    
      if (req.status !== 200) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }
    
      const updatedUser = {
        ...user,
        ...userData
      };
 
      await Storage.setItem('user', JSON.stringify(updatedUser));
     
      if (userData.currency) {
        setCurrency(userData.currency);
      }

      set({ user: updatedUser });
    } finally {
      set({ isLoading: false });
    }
  },
  
  changePassword: async (currentPassword, newPassword, repeatNewPassword) => {
    const { token } = get();
    
    if (repeatNewPassword !== newPassword) {
      throw new Error('The new passwords do not match');
    }
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      };
    
      const req = await fetch(`${api}/users/change-password`, reqOptions);
      const jsonResponse = await req.json();
  
      if (req.status !== 200) {
        throw new Error(jsonResponse.message || 'An unexpected error occurred. Please try again later.');
      }
    
      return jsonResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Try again later.');
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteAccount: async () => {
    const { token, user } = get();
    
    if (!token || !user) return;
    
    set({ isLoading: true });
    
    try {
      const reqOptions = {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      };
  
      const req = await fetch(`${api}/users/${user.id}`, reqOptions);
      const jsonResponse = await req.json();
  
      if (req.status !== 200) {
        throw jsonResponse;
      }
  
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
});

