import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="budget">
        <Label>Budget</Label>
        <Icon sf="wallet.bifold" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="transactions">
        <Label>Transactions</Label>
        <Icon sf="creditcard" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="reporting">
        <Label>Reporting</Label>
        <Icon sf="chart.line.uptrend.xyaxis" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf="gear" />
      </NativeTabs.Trigger>
    </NativeTabs> 
  );
}
