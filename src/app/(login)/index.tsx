import { useEffect, useState, useRef } from 'react';
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
import { TextInput } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { OAuthProvider } from '@/src/constants/oauth-provider';

export default function Login() {
  const router = useRouter();
  const token = useStore((state) => state.token);
  const login = useStore((state) => state.login);
  const oauth = useStore((state) => state.oauth);

  const params = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const passwordInputRef = useRef<TextInput | null>(null);
  const errorBoundary = useErrorBoundary();

  useEffect(() => {
    GoogleSignin.configure({
        webClientId: '158086281084-mu2rkruhk9ak2qda8tcq5mjmvs16are8.apps.googleusercontent.com', 
        iosClientId: '158086281084-s93mumkllinl93ksnevmbgq36426r7qr.apps.googleusercontent.com',
      });
  }, []);
 
  useEffect(() => {
    (async () => {
      if (!token || isLoggingIn) return;
      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
        router.navigate('/(tabs)/budget');
      }
    })();
  }, [token, router]);

  useEffect(() => {
    if (Boolean(params.email) && !isLoggingIn) {
      setEmail(Array.isArray(params.email) ? params.email[0] : params.email);
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }
  }, [params.email]);
  
  const formSubmitHandler = async () => {
    setIsLoading(true);
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

  const proxyChangeHandler = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    return (text: string) => {
      setter(text);
      if (text.length > 0 && !isLoggingIn) {
        setIsLoggingIn(true);
      }
    };
  }

  const authWithGoogle = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        if (
             !response.data
          || !response.data.idToken
        ) {
          throw new Error('Unable to retrieve required account information from Google. Please check your Google account settings and try again.'); 
        }
        await oauth(response.data.idToken, OAuthProvider.GOOGLE);
        router.navigate('/(tabs)/budget');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            errorBoundary(new Error('Google Sign-In requires Google Play Services, which are missing on your device. Please install or update Google Play Services to continue.'));
            break;
          default:
            errorBoundary(new Error('An unexpected error occured while logging in. Please try again later.'));
        }        
      }
      else {
        errorBoundary(error);
      }
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
              onChangeText={proxyChangeHandler(setEmail)}
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
              ref={passwordInputRef}
              value={password}
              onChangeText={proxyChangeHandler(setPassword)}
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
          <GoogleSigninButton
            style={{width: '100%', height: 60}}
            color={GoogleSigninButton.Color.Light}
            onPress={authWithGoogle}
            disabled={isLoading}
          />
          <View style={{alignItems: 'center'}}>
            <LinkButton href="/(login)/sign-up">Sign Up</LinkButton>
          </View>
        </ColLayout>
      </View>
    </Container>
  );
}
