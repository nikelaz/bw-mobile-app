import ColLayout from '@/src/components/col-layout'; import Heading from '@/src/components/heading';
import { View } from 'react-native';
import TouchableBox from '@/src/components/touchable-box';
import { useEffect, useRef } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { useStore } from '@/src/stores/store';
import months from '@/data/months';
import { Transaction, CurrencyFormatter, debounce } from '@nikelaz/bw-shared-libraries';
import LinkButton from '@/src/components/link-button';
import TextBox from '@/src/components/text-box';
import Container from '@/src/components/container';
import SwipableTouchableBox, { SwipableTouchableBoxHandle } from '@/src/components/swipable-touchable-box';
import Dialog from '@/src/helpers/alert';

export default function Transactions() {
  const currentBudget = useStore(state => state.currentBudget);
  const getCurrency = useStore(state => state.getCurrency);
  const transactions = useStore(state => state.transactions);
  const setTransactionsFilter = useStore(state => state.setTransactionsFilter);
  const transactionsTotalPages = useStore(state => state.transactionsTotalPages);
  const transactionsPage = useStore(state => state.transactionsPage);
  const prevTransactionsPage = useStore(state => state.prevTransactionsPage);
  const nextTransactionsPage = useStore(state => state.nextTransactionsPage);
  const deleteTransaction = useStore(state => state.deleteTransaction);
  const isLoading = useStore(state => state.isLoading);
  const currency = getCurrency();
  const currencyFormatter = new CurrencyFormatter(currency);
  const navigation = useNavigation();
  const router = useRouter();
  const itemRefs = useRef<Record<string, SwipableTouchableBoxHandle | null>>({});

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const changeHandler = (filter: string) => {
    setTransactionsFilter(filter);
  };

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
            <SwipableTouchableBox
              key={transaction.id}
              ref={(ref) => { itemRefs.current[transaction.id.toString()] = ref; }}
              onPress={() => {
                resetOtherItems(transaction.id.toString());
                router.navigate(`/(tabs)/transactions/details?id=${transaction.id}`);
              }}
              onDelete={() => handleDeleteTransaction(transaction)}
              onInteractionStart={() => resetOtherItems(transaction.id.toString())}
              isLoading={isLoading}
              group={true}
              groupFirst={index === 0}
              groupLast={index === transactions.length - 1}
              arrow={true}
              additionalText={currencyFormatter.format(transaction.amount)}
            >
              {transaction.title}
            </SwipableTouchableBox>
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
