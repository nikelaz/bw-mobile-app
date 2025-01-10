import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import Heading from '@/components/heading';
import { View, Button } from 'react-native';
import TouchableBox from '@/components/touchable-box';
import React, { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import GatedView from '@/components/gated-view';
import { useUserModel } from '@/view-models/user-view-model';
import { useBudgetModel } from '@/view-models/budget-view-model';
import months from '@/data/months';
import { CategoryType } from '@/types/category';
import { useRouter } from 'expo-router';
import { useCategoryBudgetModel } from '@/view-models/category-budget-view-model';

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
  const currentBudget = budgetModel.currentBudget;

  return (
    <GatedView>
      <View style={{ backgroundColor: useThemeColor({}, 'background') }}>
        <Container>
          <ColLayout>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Heading>Budget</Heading>
              <Button color={useThemeColor({}, 'primary')} title="+ New Transaction" onPress={() => router.push(`/(tabs)/transactions/create?backText=Budget&backHref=${encodeURIComponent('/(tabs)/budget')}`)} />
            </View>

            {currentBudget ? (
              <TouchableBox
                icon="calendar-clear"
                arrow={true}
                onPress={() => router.push('/budget/select-budget')}
              >
                {months[currentBudget.month.getMonth()]} {currentBudget.month.getFullYear()}
              </TouchableBox>
            ) : null}

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

            {currentBudget ? (
              <>
                <ColLayout spacing="m">
                  {categoryBudgetModel.categoryBudgetsByType && categoryBudgetModel.categoryBudgetsByType[CategoryType.INCOME] && categoryBudgetModel.categoryBudgetsByType[CategoryType.INCOME].length > 0 ? (
                    <ColLayout spacing="m">
                      <Heading level={2}>Income</Heading>
                      <View>
                        {categoryBudgetModel.categoryBudgetsByType[CategoryType.INCOME].map((categoryBudget, index) => (
                          <TouchableBox
                            group={true}
                            groupFirst={index === 0}
                            groupLast={index === categoryBudgetModel.categoryBudgetsByType[CategoryType.INCOME].length - 1}
                            arrow={true}
                            additionalText={`${currency}${amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount}`}
                            key={categoryBudget.id}
                            onPress={() => router.push(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`)}
                          >
                            {categoryBudget.category?.title}
                          </TouchableBox>
                        ))}   
                      </View>
                    </ColLayout>
                  ) : null}

                  <Button title="New Income" onPress={() => router.push(`/(tabs)/budget/category-budget-create?type=${CategoryType.INCOME}`)} />
                </ColLayout>

                <ColLayout spacing="m">
                  {categoryBudgetModel.categoryBudgetsByType && categoryBudgetModel.categoryBudgetsByType[CategoryType.EXPENSE] && categoryBudgetModel.categoryBudgetsByType[CategoryType.EXPENSE].length > 0 ? (
                    <ColLayout spacing="m">
                      <Heading level={2}>Expenses</Heading>
                      <View>
                        {categoryBudgetModel.categoryBudgetsByType[CategoryType.EXPENSE].map((categoryBudget, index) => (
                          <TouchableBox
                            group={true}
                            groupFirst={index === 0}
                            groupLast={index === categoryBudgetModel.categoryBudgetsByType[CategoryType.EXPENSE].length - 1}
                            arrow={true}
                            additionalText={`${currency}${amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount}`}
                            key={categoryBudget.id}
                            onPress={() => router.push(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`)}
                          >
                            {categoryBudget.category?.title}
                          </TouchableBox>
                        ))}   
                      </View>
                    </ColLayout>
                  ) : null}

                  <Button title="New Category" onPress={() => router.push(`/(tabs)/budget/category-budget-create?type=${CategoryType.EXPENSE}`)} />
                </ColLayout>

                <ColLayout spacing="m">
                  {categoryBudgetModel.categoryBudgetsByType && categoryBudgetModel.categoryBudgetsByType[CategoryType.SAVINGS] && categoryBudgetModel.categoryBudgetsByType[CategoryType.SAVINGS].length > 0 ? (
                    <ColLayout spacing="m">
                      <Heading level={2}>Savings</Heading>
                      <View>
                        {categoryBudgetModel.categoryBudgetsByType[CategoryType.SAVINGS].map((categoryBudget, index) => (
                          <TouchableBox
                            group={true}
                            groupFirst={index === 0}
                            groupLast={index === categoryBudgetModel.categoryBudgetsByType[CategoryType.SAVINGS].length - 1}
                            arrow={true}
                            additionalText={`${currency}${amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount}`}
                            key={categoryBudget.id}
                            onPress={() => router.push(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`)}
                          >
                            {categoryBudget.category?.title}
                          </TouchableBox>
                        ))}   
                      </View>
                    </ColLayout>
                  ) : null}

                  <Button title="New Loan" onPress={() => router.push(`/(tabs)/budget/category-budget-create?type=${CategoryType.SAVINGS}`)} />
                </ColLayout>

                <ColLayout spacing="m">
                  {categoryBudgetModel.categoryBudgetsByType && categoryBudgetModel.categoryBudgetsByType[CategoryType.DEBT] && categoryBudgetModel.categoryBudgetsByType[CategoryType.DEBT].length > 0 ? (
                    <ColLayout spacing="m">
                      <Heading level={2}>Debt</Heading>
                      <View>
                        {categoryBudgetModel.categoryBudgetsByType[CategoryType.DEBT].map((categoryBudget, index) => (
                          <TouchableBox
                            group={true}
                            groupFirst={index === 0}
                            groupLast={index === categoryBudgetModel.categoryBudgetsByType[CategoryType.DEBT].length - 1}
                            arrow={true}
                            additionalText={`${currency}${amountState === AmountState.Planned ? categoryBudget.amount : categoryBudget.currentAmount}`}
                            key={categoryBudget.id}
                            onPress={() => router.push(`/(tabs)/budget/category-budget-details?id=${categoryBudget.id}`)}
                          >
                            {categoryBudget.category?.title}
                          </TouchableBox>
                        ))}   
                      </View>
                    </ColLayout>
                  ) : null}

                  <Button title="New Fund" onPress={() => router.push(`/(tabs)/budget/category-budget-create?type=${CategoryType.DEBT}`)} />
                </ColLayout>
              </>
            ) : null}
            
          </ColLayout>
        </Container>
      </View>
    </GatedView>
  );
};
