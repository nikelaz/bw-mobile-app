import Container from '@/src/components/container';
import { View } from 'react-native';
import TextBox from '@/src/components/text-box';
import ColLayout from '@/src/components/col-layout';
import TouchableBox from '@/src/components/touchable-box';
import { useRouter, Stack } from 'expo-router';
import { useStore } from '@/src/stores/store';
import { useState } from 'react';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import FormField from '@/src/components/form-field';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import Select from '@/src/components/select';
import { countries } from '@nikelaz/bw-shared-libraries';
import { SignUpSchema } from '@/src/validation-schemas/user-schemas';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type SignUpFormData = z.infer<typeof SignUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const signup = useStore(state => state.signup);
  const countrySelectData = countries.map(country => ({ label: country, value: country }));
  const errorBoundary = useErrorBoundary();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
      firstName: '',
      lastName: '',
      country: countrySelectData[0].value,
    },
  });

  const formSubmitHandler = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      if (data.password !== data.repeatPassword) {
        throw new Error('The two passwords do not match');
      }
      await signup(data);
      router.navigate(`/(login)?signed_up=true&email=${data.email}`);
    } catch (error: any) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Container>
      <Stack.Screen options={{
        title: 'Sign Up',
        headerBackTitle: 'Login',
        headerStyle: {
          backgroundColor: useThemeColor({ light: 'white', dark: 'background' }, 'background'),
        },
        headerTitleStyle: {
          color: useThemeColor({ light: 'black', dark: 'text' }, 'text'),
        }
      }} />
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
        <FormField label="First Name" error={errors.firstName?.message}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <TextBox
                value={value}
                onChangeText={onChange}
                aria-label="first name input"
                autoComplete="name-given"
                textContentType="givenName"
                inputMode="text"
                autoCapitalize="words"
                isInvalid={Boolean(errors.firstName)}
              />
            )}
          />
        </FormField>
        <FormField label="Last Name" error={errors.lastName?.message}>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <TextBox
                value={value}
                onChangeText={onChange}
                aria-label="last name input"
                autoComplete="name-family"
                textContentType="familyName"
                inputMode="text"
                autoCapitalize="words"
                isInvalid={Boolean(errors.lastName)}
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
                value={value}
                onChangeText={onChange}
                aria-label="password input"
                autoComplete="off"
                textContentType="newPassword"
                autoCapitalize="none"
                secureTextEntry={true}
                isInvalid={Boolean(errors.password)}
              />
            )}
          />
        </FormField>
        <FormField label="Repeat Password" error={errors.repeatPassword?.message}>
          <Controller
            control={control}
            name="repeatPassword"
            render={({ field: { onChange, value } }) => (
              <TextBox
                value={value}
                onChangeText={onChange}
                aria-label="repeat password input"
                autoComplete="off"
                textContentType="password"
                autoCapitalize="none"
                secureTextEntry={true}
                isInvalid={Boolean(errors.repeatPassword)}
              />
            )}
          />
        </FormField>
        <FormField label="Country" error={errors.country?.message}>
          <Controller
            control={control}
            name="country"
            render={({ field: { onChange, value } }) => (
              <Select
                aria-label="country select"
                onValueChange={(e) => onChange(e.value)}
                items={countrySelectData}
                selectedItem={countrySelectData.find(item => item.value === value) || countrySelectData[0]}
              />
            )}
          />
        </FormField>
        <View>
          <TouchableBox
            onPress={formSubmitHandler}
            icon="create-outline"
            center={true}
            color="primary"
            isLoading={isLoading}
          >
            Sign Up
          </TouchableBox>
        </View>
      </ColLayout>
    </Container>
  );
}
