import ColLayout from '@/src/components/col-layout';
import Heading from '@/src/components/heading';
import { View } from 'react-native';
import TouchableBox from '@/src/components/touchable-box';
import React, { useState, useRef, useEffect } from 'react';
import LinkButton from '@/src/components/link-button';
import GatedView from '@/src/components/gated-view';
import { useStore } from '@/src/stores/store';
import months from '@/data/months';
import { CategoryType, CurrencyFormatter, CategoryBudget } from '@nikelaz/bw-shared-libraries';
import { useRouter } from 'expo-router';
import { LoadingLine } from '@/src/components/loading-line';
import ConditionalRenderer from '@/src/components/conditional-renderer';
import Container from '@/src/components/container';
import SwipableTouchableBox, { SwipableTouchableBoxHandle } from '@/src/components/swipable-touchable-box';
import Dialog from '@/src/helpers/alert';

enum AmountState {
  Planned = 1,
  Actual,
}

const getAmountStateCheckbox = (button: AmountState, state: AmountState) => {
  if (button === state) return 'checkmark-circle';
  return 'checkmark-circle-outline';
};

export default function Budget() {
  const getCurrency = useStore(state => state.getCurrency);
  const currentBudget = useStore(state => state.currentBudget);
  const categoryBudgetsByType = useStore(state => state.categoryBudgetsByType);
  const deleteCategoryBudget = useStore(state => state.deleteCategoryBudget);
  const [amountState, setAmountState] = useState(AmountState.Planned);
  const router = useRouter();
  const cachedCurrency = useStore(state => state.cachedCurrency);
  let currency = getCurrency();
  const currencyFormatter = new CurrencyFormatter(currency);
  const itemRefs = useRef<Record<string, SwipableTouchableBoxHandle | null>>({});
  const [isSwipeToDeleteLoading, setIsSwipeToDeleteLoading] = useState(false);

  useEffect(() => {
    currency = getCurrency();
  }, [cachedCurrency]);

  const handleDeleteCategoryBudget = (categoryBudget: CategoryBudget) => {
    Dialog.confirm(
      'Delete Category',
      `Are you sure you want to delete: ${categoryBudget.category?.title}?`,
      'Delete',
      async () => {
        setIsSwipeToDeleteLoading(true);
        try {
          await deleteCategoryBudget({ id: categoryBudget.id });
        }
        catch (error) {
          console.error('Error deleting category budget:', error);
        }
        finally {
          setIsSwipeToDeleteLoading(false);
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
    <GatedView>
      <Container topInset={true}>
        <ColLayout>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10}}>
            <Heading>Budget</Heading>

            <ConditionalRenderer isVisible={Boolean(currentBudget)}>
              <LinkButton href={'/(tabs)/budget/transaction-create'}>
                + New Transaction
              </LinkButton>
            </ConditionalRenderer>
            <ConditionalRenderer isVisible={!Boolean(currentBudget)}>
              <LoadingLine width={150} height={30} />
            </ConditionalRenderer>
          </View>

          <ConditionalRenderer isVisible={Boolean(currentBudget)}>
            <TouchableBox
              icon="calendar-outline"
              arrow={true}
              onPress={() => router.navigate('/budget/select-budget')}
            >
              {currentBudget ? months[currentBudget.month.getMonth()] : null} {currentBudget?.month.getFullYear()}
            </TouchableBox>
          </ConditionalRenderer>
          <ConditionalRenderer isVisible={!Boolean(currentBudget)}>
            <LoadingLine height={47} />
          </ConditionalRenderer>

          <ConditionalRenderer isVisible={Boolean(currentBudget)}>
            <View style={{flexDirection: 'row'}}>
              <TouchableBox
                icon={getAmountStateCheckbox(AmountState.Planned, amountState)}
                rowGroup={true}
                rowGroupFirst={true}
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => setAmountState(AmountState.Planned)}
              >
                Planned
              </TouchableBox>
              <TouchableBox
                icon={getAmountStateCheckbox(AmountState.Actual, amountState)}
                rowGroup={true}
                rowGroupLast={true}
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => setAmountState(AmountState.Actual)}
              >
                Actual
              </TouchableBox>
            </View>
          </ConditionalRenderer>
          <ConditionalRenderer isVisible={!Boolean(currentBudget)}>
            <LoadingLine height={47} />
          </ConditionalRenderer>

          <ConditionalRenderer isVisible={Boolean(currentBudget)}>
            <ColLayout>
              <ColLayout spacing="m">
                {categoryBudgetsByType && categoryBudgetsByType[CategoryType.INCOME] ? (
                  <ColLayout spacing="m">
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10}}>
                      <Heading level={2}>Income</Heading>
                      <LinkButton href={`/(tabs)/budget/category-budget-create?type=${CategoryType.INCOME}`}>
                        + New Income
                      </LinkButton>
                    </View>

                    <View>
                      {categoryBudgetsByType[CategoryType.INCOME].map((categoryBudget: CategoryBudget, index: number) => (
                        <SwipableTouchableBox
                          key={categoryBudget.id}
                          ref={(ref) => { itemRefs.current[categoryBudget.id.toString()] = ref; }}
                          onPress={() => {
                            resetOtherItems(categoryBudget.id.toString());
                            router.navigate(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`);
                          }}
                          onDelete={() => handleDeleteCategoryBudget(categoryBudget)}
                          isLoading={isSwipeToDeleteLoading}
                          onInteractionStart={() => resetOtherItems(categoryBudget.id.toString())}
                          group={true}
                          groupFirst={index === 0}
                          groupLast={index === categoryBudgetsByType[CategoryType.INCOME].length - 1}
                          arrow={true}
                          additionalText={currencyFormatter.format(amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount)}
                          progress={categoryBudget.currentAmount / categoryBudget.amount}
                        >
                          {categoryBudget.category?.title}
                        </SwipableTouchableBox>
                      ))}   
                    </View>
                  </ColLayout>
                ) : null}

                <ConditionalRenderer isVisible={categoryBudgetsByType[CategoryType.INCOME].length === 0}>
                  <TouchableBox disabled={true}>There are currently no records to display.</TouchableBox>
                </ConditionalRenderer>
              </ColLayout>

              <ColLayout spacing="m">
                {categoryBudgetsByType && categoryBudgetsByType[CategoryType.EXPENSE] ? (
                  <ColLayout spacing="m">
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <Heading level={2}>Expenses</Heading>
                      <LinkButton href={`/(tabs)/budget/category-budget-create?type=${CategoryType.EXPENSE}`}>
                        + New Category
                      </LinkButton>
                    </View>
                    
                    <View>
                      {categoryBudgetsByType[CategoryType.EXPENSE].map((categoryBudget: CategoryBudget, index: number) => (
                        <SwipableTouchableBox
                          key={categoryBudget.id}
                          ref={(ref) => { itemRefs.current[categoryBudget.id.toString()] = ref; }}
                          onPress={() => {
                            resetOtherItems(categoryBudget.id.toString());
                            router.navigate(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`);
                          }}
                          onDelete={() => handleDeleteCategoryBudget(categoryBudget)}
                          isLoading={isSwipeToDeleteLoading}
                          onInteractionStart={() => resetOtherItems(categoryBudget.id.toString())}
                          group={true}
                          groupFirst={index === 0}
                          groupLast={index === categoryBudgetsByType[CategoryType.EXPENSE].length - 1}
                          arrow={true}
                          additionalText={currencyFormatter.format(amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount)}
                          progress={categoryBudget.currentAmount / categoryBudget.amount}
                        >
                          {categoryBudget.category?.title}
                        </SwipableTouchableBox>
                      ))}   
                    </View>
                  </ColLayout>
                ) : null}

                <ConditionalRenderer isVisible={categoryBudgetsByType[CategoryType.EXPENSE].length === 0}>
                  <TouchableBox disabled={true}>There are currently no records to display.</TouchableBox>
                </ConditionalRenderer>
              </ColLayout>

              <ColLayout spacing="m">
                {categoryBudgetsByType && categoryBudgetsByType[CategoryType.SAVINGS] ? (
                  <ColLayout spacing="m">
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <Heading level={2}>Savings</Heading>
                      <LinkButton href={`/(tabs)/budget/category-budget-create?type=${CategoryType.SAVINGS}`}>
                        + New Fund
                      </LinkButton>
                    </View>
                    
                    <View>
                      {categoryBudgetsByType[CategoryType.SAVINGS].map((categoryBudget: CategoryBudget, index: number) => (
                        <SwipableTouchableBox
                          key={categoryBudget.id}
                          ref={(ref) => { itemRefs.current[categoryBudget.id.toString()] = ref; }}
                          onPress={() => {
                            resetOtherItems(categoryBudget.id.toString());
                            router.navigate(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`);
                          }}
                          onDelete={() => handleDeleteCategoryBudget(categoryBudget)}
                          isLoading={isSwipeToDeleteLoading}
                          onInteractionStart={() => resetOtherItems(categoryBudget.id.toString())}
                          group={true}
                          groupFirst={index === 0}
                          groupLast={index === categoryBudgetsByType[CategoryType.SAVINGS].length - 1}
                          arrow={true}
                          additionalText={currencyFormatter.format(amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount)}
                          progress={categoryBudget.currentAmount / categoryBudget.amount}
                        >
                          {categoryBudget.category?.title}
                        </SwipableTouchableBox>
                      ))}   
                    </View>
                  </ColLayout>
                ) : null}

                <ConditionalRenderer isVisible={categoryBudgetsByType[CategoryType.SAVINGS].length === 0}>
                  <TouchableBox disabled={true}>There are currently no records to display.</TouchableBox>
                </ConditionalRenderer>
              </ColLayout>

              <ColLayout spacing="m">
                {categoryBudgetsByType && categoryBudgetsByType[CategoryType.DEBT] ? (
                  <ColLayout spacing="m">
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <Heading level={2}>Debt</Heading>
                      <LinkButton href={`/(tabs)/budget/category-budget-create?type=${CategoryType.DEBT}`}>
                        + New Loan
                      </LinkButton>
                    </View>

                    <View>
                      {categoryBudgetsByType[CategoryType.DEBT].map((categoryBudget: CategoryBudget, index: number) => (
                        <SwipableTouchableBox
                          key={categoryBudget.id}
                          ref={(ref) => { itemRefs.current[categoryBudget.id.toString()] = ref; }}
                          onPress={() => {
                            resetOtherItems(categoryBudget.id.toString());
                            router.navigate(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`);
                          }}
                          onDelete={() => handleDeleteCategoryBudget(categoryBudget)}
                          isLoading={isSwipeToDeleteLoading}
                          onInteractionStart={() => resetOtherItems(categoryBudget.id.toString())}
                          group={true}
                          groupFirst={index === 0}
                          groupLast={index === categoryBudgetsByType[CategoryType.DEBT].length - 1}
                          arrow={true}
                          additionalText={currencyFormatter.format(amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount)}
                          progress={categoryBudget.currentAmount / categoryBudget.amount}
                        >
                          {categoryBudget.category?.title}
                        </SwipableTouchableBox>
                      ))}
                      
                      <ConditionalRenderer isVisible={categoryBudgetsByType[CategoryType.DEBT].length === 0}>
                        <TouchableBox disabled={true}>There are currently no records to display.</TouchableBox>
                      </ConditionalRenderer>
                    </View>
                  </ColLayout>
                ) : null}
              </ColLayout>
            </ColLayout>
          </ConditionalRenderer>
          <ConditionalRenderer isVisible={!currentBudget}>
            <ColLayout>
              <ColLayout spacing="m">
                <LoadingLine width={95} height={30} />
                <LoadingLine height={250} />
              </ColLayout>

              <ColLayout spacing="m">
                <LoadingLine width={95} height={30} />
                <LoadingLine height={250} />
              </ColLayout>

              <ColLayout spacing="m">
                <LoadingLine width={95} height={30} />
                <LoadingLine height={250} />
              </ColLayout>
            </ColLayout>
          </ConditionalRenderer>
        </ColLayout>
      </Container>
    </GatedView>
  );
};
