import { Currency, currencies } from '@/data/currencies';
import { api } from '@/config';
import React, { useState, createContext, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import Storage from '@/src/helpers/storage';
import type { User } from '@nikelaz/bw-shared-libraries';

interface UserModelContextType {
  user: Partial<User> | null;
  setUser: React.Dispatch<React.SetStateAction<Partial<User> | null>>;
  currency: string | null;
  setCurrency: React.Dispatch<React.SetStateAction<string | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  error: string | null;
  getCurrency: () => string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (user: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
  update: (user: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, repeatNewPassword: string) => Promise<any>;
  deleteAccount: () => Promise<void>;
}

const UserModelContext = createContext<UserModelContextType | undefined>(undefined);

type UserModelContextProviderProps = Readonly<{
  children: React.ReactNode,
}>;

export const UserModelContextProvider = (props: UserModelContextProviderProps) => {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const cachedCurrencyRef = useRef<Currency | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStoredData = async () => {
      try {
        const storedToken = await Storage.getItem('token');
        if (isMounted && storedToken) {
          setToken(storedToken);
  
          const storedUser = await Storage.getItem('user');
          if (isMounted && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setCurrency(parsedUser.currency);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading stored data:', err);
        }
      }
    };
    
    loadStoredData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const getCurrency = useCallback(() => {
    if (cachedCurrencyRef.current !== null && currency === cachedCurrencyRef.current.iso) {
      if (cachedCurrencyRef.current.iso) {
        return cachedCurrencyRef.current.iso;
      }
      return cachedCurrencyRef.current.symbol;
    }

    const currencyObj = currencies.find(x => x.iso === currency);
   
    if (!currencyObj) return null;

    cachedCurrencyRef.current = currencyObj;
    
    if (currencyObj.iso) {
      return currencyObj.iso;
    }

    return currencyObj.symbol;
  }, [currency]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
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

      if (req.status !== 200) {
        throw new Error(jsonResponse.message || 'Login failed');
      }

      await Storage.setItem('token', jsonResponse.token);
      await Storage.setItem('user', JSON.stringify(jsonResponse.user));

      setToken(jsonResponse.token);
      setUser(jsonResponse.user);
      setCurrency(jsonResponse.user.currency);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during login');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData: Partial<User>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userData }),
      };
    
      const req = await fetch(`${api}/users`, reqOptions);
      const response = await req.json();
    
      if (req.status !== 200) {
        if (
          response.statusCode && 
          response.statusCode === 500 && 
          response.message?.includes('unique constraint')
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
    
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during signup');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      setToken(null);
      setUser(null);
      setCurrency(null);
      await Storage.removeItem('token');
      await Storage.removeItem('user');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (token) return token;
    
    try {
      const storedToken = await Storage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);

        if (!user) {
          const storedUser = await Storage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setCurrency(parsedUser.currency);
          }
        }
      }
      
      return storedToken;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      return null;
    }
  }, [token, user]);

  const update = useCallback(async (userData: Partial<User>): Promise<void> => {
    if (!token || !userData) return;
    
    setIsLoading(true);
    setError(null);
    
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
      setUser(updatedUser);
      
      if (userData.currency) {
        setCurrency(userData.currency);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while updating user information');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);
  
  const changePassword = useCallback(async (
    currentPassword: string, 
    newPassword: string, 
    repeatNewPassword: string
  ): Promise<any> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (repeatNewPassword !== newPassword) {
        throw new Error('The new passwords do not match');
      }
    
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
        setError(error.message);
      } else {
        setError('An unexpected error occurred while changing password');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const deleteAccount = useCallback(async (): Promise<void> => {
    if (!token || !user) return;
    
    setIsLoading(true);
    setError(null);
    
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
        throw new Error(jsonResponse.message || 'Failed to delete account');
      }
  
      await logout();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while deleting account');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token, user, logout]);

  const userModel = useMemo((): UserModelContextType => ({
    user,
    setUser,
    currency,
    setCurrency,
    token,
    setToken,
    isLoading,
    error,
    getCurrency,
    login,
    signup,
    logout,
    getToken,
    update,
    changePassword,
    deleteAccount
  }), [
    user,
    currency,
    token,
    isLoading,
    error,
    getCurrency,
    login,
    signup,
    logout,
    getToken,
    update,
    changePassword,
    deleteAccount
  ]);

  return (
    <UserModelContext.Provider value={userModel}>
      {props.children}
    </UserModelContext.Provider>
  );
};

export const useUserModel = (): UserModelContextType => {
  const context = useContext(UserModelContext);
  
  if (context === undefined) {
    throw new Error('useUserModel must be used within a UserModelContextProvider');
  }
  
  return context;
};
