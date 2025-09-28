import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';

const Hr = () => { 
  const color = useThemeColor({}, 'systemGrey6');

  return (
    <View
      style={{
        ...styles.hr,
        backgroundColor: color,
      }}
    />
  );
};

const styles = StyleSheet.create({
  hr: {
    width: '100%',
    height: 1,
  },
});

export default Hr;
