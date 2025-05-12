import ColLayout from '@/src/components/col-layout';
import Heading from '@/src/components/heading';
import { View } from 'react-native';
import TouchableBox from '@/src/components/touchable-box';
import { useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { useBudgetStore } from '@/src/stores/budget-store';
import { useTransactionsModel } from '@/src/view-models/transactions-view-model';
import months from '@/data/months';
import { Transaction, CurrencyFormatter, debounce } from '@nikelaz/bw-shared-libraries';
import { useUserModel } from '@/src/view-models/user-view-model';
import LinkButton from '@/src/components/link-button';
import TextBox from '@/src/components/text-box';
import Container from '@/src/components/container';

export default function Transactions() {
  const budgetStore = useBudgetStore();
  const userModel = useUserModel();
  const transactionsModel = useTransactionsModel();
  const currentBudget = budgetStore.currentBudget;
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <Heading>Transactions</Heading>
          <LinkButton href="/(tabs)/transactions/create">+ New Transaction</LinkButton>
        </View>

        {currentBudget ? (
          <TouchableBox
            icon="calendar-outline"
            arrow={true}
            onPress={() => router.navigate(`/budget/select-budget?backText=Transactions&backHref=${encodeURIComponent('/(tabs)/transactions')}`)}
          >
            {months[currentBudget.month.getMonth()]} {currentBudget.month.getFullYear()}
          </TouchableBox>
        ) : null}

        <TextBox placeholder="Search" onChangeText={debounce(changeHandler)} />

        { !transactionsModel.transactions || transactionsModel.transactions.length === 0 && (
          <TouchableBox disabled={true}>There are currently no records to display.</TouchableBox>
        )}

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
