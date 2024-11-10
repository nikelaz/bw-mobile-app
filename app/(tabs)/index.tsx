import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import Heading from '@/components/heading';
import { View, Button } from 'react-native';
import TouchableBox from '@/components/touchable-box';
import { useRouter } from 'expo-router';
import { useState } from 'react';

enum AmountState {
  Planned = 1,
  Actual,
}

const getAmountStateCheckbox = (button: AmountState, state: AmountState) => {
  if (button === state) return 'checkmark-circle';
  return 'checkmark-circle-outline';
};

export default function Budget() {
  const router = useRouter();
  const isEnabled = false;
  const [amountState, setAmountState] = useState(AmountState.Planned);

  return (
    <Container>
      <ColLayout>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Heading>Budget</Heading>
          <Button title="+ New Transaction" />
        </View>
        
        <TouchableBox icon="calendar-clear" arrow={true}>November 2024</TouchableBox>

        <View style={{flexDirection: 'row'}}>
          <TouchableBox
            icon={getAmountStateCheckbox(AmountState.Planned, amountState)}
            rowGroup={true}
            rowGroupFirst={true}
            style={{flex: 1, justifyContent: 'center'}}
            onPress={() => setAmountState(AmountState.Planned)}
          >
            Planned
          </TouchableBox>
          <TouchableBox
            icon={getAmountStateCheckbox(AmountState.Actual, amountState)}
            rowGroup={true}
            rowGroupLast={true}
            style={{flex: 1, justifyContent: 'center'}}
            onPress={() => setAmountState(AmountState.Actual)}
          >
            Actual
          </TouchableBox>
        </View>
        
        <ColLayout spacing="m">
          <Heading level={2}>Income</Heading>
          <View>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Food%20@%20Billa&amount=$15.55&date=2024-1-12')} group={true} groupFirst={true} arrow={true} additionalText="$4800">Salary</TouchableBox>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Food%20@%20Lidl&amount=$35.40&date=2024-3-15')} group={true} arrow={true} additionalText="$350.80">Dividents</TouchableBox>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Electricity%20Bill&amount=$83.90&date=2024-1-12')} group={true} groupLast={true} arrow={true} additionalText="$250.40">Side Hustle</TouchableBox>
          </View>
        </ColLayout>

        <ColLayout spacing="m">
          <Heading level={2}>Expenses</Heading>
          <View>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Food%20@%20Billa&amount=$15.55&date=2024-1-12')} group={true} groupFirst={true} arrow={true} additionalText="$800">Groceries</TouchableBox>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Food%20@%20Lidl&amount=$35.40&date=2024-3-15')} group={true} arrow={true} additionalText="$350.80">Restaurants</TouchableBox>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Electricity%20Bill&amount=$83.90&date=2024-1-12')} group={true} groupLast={true} arrow={true} additionalText="$1000">Rent</TouchableBox>
          </View>
        </ColLayout>

        <ColLayout spacing="m">
          <Heading level={2}>Savings</Heading>
          <View>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Food%20@%20Billa&amount=$15.55&date=2024-1-12')} group={true} groupFirst={true} arrow={true} additionalText="$4800">Salary</TouchableBox>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Food%20@%20Lidl&amount=$35.40&date=2024-3-15')} group={true} arrow={true} additionalText="$350.80">Dividents</TouchableBox>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Electricity%20Bill&amount=$83.90&date=2024-1-12')} group={true} groupLast={true} arrow={true} additionalText="$250.40">Side Hustle</TouchableBox>
          </View>
        </ColLayout>

        <ColLayout spacing="m">
          <Heading level={2}>Debt</Heading>
          <View>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Food%20@%20Billa&amount=$15.55&date=2024-1-12')} group={true} groupFirst={true} arrow={true} additionalText="$4800">Salary</TouchableBox>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Food%20@%20Lidl&amount=$35.40&date=2024-3-15')} group={true} arrow={true} additionalText="$350.80">Dividents</TouchableBox>
            <TouchableBox onPress={() => router.push('/(tabs)/transactions/details?title=Electricity%20Bill&amount=$83.90&date=2024-1-12')} group={true} groupLast={true} arrow={true} additionalText="$250.40">Side Hustle</TouchableBox>
          </View>
        </ColLayout>
        
      </ColLayout>
    </Container>
  );
};
