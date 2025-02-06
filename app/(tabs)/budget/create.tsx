import Container from '@/components/container';
import { BudgetViewModel, useBudgetModel } from '@/view-models/budget-view-model';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useState } from 'react';
import ColLayout from '@/components/col-layout';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import GroupLabel from '@/components/group-label';
import Select from '@/components/select';
import { Budget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import TouchableBox from '@/components/touchable-box';

const generateNewBudgetOptions = (budgetModel: BudgetViewModel) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;
  const newBudgetOptions = [];

  for (let i = 0; i < months.length; i++) {
    const optionDate = new Date();
    optionDate.setMonth(i);
    const budgetExists = budgetModel.budgetExistsForMonth(i);
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
  const budgetModel = useBudgetModel();
  const router = useRouter();
  const errorBoundary = useErrorBoundary();
  const [isLoading, setIsLoading] = useState(false);
    
  const newBudgetOptions = generateNewBudgetOptions(budgetModel);
  const copyFromItems = budgetModel.budgets.map((budget: Budget) => {
    const date = new Date(budget.month);
    return {
      value: budget.id,
      label: `${months[date.getMonth()]} ${date.getFullYear()}`
    };
  });

  const [copyFrom, setCopyFrom] = useState(copyFromItems[0]);
  const [newBudget, setNewBudget] = useState(newBudgetOptions[0]);

  const createBudget = async () => {
    setIsLoading(true);
    try {
      await budgetModel.create({ month: newBudget.value }, { id: copyFrom.value });
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

          <TouchableBox isLoading={isLoading} icon='create' onPress={createBudget}>Create</TouchableBox>
        </ColLayout>
      </Container>
    </View>
  );
}
