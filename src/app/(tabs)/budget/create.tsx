import Container from '@/src/components/container';
import { useStore } from '@/src/stores/store';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useState } from 'react';
import ColLayout from '@/src/components/col-layout';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import GroupLabel from '@/src/components/group-label';
import Select from '@/src/components/select';
import { Budget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import TouchableBox from '@/src/components/touchable-box';

const generateNewBudgetOptions = (budgetExistsForMonth: any) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;
  const newBudgetOptions = [];

  for (let i = 0; i < months.length; i++) {
    const optionDate = new Date();
    optionDate.setMonth(i);
    const budgetExists = budgetExistsForMonth(i);
    const isPast = now.getMonth() > i;

    if (budgetExists) continue;
    if (isPast && !budgetExists) continue;

    newBudgetOptions.push({
      label: `${months[i]} ${currentYear}`,
      value: optionDate.toISOString(),
    });
  }

  for (let i = 0; i < 3; i++) {
    const optionDate = new Date();
    optionDate.setFullYear(nextYear);
    optionDate.setMonth(i);

    newBudgetOptions.push({
      label: `${months[i]} ${nextYear}`,
      value: optionDate.toISOString(),
      disabled: false,
    });
  }

  return newBudgetOptions;
}

export default function CreateBudget() {
  const budgets = useStore(state => state.budgets);
  const budgetExistsForMonth = useStore(state => state.budgetExistsForMonth);
  const createBudget = useStore(state => state.createBudget);
  const router = useRouter();
  const errorBoundary = useErrorBoundary();
  const [isLoading, setIsLoading] = useState(false);
    
  const newBudgetOptions = generateNewBudgetOptions(budgetExistsForMonth);
  const copyFromItems = budgets.map((budget: Budget) => {
    const date = new Date(budget.month);
    return {
      value: budget.id.toString(),
      label: `${months[date.getMonth()]} ${date.getFullYear()}`
    };
  });

  const [copyFrom, setCopyFrom] = useState(copyFromItems[0]);
  const [newBudget, setNewBudget] = useState(newBudgetOptions[0]);

  const createBudgetHandler = async () => {
    setIsLoading(true);
    try {
      await createBudget({ month: newBudget.value }, { id: parseInt(copyFrom.value) });
      router.dismissTo('/(tabs)/budget');
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Stack.Screen options={{
        title: 'Create New Budget',
        headerBackButtonDisplayMode: 'minimal',
      }} />
      <Container>
        <ColLayout spacing='l'>
          <View>
            <GroupLabel>For Month</GroupLabel>
            <Select
              items={newBudgetOptions}
              selectedItem={newBudget}
              onValueChange={val => setNewBudget(val)}
            />
          </View>

          <View>
            <GroupLabel>Copy From</GroupLabel>
            <Select
              items={copyFromItems}
              selectedItem={copyFrom}
              onValueChange={val => setCopyFrom(val)}
            />
          </View>

          <TouchableBox isLoading={isLoading} color="primary" center={true} icon='create-outline' onPress={createBudgetHandler}>Create</TouchableBox>
        </ColLayout>
      </Container>
    </View>
  );
}
