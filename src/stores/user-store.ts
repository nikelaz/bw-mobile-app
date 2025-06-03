import { create } from 'zustand';
import { useEffect } from 'react';
import { Currency, currencies } from '@/data/currencies';
import { api } from '@/config';
import Storage from '@/src/helpers/storage';

interface User {
  id: string;
  email: string;
  currency: string;
  [key: string]: any; // For other user properties
}

interface UserState {
  user: User | null;
  token: string | null;
  currency: string | null;
  cachedCurrency: Currency | null;
  isLoading: boolean;
  newItem: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setCurrency: (currency: string | null) => void;
  getCurrency: () => string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (user: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  initializeFromStorage: () => Promise<string | null>;
  update: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, repeatNewPassword: string) => Promise<any>;
  deleteAccount: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  token: null,
  currency: null,
  cachedCurrency: null,
  isLoading: false,
  
  setUser: (user) => set({ user }),
  
  setToken: (token) => set({ token }),
  
  setCurrency: (currency) => set({ currency }),
  
  getCurrency: () => {
    const { currency, cachedCurrency } = get();
    
    // Return from cache if possible
    if (cachedCurrency !== null && currency === cachedCurrency.iso) {
      return cachedCurrency.iso || cachedCurrency.symbol;
    }

    // Find the currency in our list
    const currencyObj = currencies.find(x => x.iso === currency);
    
    if (!currencyObj) return null;

    // Update cache
    set({ cachedCurrency: currencyObj });
    
    return currencyObj.iso || currencyObj.symbol;
  },
  
  login: async (email, password) => {
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

      set({
        token: jsonResponse.token,
        user: jsonResponse.user,
        currency: jsonResponse.user.currency
      });
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
    set({ token: null, user: null, currency: null });
    await Storage.removeItem('token');
    await Storage.removeItem('user');
  },
  
  initializeFromStorage: async () => {
    // Initialize from storage if we don't have a token yet
    const { token, user } = get();
    
    if (token) return token;
    
    const storedToken = await Storage.getItem('token');
    
    if (storedToken) {
      set({ token: storedToken });
    }

    if (!user) {
      const storedUser = await Storage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          set({ 
            user: parsedUser,
            currency: parsedUser.currency
          });
        } catch (e) {
          console.error('Failed to parse stored user data');
        }
      }
    }

    return storedToken;
  },
  
  update: async (userData) => {
    const { token, user } = get();
    
    if (!token || !userData) return;
    
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
      
      set({ 
        user: updatedUser,
        currency: userData.currency || get().currency,
      });
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
}));

// Hook to initialize the user store
export const useUserStoreInit = () => {
  const { initializeFromStorage } = useUserStore();
  
  useEffect(() => {
    initializeFromStorage();
  }, []);
  
  return useUserStore();
};
