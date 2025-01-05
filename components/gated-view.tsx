import { GenericChildrenProps } from '@/types/generics';
import { useRootNavigationState, Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const GatedView = (props: GenericChildrenProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
      setIsLoading(false);
    };

    getToken();
  }, [setToken, setIsLoading]);

  if (token) return props.children;

  if (isLoading || !rootNavigationState?.key) return null;

  return <Redirect href="/(login)" />;
}

export default GatedView;
