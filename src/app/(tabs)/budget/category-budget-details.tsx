import Container from '@/src/components/container';
import { useStore } from '@/src/stores/store';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { CategoryBudget, CategoryType, Transaction, CurrencyFormatter } from '@nikelaz/bw-shared-libraries';
import GroupLabel from '@/src/components/group-label';
import TextBox from '@/src/components/text-box';
import { useState, useRef } from 'react';
import ColLayout from '@/src/components/col-layout';
import TouchableBox from '@/src/components/touchable-box';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import Dialog from '@/src/helpers/alert';
import { CreateCategoryBudgetSchema } from '@/src/validation-schemas/category-budget.schemas';
import SwipableTouchableBox, { SwipableTouchableBoxHandle } from '@/src/components/swipable-touchable-box';
import Heading from '@/src/components/heading';
import Hr from '@/src/components/hr';

export default function CategoryBudgetDetails() {
  const currentBudget = useStore(state => state.currentBudget);
  const updateCategoryBudget = useStore(state => state.updateCategoryBudget);
  const deleteCategoryBudget = useStore(state => state.deleteCategoryBudget);
  const deleteTransaction = useStore(state => state.deleteTransaction);
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryBudgetId = Array.isArray(params.id) ? parseInt(params.id[0]) : parseInt(params.id);
  const categoryBudget = currentBudget?.categoryBudgets?.find((x: CategoryBudget) => x.id === categoryBudgetId);
  const [title, setTitle] = useState(categoryBudget?.category?.title);
  const [amount, setAmount] = useState(categoryBudget?.amount.toString());
  const [accAmount, setAccAmount] = useState(categoryBudget?.category?.accAmount?.toString());
  const errorBoundary = useErrorBoundary();
  const [isLoading, setIsLoading] = useState(false);
  const itemRefs = useRef<Record<string, SwipableTouchableBoxHandle | null>>({});
  const getCurrency = useStore(state => state.getCurrency);
  const currency = getCurrency();
  const currencyFormatter = new CurrencyFormatter(currency);
  
  if (!categoryBudget) return null;

  const updateCategoryBudgetHandler = async () => {
    try {
      const parsedInput = CreateCategoryBudgetSchema.parse({
        title,
        amount,
        accAmount,
      });

      await updateCategoryBudget({
        id: categoryBudget.id,
        category: {
          id: categoryBudget.category?.id,
          title: parsedInput.title,
          accAmount: parsedInput.accAmount,
        },
        amount: parsedInput.amount
      });
    } catch (error) {
      errorBoundary(error);
    }
  };

  const deleteCategoryBudgetHandler = async () => {
    setIsLoading(true);
    try {
      await deleteCategoryBudget({ id: categoryBudgetId });
      router.dismissTo('/(tabs)/budget');
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    Dialog.confirm(
      'Delete Category',
      `You are about to delete a category: \n${title} \nAre you sure?`,
      'Delete',
      () => deleteCategoryBudgetHandler()
    );
  }

  const handleDeleteTransaction = (transaction: Transaction) => {
    Dialog.confirm(
      'Delete Transaction',
      `Are you sure you want to delete: ${transaction.title}?`,
      'Delete',
      async () => {
        try {
          await deleteTransaction(transaction.id);
        } catch (error) {
          console.error('Error deleting transaction:', error);
        }
      }
    );
  };

  const resetOtherItems = (excludeId: string) => {
    Object.keys(itemRefs.current).forEach(id => {
      if (id !== excludeId && itemRefs.current[id]) {
        itemRefs.current[id]?.resetPosition();
      }
    });
  };

  return (
    <View>
      <Stack.Screen options={{
        title: title,
        headerBackButtonDisplayMode: 'minimal',
      }} />
      <Container>
        <ColLayout spacing='xl'>
          <ColLayout spacing='l'>
            <View>
              <GroupLabel>Title</GroupLabel>
              <TextBox value={title} onChangeText={setTitle} onBlur={updateCategoryBudgetHandler}/>
            </View>

            <View>
              <GroupLabel>Planned</GroupLabel>
              <TextBox value={amount} onChangeText={setAmount} onBlur={updateCategoryBudgetHandler}/>
            </View>

            {categoryBudget.category?.type === CategoryType.SAVINGS || categoryBudget.category?.type === CategoryType.DEBT ? (
              <View>
                <GroupLabel>Accumulated</GroupLabel>
                <TextBox value={accAmount} onChangeText={setAccAmount} onBlur={(updateCategoryBudgetHandler)} />
              </View>
            ) : null}

            <View>
              <GroupLabel>Actual</GroupLabel>
              <TextBox value={categoryBudget.currentAmount.toString()} editable={false} />
            </View>

            <TouchableBox isLoading={isLoading} icon="trash-bin-outline" color="danger" center={true} onPress={confirmDelete}>Delete Category</TouchableBox>  
          </ColLayout>

          { categoryBudget.transactions && categoryBudget.transactions.length > 0 ? (
            <>
              <Hr />
              <ColLayout spacing="l">
                <Heading level={2}>{title} Transactions</Heading>
                <View>
                  {categoryBudget.transactions.map((transaction: Transaction, index: number) => (
                    <SwipableTouchableBox
                      key={transaction.id}
                      ref={(ref) => { itemRefs.current[transaction.id.toString()] = ref; }}
                      onPress={() => {
                        resetOtherItems(transaction.id.toString());
                        router.navigate(`/budget/transaction-details?id=${transaction.id}`);
                      }}
                      onDelete={() => handleDeleteTransaction(transaction)}
                      onInteractionStart={() => resetOtherItems(transaction.id.toString())}
                      isLoading={isLoading}
                      groupFirst={index === 0}
                      groupLast={index === (categoryBudget.transactions?.length || 0) - 1}
                      arrow={true}
                      additionalText={currencyFormatter.format(transaction.amount)}
                    >
                      {transaction.title}
                    </SwipableTouchableBox>
                  ))}
                </View>
              </ColLayout>
            </>
          ) : null }
        </ColLayout>
      </Container>
    </View>
  );
}
