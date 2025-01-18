import Heading from '@/components/heading';
import Select from '../../../components/select';
import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import { currencies } from '@/data/currencies';
import { countries } from '@/data/countries';
import GroupLabel from '@/components/group-label';
import { View } from 'react-native';
import TouchableBox from '@/components/touchable-box';
import TextBox from '@/components/text-box';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useUserModel } from '@/view-models/user-view-model';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import { UserUpdateSchema } from '@/validation-schemas/user-schemas';

export default function Settings() {
  const userModel = useUserModel();
  const navigation = useNavigation();
  const router = useRouter();
  const errorBoundary = useErrorBoundary();
  const [firstName, setFirstName] = useState(userModel.user.firstName);
  const [lastName, setLastName] = useState(userModel.user.lastName);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const currencyItems = currencies.map(currency => ({
    label: `${currency.title}`,
    value: currency.iso }
  ));

  const countryItems = countries.map(country => ({
    label: country,
    value: country
  }));

  const initialCurrency = currencyItems.find(currency => currency.value === userModel.user.currency);
  const initialCountry = countryItems.find(country => country.value === userModel.user.country);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const updateUser = async (updateObj: any) => {
    try {
      const parsedInput = UserUpdateSchema.parse({
        firstName,
        lastName,
      });

      userModel.update({
        ...userModel.user,
        ...parsedInput,
        ...updateObj,
      });
    } catch (error) {
      errorBoundary(error);
    }
  };

  const logout = async () => {
    setIsLogoutLoading(true);

    try {
      await userModel.logout();
      router.replace('/(login)');
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLogoutLoading(false);
    }
  }

  return (
    <Container>
      <ColLayout>
        <Heading>Settings</Heading>

        <ColLayout spacing='m'>
          <Heading level={2}>Preferences</Heading>
          <View>
            <GroupLabel>Currency</GroupLabel>
            <Select
              onValueChange={(val) => updateUser({ currency: val.value })}
              items={currencyItems}
              selectedItem={initialCurrency || currencyItems[0]}
            />
          </View>
        </ColLayout>

        <ColLayout>
          <ColLayout spacing='m'>
          <Heading level={2}>User Details</Heading>
          <View>
            <GroupLabel>First Name</GroupLabel>
            <TextBox value={firstName} onChangeText={setFirstName} onBlur={() =>  updateUser({firstName})}/>
          </View>
          <View>
            <GroupLabel>Last Name</GroupLabel>
            <TextBox value={lastName} onChangeText={setLastName} onBlur={() => updateUser({lastName})}/>
          </View>
          <View>
            <GroupLabel>Country</GroupLabel>
            <Select
              onValueChange={(item) => updateUser({country: item.value})}
              items={countryItems}
              selectedItem={initialCountry || countryItems[0]}
            />
          </View>
          </ColLayout>
          <TouchableBox onPress={() => router.navigate('/(tabs)/settings/change-password')} icon="lock-closed" arrow={true}>Change Password</TouchableBox>
          <TouchableBox isLoading={isLogoutLoading} onPress={logout} icon="log-out">Logout</TouchableBox>   
        </ColLayout>
      </ColLayout>
    </Container>
  );
};
