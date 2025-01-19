import Container from '@/components/container';
import { View } from 'react-native';
import GroupLabel from '@/components/group-label';
import TextBox from '@/components/text-box';
import ColLayout from '@/components/col-layout';
import TouchableBox from '@/components/touchable-box';
import { useRouter } from 'expo-router';
import { useUserModel } from '@/view-models/user-view-model';
import { useState } from 'react';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import Select from '@/components/select';
import { countries } from '@/data/countries';
import { SignUpSchema } from '@/validation-schemas/user-schemas';

export default function ChangePassword() {
  const router = useRouter();
  const userModel = useUserModel();
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
      await userModel.signup(parsedUser);
      router.navigate('/(login)');
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
          <TextBox autoComplete="email" textContentType="emailAddress" autoCorrect={false} inputMode="email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        </View>
        <View>
          <GroupLabel>First Name</GroupLabel>
          <TextBox autoComplete="name-given" textContentType="givenName" inputMode="text" autoCapitalize="none" value={firstName} onChangeText={setFirstName} />
        </View>
        <View>
          <GroupLabel>Last Name</GroupLabel>
          <TextBox autoComplete="name-family" textContentType="familyName" inputMode="text" autoCapitalize="none" value={lastName} onChangeText={setLastName} />
        </View>
        <View>
          <GroupLabel>Password</GroupLabel>
          <TextBox autoComplete="off" textContentType="newPassword" autoCapitalize="none" value={password} onChangeText={setPassword} secureTextEntry={true} />
        </View>
        <View>
          <GroupLabel>Repeat Password</GroupLabel>
          <TextBox autoComplete="off" textContentType="password" autoCapitalize="none" value={repeatPassword} onChangeText={setRepeatPassword} secureTextEntry={true} />
        </View>
        <View>
          <GroupLabel>Country</GroupLabel>
          <Select
            onValueChange={(e) => setCountry(countrySelectData.find(item => item.value === e.value) || countrySelectData[0])}
            items={countrySelectData}
            selectedItem={country}
          />
        </View>
        <View>
          <TouchableBox onPress={signup} arrow={true} isLoading={isLoading}>Sign Up</TouchableBox>
        </View>
      </ColLayout>
    </Container>
  );
}
