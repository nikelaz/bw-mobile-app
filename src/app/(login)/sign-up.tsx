import Container from '@/src/components/container';
import { View } from 'react-native';
import GroupLabel from '@/src/components/group-label';
import TextBox from '@/src/components/text-box';
import ColLayout from '@/src/components/col-layout';
import TouchableBox from '@/src/components/touchable-box';
import { useRouter, Stack } from 'expo-router';
import { useUserStore } from '@/src/stores/user-store';
import { useState } from 'react';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import Select from '@/src/components/select';
import { countries } from '@nikelaz/bw-shared-libraries';
import { SignUpSchema } from '@/src/validation-schemas/user-schemas';

export default function ChangePassword() {
  const router = useRouter();
  const userStore = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const countrySelectData = countries.map(country => ({ label: country, value: country }));
  const [country, setCountry] = useState(countrySelectData[0]);
  const errorBoundary = useErrorBoundary();
  const [isLoading, setIsLoading] = useState(false);

  const signup = async () => {
    setIsLoading(true);

    try {
      const parsedUser = SignUpSchema.parse({ email, password, repeatPassword, firstName, lastName, country: country.value });
      if (parsedUser.password !== parsedUser.repeatPassword) {
        throw new Error('The two passwords do not match');
      }
      await userStore.signup(parsedUser);
      router.navigate(`/(login)?signed_up=true&email=${email}`);
    } catch (error: any) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <ColLayout spacing="l">
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
        <View>
          <GroupLabel>First Name</GroupLabel>
          <TextBox
            value={firstName}
            onChangeText={setFirstName}
            aria-label="first name input"
            autoComplete="name-given"
            textContentType="givenName"
            inputMode="text"
            autoCapitalize="words"
          />
        </View>
        <View>
          <GroupLabel>Last Name</GroupLabel>
          <TextBox
            value={lastName}
            onChangeText={setLastName}
            aria-label="last name input"
            autoComplete="name-family"
            textContentType="familyName"
            inputMode="text"
            autoCapitalize="words"
          />
        </View>
        <View>
          <GroupLabel>Password</GroupLabel>
          <TextBox
            value={password}
            onChangeText={setPassword}
            aria-label="password input"
            autoComplete="off"
            textContentType="newPassword"
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>
        <View>
          <GroupLabel>Repeat Password</GroupLabel>
          <TextBox 
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            aria-label="repeat password input"
            autoComplete="off"
            textContentType="password"
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>
        <View>
          <GroupLabel>Country</GroupLabel>
          <Select
            aria-label="country select"
            onValueChange={(e) => setCountry(countrySelectData.find(item => item.value === e.value) || countrySelectData[0])}
            items={countrySelectData}
            selectedItem={country}
          />
        </View>
        <View>
          <TouchableBox
            onPress={signup}
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
