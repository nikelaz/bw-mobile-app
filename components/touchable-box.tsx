import { Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './themed-text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text } from 'react-native';

type TouchableBoxProps = Readonly<{
  children: React.ReactNode,
  icon?: any,
  arrow?: boolean,
  onPress?: () => void,
  group?: boolean,
  groupFirst?: boolean,
  groupLast?: boolean,
  rowGroup?: boolean,
  rowGroupFirst?: boolean,
  rowGroupLast?: boolean,
  additionalText?: string,
  style?: any,
  size?: 's',
}>;

const TouchableBox = (props: TouchableBoxProps) => {
  const [isActive, setIsActive] = useState(false);
  const bgColor = isActive ? useThemeColor({}, 'systemGrey5') : useThemeColor({}, 'systemGrey6');

  const iconStyles = props.icon ? { ...styles.withIcon } : {};
  
  const groupStyles: any = {};

  if (props.group) {
    if (props.groupLast) {
      groupStyles.borderTopLeftRadius = 0;
      groupStyles.borderTopRightRadius = 0;
    }
    else if (props.groupFirst) {
      groupStyles.borderBottomLeftRadius = 0;
      groupStyles.borderBottomRightRadius = 0;
    } else {
      groupStyles.borderRadius = 0;
    }
  }

  const rowGroupStyles: any = {};

  if (props.rowGroup) {
    if (props.rowGroupLast) {
      rowGroupStyles.borderTopLeftRadius = 0;
      rowGroupStyles.borderBottomLeftRadius = 0;
    }
    else if (props.rowGroupFirst) {
      rowGroupStyles.borderTopRightRadius = 0;
      rowGroupStyles.borderBottomRightRadius = 0;
    } else {
      rowGroupStyles.borderRadius = 0;
    }
  }

  const smallSizeStyles = props.size === 's' ? { paddingTop: 5, paddingBottom: 5 } : {};

  return (
    <Pressable
      onPressIn={() => setIsActive(true)}
      onPressOut={() => setIsActive(false)}
      onPress={props.onPress}
      style={{
        backgroundColor: bgColor,
        ...styles.touchableBox,
        ...iconStyles,
        ...groupStyles,
        ...rowGroupStyles,
        ...smallSizeStyles,
        ...props.style,
      }}
    >
      {props.icon ? (
        <Ionicons name={props.icon} size={24} color={useThemeColor({}, 'systemGrey2')} />
      ) : null}
      
      <ThemedText>{props.children}</ThemedText>

      {props.additionalText ? (
        <ThemedText style={{ color: useThemeColor({}, 'systemGrey'), marginLeft: 'auto'}}>{props.additionalText}</ThemedText>
      ) : null} 

      {props.arrow ? (
        <Ionicons style={{ marginLeft: props.additionalText ? 0 : 'auto' }} name="chevron-forward" size={22} color={useThemeColor({}, 'systemGrey2')} />
      ) : null}

      {props.group && !props.groupLast ? (
        <View style={styles.groupSeparator} />
      ) : null}

      {props.rowGroup && !props.rowGroupLast ? (
        <View style={styles.rowGroupSeparator} />
      ) : null}
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  touchableBox: {
    height: 'auto',
    borderRadius: 10,
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  withIcon: {
    paddingTop: 11.5,
    paddingBottom: 11.5,
  },
  groupSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: useThemeColor({}, 'systemGrey4'),
    position: 'absolute',
    bottom: 0,
    left: 15,
  },
  rowGroupSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: useThemeColor({}, 'systemGrey4'),
    position: 'absolute',
    right: 0,
    top: 15,
  }
});

export default TouchableBox;
