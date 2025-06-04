import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/src/components/tab-bar-icon';
import { useThemeColor } from '@/src/hooks/useThemeColor';

export default function TabLayout() {
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
