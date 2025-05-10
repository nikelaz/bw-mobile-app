import { Platform, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@/hooks/useThemeColor';

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
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const color = isIOS ? primaryColor : textColor;
  const iconSize = isIOS ? 28 : 25;

  return (
    <TouchableOpacity onPress={props.onPress} style={styles.wrapper}>
      <Ionicons size={iconSize} name={backIcon} color={color} />
    </TouchableOpacity>
  );
}

export default BackButton;
