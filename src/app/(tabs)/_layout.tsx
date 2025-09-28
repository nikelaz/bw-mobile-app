import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useThemeColor } from '@/src/hooks/useThemeColor';

export default function TabLayout() {
  const bgColor = Platform.OS === 'android' ? useThemeColor({}, 'systemGrey7') : null;
  const indicatorBgColor = Platform.OS === 'android' ? useThemeColor({}, 'systemGrey5') : undefined;
  const foregroundColor = Platform.OS === 'android' ? useThemeColor({}, 'text') : undefined;

  return (
    <NativeTabs
      backgroundColor={bgColor}
      indicatorColor={indicatorBgColor}
      iconColor={foregroundColor}
      labelStyle={{
        color: foregroundColor
      }}
    >
      <NativeTabs.Trigger name="budget">
        <Label>Budget</Label>
        { Platform.OS === 'ios' ? (
          <Icon sf="wallet.bifold" />
        ) : (
          <Icon src={require('@/assets/wallet.svg')}/>
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="transactions">
        <Label>Transactions</Label>
        { Platform.OS === 'ios' ? (
          <Icon sf="creditcard" />
        ) : (
          <Icon src={require('@/assets/card.svg')}/>
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="reporting">
        <Label>Reporting</Label>
        { Platform.OS === 'ios' ? (
          <Icon sf="chart.line.uptrend.xyaxis" />
        ) : (
          <Icon src={require('@/assets/chart.svg')}/>
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        { Platform.OS === 'ios' ? (
          <Icon sf="gear" />
        ) : (
          <Icon src={require('@/assets/gear.svg')}/>
        )}
      </NativeTabs.Trigger>
    </NativeTabs> 
  );
}
