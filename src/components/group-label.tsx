import { ThemedText } from './themed-text';
import { StyleSheet } from 'react-native';
import { type ThemedTextProps } from '@/src/components/themed-text';

const GroupLabel = (props: ThemedTextProps) => (
  <ThemedText style={styles.groupLabel}>
    {props.children}
  </ThemedText>
);

const styles = StyleSheet.create({
  groupLabel: {
    textTransform: 'uppercase',
    fontSize: 12,
    marginHorizontal: 15,
    marginBottom: 5,
  },
});

export default GroupLabel;
