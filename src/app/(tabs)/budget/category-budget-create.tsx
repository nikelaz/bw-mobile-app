import Container from '@/components/container';
import { useBudgetModel } from '@/view-models/budget-view-model';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import TextBox from '@/components/text-box';
import { useState } from 'react';
import ColLayout from '@/components/col-layout';
import { CategoryType } from '@nikelaz/bw-shared-libraries';
import { useCategoryBudgetModel } from '@/view-models/category-budget-view-model';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import GroupLabel from '@/components/group-label';
import TouchableBox from '@/components/touchable-box';
import { CreateCategoryBudgetSchema } from '@/validation-schemas/category-budget.schemas';

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
  const [isLoading, setIsLoading] = useState(false);
  const errorBoundary = useErrorBoundary();

  const createCategoryBudget = async () => {
    setIsLoading(true);

    try {
      const parsedInput = CreateCategoryBudgetSchema.parse({
        amount,
        title,
        accAmount,
      });

      await categoryBudgetModel.create({
        amount: parsedInput.amount,
        category: {
          type,
          title: parsedInput.title,
          accAmount: parsedInput.accAmount
        },
        budget: budgetModel.currentBudget
      });

      router.dismissTo('/(tabs)/budget');
      setTitle('');
      setAmount('');
      setAccAmount('');
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
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
            <TextBox inputMode="text" value={title} onChangeText={setTitle} placeholder={`e.g. ${getCategoryPlaceholder(type)}`} />
          </View>

          <View>
            <GroupLabel>Planned Amount</GroupLabel>
            <TextBox inputMode="decimal" value={amount} onChangeText={setAmount} />
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

          <TouchableBox isLoading={isLoading} icon='create-outline' color="primary" center={true} onPress={createCategoryBudget}>Create</TouchableBox>
        </ColLayout>
      </Container>
    </View>
  );
}
