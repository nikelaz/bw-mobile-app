import Container from '@/src/components/container';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import GroupLabel from '@/src/components/group-label';
import TextBox from '@/src/components/text-box';
import ColLayout from '@/src/components/col-layout';
import TouchableBox from '@/src/components/touchable-box';
import Select from '@/src/components/select';
import DatePicker from 'react-native-date-picker';
import { useState } from 'react';
import { useStore } from '@/src/stores/store';
import { CategoryBudget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import BackButton from '@/src/components/back-button';
import { CreateTransactionSchema } from '@/src/validation-schemas/transaction.schemas';

const getOptionsFromCategoryBudgets = (categoryBudgets?: CategoryBudget[]) => {
  const categoriesMap: any = {};
  
  if (!categoryBudgets || categoryBudgets.length === 0) {
    return [];
  }

  categoryBudgets.forEach((categoryBudget: CategoryBudget) => {
    if (!categoryBudget.category) return;
    categoriesMap[categoryBudget.id] = categoryBudget.category.title;
  });
  
  return Object.keys(categoriesMap).map((key: any) => {
    return ({
      value: key,
      label: categoriesMap[key],
    });
  });
};

export default function TransactionCreate() {
  const createTransaction = useStore(state => state.createTransaction);
  const currentBudget = useStore(state => state.currentBudget);
  const params = useLocalSearchParams();
  const backText = (Array.isArray(params.backText) ? params.backText[0] : params.backText) || 'Transactions';
  const backHref: any = (Array.isArray(params.backHref) ? params.backHref[0] : params.backHref) || '/(tabs)/transactions';
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const categoryOptions = getOptionsFromCategoryBudgets(currentBudget?.categoryBudgets);
  const [category, setCategory] = useState(categoryOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  
  const errorBoundary = useErrorBoundary();

  const createTransactionHandler = async () => {
    setIsLoading(true);

    try {
      const parsedInput = CreateTransactionSchema.parse({
        title,
        date: date.toISOString(),
        amount,
        categoryBudgetId: category.value,
      });

      await createTransaction({
        title: parsedInput.title,
        date: new Date(parsedInput.date),
        amount: parsedInput.amount,
        categoryBudget: {
          id: parsedInput.categoryBudgetId,
        },
      });
      backButtonHandler();
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  }

  const backButtonHandler = () => {
    router.dismissTo('/(tabs)/transactions');

    if (backHref !== '/(tabs)/transactions') {
      router.navigate(backHref);
    }
  }

  return (
    <View>
      <Stack.Screen options={{
        title: 'Create New Transaction',
        headerLeft: () => (
          <BackButton aria-label={backText} onPress={backButtonHandler} />
        )
      }} />

      <Container>
        <ColLayout>
          <ColLayout spacing="m">
            <View>
              <GroupLabel>Title</GroupLabel>
              <TextBox value={title} onChangeText={setTitle} />
            </View>
            <View>
              <GroupLabel>Date</GroupLabel>
              <TouchableBox onPress={() => setOpen(true)} icon="calendar">{date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</TouchableBox>
              <DatePicker
                modal={true}
                open={open}
                date={date}
                mode="date"
                onConfirm={async (date) => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
            <View>
              <GroupLabel>Category</GroupLabel>
              <Select
                onValueChange={(category) => {
                  setCategory(category);
                }}
                items={categoryOptions}
                selectedItem={category}
              />
            </View>
            <View>
              <GroupLabel>Amount</GroupLabel>
              <TextBox value={amount} onChangeText={setAmount} />
            </View>
          </ColLayout>

          <TouchableBox isLoading={isLoading} icon='create-outline' color="primary" center={true} onPress={createTransactionHandler}>Create</TouchableBox>
        </ColLayout>
      </Container>
    </View>      
  );
};
