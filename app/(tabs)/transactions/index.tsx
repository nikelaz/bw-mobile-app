import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import Heading from '@/components/heading';
import { View } from 'react-native';
import TouchableBox from '@/components/touchable-box';
import { useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { useBudgetModel } from '@/view-models/budget-view-model';
import { useTransactionsModel } from '@/view-models/transactions-view-model';
import months from '@/data/months';
import { Transaction } from '@nikelaz/bw-shared-libraries';
import { useUserModel } from '@/view-models/user-view-model';
import LinkButton from '@/components/link-button';
import TextBox from '@/components/text-box';
import { debounce } from '@nikelaz/bw-shared-libraries';
import { CurrencyFormatter } from '@nikelaz/bw-shared-libraries';

export default function Transactions() {
  const budgetModel = useBudgetModel();
  const userModel = useUserModel();
  const transactionsModel = useTransactionsModel();
  const currentBudget = budgetModel.currentBudget;
  const currency = userModel.getCurrency();
  const currencyFormatter = new CurrencyFormatter(currency);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const changeHandler = (filter: string) => {
    transactionsModel.setFilter(filter);
  };

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
            onPress={() => router.navigate(`/budget/select-budget?backText=Transactions&backHref=${encodeURIComponent('/(tabs)/transactions')}`)}
          >
            {months[currentBudget.month.getMonth()]} {currentBudget.month.getFullYear()}
          </TouchableBox>
        ) : null}

        <TextBox placeholder="Search" onChangeText={debounce(changeHandler)} />

        <View>
          {transactionsModel.transactions.map((transaction: Transaction, index: number) => (
            <TouchableBox
              key={transaction.id}
              onPress={() => router.navigate(`/(tabs)/transactions/details?id=${transaction.id}`)}
              group={true}
              groupFirst={index === 0}
              groupLast={index === transactionsModel.transactions.length - 1}
              arrow={true}
              additionalText={currencyFormatter.format(transaction.amount)}
            >
              {transaction.title}
            </TouchableBox>
          ))}
        </View>

        {transactionsModel.totalPages > 1 ? (
          <View style={{flexDirection: 'row'}}>
            {transactionsModel.page !== 0 ? (
              <TouchableBox
                rowGroup={transactionsModel.page !== transactionsModel.totalPages - 1}
                rowGroupFirst={transactionsModel.page !== transactionsModel.totalPages - 1}
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => transactionsModel.prevPage()}
              >
                Previous Page
              </TouchableBox>
            ) : null}
            
            {transactionsModel.page !== transactionsModel.totalPages - 1 ? (
              <TouchableBox
                rowGroup={transactionsModel.page !== 0}
                rowGroupLast={transactionsModel.page !== 0}
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => transactionsModel.nextPage()}
              >
                Next Page
              </TouchableBox>
            ) : null}
          </View>
        ) : null}
      </ColLayout>
    </Container>
  );
};
