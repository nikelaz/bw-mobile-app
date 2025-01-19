import { ThemedText } from './themed-text';
import { StyleSheet } from 'react-native';

const GroupLabel = (props: GenericChildrenProps) => (
  <ThemedText style={styles.groupLabel}>
    {props.children}
  </ThemedText>
);

const styles = StyleSheet.create({
  groupLabel: {
    textTransform: 'uppercase',
    fontSize: 12,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
  },
});

export default GroupLabel;
