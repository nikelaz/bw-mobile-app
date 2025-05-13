import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions } from 'react-native';

import { TabBarIcon } from '@/src/components/tab-bar-icon';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useUserStore } from '@/src/stores/user-store';
import { useBudgetStoreInit } from '@/src/stores/budget-store';
import { useCategoryBudgetStoreInit } from '@/src/stores/category-budget-store';
import { useTransactionsStoreInit } from '@/src/stores/transactions-store';

export default function TabLayout() {
  const userStore = useUserStore();
  useBudgetStoreInit(userStore.token);
  useCategoryBudgetStoreInit();
  useTransactionsStoreInit(userStore.token, Dimensions.get('window').height);

  return (
    <>
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
    </> 
  );
}
