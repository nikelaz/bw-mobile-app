import { Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import { useUserModel } from '@/view-models/user-view-model';

const GatedView = (props: GenericChildrenProps) => {
  const userModel = useUserModel();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [localToken, setLocalToken] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await userModel.getToken();
      setLocalToken(token);
      setIsLoading(false);
    })()
  }, [setLocalToken, setIsLoading]);

  if (localToken) return props.children;

  if (isLoading) return null;

  return <Redirect href="/(login)" />;
}

export default GatedView;
