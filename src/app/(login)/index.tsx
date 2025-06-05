import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '@/src/stores/store';
import * as LocalAuthentication from 'expo-local-authentication';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import { View } from 'react-native';
import Logo from '@/src/components/logo';
import TouchableBox from '@/src/components/touchable-box';
import GroupLabel from '@/src/components/group-label';
import TextBox from '@/src/components/text-box';
import ColLayout from '@/src/components/col-layout';
import LinkButton from '@/src/components/link-button';
import ConditionalRenderer from '@/src/components/conditional-renderer';
import SuccessBox from '@/src/components/success-box';
import Container from '@/src/components/container';
import { LoginSchema } from '@/src/validation-schemas/user-schemas';

export default function Login() {
  const router = useRouter();
  const token = useStore((state) => state.token);
  const login = useStore((state) => state.login);

  const params = useLocalSearchParams();
  const [email, setEmail] = useState(params.email ? (Array.isArray(params.email) ? params.email[0] : params.email) : '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const errorBoundary = useErrorBoundary();
  
  useEffect(() => {
    (async () => {
      if (!token || isLoggingIn) return;
      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
        router.navigate('/(tabs)/budget');
      }
    })();
  }, [token, router]);
  
  const formSubmitHandler = async () => {
    setIsLoading(true);
    setIsLoggingIn(true);
    try {
      const parsedUser = LoginSchema.parse({ email, password });
      await login(parsedUser.email, parsedUser.password);
      router.navigate('/(tabs)/budget');
    } catch (error: any) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
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
            <TextBox
              value={email}
              onChangeText={setEmail}
              aria-label="email input"
              autoComplete="email"
              textContentType="emailAddress"
              inputMode="email"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <GroupLabel>Password</GroupLabel>
            <TextBox
              value={password}
              onChangeText={setPassword}
              aria-label="password input"
              textContentType="password"
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              autoComplete="off"
            />
          </View>
          <View>
            <TouchableBox icon="log-in-outline" onPress={formSubmitHandler} color="primary" center={true} isLoading={isLoading}>Login</TouchableBox>
          </View>
          <View style={{alignItems: 'center'}}>
            <LinkButton href="/(login)/sign-up">Sign Up</LinkButton>
          </View>
        </ColLayout>
      </View>
    </Container>
  );
}
