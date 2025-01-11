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
import { Transaction } from '@/types/transaction';
import { useBudgetModel } from '@/view-models/budget-view-model';
import { CategoryBudget } from '@/types/category-budget';
import months from '@/data/months';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import Dialog from '@/helpers/alert';
import { ThemedText } from '@/components/themed-text';

const getOptionsFromCategoryBudgets = (categoryBudgets: CategoryBudget[]) => {
  const categoriesMap: any = {};

  categoryBudgets.forEach((categoryBudget: CategoryBudget) => {
    if (!categoryBudget.category) return;
    categoriesMap[categoryBudget.category.id] = categoryBudget.category.title;
  });
  
  return Object.keys(categoriesMap).map((key: any) => {
    return ({
      value: key,
      label: categoriesMap[key],
    });
  });
};

export default function TransactionDetails() {
  const transactionsModel = useTransactionsModel();
  const budgetModel = useBudgetModel();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? parseInt(params.id[0]) : parseInt(params.id);
  const router = useRouter();
  const transaction = transactionsModel.transactions.find((transaction: Transaction) => transaction.id === id);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date(transaction?.date));
  const [title, setTitle] = useState(transaction?.title);
  const [amount, setAmount] = useState(transaction?.amount.toString());

  const categoryOptions = getOptionsFromCategoryBudgets(budgetModel.currentBudget.categoryBudgets);
  const [category, setCategory] = useState(categoryOptions.find(option => parseInt(option.value) === transaction?.categoryBudget.category.id) || categoryOptions[0]);
  
  const errorBoundary = useErrorBoundary();

  const updateTransaction = async (passedDate?: Date, category?: any) => {
    const updateObj: any = {
      id,
      title,
      amount: parseFloat(amount),
    };

    if (passedDate) {
      updateObj.date = passedDate.toISOString();
    } else {
      updateObj.date = date.toISOString()
    }

    if (category) {
      updateObj.categoryBudget = {
        id: parseInt(category.value),
      };
    }

    try {
      await transactionsModel.update(updateObj);
    } catch (error) {
      errorBoundary(error);
    }
  };

  const deleteTransaction = async () => {
    try {
      await transactionsModel.delete(id);
      router.push('/(tabs)/transactions');
    } catch (error) {
      errorBoundary(error);
    }
  };

  const confirmDelete = () => {
    Dialog.confirm(
      'Delete Transaction',
      `You are about to delete a transaction: \n${title} \nAre you sure?`,
      'Delete',
      () => deleteTransaction()
    );
  }

  if (!transaction) return <ThemedText>Loading...</ThemedText>;

  return (
    <View>
      <Stack.Screen options={{
        title: title,
        headerBackTitle: 'Transactions',
      }} />

      <Container>
        <ColLayout>
          <ColLayout spacing="m">
            <View>
              <GroupLabel>Title</GroupLabel>
              <TextBox value={title} onChangeText={setTitle} onBlur={() => updateTransaction()} />
            </View>
            <View>
              <GroupLabel>Date</GroupLabel>
              <TouchableBox onPress={() => setOpen(true)} icon="calendar">{date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</TouchableBox>
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                  setOpen(false);
                  setDate(date);
                  updateTransaction(date);
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
                  updateTransaction(undefined, category);
                }}
                items={categoryOptions}
                selectedItem={category}
              />
            </View>
            <View>
              <GroupLabel>Amount</GroupLabel>
              <TextBox value={amount} onChangeText={setAmount} onBlur={() => updateTransaction()} />
            </View>
          </ColLayout>
          <TouchableBox onPress={confirmDelete} icon="trash-bin">Delete Transaction</TouchableBox>   
        </ColLayout>
      </Container>
    </View>      
  );
};
