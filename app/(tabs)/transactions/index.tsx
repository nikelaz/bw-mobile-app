import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import Heading from '@/components/heading';
import { View } from 'react-native';
import TouchableBox from '@/components/touchable-box';
import { useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';

export default function Transactions() {
  const navigation = useNavigation();
  const router = useRouter();
  

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <Container>
      <ColLayout>
        <Heading>Transactions</Heading>

        <View>
          <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Food%20@%20Billa&amount=$15.55&date=2024-1-12')} group={true} groupFirst={true} arrow={true} additionalText="$15.55">Food @ Billa</TouchableBox>
          <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Food%20@%20Lidl&amount=$35.40&date=2024-3-15')} group={true} arrow={true} additionalText="$35.40">Food @ Lidl</TouchableBox>
          <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Electricity%20Bill&amount=$83.90&date=2024-1-12')} group={true} arrow={true} additionalText="$83.90">Electricity Bill</TouchableBox>
          <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Fuel%20@%20OMV&amount=$15.55&date=2024-1-12')} group={true} groupLast={true} arrow={true} additionalText="$112.90">Fuel @ OMV</TouchableBox>
        </View>
      </ColLayout>
    </Container>
  );
};
