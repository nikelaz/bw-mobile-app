import Container from '@/src/components/container';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import ColLayout from '@/src/components/col-layout';
import { useStore } from '@/src/stores/store';
import TouchableBox from '@/src/components/touchable-box';
import { Budget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import BackButton from '@/src/components/back-button';
import LinkBox from '@/src/components/link-box';

export default function SelectBudget() {
  const budgets = useStore(state => state.budgets);
  const setCurrentBudget = useStore(state => state.setCurrentBudget);
  const router = useRouter();
  const params = useLocalSearchParams();
  const backText = (Array.isArray(params.backText) ? params.backText[0] : params.backText) || 'Budget';
  const backHref: any = (Array.isArray(params.backHref) ? params.backHref[0] : params.backHref) || '/(tabs)/budget';

  const changeBudgetPeriod = (budget: Budget) => {
    setCurrentBudget(budget);
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
          <BackButton aria-label={backText} onPress={backButtonHandler} />
        )
      }} />

      <Container>
        <ColLayout spacing="l">
          <View>
            {budgets.map((budget: Budget, index: number) => {
              const budgetDate = new Date(budget.month);
              const budgetWithDate: Budget = {
                ...budget,
                month: budgetDate,
              };

              return (
                <TouchableBox
                  group={true}
                  groupFirst={index === 0}
                  groupLast={index === budgets.length - 1}
                  arrow={false}
                  key={budget.id}
                  onPress={() => changeBudgetPeriod(budgetWithDate)}
                >
                  {months[budgetDate.getMonth()]} {budgetDate.getFullYear()}
                </TouchableBox>
              )
            })}   
          </View>

          <LinkBox icon="add-outline" color="primary" center={true} href="/(tabs)/budget/create">Create New Budget</LinkBox>
        </ColLayout>
      </Container>
    </View>
  );
}
