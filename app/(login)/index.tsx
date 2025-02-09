import { View } from 'react-native';
import GroupLabel from '@/components/group-label';
import TextBox from '@/components/text-box';
import ColLayout from '@/components/col-layout';
import Logo from '@/components/logo';
import TouchableBox from '@/components/touchable-box';
import { useRouter } from 'expo-router';
import { useUserModel } from '@/view-models/user-view-model';
import { useEffect, useState } from 'react';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import LinkButton from '@/components/link-button';
import { LoginSchema } from '@/validation-schemas/user-schemas';
import * as LocalAuthentication from 'expo-local-authentication';
import ConditionalRenderer from '@/components/conditional-renderer';
import SuccessBox from '@/components/success-box';
import { useLocalSearchParams } from 'expo-router';
import AndroidOffsetContainer from '@/components/android-offset-container';

export default function ChangePassword() {
  const router = useRouter();
  const userModel = useUserModel();
  const params = useLocalSearchParams();
  const [email, setEmail] = useState(params.email ? (Array.isArray(params.email) ? params.email[0] : params.email) : '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const errorBoundary = useErrorBoundary();
  

  useEffect(() => {
    (async () => {
      const token = await userModel.getToken();
      if (!token) return;
      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
        router.navigate('/(tabs)/budget');
      }
    })();
  }, []);
  
  const login = async () => {
    setIsLoading(true);
    try {
      const parsedUser = LoginSchema.parse({ email, password });
      await userModel.login(parsedUser.email, parsedUser.password);
      router.navigate('/(tabs)/budget');
    } catch (error: any) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AndroidOffsetContainer>
      <View style={{width: '100%', maxWidth: 420, margin: 'auto'}}>
        <ColLayout spacing="l">
          <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 30}}>
            <Logo width={100} height={100} />
          </View>

          <ConditionalRenderer isVisible={Boolean(params.signed_up)}>          
            <SuccessBox>Account created successfully.</SuccessBox>
          </ConditionalRenderer>

          <View>
            <GroupLabel>Email</GroupLabel>
            <TextBox autoComplete="email" textContentType="emailAddress" autoCorrect={false} inputMode="email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>
          <View>
            <GroupLabel>Password</GroupLabel>
            <TextBox autoComplete="off" textContentType="password" autoCorrect={false} autoCapitalize="none" value={password} onChangeText={setPassword} secureTextEntry={true} />
          </View>
          <View>
            <TouchableBox icon="log-in-outline" onPress={login} color="primary" center={true} isLoading={isLoading}>Login</TouchableBox>
          </View>
          <View style={{alignItems: 'center'}}>
            <LinkButton href="/(login)/sign-up">Sign Up</LinkButton>
          </View>
        </ColLayout>
      </View>
    </AndroidOffsetContainer>
  );
}
