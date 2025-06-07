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
import { useStore } from '@/src/stores/store';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import { UserUpdateSchema } from '@/src/validation-schemas/user-schemas';
import Dialog from '@/src/helpers/alert';
import Container from '@/src/components/container';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type UserUpdateFormData = z.infer<typeof UserUpdateSchema> & { country: string };

export default function Settings() {
  const user = useStore(state => state.user);
  const updateUser = useStore(state => state.updateUser);
  const deleteAccount = useStore(state => state.deleteAccount);
  const logout = useStore(state => state.logout);

  const navigation = useNavigation();
  const router = useRouter();
  const errorBoundary = useErrorBoundary();
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

  const { control, handleSubmit } = useForm<UserUpdateFormData>({
    resolver: zodResolver(UserUpdateSchema.extend({ country: z.string().min(1) })),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      country: user?.country || countryItems[0].value,
      currency: currencyItems.find(c => c.value === user?.currency)?.value || currencyItems[0].value,
    },
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const updateUserHandler = handleSubmit(async (data) => {
    try {
      if (!user || !user.id) throw new Error('User not loaded');
      await updateUser({ id: user.id, ...data });
    } catch (error) {
      errorBoundary(error);
    }
  });

  const logoutHandler = async () => {
    setIsLogoutLoading(true);

    try {
      await logout();
      router.replace('/(login)');
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLogoutLoading(false);
    }
  }

  const deleteAccountHandler = async () => {
    setIsDeleteLoading(true);
    try {
      await deleteAccount();
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
      () => deleteAccountHandler()
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
            <Controller
              control={control}
              name="currency"
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={(val) => {
                    onChange(val.value);
                    updateUserHandler();
                  }}
                  items={currencyItems}
                  selectedItem={currencyItems.find(c => c.value === value) || currencyItems[0]}
                />
              )}
            />
          </View>
        </ColLayout>

        <ColLayout>
          <ColLayout spacing='m'>
          <Heading level={2}>User Details</Heading>
          <View>
            <GroupLabel>First Name</GroupLabel>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <TextBox value={value} onChangeText={onChange} onBlur={updateUserHandler} />
              )}
            />
          </View>
          <View>
            <GroupLabel>Last Name</GroupLabel>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <TextBox value={value} onChangeText={onChange} onBlur={updateUserHandler} />
              )}
            />
          </View>
          <View>
            <GroupLabel>Country</GroupLabel>
            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={(item) => { onChange(item.value); updateUserHandler(); }}
                  items={countryItems}
                  selectedItem={countryItems.find(c => c.value === value) || countryItems[0]}
                />
              )}
            />
          </View>
          </ColLayout>
          <TouchableBox onPress={() => router.navigate('/(tabs)/settings/change-password')} icon="lock-closed-outline" arrow={true}>Change Password</TouchableBox>
          <TouchableBox onPress={confirmDelete} icon="trash-outline" color="danger" isLoading={isDeleteLoading}>Delete Account</TouchableBox>
          <TouchableBox isLoading={isLogoutLoading} onPress={logoutHandler} icon="log-out-outline">Logout</TouchableBox>   
        </ColLayout>
      </ColLayout>
    </Container>
  );
};
