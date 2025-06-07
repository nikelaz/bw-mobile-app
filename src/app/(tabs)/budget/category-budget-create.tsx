import Container from '@/src/components/container';
import { useStore } from '@/src/stores/store';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import TextBox from '@/src/components/text-box';
import { useForm, Controller } from 'react-hook-form';
import ColLayout from '@/src/components/col-layout';
import { CategoryType } from '@nikelaz/bw-shared-libraries';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import TouchableBox from '@/src/components/touchable-box';
import { CreateCategoryBudgetSchema } from '@/src/validation-schemas/category-budget.schemas';
import { useState } from 'react';
import FormField from '@/src/components/form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

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

type CategoryBudgetFormData = z.infer<typeof CreateCategoryBudgetSchema>;

export default function CategoryBudgetCreate() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryBudgetFormData>({
    resolver: zodResolver(CreateCategoryBudgetSchema),
    defaultValues: {
      title: '',
      amount: '',
      accAmount: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const errorBoundary = useErrorBoundary();
  const router = useRouter();
  const currentBudget = useStore(state => state.currentBudget);
  const createCategoryBudget = useStore(state => state.createCategoryBudget);
  const params = useLocalSearchParams();
  const type = Array.isArray(params.type) ? parseInt(params.type[0]) : parseInt(params.type);

  const formSubmitHandler = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const parsedData = CreateCategoryBudgetSchema.parse(data);
      await createCategoryBudget({
        amount: parseFloat(parsedData.amount),
        category: {
          type,
          title: parsedData.title,
          accAmount: parseFloat(parsedData.accAmount || '0'),
        },
        budget: currentBudget
      });
      router.dismissTo('/(tabs)/budget');
      reset();
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <View>
      <Stack.Screen options={{
        title: getScreenTitle(type),
        headerBackButtonDisplayMode: 'minimal',
      }} />
      <Container>
        <ColLayout spacing='s'>
          <FormField label="Title" error={errors.title?.message}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <TextBox 
                  inputMode="text" 
                  value={value} 
                  onChangeText={onChange} 
                  placeholder={`e.g. ${getCategoryPlaceholder(type)}`}
                  isInvalid={Boolean(errors.title)}
                />
              )}
            />
          </FormField>

          <FormField label="Planned Amount" error={errors.amount?.message}>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <TextBox 
                  inputMode="decimal" 
                  value={value} 
                  onChangeText={onChange}
                  isInvalid={Boolean(errors.amount)}
                />
              )}
            />
          </FormField>

          {(type === CategoryType.SAVINGS || type === CategoryType.DEBT) && (
            <FormField label={type === CategoryType.DEBT ? 'Leftover Debt' : 'Accumulated'} error={errors.accAmount?.message}>
              <Controller
                control={control}
                name="accAmount"
                render={({ field: { onChange, value } }) => (
                  <TextBox 
                    inputMode="decimal"
                    value={value} 
                    onChangeText={onChange}
                    isInvalid={Boolean(errors.accAmount)}
                  />
                )}
              />
            </FormField>
          )}

          <TouchableBox 
            isLoading={isLoading} 
            icon='create-outline' 
            color="primary" 
            center={true} 
            onPress={formSubmitHandler}
          >
            Create
          </TouchableBox>
        </ColLayout>
      </Container>
    </View>
  );
}
