import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions } from 'react-native';

import { TabBarIcon } from '@/src/components/tab-bar-icon';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { BudgetModelContextProvider } from '@/src/view-models/budget-view-model';
import { useUserModel } from '@/src/view-models/user-view-model';
import { CategoryBudgetModelContextProvider } from '@/src/view-models/category-budget-view-model';
import { TransactionsModelContextProvider } from '@/src/view-models/transactions-view-model';

export default function TabLayout() {
  const userModel = useUserModel();

  return (
    <BudgetModelContextProvider token={userModel.token}>
      <TransactionsModelContextProvider token={userModel.token} height={Dimensions.get('window').height}>
        <CategoryBudgetModelContextProvider token={userModel.token}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                borderTopColor: useThemeColor({}, 'systemGrey2'),
                backgroundColor: useThemeColor({ light: 'white', dark: 'black' }, 'background')
              },
              tabBarActiveTintColor: useThemeColor({}, 'primary'),
            }}>
            <Tabs.Screen
              name="budget"
              options={{
                title: 'Budget',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'wallet' : 'wallet-outline'} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="reporting"
              options={{
                title: 'Reporting',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="transactions"
              options={{
                title: 'Transactions',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'card' : 'card-outline'} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Settings',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
                ),
              }}
            />
          </Tabs>
        </CategoryBudgetModelContextProvider>
      </TransactionsModelContextProvider>
    </BudgetModelContextProvider>
    
  );
}
