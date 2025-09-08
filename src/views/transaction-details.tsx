import Container from '@/src/components/container';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import GroupLabel from '@/src/components/group-label';
import TextBox from '@/src/components/text-box';
import ColLayout from '@/src/components/col-layout';
import TouchableBox from '@/src/components/touchable-box';
import Select from '@/src/components/select';
import DatePicker from 'react-native-date-picker';
import { useState, useEffect } from 'react';
import { useStore } from '@/src/stores/store';
import { Transaction, CategoryBudget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import Dialog from '@/src/helpers/alert';
import { UpdateTransactionSchema } from '@/src/validation-schemas/transaction.schemas';

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

type TransactionDetailsProps = Readonly<{
  setTitle: (title: string) => void;
}>;

export default function TransactionDetailsView(props: TransactionDetailsProps) {
  const transactions = useStore(state => state.transactions);
  const updateTransaction = useStore(state => state.updateTransaction);
  const deleteTransaction = useStore(state => state.deleteTransaction);
  const currentBudget = useStore(state => state.currentBudget);
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? parseInt(params.id[0]) : parseInt(params.id);
  const router = useRouter();
  const transaction = transactions.find((transaction: Transaction) => transaction.id === id);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(transaction ? new Date(transaction.date) : new Date());
  const [title, setTitle] = useState(transaction?.title);
  const [amount, setAmount] = useState(transaction?.amount.toString());
  const [isLoading, setIsLoading] = useState(false);

  const categoryOptions = getOptionsFromCategoryBudgets(currentBudget?.categoryBudgets);
  const [category, setCategory] = useState(categoryOptions.find(option => parseInt(option.value) === transaction?.categoryBudget?.id) || categoryOptions[0]);
  
  const errorBoundary = useErrorBoundary();

  if (props.setTitle) {
    useEffect(() => {
      props.setTitle(title);
    }, [title]);
  }

  const updateTransactionHandler = async (passedDate?: Date, category?: any) => {
    try {
      const updateObj: any = UpdateTransactionSchema.parse({
        id,
        title,
        amount
      });
  
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
  
      await updateTransaction(updateObj);
    } catch (error) {
      errorBoundary(error);
    }
  };

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
      `You are about to delete a transaction: \n${title} \nAre you sure?`,
      'Delete',
      () => deleteTransactionHandler()
    );
  }

  return (
    <Container>
      <ColLayout>
        <ColLayout spacing="m">
          <View>
            <GroupLabel>Title</GroupLabel>
            <TextBox value={title} onChangeText={setTitle} onBlur={() => updateTransactionHandler()} />
          </View>
          <View>
            <GroupLabel>Date</GroupLabel>
            <TouchableBox onPress={() => setOpen(true)} icon="calendar">{date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</TouchableBox>
            <DatePicker
              modal
              open={open}
              date={date}
              mode="date"
              onConfirm={(date) => {
                setOpen(false);
                setDate(date);
                updateTransactionHandler(date);
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
                updateTransactionHandler(undefined, category);
              }}
              items={categoryOptions}
              selectedItem={category}
            />
          </View>
          <View>
            <GroupLabel>Amount</GroupLabel>
            <TextBox value={amount} onChangeText={setAmount} onBlur={() => updateTransactionHandler()} />
          </View>
        </ColLayout>

        <TouchableBox isLoading={isLoading} color="danger" center={true} onPress={confirmDelete} icon="trash-bin">Delete Transaction</TouchableBox>   
      </ColLayout>
    </Container>
  );
};
