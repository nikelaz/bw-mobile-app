import ColLayout from '@/src/components/col-layout';
import Heading from '@/src/components/heading';
import { View } from 'react-native';
import TouchableBox from '@/src/components/touchable-box';
import { useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { useBudgetStore } from '@/src/stores/budget-store';
import { useTransactionsStore } from '@/src/stores/transactions-store';
import months from '@/data/months';
import { Transaction, CurrencyFormatter, debounce } from '@nikelaz/bw-shared-libraries';
import { useUserStore } from '@/src/stores/user-store';
import LinkButton from '@/src/components/link-button';
import TextBox from '@/src/components/text-box';
import Container from '@/src/components/container';

export default function Transactions() {
  const budgetStore = useBudgetStore();
  const userStore = useUserStore();
  const transactionsStore = useTransactionsStore();
  const currentBudget = budgetStore.currentBudget;
  const currency = userStore.getCurrency();
  const currencyFormatter = new CurrencyFormatter(currency);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const changeHandler = (filter: string) => {
    transactionsStore.setFilter(filter);
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

        { !transactionsStore.transactions || transactionsStore.transactions.length === 0 && (
          <TouchableBox disabled={true}>There are currently no records to display.</TouchableBox>
        )}

        <View>
          {transactionsStore.transactions.map((transaction: Transaction, index: number) => (
            <TouchableBox
              key={transaction.id}
              onPress={() => router.navigate(`/(tabs)/transactions/details?id=${transaction.id}`)}
              group={true}
              groupFirst={index === 0}
              groupLast={index === transactionsStore.transactions.length - 1}
              arrow={true}
              additionalText={currencyFormatter.format(transaction.amount)}
            >
              {transaction.title}
            </TouchableBox>
          ))}
        </View>

        {transactionsStore.totalPages > 1 ? (
          <View style={{flexDirection: 'row'}}>
            {transactionsStore.page !== 0 ? (
              <TouchableBox
                rowGroup={transactionsStore.page !== transactionsStore.totalPages - 1}
                rowGroupFirst={transactionsStore.page !== transactionsStore.totalPages - 1}
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => transactionsStore.prevPage()}
              >
                Previous Page
              </TouchableBox>
            ) : null}
            
            {transactionsStore.page !== transactionsStore.totalPages - 1 ? (
              <TouchableBox
                rowGroup={transactionsStore.page !== 0}
                rowGroupLast={transactionsStore.page !== 0}
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => transactionsStore.nextPage()}
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
