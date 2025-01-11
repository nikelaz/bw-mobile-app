import Container from '@/components/container';
import { useBudgetModel } from '@/view-models/budget-view-model';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import TextBox from '@/components/text-box';
import { useState } from 'react';
import ColLayout from '@/components/col-layout';
import { CategoryType } from '@/types/category';
import { useCategoryBudgetModel } from '@/view-models/category-budget-view-model';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import Button from '@/components/button';
import GroupLabel from '@/components/group-label';

const getCategoryPlaceholder = (type: CategoryType) => {
  switch (type) {
    case CategoryType.INCOME:
      return 'Salary';
    case CategoryType.EXPENSE:
      return 'Groceries';
    case CategoryType.SAVINGS:
      return 'College Fund';
    case CategoryType.DEBT:
      return 'Mortgage';
  }
};

const getScreenTitle = (type: CategoryType) => {
  const shared = 'Create New';

  switch (type) {
    case CategoryType.INCOME:
      return `${shared} Income`;
    case CategoryType.EXPENSE:
      return `${shared} Category`;
    case CategoryType.SAVINGS:
      return `${shared} Fund`;
    case CategoryType.DEBT:
      return `${shared} Loan`;
  }
};

export default function CategoryBudgetCreate() {
  const budgetModel = useBudgetModel();
  const categoryBudgetModel = useCategoryBudgetModel();
  const params = useLocalSearchParams();
  const router = useRouter();
  const type = Array.isArray(params.type) ? parseInt(params.type[0]) : parseInt(params.type);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [accAmount, setAccAmount] = useState('');
  const errorBoundary = useErrorBoundary();

  const createCategoryBudget = async () => {
    try {
      await categoryBudgetModel.create({
        amount: parseFloat(amount),
        category: {
          type,
          title,
          accAmount: accAmount ? parseFloat(accAmount) : undefined
        },
        budget: budgetModel.currentBudget
      });

      router.push('/(tabs)/budget');
    } catch (error) {
      errorBoundary(error);
    }
  };

  return (
    <View>
      <Stack.Screen options={{
        title: getScreenTitle(type),
        headerBackButtonDisplayMode: 'minimal',
      }} />
      <Container>
        <ColLayout spacing='l'>
          <View>
            <GroupLabel>Title</GroupLabel>
            <TextBox value={title} onChangeText={setTitle} placeholder={`e.g. ${getCategoryPlaceholder(type)}`} />
          </View>

          <View>
            <GroupLabel>Planned Amount</GroupLabel>
            <TextBox value={amount} onChangeText={setAmount} />
          </View>

          {type === CategoryType.SAVINGS || type === CategoryType.DEBT ? (
            <View>
              <GroupLabel>{type === CategoryType.DEBT ? 'Leftover Debt' : 'Accumulated'}</GroupLabel>
              <TextBox
                value={accAmount}
                onChangeText={setAccAmount}
              />
            </View>
          ) : null}

          <Button onPress={createCategoryBudget}>Save Changes</Button>
        </ColLayout>
      </Container>
    </View>
  );
}
