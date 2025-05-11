import { Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import { useUserModel } from '@/view-models/user-view-model';
import LoadingOverlay from './loading-overlay';

interface GenericChildrenProps {
  children: React.ReactNode;
}

const GatedView = (props: GenericChildrenProps) => {
  const userModel = useUserModel();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [localToken, setLocalToken] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchToken = async () => {
      try {
        const token = await userModel.getToken();
        if (isMounted) {
          setLocalToken(token);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching token:', error);
          setIsLoading(false);
        }
      }
    };

    fetchToken();

    return () => {
      isMounted = false;
    };
  }, [userModel]);

  if (isLoading) return <LoadingOverlay isVisible={true} />;

  if (localToken) return props.children;

  return <Redirect href="/(login)" />;
}

export default GatedView;
