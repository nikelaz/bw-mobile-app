import { useThemeColor } from '@/hooks/useThemeColor';
import { TouchableOpacity, GestureResponderEvent, Text } from 'react-native';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={{ color: useThemeColor({}, 'primary'), fontSize: 18 }}>{props.children}</Text>
    </TouchableOpacity>
  )
}

export default Button;
