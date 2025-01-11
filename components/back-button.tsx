import { Platform, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GestureResponderEvent } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    paddingRight: 20
  }
});

export interface BackButtonProps {
  onPress: ((event: GestureResponderEvent) => void);
  label?: string;
}

const BackButton = (props: any) => {
  const isIOS = Platform.OS === 'ios';
  const backIcon = isIOS ? 'chevron-back-outline' : 'arrow-back-outline'
  const color = isIOS ? useThemeColor({}, 'primary') : useThemeColor({}, 'text');
  const iconSize = isIOS ? 28 : 25;

  return (
    <TouchableOpacity onPress={props.onPress} style={styles.wrapper}>
      <Ionicons size={iconSize} name={backIcon} color={color} />
    </TouchableOpacity>
  );
}

export default BackButton;
