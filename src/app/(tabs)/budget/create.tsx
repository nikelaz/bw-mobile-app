import Container from '@/src/components/container';
import { useStore } from '@/src/stores/store';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useState } from 'react';
import ColLayout from '@/src/components/col-layout';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import GroupLabel from '@/src/components/group-label';
import Select from '@/src/components/select';
import { Budget } from '@nikelaz/bw-shared-libraries';
import months from '@/data/months';
import TouchableBox from '@/src/components/touchable-box';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

const generateNewBudgetOptions = (budgetExistsForMonth: any) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;
  const newBudgetOptions = [];

  for (let i = 0; i < months.length; i++) {
    const optionDate = new Date();
    optionDate.setMonth(i);
    const budgetExists = budgetExistsForMonth(i);
    const isPast = now.getMonth() > i;

    if (budgetExists) continue;
    if (isPast && !budgetExists) continue;

    newBudgetOptions.push({
      label: `${months[i]} ${currentYear}`,
      value: optionDate.toISOString(),
    });
  }

  for (let i = 0; i < 3; i++) {
    const optionDate = new Date();
    optionDate.setFullYear(nextYear);
    optionDate.setMonth(i);

    newBudgetOptions.push({
      label: `${months[i]} ${nextYear}`,
      value: optionDate.toISOString(),
      disabled: false,
    });
  }

  return newBudgetOptions;
}

const CreateBudgetSchema = z.object({
  newBudget: z.object({ label: z.string(), value: z.string() }),
  copyFrom: z.object({ label: z.string(), value: z.string() }),
});

type CreateBudgetFormData = z.infer<typeof CreateBudgetSchema>;

export default function CreateBudget() {
  const budgets = useStore(state => state.budgets);
  const budgetExistsForMonth = useStore(state => state.budgetExistsForMonth);
  const createBudget = useStore(state => state.createBudget);
  const router = useRouter();
  const newBudgetOptions = generateNewBudgetOptions(budgetExistsForMonth);
  const copyFromItems = budgets.map((budget: Budget) => {
    const date = new Date(budget.month);
    return {
      value: budget.id.toString(),
      label: `${months[date.getMonth()]} ${date.getFullYear()}`
    };
  });

  const { control, handleSubmit } = useForm<CreateBudgetFormData>({
    defaultValues: {
      newBudget: newBudgetOptions[0],
      copyFrom: copyFromItems[0],
    },
    resolver: async (values) => {
      try {
        CreateBudgetSchema.parse(values);
        return { values, errors: {} };
      } catch (e: any) {
        return { values: {}, errors: e.formErrors?.fieldErrors || {} };
      }
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const errorBoundary = useErrorBoundary();

  const createBudgetHandler = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await createBudget({ month: data.newBudget.value }, { id: parseInt(data.copyFrom.value) });
      router.dismissTo('/(tabs)/budget');
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <View>
      <Stack.Screen options={{
        title: 'Create New Budget',
        headerBackButtonDisplayMode: 'minimal',
      }} />
      <Container>
        <ColLayout spacing='l'>
          <View>
            <GroupLabel>For Month</GroupLabel>
            <Controller
              control={control}
              name="newBudget"
              render={({ field: { onChange, value } }) => (
                <Select
                  items={newBudgetOptions}
                  selectedItem={value}
                  onValueChange={onChange}
                />
              )}
            />
          </View>
          <View>
            <GroupLabel>Copy From</GroupLabel>
            <Controller
              control={control}
              name="copyFrom"
              render={({ field: { onChange, value } }) => (
                <Select
                  items={copyFromItems}
                  selectedItem={value}
                  onValueChange={onChange}
                />
              )}
            />
          </View>
          <TouchableBox isLoading={isLoading} color="primary" center={true} icon='create-outline' onPress={createBudgetHandler}>Create</TouchableBox>
        </ColLayout>
      </Container>
    </View>
  );
}
