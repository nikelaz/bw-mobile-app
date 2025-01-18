import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import Heading from '@/components/heading';
import { View } from 'react-native';
import TouchableBox from '@/components/touchable-box';
import React, { useState } from 'react';
import LinkButton from '@/components/link-button';
import GatedView from '@/components/gated-view';
import { useUserModel } from '@/view-models/user-view-model';
import { useBudgetModel } from '@/view-models/budget-view-model';
import months from '@/data/months';
import { CategoryType } from '@/types/category';
import { useRouter } from 'expo-router';
import { useCategoryBudgetModel } from '@/view-models/category-budget-view-model';
import { LoadingLine } from '@/components/loading-line';
import { CurrencyFormatter } from '@nikelaz/bw-shared-libraries';
import { CategoryBudget } from '@/types/category-budget';

enum AmountState {
  Planned = 1,
  Actual,
}

const getAmountStateCheckbox = (button: AmountState, state: AmountState) => {
  if (button === state) return 'checkmark-circle';
  return 'checkmark-circle-outline';
};

export default function Budget() {
  const [amountState, setAmountState] = useState(AmountState.Planned);
  const userModel = useUserModel();
  const budgetModel = useBudgetModel();
  const router = useRouter();
  const categoryBudgetModel = useCategoryBudgetModel();
  const currency = userModel.getCurrency();
  const currencyFormatter = new CurrencyFormatter(currency);
  let currentBudget = budgetModel.currentBudget;

  return (
    <GatedView>
      <Container>
        <ColLayout>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Heading>Budget</Heading>

            {currentBudget ? (
              <LinkButton href={`/(tabs)/transactions/create?backText=Budget&backHref=${encodeURIComponent('/(tabs)/budget')}`}>
                + New Transaction
              </LinkButton>
            ) : (
              <LoadingLine width={150} height={30} />
            )}
          </View>

          {currentBudget ? (
            <TouchableBox
              icon="calendar-clear"
              arrow={true}
              onPress={() => router.navigate('/budget/select-budget')}
            >
              {months[currentBudget.month.getMonth()]} {currentBudget.month.getFullYear()}
            </TouchableBox>
          ) : (
            <LoadingLine height={47} />
          )}

          {currentBudget ? (
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
          ) : (
            <LoadingLine height={47} />
          )}

          {currentBudget ? (
            <>
              <ColLayout spacing="m">
                {categoryBudgetModel.categoryBudgetsByType && categoryBudgetModel.categoryBudgetsByType[CategoryType.INCOME] && categoryBudgetModel.categoryBudgetsByType[CategoryType.INCOME].length > 0 ? (
                  <ColLayout spacing="m">
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Heading level={2}>Income</Heading>
                      <LinkButton href={`/(tabs)/budget/category-budget-create?type=${CategoryType.INCOME}`}>
                        + New Income
                      </LinkButton>
                    </View>

                    <View>
                      {categoryBudgetModel.categoryBudgetsByType[CategoryType.INCOME].map((categoryBudget: CategoryBudget, index: number) => (
                        <TouchableBox
                          group={true}
                          groupFirst={index === 0}
                          groupLast={index === categoryBudgetModel.categoryBudgetsByType[CategoryType.INCOME].length - 1}
                          arrow={true}
                          additionalText={currencyFormatter.format(amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount)}
                          key={categoryBudget.id}
                          onPress={() => router.navigate(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`)}
                        >
                          {categoryBudget.category?.title}
                        </TouchableBox>
                      ))}   
                    </View>
                  </ColLayout>
                ) : null}
              </ColLayout>

              <ColLayout spacing="m">
                {categoryBudgetModel.categoryBudgetsByType && categoryBudgetModel.categoryBudgetsByType[CategoryType.EXPENSE] && categoryBudgetModel.categoryBudgetsByType[CategoryType.EXPENSE].length > 0 ? (
                  <ColLayout spacing="m">
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Heading level={2}>Expenses</Heading>
                      <LinkButton href={`/(tabs)/budget/category-budget-create?type=${CategoryType.EXPENSE}`}>
                        + New Category
                      </LinkButton>
                    </View>
                    
                    <View>
                      {categoryBudgetModel.categoryBudgetsByType[CategoryType.EXPENSE].map((categoryBudget: CategoryBudget, index: number) => (
                        <TouchableBox
                          group={true}
                          groupFirst={index === 0}
                          groupLast={index === categoryBudgetModel.categoryBudgetsByType[CategoryType.EXPENSE].length - 1}
                          arrow={true}
                          additionalText={currencyFormatter.format(amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount)}
                          key={categoryBudget.id}
                          onPress={() => router.navigate(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`)}
                        >
                          {categoryBudget.category?.title}
                        </TouchableBox>
                      ))}   
                    </View>
                  </ColLayout>
                ) : null}
              </ColLayout>

              <ColLayout spacing="m">
                {categoryBudgetModel.categoryBudgetsByType && categoryBudgetModel.categoryBudgetsByType[CategoryType.SAVINGS] && categoryBudgetModel.categoryBudgetsByType[CategoryType.SAVINGS].length > 0 ? (
                  <ColLayout spacing="m">
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Heading level={2}>Savings</Heading>
                      <LinkButton href={`/(tabs)/budget/category-budget-create?type=${CategoryType.SAVINGS}`}>
                        + New Loan
                      </LinkButton>
                    </View>
                    
                    <View>
                      {categoryBudgetModel.categoryBudgetsByType[CategoryType.SAVINGS].map((categoryBudget: CategoryBudget, index: number) => (
                        <TouchableBox
                          group={true}
                          groupFirst={index === 0}
                          groupLast={index === categoryBudgetModel.categoryBudgetsByType[CategoryType.SAVINGS].length - 1}
                          arrow={true}
                          additionalText={currencyFormatter.format(amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount)}
                          key={categoryBudget.id}
                          onPress={() => router.navigate(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`)}
                        >
                          {categoryBudget.category?.title}
                        </TouchableBox>
                      ))}   
                    </View>
                  </ColLayout>
                ) : null}
              </ColLayout>

              <ColLayout spacing="m">
                {categoryBudgetModel.categoryBudgetsByType && categoryBudgetModel.categoryBudgetsByType[CategoryType.DEBT] && categoryBudgetModel.categoryBudgetsByType[CategoryType.DEBT].length > 0 ? (
                  <ColLayout spacing="m">
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Heading level={2}>Debt</Heading>
                      <LinkButton href={`/(tabs)/budget/category-budget-create?type=${CategoryType.DEBT}`}>
                        + New Fund
                      </LinkButton>
                    </View>

                    <View>
                      {categoryBudgetModel.categoryBudgetsByType[CategoryType.DEBT].map((categoryBudget: CategoryBudget, index: number) => (
                        <TouchableBox
                          group={true}
                          groupFirst={index === 0}
                          groupLast={index === categoryBudgetModel.categoryBudgetsByType[CategoryType.DEBT].length - 1}
                          arrow={true}
                          additionalText={currencyFormatter.format(amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount)}
                          key={categoryBudget.id}
                          onPress={() => router.navigate(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`)}
                        >
                          {categoryBudget.category?.title}
                        </TouchableBox>
                      ))}   
                    </View>
                  </ColLayout>
                ) : null}
              </ColLayout>
            </>
          ) : (
            <>
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
            </>
          )}
          
        </ColLayout>
      </Container>
    </GatedView>
  );
};
