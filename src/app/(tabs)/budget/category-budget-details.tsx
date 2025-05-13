import Container from '@/src/components/container';
import { useBudgetStore } from '@/src/stores/budget-store';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { CategoryBudget, CategoryType } from '@nikelaz/bw-shared-libraries';
import GroupLabel from '@/src/components/group-label';
import TextBox from '@/src/components/text-box';
import { useState } from 'react';
import ColLayout from '@/src/components/col-layout';
import TouchableBox from '@/src/components/touchable-box';
import { useCategoryBudgetStore } from '@/src/stores/category-budget-store';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import Dialog from '@/src/helpers/alert';
import { CreateCategoryBudgetSchema } from '@/src/validation-schemas/category-budget.schemas';

export default function CategoryBudgetDetails() {
  const budgetStore = useBudgetStore();
  const categoryBudgetStore = useCategoryBudgetStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryBudgetId = Array.isArray(params.id) ? parseInt(params.id[0]) : parseInt(params.id);
  const categoryBudget: CategoryBudget = budgetStore.currentBudget.categoryBudgets.find((x: CategoryBudget) => x.id === categoryBudgetId);
  const [title, setTitle] = useState(categoryBudget?.category?.title);
  const [amount, setAmount] = useState(categoryBudget?.amount.toString());
  const [accAmount, setAccAmount] = useState(categoryBudget?.category?.accAmount?.toString());
  const errorBoundary = useErrorBoundary();
  const [isLoading, setIsLoading] = useState(false);

  if (!categoryBudget) return null;

  const updateCategoryBudget = async () => {
    try {
      const parsedInput = CreateCategoryBudgetSchema.parse({
        title,
        amount,
        accAmount,
      });

      await categoryBudgetStore.update({
        id: categoryBudget.id,
        category: {
          id: categoryBudget.category?.id,
          title: parsedInput.title,
          accAmount: parsedInput.accAmount,
        },
        amount: parsedInput.amount
      });
    } catch (error) {
      errorBoundary(error);
    }
  };

  const deleteCategoryBudget = async () => {
    setIsLoading(true);
    try {
      await categoryBudgetStore.delete({ id: categoryBudgetId });
      router.dismissTo('/(tabs)/budget');
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    Dialog.confirm(
      'Delete Category',
      `You are about to delete a category: \n${title} \nAre you sure?`,
      'Delete',
      () => deleteCategoryBudget()
    );
  }

  return (
    <View>
      <Stack.Screen options={{
        title: title,
        headerBackButtonDisplayMode: 'minimal',
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

          {categoryBudget.category?.type === CategoryType.SAVINGS || categoryBudget.category?.type === CategoryType.DEBT ? (
            <View>
              <GroupLabel>Accumulated</GroupLabel>
              <TextBox value={accAmount} onChangeText={setAccAmount} onBlur={(updateCategoryBudget)} />
            </View>
          ) : null}

          <View>
            <GroupLabel>Actual</GroupLabel>
            <TextBox value={categoryBudget.currentAmount.toString()} editable={false} />
          </View>

          <TouchableBox isLoading={isLoading} icon="trash-bin-outline" color="danger" center={true} onPress={confirmDelete}>Delete</TouchableBox>  
        </ColLayout>
      </Container>
    </View>
  );
}
