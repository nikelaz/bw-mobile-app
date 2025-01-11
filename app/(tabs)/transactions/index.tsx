import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import Heading from '@/components/heading';
import { View, Button } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import TouchableBox from '@/components/touchable-box';
import { useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { useBudgetModel } from '@/view-models/budget-view-model';
import { useTransactionsModel } from '@/view-models/transactions-view-model';
import months from '@/data/months';
import { Transaction } from '@/types/transaction';
import { useUserModel } from '@/view-models/user-view-model';
import LinkButton from '@/components/link-button';

export default function Transactions() {
  const budgetModel = useBudgetModel();
  const userModel = useUserModel();
  const transactionsModel = useTransactionsModel();
  const currentBudget = budgetModel.currentBudget;
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <Container>
      <ColLayout>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Heading>Transactions</Heading>
          <LinkButton href="/(tabs)/transactions/create">+ New Transaction</LinkButton>
        </View>

        {currentBudget ? (
          <TouchableBox
            icon="calendar-clear"
            arrow={true}
            onPress={() => router.push(`/budget/select-budget?backText=Transactions&backHref=${encodeURIComponent('/(tabs)/transactions')}`)}
          >
            {months[currentBudget.month.getMonth()]} {currentBudget.month.getFullYear()}
          </TouchableBox>
        ) : null}

        <View>
          {transactionsModel.transactions.map((transaction: Transaction, index: number) => (
            <TouchableBox
              key={transaction.id}
              onPress={() => router.push(`/(tabs)/transactions/details?id=${transaction.id}`)}
              group={true}
              groupFirst={index === 0}
              groupLast={index === transactionsModel.transactions.length - 1}
              arrow={true}
              additionalText={`${userModel.getCurrency()}${transaction.amount}`}
            >
              {transaction.title}
            </TouchableBox>
          ))}
        </View>
      </ColLayout>
    </Container>
  );
};
