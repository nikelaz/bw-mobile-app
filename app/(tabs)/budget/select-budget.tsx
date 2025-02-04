import Container from '@/components/container';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import ColLayout from '@/components/col-layout';
import { useBudgetModel } from '@/view-models/budget-view-model';
import TouchableBox from '@/components/touchable-box';
import { Budget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import BackButton from '@/components/back-button';
import LinkBox from '@/components/link-box';

export default function SelectBudget() {
  const budgetModel = useBudgetModel();
  const router = useRouter();
  const params = useLocalSearchParams();
  const backText = (Array.isArray(params.backText) ? params.backText[0] : params.backText) || 'Budget';
  const backHref: any = (Array.isArray(params.backHref) ? params.backHref[0] : params.backHref) || '/(tabs)/budget';

  if (!budgetModel) return null;

  const changeBudgetPeriod = (budget: Budget) => {
    budgetModel.setCurrentBudget(budget);
    backButtonHandler();
  };

  const backButtonHandler = () => {
    router.dismissTo('/(tabs)/budget');
    if (backHref !== '/(tabs)/budget') router.navigate(backHref);
  }

  return (
    <View>
      <Stack.Screen options={{
        title: 'Select Budget Period',
        headerLeft: () => (
          <BackButton label={backText} onPress={backButtonHandler} />
        )
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

          <LinkBox icon="add-outline" href="/(tabs)/budget/create">Create New Budget</LinkBox>
        </ColLayout>
      </Container>
    </View>
  );
}
