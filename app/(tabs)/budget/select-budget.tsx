import Container from '@/components/container';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import ColLayout from '@/components/col-layout';
import { useBudgetModel } from '@/view-models/budget-view-model';
import TouchableBox from '@/components/touchable-box';
import { Budget } from '@/types/budget';
import months from '@/data/months';

export default function SelectBudget() {
  const budgetModel = useBudgetModel();
  const router = useRouter();

  if (!budgetModel) return <p>Loading</p>;

  const changeBudgetPeriod = (budget: Budget) => {
    budgetModel.setCurrentBudget(budget);
    router.push('/(tabs)/budget');
  };

  return (
    <View>
      <Stack.Screen options={{
        title: 'Select Budget Period',
        headerBackTitle: 'Budget',
      }} />

      <Container>
        <ColLayout spacing="l">
          <View>
            {budgetModel.budgets.map((budget: Budget, index: number) => {
              const budgetDate = new Date(budget.month);
              const budgetWithDate: Budget = {
                ...budget,
                month: budgetDate,
              };

              return (
                <TouchableBox
                  group={true}
                  groupFirst={index === 0}
                  groupLast={index === budgetModel.budgets.length - 1}
                  arrow={false}
                  key={budget.id}
                  onPress={() => changeBudgetPeriod(budgetWithDate)}
                >
                  {months[budgetDate.getMonth()]} {budgetDate.getFullYear()}
                </TouchableBox>
              )
            })}   
          </View>
        </ColLayout>
      </Container>
    </View>
  );
}
