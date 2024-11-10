import Heading from '@/components/heading';
import Select from '../../../components/select';
import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import { currencies } from '@/data/currencies';
import GroupLabel from '@/components/group-label';
import { View } from 'react-native';
import TouchableBox from '@/components/touchable-box';
import TextBox from '@/components/text-box';
import { useNavigation, Link, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Settings() {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const onChange = (obj: any) => {
    console.log('change', obj);
  };

  const selectItems = currencies.map(currency => ({
    label: `${currency.title} - ${currency.symbol}`,
    value: currency.iso }
  ));

  return (
    <Container>
      <ColLayout>
        <Heading>Settings</Heading>

        <ColLayout spacing='m'>
          <Heading level={2}>Preferences</Heading>
          <View>
            <GroupLabel>Currency</GroupLabel>
            <Select
              onValueChange={onChange}
              items={selectItems}
            />
          </View>
        </ColLayout>

        <ColLayout>
          <ColLayout spacing='m'>
          <Heading level={2}>User Details</Heading>
          <View>
            <GroupLabel>First Name</GroupLabel>
            <TextBox />
          </View>
          <View>
            <GroupLabel>Last Name</GroupLabel>
            <TextBox />
          </View>
          </ColLayout>
          <TouchableBox onPress={() => router.push('/(tabs)/settings/change-password')} icon="lock-closed" arrow={true}>Change Password</TouchableBox>   
        </ColLayout>
      </ColLayout>
    </Container>
  );
};
