import { Platform, TouchableOpacity, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GestureResponderEvent } from 'react-native';

export interface BackButtonProps {
  onPress: ((event: GestureResponderEvent) => void);
  label?: string;
}

const BackButton = (props: any) => {
  const isIOS = Platform.OS === 'ios';
  const color = isIOS ? useThemeColor({}, 'primary') : useThemeColor({}, 'text');
  const paddingRight = isIOS ? 5 : 20;

  return (
    <TouchableOpacity onPress={props.onPress} style={{ paddingRight }}>
      <Ionicons size={25} name="arrow-back" color={color} />
      { Platform.OS === 'ios' && props.label ? (
        <Text style={{ color }}>{props.label}</Text>
      ) : null }
    </TouchableOpacity>
  );
}

export default BackButton;
