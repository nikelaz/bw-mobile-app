import { Stack } from 'expo-router';
import { useState } from 'react';
import TransactionDetailsView from '@/src/views/transaction-details';

export default function TransactionDetails() {
  const [title, setTitle] = useState('Transaction');

  return (
    <>
      <Stack.Screen options={{
        title: title,
        headerBackButtonDisplayMode: 'minimal',
      }} />

      <TransactionDetailsView setTitle={setTitle}/>
    </>      
  );
};
