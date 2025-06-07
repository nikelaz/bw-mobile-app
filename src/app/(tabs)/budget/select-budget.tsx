import Container from '@/src/components/container';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import ColLayout from '@/src/components/col-layout';
import { useStore } from '@/src/stores/store';
import { Budget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import BackButton from '@/src/components/back-button';
import LinkBox from '@/src/components/link-box';
import Dialog from '@/src/helpers/alert';
import SwipableBudgetItem, { SwipableBudgetItemHandle } from '@/src/components/swipable-budget-item';
import { useRef } from 'react';

export default function SelectBudget() {
  const budgets = useStore(state => state.budgets);
  const deleteBudget = useStore(state => state.deleteBudget);
  const isLoading = useStore(state => state.isLoading);
  const setCurrentBudget = useStore(state => state.setCurrentBudget);
  const router = useRouter();
  const params = useLocalSearchParams();
  const backText = (Array.isArray(params.backText) ? params.backText[0] : params.backText) || 'Budget';
  const backHref: any = (Array.isArray(params.backHref) ? params.backHref[0] : params.backHref) || '/(tabs)/budget';
  const itemRefs = useRef<Record<string, SwipableBudgetItemHandle | null>>({});

  const changeBudgetPeriod = (budget: Budget) => {
    setCurrentBudget(budget);
    backButtonHandler();
  };

  const backButtonHandler = () => {
    router.dismissTo('/(tabs)/budget');
    if (backHref !== '/(tabs)/budget') router.navigate(backHref);
  }

  const handleDeleteBudget = (budget: Budget) => {
    const date = new Date(budget.month);
    Dialog.confirm(
      'Delete Budget',
      `Are you sure you want to delete the budget for ${months[date.getMonth()]} ${date.getFullYear()}?`,
      'Delete',
      () => {
        deleteBudget(budget.id);
      }
    );
  };

  const resetOtherItems = (excludeId: string) => {
    Object.keys(itemRefs.current).forEach(id => {
      if (id !== excludeId && itemRefs.current[id]) {
        itemRefs.current[id]?.resetPosition();
      }
    });
  };

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
                <SwipableBudgetItem
                  key={budget.id}
                  ref={(ref) => { itemRefs.current[budget.id] = ref; }}
                  budget={budget}
                  onPress={() => {
                    resetOtherItems(budget.id.toString());
                    changeBudgetPeriod(budgetWithDate);
                  }}
                  onDelete={() => handleDeleteBudget(budget)}
                  onInteractionStart={() => resetOtherItems(budget.id.toString())}
                  isLoading={isLoading}
                  groupFirst={index === 0}
                  groupLast={index === budgets.length - 1}
                />
              )
            })}   
          </View>

          <LinkBox icon="add-outline" color="primary" center={true} href="/(tabs)/budget/create">Create New Budget</LinkBox>
        </ColLayout>
      </Container>
    </View>
  );
}
