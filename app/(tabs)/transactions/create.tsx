import Container from '@/components/container';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import GroupLabel from '@/components/group-label';
import TextBox from '@/components/text-box';
import ColLayout from '@/components/col-layout';
import TouchableBox from '@/components/touchable-box';
import Select from '@/components/select';
import DatePicker from 'react-native-date-picker';
import { useState } from 'react';
import { useTransactionsModel } from '@/view-models/transactions-view-model';
import { useBudgetModel } from '@/view-models/budget-view-model';
import { CategoryBudget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import BackButton from '@/components/back-button';
import { CreateTransactionSchema } from '@/validation-schemas/transaction.schemas';

const getOptionsFromCategoryBudgets = (categoryBudgets: CategoryBudget[]) => {
  const categoriesMap: any = {};

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
  const transactionsModel = useTransactionsModel();
  const budgetModel = useBudgetModel();
  const params = useLocalSearchParams();
  const backText = (Array.isArray(params.backText) ? params.backText[0] : params.backText) || 'Transactions';
  const backHref: any = (Array.isArray(params.backHref) ? params.backHref[0] : params.backHref) || '/(tabs)/transactions';
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const categoryOptions = getOptionsFromCategoryBudgets(budgetModel.currentBudget.categoryBudgets);
  const [category, setCategory] = useState(categoryOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  
  const errorBoundary = useErrorBoundary();

  const createTransaction = async () => {
    setIsLoading(true);

    try {
      const parsedInput = CreateTransactionSchema.parse({
        title,
        date: date.toISOString(),
        amount,
        categoryBudgetId: category.value,
      });

      await transactionsModel.create({
        title: parsedInput.title,
        date: parsedInput.date,
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
          <BackButton label={backText} onPress={backButtonHandler} />
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

          <TouchableBox isLoading={isLoading} icon='create' onPress={createTransaction}>Create</TouchableBox>
        </ColLayout>
      </Container>
    </View>      
  );
};
