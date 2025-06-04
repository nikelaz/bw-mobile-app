import ColLayout from '@/src/components/col-layout'; import Heading from '@/src/components/heading';
import { View } from 'react-native';
import TouchableBox from '@/src/components/touchable-box';
import { useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { useStore } from '@/src/stores/store';
import months from '@/data/months';
import { Transaction, CurrencyFormatter, debounce } from '@nikelaz/bw-shared-libraries';
import LinkButton from '@/src/components/link-button';
import TextBox from '@/src/components/text-box';
import Container from '@/src/components/container';

export default function Transactions() {
  const currentBudget = useStore(state => state.currentBudget);
  const getCurrency = useStore(state => state.getCurrency);
  const transactions = useStore(state => state.transactions);
  const setTransactionsFilter = useStore(state => state.setTransactionsFilter);
  const transactionsTotalPages = useStore(state => state.transactionsTotalPages);
  const transactionsPage = useStore(state => state.transactionsPage);
  const prevTransactionsPage = useStore(state => state.prevTransactionsPage);
  const nextTransactionsPage = useStore(state => state.nextTransactionsPage);
  const currency = getCurrency();
  const currencyFormatter = new CurrencyFormatter(currency);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const changeHandler = (filter: string) => {
    setTransactionsFilter(filter);
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

        { !transactions || transactions.length === 0 && (
          <TouchableBox disabled={true}>There are currently no records to display.</TouchableBox>
        )}

        <View>
          {transactions.map((transaction: Transaction, index: number) => (
            <TouchableBox
              key={transaction.id}
              onPress={() => router.navigate(`/(tabs)/transactions/details?id=${transaction.id}`)}
              group={true}
              groupFirst={index === 0}
              groupLast={index === transactions.length - 1}
              arrow={true}
              additionalText={currencyFormatter.format(transaction.amount)}
            >
              {transaction.title}
            </TouchableBox>
          ))}
        </View>

        {transactionsTotalPages > 1 ? (
          <View style={{flexDirection: 'row'}}>
            {transactionsPage !== 0 ? (
              <TouchableBox
                rowGroup={transactionsPage !== transactionsTotalPages - 1}
                rowGroupFirst={transactionsPage !== transactionsTotalPages - 1}
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => prevTransactionsPage()}
              >
                Previous Page
              </TouchableBox>
            ) : null}
            
            {transactionsPage !== transactionsTotalPages - 1 ? (
              <TouchableBox
                rowGroup={transactionsPage !== 0}
                rowGroupLast={transactionsPage !== 0}
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => nextTransactionsPage()}
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
