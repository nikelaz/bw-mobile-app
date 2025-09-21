import { Stack, useRouter } from 'expo-router';
import Container from '@/src/components/container';
import { View } from 'react-native';
import ColLayout from '@/src/components/col-layout';
import { useStore } from '@/src/stores/store';
import { Budget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import LinkBox from '@/src/components/link-box';
import Dialog from '@/src/helpers/alert';
import SwipableTouchableBox, { SwipableTouchableBoxHandle } from '@/src/components/swipable-touchable-box';
import { useRef } from 'react';
import useErrorBoundary from '@/src/hooks/useErrorBoundary'; 

export default function SelectBudgetView() {
  const budgets = useStore(state => state.budgets);
  const deleteBudget = useStore(state => state.deleteBudget);
  const isLoading = useStore(state => state.isLoading);
  const setCurrentBudget = useStore(state => state.setCurrentBudget);
  const router = useRouter();
  const itemRefs = useRef<Record<string, SwipableTouchableBoxHandle | null>>({});
  const errorBoundary = useErrorBoundary();

  const changeBudgetPeriod = (budget: Budget) => {
    setCurrentBudget(budget);
    router.back();
  };

  const handleDeleteBudget = (budget: Budget) => {
    const date = new Date(budget.month);
    Dialog.confirm(
      'Delete Budget',
      `Are you sure you want to delete the budget for ${months[date.getMonth()]} ${date.getFullYear()}?`,
      'Delete',
      async () => {
        try {
          await deleteBudget(budget.id);
        } catch (error) {
          errorBoundary(error);
        }
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
        headerBackButtonDisplayMode: 'minimal',
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
                <SwipableTouchableBox
                  key={budget.id}
                  ref={(ref) => { itemRefs.current[budget.id] = ref; }}
                  onPress={() => {
                    resetOtherItems(budget.id.toString());
                    changeBudgetPeriod(budgetWithDate);
                  }}
                  onDelete={() => handleDeleteBudget(budget)}
                  onInteractionStart={() => resetOtherItems(budget.id.toString())}
                  isLoading={isLoading}
                  group={true}
                  groupFirst={index === 0}
                  groupLast={index === budgets.length - 1}
                >
                  {months[budgetDate.getMonth()]} {budgetDate.getFullYear()}
                </SwipableTouchableBox>
              )
            })}   
          </View>

          <LinkBox icon="add-outline" color="primary" center={true} href="/(tabs)/budget/create">Create New Budget</LinkBox>
        </ColLayout>
      </Container>
    </View>
    );
  }
