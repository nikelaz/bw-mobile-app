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
import { Transaction, CategoryBudget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import Dialog from '@/src/helpers/alert';
import { UpdateTransactionSchema } from '@/src/validation-schemas/transaction.schemas';
import { useForm, Controller } from 'react-hook-form';

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

type TransactionDetailsFormData = {
  title: string;
  amount: string;
  category: { value: string; label: string };
};

export default function TransactionDetails() {
  const transactions = useStore(state => state.transactions);
  const updateTransaction = useStore(state => state.updateTransaction);
  const deleteTransaction = useStore(state => state.deleteTransaction);
  const currentBudget = useStore(state => state.currentBudget);
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? parseInt(params.id[0]) : parseInt(params.id);
  const router = useRouter();
  const transaction = transactions.find((transaction: Transaction) => transaction.id === id);
  const categoryOptions = getOptionsFromCategoryBudgets(currentBudget?.categoryBudgets);
  const { control, handleSubmit } = useForm<TransactionDetailsFormData>({
    defaultValues: {
      title: transaction?.title || '',
      amount: transaction?.amount?.toString() || '',
      category: categoryOptions.find(option => parseInt(option.value) === transaction?.categoryBudget?.id) || categoryOptions[0],
    },
  });
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(transaction ? new Date(transaction.date) : new Date());
  const [isLoading, setIsLoading] = useState(false);
  const errorBoundary = useErrorBoundary();
  const updateTransactionHandler = handleSubmit(async (data) => {
    try {
      const updateObj: any = UpdateTransactionSchema.parse({
        id,
        title: data.title,
        amount: data.amount,
      });
      updateObj.date = date.toISOString();
      updateObj.categoryBudget = { id: parseInt(data.category.value) };
      await updateTransaction(updateObj);
    } catch (error) {
      errorBoundary(error);
    }
  });

  const deleteTransactionHandler = async () => {
    setIsLoading(true);
    try {
      await deleteTransaction(id);
      router.dismissTo('/(tabs)/transactions');
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    Dialog.confirm(
      'Delete Transaction',
      `You are about to delete a transaction: \n${transaction?.title} \nAre you sure?`,
      'Delete',
      () => deleteTransactionHandler()
    );
  }

  return (
    <View>
      <Stack.Screen options={{
        title: transaction?.title,
        headerBackButtonDisplayMode: 'minimal',
      }} />
      <Container>
        <ColLayout>
          <ColLayout spacing="m">
            <View>
              <GroupLabel>Title</GroupLabel>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <TextBox value={value} onChangeText={onChange} onBlur={updateTransactionHandler} />
                )}
              />
            </View>
            <View>
              <GroupLabel>Date</GroupLabel>
              <TouchableBox onPress={() => setOpen(true)} icon="calendar">{date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</TouchableBox>
              <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                onConfirm={(dateVal) => {
                  setOpen(false);
                  setDate(dateVal);
                  updateTransactionHandler();
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
            <View>
              <GroupLabel>Category</GroupLabel>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <Select
                    onValueChange={onChange}
                    items={categoryOptions}
                    selectedItem={value}
                  />
                )}
              />
            </View>
            <View>
              <GroupLabel>Amount</GroupLabel>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <TextBox value={value} onChangeText={onChange} onBlur={updateTransactionHandler} />
                )}
              />
            </View>
          </ColLayout>
          <TouchableBox isLoading={isLoading} color="danger" center={true} onPress={confirmDelete} icon="trash-bin">Delete Transaction</TouchableBox>   
        </ColLayout>
      </Container>
    </View>      
  );
};
