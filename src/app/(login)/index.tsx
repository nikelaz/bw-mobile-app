import { useEffect, useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '@/src/stores/store';
import * as LocalAuthentication from 'expo-local-authentication';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import { View } from 'react-native';
import Logo from '@/src/components/logo';
import TouchableBox from '@/src/components/touchable-box';
import TextBox from '@/src/components/text-box';
import ColLayout from '@/src/components/col-layout';
import LinkButton from '@/src/components/link-button';
import ConditionalRenderer from '@/src/components/conditional-renderer';
import FeedbackBox from '@/src/components/feedback-box';
import Container from '@/src/components/container';
import FormField from '@/src/components/form-field';
import { LoginSchema } from '@/src/validation-schemas/user-schemas';
import { TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type LoginFormData = z.infer<typeof LoginSchema>;

export default function Login() {
  const router = useRouter();
  const token = useStore((state) => state.token);
  const login = useStore((state) => state.login);

  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const passwordInputRef = useRef<TextInput | null>(null);
  const errorBoundary = useErrorBoundary();

  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');
 
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
      const emailValue = Array.isArray(params.email) ? params.email[0] : params.email;
      setValue('email', emailValue);
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }
  }, [params.email, setValue]);
  
  const formSubmitHandler = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      router.navigate('/(tabs)/budget');
    } catch (error: any) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  });

  const handleFieldChange = () => {
    if ((watchedEmail.length > 0 || watchedPassword.length > 0) && !isLoggingIn) {
      setIsLoggingIn(true);
    }
  };

  useEffect(() => {
    handleFieldChange();
  }, [watchedEmail, watchedPassword]);

  return (
    <Container>
      <View style={{width: '100%', maxWidth: 420, margin: 'auto'}}>
        <ColLayout spacing="m">
          <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 30}}>
            <Logo width={100} height={100} />
          </View>

          <ConditionalRenderer isVisible={Boolean(params.signed_up)}>          
            <FeedbackBox color="success">Account created successfully.</FeedbackBox>
          </ConditionalRenderer> 

          <ColLayout spacing="s">
            <FormField label="Email" error={errors.email?.message}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextBox
                    value={value}
                    onChangeText={onChange}
                    aria-label="email input"
                    autoComplete="email"
                    textContentType="emailAddress"
                    inputMode="email"
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none"
                    isInvalid={Boolean(errors.email)}
                  />
                )}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextBox
                    ref={passwordInputRef}
                    value={value}
                    onChangeText={onChange}
                    aria-label="password input"
                    textContentType="password"
                    secureTextEntry={true}
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoComplete="off"
                    isInvalid={Boolean(errors.password)}
                  />
                )}
              />
            </FormField>
          </ColLayout> 

          <View style={{marginTop: 20}}>
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
