import Container from '@/components/container';
import { useBudgetModel } from '@/view-models/budget-view-model';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { CategoryBudget } from '@/types/category-budget';
import GroupLabel from '@/components/group-label';
import TextBox from '@/components/text-box';
import { useState } from 'react';
import ColLayout from '@/components/col-layout';
import { CategoryType } from '@/types/category';
import TouchableBox from '@/components/touchable-box';
import { useCategoryBudgetModel } from '@/view-models/category-budget-view-model';
import useErrorBoundary from '@/hooks/useErrorBoundary';

export default function BudgetDetails() {
  const budgetModel = useBudgetModel();
  const categoryBudgetModel = useCategoryBudgetModel();
  const params = useLocalSearchParams();
  const categoryBudgetId = Array.isArray(params.id) ? parseInt(params.id[0]) : parseInt(params.id);
  const categoryBudget: CategoryBudget = budgetModel.currentBudget.categoryBudgets.find((x: CategoryBudget) => x.id === categoryBudgetId);
  const [title, setTitle] = useState(categoryBudget.category?.title);
  const [amount, setAmount] = useState(categoryBudget.amount.toString());
  const errorBoundary = useErrorBoundary();

  if (!categoryBudget) return 'Loading';

  console.log('categoryBudget', categoryBudget);

  const updateCategoryBudget = async () => {
    try {
      await categoryBudgetModel.updateCategoryBudget({
        id: categoryBudget.id,
        category: {
          id: categoryBudget.category?.id,
          title,
        },
        amount
      });
    } catch (error) {
      errorBoundary(error);
    }
  };

  return (
    <View>
      <Stack.Screen options={{
        title: title,
        headerBackTitle: 'Budget',
      }} />
      <Container>
        <ColLayout spacing='l'>
          <View>
            <GroupLabel>Title</GroupLabel>
            <TextBox value={title} onChangeText={setTitle} onBlur={updateCategoryBudget}/>
          </View>
          <View>
            <GroupLabel>Planned</GroupLabel>
            <TextBox value={amount} onChangeText={setAmount} onBlur={updateCategoryBudget}/>
          </View>
          <View>
            <GroupLabel>Actual</GroupLabel>
            <TextBox value={categoryBudget.currentAmount.toString()} editable={false} />
          </View>

          {categoryBudget.category?.type === CategoryType.SAVINGS || categoryBudget.category?.type === CategoryType.DEBT ? (
            <View>
              <GroupLabel>Accumulated</GroupLabel>
              <TextBox value={categoryBudget.category?.accAmount.toString()} editable={false} />
            </View>
          ) : null}

          <TouchableBox icon="trash-bin">Delete</TouchableBox>  
        </ColLayout>
      </Container>
    </View>
  );
}
