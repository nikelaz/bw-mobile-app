import { Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './themed-text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { Loader } from './loader';
import ProgressBar from './progress-bar';
import ConditionalRenderer from './conditional-renderer';

export interface TouchableBoxProps {
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
  isLoading?: boolean,
  disabled?: boolean,
  progress?: number,
  color?: 'primary' | 'danger',
  center?: boolean,
  opaque?: boolean,
}

const TouchableBox = (props: TouchableBoxProps) => {
  const [isActive, setIsActive] = useState(false);
  let bgColor = isActive ? useThemeColor({}, 'systemGrey5') : useThemeColor({light: 'white'}, 'systemGrey6');
  let iconColor = useThemeColor({}, 'systemGrey2');
  let additionalTextColor = useThemeColor({}, 'systemGrey');
  let arrowColor = useThemeColor({}, 'systemGrey2');
  let separatorColor = useThemeColor({}, 'systemGrey4');
  let textColor = useThemeColor({}, 'text');
  const primary = useThemeColor({}, 'primary');
  const primaryDarker = useThemeColor({}, 'primaryDarker');
  const white = useThemeColor({}, 'white');
  const danger = useThemeColor({}, 'dangerOpaque50');
  const dangerActive = useThemeColor({}, 'dangerOpaque70');

  if (props.color === 'primary') {
    bgColor = isActive ?  primaryDarker : primary;
  }

  if (props.color === 'danger') {
    bgColor = isActive ?  dangerActive : danger;
  }

  if (props.color === 'danger' || props.color === 'primary') {
    iconColor = textColor = additionalTextColor = arrowColor = separatorColor = white;
  }
  
  const groupStyles: any = {};

  if (props.group) {
    if (props.groupLast && !props.groupFirst) {
      groupStyles.borderTopLeftRadius = 0;
      groupStyles.borderTopRightRadius = 0;
    }
    else if (props.groupFirst && !props.groupLast) {
      groupStyles.borderBottomLeftRadius = 0;
      groupStyles.borderBottomRightRadius = 0;
    } else if (!props.groupFirst && !props.groupLast) {
      groupStyles.borderRadius = 0;
    }
  }

  const rowGroupStyles: any = {};

  if (props.rowGroup) {
    if (props.rowGroupLast && !props.rowGroupFirst) {
      rowGroupStyles.borderTopLeftRadius = 0;
      rowGroupStyles.borderBottomLeftRadius = 0;
    }
    else if (props.rowGroupFirst && !props.rowGroupLast) {
      rowGroupStyles.borderTopRightRadius = 0;
      rowGroupStyles.borderBottomRightRadius = 0;
    } else if (!props.rowGroupFirst && !props.rowGroupLast) {
      rowGroupStyles.borderRadius = 0;
    }
  }

  const smallSizeStyles = props.size === 's' ? { paddingTop: 5, paddingBottom: 5 } : {};

  

  return (
    <Pressable
      onPressIn={() => !props.isLoading && setIsActive(true)}
      onPressOut={() => !props.isLoading && setIsActive(false)}
      onPress={() => { !props.isLoading && (props.onPress && props.onPress()) }}
      style={{
        backgroundColor: bgColor,
        ...styles.touchableBox,
        ...groupStyles,
        ...rowGroupStyles,
        ...smallSizeStyles,
        ...(props.center ? { justifyContent: 'center' } : {}),
        ...props.style,
      }}
      disabled={props.disabled}
    >
      {props.isLoading ? (
        <Loader width={20} height={20} color={additionalTextColor} />
      ) : null}

      {props.icon && !props.isLoading ? (
        <Ionicons name={props.icon} size={24} color={iconColor} />
      ) : null}
      
      {props.isLoading ? (
        <ThemedText style={{ color: additionalTextColor }}>
          Loading...
        </ThemedText>
      ) : (
        <ThemedText numberOfLines={1} style={{ flexShrink: 1, color: textColor }}>
          {props.children}
        </ThemedText>
      )}
      

      {props.additionalText ? (
        <ThemedText style={{ color: additionalTextColor, marginLeft: 'auto', flexShrink: 0 }}>{props.additionalText}</ThemedText>
      ) : null} 

      {!props.isLoading && props.arrow ? (
        <Ionicons style={{ marginLeft: props.additionalText ? 0 : 'auto', flexShrink: 0 }} name="chevron-forward" size={22} color={arrowColor} />
      ) : null}

      {props.group && !props.groupLast ? (
        <View style={{ ...styles.groupSeparator, backgroundColor: separatorColor }} />
      ) : null}

      {props.rowGroup && !props.rowGroupLast ? (
        <View style={{ ...styles.rowGroupSeparator, backgroundColor: separatorColor }} />
      ) : null}

      <ConditionalRenderer isVisible={Boolean(props.progress)}>
        <ProgressBar progress={props.progress || 0}/>
      </ConditionalRenderer>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  touchableBox: {
    height: 'auto',
    borderRadius: 10,
    paddingTop: 11.5,
    paddingRight: 15,
    paddingBottom: 11.5,
    paddingLeft: 15,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  groupSeparator: {
    width: '100%',
    height: 1,
    position: 'absolute',
    bottom: 0,
    left: 15,
  },
  rowGroupSeparator: {
    width: 1,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 12,
  },
  autoWidth: {
    width: 'auto',
  },
});

export default TouchableBox;
