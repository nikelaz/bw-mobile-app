import Container from '@/components/container';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Button, Alert } from 'react-native';
import GroupLabel from '@/components/group-label';
import TextBox from '@/components/text-box';
import ColLayout from '@/components/col-layout';
import TouchableBox from '@/components/touchable-box';
import Select from '@/components/select';
// import DatePicker from 'react-native-date-picker';
import { useState } from 'react';

export default function TransactionDetails() {
  const params = useLocalSearchParams();
  // const [open, setOpen] = useState(false);
  // const [date, setDate] = useState(new Date(params.date.toString()));

  const showConfirmDialog = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this transaction?",
      [
        // The "Yes" button
        {
          text: "Yes",
          // onPress: () => {
          //   setShowBox(false);
          // },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  return (
    <View>
      <Stack.Screen options={{
        title: 'Transaction',
        headerBackTitle: 'Transactions',
      }} />

      <Container>
        <ColLayout>
          <ColLayout spacing="m">
            <View>
              <GroupLabel>Title</GroupLabel>
              <TextBox value={params.title.toString()}/>
            </View>
            <View>
              <GroupLabel>Date</GroupLabel>
              <TextBox value={params.date.toString()}/>
              {/* <Button title="Open DatePicker" onPress={() => setOpen(true)} />
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                  setOpen(false)
                  setDate(date)
                }}
                onCancel={() => {
                  setOpen(false)
                }}
              /> */}
            </View>
            <View>
              <GroupLabel>Category</GroupLabel>
              <Select
                onValueChange={() => console.log('change')}
                items={[
                  { label: 'Groceries', value: '1' },
                  { label: 'Housing', value: '1' },
                  { label: 'Restaurants', value: '1' },
                ]}
              />
            </View>
            <View>
              <GroupLabel>Amount</GroupLabel>
              <TextBox value={params.amount.toString()}/>
            </View>
          </ColLayout>
          <TouchableBox onPress={showConfirmDialog} icon="trash-bin">Delete Transaction</TouchableBox>   
        </ColLayout>
      </Container>
    </View>      
  );
};
