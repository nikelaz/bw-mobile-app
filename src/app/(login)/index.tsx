import { useEffect, useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '@/src/stores/store';
import * as LocalAuthentication from 'expo-local-authentication';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import { View, Platform } from 'react-native';
import Logo from '@/src/components/logo';
import TouchableBox from '@/src/components/touchable-box';
import GroupLabel from '@/src/components/group-label';
import TextBox from '@/src/components/text-box';
import ColLayout from '@/src/components/col-layout';
import ConditionalRenderer from '@/src/components/conditional-renderer';
import SuccessBox from '@/src/components/success-box';
import Container from '@/src/components/container';
import { LoginSchema } from '@/src/validation-schemas/user-schemas';
import { TextInput } from 'react-native';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { OAuthProvider } from '@/src/constants/oauth-provider';
import * as AppleAuthentication from 'expo-apple-authentication';
import Hr from '@/src/components/hr';

export default function Login() {
  const router = useRouter();
  const token = useStore((state) => state.token);
  const login = useStore((state) => state.login);
  const oauth = useStore((state) => state.oauth);

  const params = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingApple, setIsLoadingApple] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const passwordInputRef = useRef<TextInput | null>(null);
  const errorBoundary = useErrorBoundary();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '158086281084-2ukh2g8718rf8r6k5honmkh8djem26bp.apps.googleusercontent.com', 
      iosClientId: '158086281084-aeh9cjqtu6ea8kqe3eke9fs627hlq7r8.apps.googleusercontent.com',
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
    setIsLoadingEmail(true);
    try {
      const parsedUser = LoginSchema.parse({ email, password });
      await login(parsedUser.email, parsedUser.password);
      router.navigate('/(tabs)/budget');
    } catch (error: any) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
      setIsLoadingEmail(false);
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
    setIsLoadingGoogle(true);
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
            errorBoundary(new Error('An unexpected error occurred while logging in. Please try again later.'));
        }        
      }
      else {
        errorBoundary(error);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingGoogle(false);
    }
  };

  const authWithApple = async () => {
    setIsLoading(true);
    setIsLoadingApple(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) {
        errorBoundary(new Error('An unexpected error occurred while logging in. Please try again later.'));
        setIsLoading(false);
        setIsLoadingApple(false);
        return;
      }

      await oauth(
        credential.identityToken,
        OAuthProvider.APPLE,
        credential.fullName?.givenName,
        credential.fullName?.familyName
      );
      router.navigate('/(tabs)/budget');
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        errorBoundary(new Error('An unexpected error occurred while logging in. Please try again later.'));
      }
    } finally {
      setIsLoading(false);
      setIsLoadingApple(false);
    }
  };

  return (
    <Container>
      <View style={{width: '100%', maxWidth: 420, margin: 'auto'}}>
        <ColLayout spacing="l">
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10}}>
            <Logo width={100} height={100} />
          </View>

          <ConditionalRenderer isVisible={Boolean(params.signed_up)}>          
            <SuccessBox>Account created successfully.</SuccessBox>
          </ConditionalRenderer>

          <ColLayout spacing="m">
            <ColLayout spacing="l">
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
            </ColLayout>
            <View>
              <TouchableBox
                icon="log-in-outline"
                onPress={formSubmitHandler}
                color="primary"
                center={true}
                disabled={isLoading}
                isLoading={isLoadingEmail}
              >
                Log In with Email
              </TouchableBox>
            </View>
          </ColLayout>

          <Hr />

          <ColLayout spacing="m">
            {Platform.OS === 'ios' ? (
              <TouchableBox
                icon="logo-apple"
                onPress={authWithApple}
                center={true}
                disabled={isLoading}
                isLoading={isLoadingApple}
              >
                Continue with Apple
              </TouchableBox>
            ) : null }
            <TouchableBox
              icon="logo-google"
              onPress={authWithGoogle}
              center={true}
              disabled={isLoading}
              isLoading={isLoadingGoogle}
            >
              Continue with Google
            </TouchableBox>
            <TouchableBox
              icon="mail-outline"
              onPress={() => router.navigate('/(login)/sign-up')}
              center={true}
              disabled={isLoading}
            >
              Sign Up with Email
            </TouchableBox>
          </ColLayout>
        </ColLayout>
      </View>
    </Container>
  );
}
