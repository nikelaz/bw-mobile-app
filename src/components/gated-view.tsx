import { Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/src/stores/user-store';
import LoadingOverlay from './loading-overlay';

type GatedViewProps = Readonly<{
  children: React.ReactNode,
}>;

const GatedView = (props: GatedViewProps) => {
  const userStore = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [localToken, setLocalToken] = useState<string | null>(null);

  useEffect(() => {
    const token = userStore.token;
    setLocalToken(token);
    setIsLoading(false);
  }, [userStore.token]);

  if (isLoading) return <LoadingOverlay isVisible={true} />;

  if (localToken) return props.children;

  return <Redirect href="/(login)" />;
}

export default GatedView;
