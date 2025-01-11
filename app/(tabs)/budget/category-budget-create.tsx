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
  const type = parseInt(params.type[0]) || CategoryType.EXPENSE;
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
        headerBackTitle: 'Budget',
      }} />
      <Container>
        <ColLayout spacing='l'>
          <TextBox value={title} onChangeText={setTitle} placeholder={`Category (e.g. ${getCategoryPlaceholder(type)})`} />
          <TextBox value={amount} onChangeText={setAmount} placeholder="Planned Amount" />

          {type === CategoryType.SAVINGS || type === CategoryType.DEBT ? (
            <TextBox
              value={accAmount}
              onChangeText={setAccAmount}
              placeholder={type === CategoryType.DEBT ? 'Leftover Debt' : 'Accumulated'}
            />
          ) : null}

          <Button onPress={createCategoryBudget}>Save Changes</Button>
        </ColLayout>
      </Container>
    </View>
  );
}
