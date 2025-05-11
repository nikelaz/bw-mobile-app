import Heading from '@/src/components/heading';
import Select from '../../../components/select';
import ColLayout from '@/src/components/col-layout';
import { currencies, countries } from '@nikelaz/bw-shared-libraries';
import GroupLabel from '@/src/components/group-label';
import { View } from 'react-native';
import TouchableBox from '@/src/components/touchable-box';
import TextBox from '@/src/components/text-box';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useUserModel } from '@/src/view-models/user-view-model';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import { UserUpdateSchema } from '@/src/validation-schemas/user-schemas';
import Dialog from '@/src/helpers/alert';
import Container from '@/src/components/container';

export default function Settings() {
  const userModel = useUserModel();
  const navigation = useNavigation();
  const router = useRouter();
  const errorBoundary = useErrorBoundary();
  const [firstName, setFirstName] = useState(userModel.user.firstName);
  const [lastName, setLastName] = useState(userModel.user.lastName);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const currencyItems = currencies.map(currency => ({
    label: `${currency.title}`,
    value: currency.iso
  }));

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

  const deleteAccount = async () => {
    setIsDeleteLoading(true);
    try {
      await userModel.deleteAccount();
      router.navigate('/(login)');
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const secondaryDeleteConfirmation = () => {
    Dialog.confirm(
      'Delete Account',
      `This is permanent and you will lose all of your data \nAre you sure?`,
      'Yes, Delete',
      () => deleteAccount()
    );
  }

  const confirmDelete = () => {
    Dialog.confirm(
      'Delete Account',
      `You are about to delete your account.`,
      'Delete',
      () => secondaryDeleteConfirmation()
    );
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
          <TouchableBox onPress={() => router.navigate('/(tabs)/settings/change-password')} icon="lock-closed-outline" arrow={true}>Change Password</TouchableBox>
          <TouchableBox onPress={confirmDelete} icon="trash-outline" color="danger" isLoading={isDeleteLoading}>Delete Account</TouchableBox>
          <TouchableBox isLoading={isLogoutLoading} onPress={logout} icon="log-out-outline">Logout</TouchableBox>   
        </ColLayout>
      </ColLayout>
    </Container>
  );
};
