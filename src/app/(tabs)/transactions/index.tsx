import ColLayout from '@/src/components/col-layout'; import Heading from '@/src/components/heading';
import { View, ActivityIndicator, ScrollView } from 'react-native';
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
  const loadMoreTransactions = useStore(state => state.loadMoreTransactions);
  const hasMoreTransactions = useStore(state => state.hasMoreTransactions);
  const isLoadingMoreTransactions = useStore(state => state.isLoadingMoreTransactions);
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

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 100; // How close to bottom to trigger loading
    
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      if (hasMoreTransactions && !isLoadingMoreTransactions) {
        loadMoreTransactions();
      }
    }
  };

  return (
    <Container 
      onScroll={handleScroll}
      scrollEventThrottle={400}
    >
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

        {!transactions || transactions.length === 0 ? (
          <TouchableBox disabled={true}>There are currently no records to display.</TouchableBox>
        ) : (
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
            
            {isLoadingMoreTransactions && (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" />
              </View>
            )}
          </View>
        )}
      </ColLayout>
    </Container>
  );
}
