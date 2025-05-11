import { useThemeColor } from '@/src/hooks/useThemeColor';
import { TouchableOpacity, GestureResponderEvent, Text, StyleSheet } from 'react-native';

export type ButtonProps = Readonly<{
  children: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}>;

const Button = (props: ButtonProps) => {
  const color = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={props.onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <Text style={[styles.inner, { color }]}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    minHeight: 50,
  },
  inner: {
    fontSize: 18,
  },
});

export default Button;
