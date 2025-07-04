import Container from '@/src/components/container';
import { useStore } from '@/src/stores/store';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import TextBox from '@/src/components/text-box';
import { useState } from 'react';
import ColLayout from '@/src/components/col-layout';
import { CategoryType } from '@nikelaz/bw-shared-libraries';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import GroupLabel from '@/src/components/group-label';
import TouchableBox from '@/src/components/touchable-box';
import { CreateCategoryBudgetSchema } from '@/src/validation-schemas/category-budget.schemas';

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
  const currentBudget = useStore(state => state.currentBudget);
  const createCategoryBudget = useStore(state => state.createCategoryBudget);
  const params = useLocalSearchParams();
  const router = useRouter();
  const type = Array.isArray(params.type) ? parseInt(params.type[0]) : parseInt(params.type);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [accAmount, setAccAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const errorBoundary = useErrorBoundary();

  const formSubmitHandler = async () => {
    setIsLoading(true);

    try {
      const parsedInput = CreateCategoryBudgetSchema.parse({
        amount,
        title,
        accAmount,
      });

      await createCategoryBudget({
        amount: parsedInput.amount,
        category: {
          type,
          title: parsedInput.title,
          accAmount: parsedInput.accAmount
        },
        budget: currentBudget
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

          <TouchableBox isLoading={isLoading} icon='create-outline' color="primary" center={true} onPress={formSubmitHandler}>Create</TouchableBox>
        </ColLayout>
      </Container>
    </View>
  );
}
