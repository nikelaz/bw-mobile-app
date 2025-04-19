import { useThemeColor } from '@/hooks/useThemeColor';
import { TouchableOpacity, GestureResponderEvent, Text } from 'react-native';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

const Button = (props: ButtonProps) => {
  const color = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity style={styles.wrapper} onPress={props.onPress}>
      <Text style={{ ...styles.inner, color }}>{props.children}</Text>
    </TouchableOpacity>
  )
};

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: 50,
  },
  inner: {
    fontSize: 18,
  },
};

export default Button;

