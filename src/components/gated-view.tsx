import { Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import { useStore } from '@/src/stores/store';
import LoadingOverlay from './loading-overlay';

type GatedViewProps = Readonly<{
  children: React.ReactNode,
}>;

const GatedView = (props: GatedViewProps) => {
  const token = useStore(state => state.token);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [localToken, setLocalToken] = useState<string | null>(null);

  useEffect(() => {
    setLocalToken(token);
    setIsLoading(false);
  }, [token]);

  if (isLoading) return <LoadingOverlay isVisible={true} />;

  if (localToken) return props.children;

  return <Redirect href="/(login)" />;
}

export default GatedView;
