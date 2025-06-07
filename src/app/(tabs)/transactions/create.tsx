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

type TransactionCreateFormData = {
  title: string;
  amount: string;
  category: { value: string; label: string };
};

export default function TransactionCreate() {
  const currentBudget = useStore(state => state.currentBudget);
  const params = useLocalSearchParams();
  const backText = (Array.isArray(params.backText) ? params.backText[0] : params.backText) || 'Transactions';
  const backHref: any = (Array.isArray(params.backHref) ? params.backHref[0] : params.backHref) || '/(tabs)/transactions';
  const router = useRouter();
  const categoryOptions = getOptionsFromCategoryBudgets(currentBudget?.categoryBudgets);
  const { control, handleSubmit } = useForm<TransactionCreateFormData>({
    defaultValues: {
      title: '',
      amount: '',
      category: categoryOptions[0],
    },
  });
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const errorBoundary = useErrorBoundary();
  const createTransaction = useStore(state => state.createTransaction);

  const createTransactionHandler = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const parsedInput = CreateTransactionSchema.parse({
        title: data.title,
        date: date.toISOString(),
        amount: data.amount,
        categoryBudgetId: data.category.value,
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
  });

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
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <TextBox value={value} onChangeText={onChange} />
                )}
              />
            </View>
            <View>
              <GroupLabel>Date</GroupLabel>
              <TouchableBox onPress={() => setOpen(true)} icon="calendar">{date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</TouchableBox>
              <DatePicker
                modal={true}
                open={open}
                date={date}
                mode="date"
                onConfirm={async (dateVal) => {
                  setOpen(false);
                  setDate(dateVal);
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
                  <TextBox value={value} onChangeText={onChange} />
                )}
              />
            </View>
          </ColLayout>
          <TouchableBox isLoading={isLoading} icon='create-outline' color="primary" center={true} onPress={createTransactionHandler}>Create</TouchableBox>
        </ColLayout>
      </Container>
    </View>
  );
};
