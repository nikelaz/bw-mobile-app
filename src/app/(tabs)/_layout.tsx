import React from 'react';
import { withLayoutContext } from 'expo-router';
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from '@bottom-tabs/react-navigation';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

export default function TabLayout() {
  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="budget"
          options={{
            title: 'Budget',
            tabBarIcon: () => require('@/assets/icons/wallet.svg'),
          }}
        />
        <Tabs.Screen
          name="reporting"
          options={{
            title: 'Reporting',
            tabBarIcon: () => require('@/assets/icons/stats-chart.svg'),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transactions',
            tabBarIcon: () => require('@/assets/icons/card.svg'),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: () => require('@/assets/icons/settings.svg'),
          }}
        />
      </Tabs>
    </> 
  );
}
