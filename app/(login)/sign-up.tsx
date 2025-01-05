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
import UserSchema from '@/validation-schemas/user-schema';

export default function ChangePassword() {
  const router = useRouter();
  const userModel = useUserModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const errorBoundary = useErrorBoundary();

  const countrySelectData = countries.map(country => ({ label: country, value: country }));

  const signup = async () => {
    try {
      const parsedUser = UserSchema.parse({ email, password, repeatPassword, firstName, lastName, country });
      if (parsedUser.password !== parsedUser.repeatPassword) {
        throw new Error('The two passwords do not match');
      }
      await userModel.signup(parsedUser);
      router.navigate('/(login)');
    } catch (error: any) {
      errorBoundary(error);
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
          <TextBox value={email} onChangeText={setEmail} />
        </View>
        <View>
          <GroupLabel>First Name</GroupLabel>
          <TextBox value={firstName} onChangeText={setFirstName} />
        </View>
        <View>
          <GroupLabel>Last Name</GroupLabel>
          <TextBox value={lastName} onChangeText={setLastName} />
        </View>
        <View>
          <GroupLabel>Password</GroupLabel>
          <TextBox value={password} onChangeText={setPassword} secureTextEntry={true} />
        </View>
        <View>
          <GroupLabel>Repeat Password</GroupLabel>
          <TextBox value={repeatPassword} onChangeText={setRepeatPassword} secureTextEntry={true} />
        </View>
        <View>
          <GroupLabel>Country</GroupLabel>
          <Select
            onValueChange={(e) => setCountry(e.value)}
            items={countrySelectData}
          />
        </View>
        <View>
          <TouchableBox onPress={signup} arrow={true}>Sign Up</TouchableBox>
        </View>
      </ColLayout>
    </Container>
  );
}
