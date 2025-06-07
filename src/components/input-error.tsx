import { StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/src/hooks/useThemeColor';

type InputErrorProps = Readonly<{
  children?: React.ReactNode;
}>;

const InputError = (props: InputErrorProps) => {
  const red = useThemeColor({}, 'red');

  return (
    <ThemedText style={{ ...styles.message, color: red }}>
      {props.children}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 14,
    marginHorizontal: 15,
    marginTop: 6,
  },
});

export default InputError;
